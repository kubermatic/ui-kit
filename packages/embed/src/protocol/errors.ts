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

/** The Dashboard refused the request because of scope, declaration or consent. */
export const BOUNDARY_ERROR_CODES = ['out-of-scope', 'not-declared', 'not-consented'] as const;

/** The platform rejected a request sent with the user's credentials. */
export const PLATFORM_ERROR_CODES = [
  'forbidden',
  'not-found',
  'conflict',
  'invalid',
  'upstream',
] as const;

/** The channel itself failed. */
export const TRANSPORT_ERROR_CODES = [
  'timeout',
  'disconnected',
  'protocol',
  'invalid-payload',
] as const;

export const EMBED_ERROR_CODES = [
  ...BOUNDARY_ERROR_CODES,
  ...PLATFORM_ERROR_CODES,
  ...TRANSPORT_ERROR_CODES,
] as const;

export type BoundaryErrorCode = (typeof BOUNDARY_ERROR_CODES)[number];
export type PlatformErrorCode = (typeof PLATFORM_ERROR_CODES)[number];
export type TransportErrorCode = (typeof TRANSPORT_ERROR_CODES)[number];
export type EmbedErrorCode = (typeof EMBED_ERROR_CODES)[number];

/** `unknown` is a code this side does not know, such as one added in a later minor version. */
export type EmbedErrorKind = 'boundary' | 'platform' | 'transport' | 'unknown';

const DESCRIPTIONS: Record<EmbedErrorCode, string> = {
  'out-of-scope': 'The request is outside the extension’s scope',
  'not-declared': 'The extension did not declare this access',
  'not-consented': 'The user has not consented to this access',
  forbidden: 'The platform denied the request',
  'not-found': 'The object was not found',
  conflict: 'The request conflicts with the object’s current state',
  invalid: 'The platform rejected the request as invalid',
  upstream: 'The platform failed to handle the request',
  timeout: 'The request timed out',
  disconnected: 'The connection to the Dashboard is closed',
  protocol: 'The Dashboard sent a malformed or unexpected message',
  'invalid-payload': 'The message could not be sent',
};

function includes<T extends string>(list: readonly T[], code: string): code is T {
  return (list as readonly string[]).includes(code);
}

export function isKnownErrorCode(code: string): code is EmbedErrorCode {
  return includes(EMBED_ERROR_CODES, code);
}

export function errorKind(code: string): EmbedErrorKind {
  if (includes(BOUNDARY_ERROR_CODES, code)) return 'boundary';
  if (includes(PLATFORM_ERROR_CODES, code)) return 'platform';
  if (includes(TRANSPORT_ERROR_CODES, code)) return 'transport';
  return 'unknown';
}

function describeCode(code: string): string {
  return isKnownErrorCode(code) ? DESCRIPTIONS[code] : `The request failed (${code})`;
}

/** A failure as it arrives on the wire, before it is checked. */
export interface FailureLike {
  code?: unknown;
  message?: unknown;
  details?: unknown;
}

export class KdpEmbedError extends Error {
  override readonly name = 'KdpEmbedError';
  readonly code: EmbedErrorCode | (string & {});
  declare readonly details?: unknown;

  constructor(code: EmbedErrorCode | (string & {}), message?: string, details?: unknown) {
    super(message || describeCode(code));
    this.code = code;
    if (details !== undefined) this.details = details;
  }

  get kind(): EmbedErrorKind {
    return errorKind(this.code);
  }

  /** The Dashboard refused it, whether or not a request reached the platform. */
  get isBoundary(): boolean {
    return this.kind === 'boundary';
  }

  /** Builds an error from a wire failure. A missing code becomes `protocol`. */
  static fromFailure(failure: FailureLike | undefined): KdpEmbedError {
    const code =
      typeof failure?.code === 'string' && failure.code !== '' ? failure.code : 'protocol';
    const message = typeof failure?.message === 'string' ? failure.message : undefined;
    return new KdpEmbedError(code, message, failure?.details);
  }
}

export function isKdpEmbedError(value: unknown): value is KdpEmbedError {
  return value instanceof KdpEmbedError;
}
