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
   * Origins the Dashboard may answer from, e.g. `['https://kdp.example.com']`. When omitted, an
   * answer from any origin is accepted, as long as it comes from the parent window.
   */
  expectedOrigins?: readonly string[];
  /** How long to wait for the Dashboard to answer. Defaults to 10 seconds. */
  handshakeTimeoutMs?: number;
  /** How long each request waits for its response. Defaults to 30 seconds. */
  requestTimeoutMs?: number;
}

export type ConnectOutcome =
  | { status: 'connected'; client: KdpClient; hostProtocolVersion: string }
  /** The page is not in a frame, for example because it was opened directly. */
  | { status: 'not-embedded' }
  /** The Dashboard speaks an incompatible protocol version. */
  | { status: 'version-mismatch'; hostProtocolVersion: string }
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

/** Connects to the Dashboard that frames this page. Never rejects. */
export function connect(options: ConnectOptions = {}): Promise<ConnectOutcome> {
  const env = windowEnvironment();
  if (!env) return Promise.resolve({ status: 'not-embedded' });
  return connectWith(env, options);
}

export function connectWith(
  env: HandshakeEnvironment,
  {
    expectedOrigins,
    handshakeTimeoutMs = DEFAULT_HANDSHAKE_TIMEOUT_MS,
    requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
  }: ConnectOptions = {},
): Promise<ConnectOutcome> {
  if (env.parent === env.self) return Promise.resolve({ status: 'not-embedded' });

  return new Promise((resolve) => {
    const announce: AnnounceMessage = {
      type: ANNOUNCE,
      protocolVersion: PROTOCOL_VERSION,
      instanceId: randomId(),
    };
    // The announcement carries only a version and a random ID, so any embedder may see it.
    const post = () => env.parent.postMessage(announce, '*');

    function settle(outcome: ConnectOutcome): void {
      env.removeEventListener('message', onMessage);
      env.clearInterval(interval);
      env.clearTimeout(deadline);
      resolve(outcome);
    }

    function onMessage(event: MessageEvent): void {
      if (event.source !== env.parent) return;
      if (expectedOrigins && !expectedOrigins.includes(event.origin)) return;
      const message: unknown = event.data;

      if (isRefuseMessage(message)) {
        // `version-mismatch` is the only refusal this version defines; any other reason, from a
        // later host, is reported as one too rather than left to time out.
        settle({ status: 'version-mismatch', hostProtocolVersion: message.protocolVersion });
        return;
      }
      if (!isAcceptMessage(message)) return;

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
      settle({ status: 'connected', client, hostProtocolVersion: message.protocolVersion });
    }

    env.addEventListener('message', onMessage);
    const deadline = env.setTimeout(() => settle({ status: 'timed-out' }), handshakeTimeoutMs);
    const interval = env.setInterval(post, ANNOUNCE_INTERVAL_MS);
    post();
  });
}
