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
export { type ConnectOptions, type ConnectOutcome, connect } from './client/connect.js';
export type { ClientStatus, KdpClient, KdpClientEvents } from './client/client.js';
export {
  BOUNDARY_ERROR_CODES,
  type BoundaryErrorCode,
  EMBED_ERROR_CODES,
  type EmbedErrorCode,
  type EmbedErrorKind,
  KdpEmbedError,
  PLATFORM_ERROR_CODES,
  type PlatformErrorCode,
  TRANSPORT_ERROR_CODES,
  type TransportErrorCode,
  errorKind,
  isKdpEmbedError,
} from './protocol/errors.js';
export type {
  EmbedContext,
  EmbedVerb,
  GroupKind,
  KdpObject,
  KdpObjectMeta,
  ServiceObjectRef,
  Theme,
} from './protocol/messages.js';
export { PROTOCOL_VERSION } from './protocol/version.js';
