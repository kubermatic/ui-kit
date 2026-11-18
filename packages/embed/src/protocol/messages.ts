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

export type Theme = 'light' | 'dark';

export type EmbedVerb = 'get' | 'list' | 'create' | 'patch' | 'delete';

export interface GroupKind {
  group: string;
  kind: string;
}

/** The object a context-menu extension was opened on. */
export interface ServiceObjectRef extends GroupKind {
  name: string;
  namespace?: string;
}

export interface KdpObjectMeta {
  name?: string;
  namespace?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  [key: string]: unknown;
}

export interface KdpObject {
  apiVersion?: string;
  kind?: string;
  metadata: KdpObjectMeta;
  [key: string]: unknown;
}

export interface EmbedContext {
  /** The workspace path without the `root:` prefix, e.g. `acme:team`. */
  workspace: string;
  service: { id: string; name: string };
  kinds: GroupKind[];
  object?: ServiceObjectRef;
  user: { name: string };
  theme: Theme;
}

/*
 * `kind` is one of the service's kinds from `EmbedContext.kinds`. An omitted `namespace` is sent
 * as omitted; the Dashboard decides what it means.
 */
export interface OperationContracts {
  listObjects: { params: { kind: string; namespace?: string }; result: KdpObject[] };
  getObject: { params: { kind: string; name: string; namespace?: string }; result: KdpObject };
  createObject: {
    params: { kind: string; object: KdpObject; namespace?: string };
    result: KdpObject;
  };
  patchObject: {
    /** `patch` is a JSON merge patch (RFC 7386). */
    params: { kind: string; name: string; patch: unknown; namespace?: string };
    result: KdpObject;
  };
  deleteObject: { params: { kind: string; name: string; namespace?: string }; result: null };
  getRelated: {
    params: { kind: string; name: string; identifier: string; namespace?: string };
    result: KdpObject[];
  };
  can: { params: { verb: EmbedVerb; kind: string; namespace?: string }; result: boolean };
}

export type Operation = keyof OperationContracts;
export type OperationParams<O extends Operation> = OperationContracts[O]['params'];
export type OperationResult<O extends Operation> = OperationContracts[O]['result'];

export const OPERATIONS = [
  'listObjects',
  'getObject',
  'createObject',
  'patchObject',
  'deleteObject',
  'getRelated',
  'can',
] as const satisfies readonly Operation[];

export const ANNOUNCE = 'kdp.embed.announce';
export const ACCEPT = 'kdp.embed.accept';
export const REFUSE = 'kdp.embed.refuse';
export const REQUEST = 'kdp.embed.request';
export const RESPONSE = 'kdp.embed.response';
export const NOTIFY = 'kdp.embed.notify';

export interface AnnounceMessage {
  type: typeof ANNOUNCE;
  protocolVersion: string;
  /** Random per `connect()` call and shared by its repeats: a host tells a repeat from a reload. */
  instanceId: string;
}

export interface AcceptMessage {
  type: typeof ACCEPT;
  protocolVersion: string;
  context: EmbedContext;
}

export interface RefuseMessage {
  type: typeof REFUSE;
  protocolVersion: string;
  reason: 'version-mismatch' | (string & {});
}

export type HandshakeMessage = AnnounceMessage | AcceptMessage | RefuseMessage;

export type RequestMessage<O extends Operation = Operation> = O extends Operation
  ? { type: typeof REQUEST; id: number; operation: O; params: OperationParams<O> }
  : never;

export interface Failure {
  code: string;
  message: string;
  details?: unknown;
}

export type ResponseMessage<T = unknown> =
  | { type: typeof RESPONSE; id: number; ok: true; result: T }
  | { type: typeof RESPONSE; id: number; ok: false; failure: Failure };

export type NotifyMessage =
  { type: typeof NOTIFY; event: 'theme'; theme: Theme } | { type: typeof NOTIFY; event: 'closing' };

export type ChannelMessage = RequestMessage | ResponseMessage | NotifyMessage;

type Fields = Record<string, unknown>;

function isRecord(value: unknown): value is Fields {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isId(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function hasType(value: unknown, type: string): value is Fields {
  return isRecord(value) && value.type === type;
}

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function isOperation(value: unknown): value is Operation {
  return (OPERATIONS as readonly unknown[]).includes(value);
}

function isGroupKind(value: unknown): value is GroupKind {
  return isRecord(value) && isString(value.group) && isString(value.kind);
}

function isServiceObjectRef(value: unknown): value is ServiceObjectRef {
  return (
    isRecord(value) &&
    isGroupKind(value) &&
    isString(value.name) &&
    (value.namespace === undefined || isString(value.namespace))
  );
}

export function isEmbedContext(value: unknown): value is EmbedContext {
  return (
    isRecord(value) &&
    isString(value.workspace) &&
    isRecord(value.service) &&
    isString(value.service.id) &&
    isString(value.service.name) &&
    Array.isArray(value.kinds) &&
    value.kinds.every(isGroupKind) &&
    (value.object === undefined || isServiceObjectRef(value.object)) &&
    isRecord(value.user) &&
    isString(value.user.name) &&
    isTheme(value.theme)
  );
}

export function isAnnounceMessage(value: unknown): value is AnnounceMessage {
  return (
    hasType(value, ANNOUNCE) &&
    isString(value.protocolVersion) &&
    isString(value.instanceId) &&
    value.instanceId !== ''
  );
}

export function isAcceptMessage(value: unknown): value is AcceptMessage {
  return hasType(value, ACCEPT) && isString(value.protocolVersion) && isEmbedContext(value.context);
}

/** Any non-empty reason is accepted, so that a reason added by a later host still ends the wait. */
export function isRefuseMessage(value: unknown): value is RefuseMessage {
  return (
    hasType(value, REFUSE) &&
    isString(value.protocolVersion) &&
    isString(value.reason) &&
    value.reason !== ''
  );
}

/**
 * Checks the envelope only. The operation may still be one this side does not know, which the
 * host answers with a `protocol` failure; use `isOperation` for that.
 */
export function isRequestMessage(value: unknown): value is RequestMessage {
  return (
    hasType(value, REQUEST) && isId(value.id) && isString(value.operation) && isRecord(value.params)
  );
}

/**
 * A failure only needs to be an object here: a missing code or message is repaired by
 * `KdpEmbedError.fromFailure` rather than treated as a malformed response.
 */
export function isResponseMessage(value: unknown): value is ResponseMessage {
  if (!hasType(value, RESPONSE) || !isId(value.id)) return false;
  if (value.ok === true) return 'result' in value;
  if (value.ok === false) return isRecord(value.failure);
  return false;
}

export function isNotifyMessage(value: unknown): value is NotifyMessage {
  if (!hasType(value, NOTIFY)) return false;
  if (value.event === 'theme') return isTheme(value.theme);
  return value.event === 'closing';
}
