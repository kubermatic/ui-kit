/*
 * Copyright 2026 The Kubermatic Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ANNOUNCE,
  type AnnounceMessage,
  REFUSE,
  isAcceptMessage,
  isRefuseMessage,
} from '../protocol/messages.js';
import { PROTOCOL_VERSION, isCompatible } from '../protocol/version.js';
import { type KdpClient, DEFAULT_REQUEST_TIMEOUT_MS, createClient } from './client.js';
import { type HandshakeEnvironment, windowEnvironment } from './environment.js';

export const DEFAULT_HANDSHAKE_TIMEOUT_MS = 10_000;
export const ANNOUNCE_INTERVAL_MS = 250;

export interface ConnectOptions {
  /**
   * Origins the Dashboard may answer from, e.g. `['https://kdp.example.com']`. `'*'` accepts an
   * answer from any origin, as long as it comes from the parent window: any site that can frame
   * the page can then pose as the Dashboard, and the page's `frame-ancestors` CSP is its only
   * protection.
   */
  expectedOrigins: readonly string[] | '*';
  /** How long to wait for the Dashboard to answer. Defaults to 10 seconds. */
  handshakeTimeoutMs?: number;
  /** How long each request waits for its response. Defaults to 30 seconds. */
  requestTimeoutMs?: number;
  /** Stops the handshake. The promise then rejects with the signal's reason. */
  signal?: AbortSignal;
}

export type ConnectOutcome =
  /** `client.hostProtocolVersion` is the Dashboard's protocol version. */
  | { status: 'connected'; client: KdpClient }
  /** The page is not in a frame, for example because it was opened directly. */
  | { status: 'not-embedded' }
  /** The Dashboard speaks an incompatible protocol version. */
  | { status: 'version-mismatch'; hostProtocolVersion: string }
  /** The Dashboard refused the page for a reason this version does not know. */
  | { status: 'refused'; reason: string; hostProtocolVersion: string }
  /**
   * Nothing accepted the page before the deadline. The most common cause is a framing header on
   * the page (`X-Frame-Options`, or a `frame-ancestors` CSP that excludes the Dashboard).
   */
  | { status: 'timed-out' };

// `crypto.randomUUID` exists only in secure contexts; an extension served over plain HTTP from a
// non-localhost origin has only `getRandomValues`, and `connect()` must not throw there.
function randomId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

// An entry with a path, a trailing slash or a wildcard never equals `event.origin`, so the
// handshake would time out without a hint.
function isOrigin(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).origin === value;
  } catch {
    return false;
  }
}

/**
 * Connects to the Dashboard that frames this page. Rejects only when `signal` aborts, or with a
 * `TypeError` when `expectedOrigins` is neither `'*'` nor a non-empty list of origins.
 */
export function connect(options: ConnectOptions): Promise<ConnectOutcome> {
  return connectWith(windowEnvironment(), options);
}

export function connectWith(
  env: HandshakeEnvironment | undefined,
  {
    expectedOrigins,
    handshakeTimeoutMs = DEFAULT_HANDSHAKE_TIMEOUT_MS,
    requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    signal,
  }: ConnectOptions,
): Promise<ConnectOutcome> {
  if (expectedOrigins !== '*') {
    // Failing loudly beats trusting every origin, or none, by accident.
    if (!Array.isArray(expectedOrigins) || expectedOrigins.length === 0) {
      return Promise.reject(
        new TypeError("connect() needs expectedOrigins: the Dashboard's origins, or '*'"),
      );
    }
    const invalid = expectedOrigins.filter((origin) => !isOrigin(origin));
    if (invalid.length > 0) {
      return Promise.reject(
        new TypeError(
          `connect() got ${invalid.map((o) => JSON.stringify(o)).join(', ')} in expectedOrigins; ` +
            "an origin is a scheme, host and port, e.g. 'https://kdp.example.com'",
        ),
      );
    }
  }
  // An abort reason is whatever the caller passed to `abort()`, as with `fetch`.
  // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
  if (signal?.aborted) return Promise.reject(signal.reason);
  if (!env || env.parent === env.self) return Promise.resolve({ status: 'not-embedded' });
  const win = env;

  return new Promise((resolve, reject) => {
    const announce: AnnounceMessage = {
      type: ANNOUNCE,
      protocolVersion: PROTOCOL_VERSION,
      instanceId: randomId(),
    };
    // The announcement carries only a version and a random ID, so any embedder may see it.
    const post = () => win.parent.postMessage(announce, '*');

    function stop(): void {
      win.removeEventListener('message', onMessage);
      win.clearInterval(interval);
      win.clearTimeout(deadline);
      signal?.removeEventListener('abort', onAbort);
    }

    function settle(outcome: ConnectOutcome): void {
      stop();
      resolve(outcome);
    }

    function onAbort(): void {
      stop();
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      reject(signal?.reason);
    }

    function onMessage(event: MessageEvent): void {
      if (event.source !== win.parent) return;
      if (expectedOrigins !== '*' && !expectedOrigins.includes(event.origin)) return;
      const message: unknown = event.data;
      if (!isRefuseMessage(message) && !isAcceptMessage(message)) return;
      if (message.instanceId !== announce.instanceId) return;

      if (message.type === REFUSE) {
        const hostProtocolVersion = message.protocolVersion;
        settle(
          message.reason === 'version-mismatch'
            ? { status: 'version-mismatch', hostProtocolVersion }
            : { status: 'refused', reason: message.reason, hostProtocolVersion },
        );
        return;
      }

      const port = event.ports[0];
      if (!isCompatible(PROTOCOL_VERSION, message.protocolVersion)) {
        port?.close();
        settle({ status: 'version-mismatch', hostProtocolVersion: message.protocolVersion });
        return;
      }
      // An accept without a port cannot be used; a conforming host's next answer may be.
      if (!port) return;

      const client = createClient({
        port,
        context: message.context,
        hostProtocolVersion: message.protocolVersion,
        requestTimeoutMs,
      });
      settle({ status: 'connected', client });
    }

    win.addEventListener('message', onMessage);
    signal?.addEventListener('abort', onAbort);
    const deadline = win.setTimeout(() => settle({ status: 'timed-out' }), handshakeTimeoutMs);
    const interval = win.setInterval(post, ANNOUNCE_INTERVAL_MS);
    post();
  });
}
