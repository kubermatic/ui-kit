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

/**
 * The wire protocol version, independent of the package version. Additive changes raise the
 * minor, breaking changes raise the major.
 */
export const PROTOCOL_VERSION = '1.0';

export interface ProtocolVersion {
  major: number;
  minor: number;
}

const VERSION_PATTERN = /^(\d+)\.(\d+)$/;

/** Parses a `major.minor` string. Anything else, including non-strings, yields `null`. */
export function parseProtocolVersion(value: unknown): ProtocolVersion | null {
  if (typeof value !== 'string') return null;
  const match = VERSION_PATTERN.exec(value);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]) };
}

/**
 * Whether two sides can talk: both versions parse and their majors are equal. The page and the
 * Dashboard host both call this, so they cannot disagree.
 */
export function isCompatible(ours: unknown, theirs: unknown): boolean {
  const a = parseProtocolVersion(ours);
  const b = parseProtocolVersion(theirs);
  return a !== null && b !== null && a.major === b.major;
}
