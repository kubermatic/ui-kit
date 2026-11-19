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
import { type KdpClient, createClient } from '../client/client.js';
import { type EmbedErrorCode, KdpEmbedError, isKdpEmbedError } from '../protocol/errors.js';
import {
  NOTIFY,
  RESPONSE,
  type EmbedContext,
  type EmbedVerb,
  type FieldOption,
  type KdpObject,
  type NotifyMessage,
  type Operation,
  type OperationParams,
  type OperationResult,
  type ResponseMessage,
  type Theme,
  isOperation,
  isRequestMessage,
} from '../protocol/messages.js';
import { PROTOCOL_VERSION } from '../protocol/version.js';

export interface MockCanCheck {
  verb: EmbedVerb;
  kind: string;
  namespace?: string;
}

export interface MockHostOptions {
  /** Merged over a default context: workspace `demo`, service `demo`, theme `light`. */
  context?: Partial<EmbedContext>;
  /** The objects each kind starts with. They are copied, so the arrays are never changed. */
  objects?: Record<string, readonly KdpObject[]>;
  /**
   * What `getRelated(kind, name, identifier)` returns, keyed by `` `${kind}/${name}/${identifier}` ``,
   * where `kind` and `name` identify the source object, not the related ones. The namespace is not
   * part of the key. Keys without an entry return an empty list.
   */
  related?: Record<string, readonly KdpObject[]>;
  /**
   * What `getFieldOptions(kind, field)` returns, keyed by kind and then by field path, e.g.
   * `{ LLMAccess: { 'spec.llmModels[].id': [...] } }`. The namespace is not part of the key. A kind
   * or field without an entry returns an empty list.
   */
  fieldOptions?: Record<string, Record<string, readonly FieldOption[]>>;
  /** The answer to every `can` question, or a function that decides per question. Defaults to `true`. */
  can?: boolean | ((check: MockCanCheck) => boolean);
  /** Makes an operation always fail with the given code. */
  fail?: Partial<Record<Operation, EmbedErrorCode | (string & {})>>;
}

export interface MockHost {
  /** A client connected to the mock host over a real `MessageChannel`. */
  readonly client: KdpClient;
  /** A copy of the host's objects per kind, as changed by the client's calls. */
  readonly objects: Record<string, KdpObject[]>;
  /** Sends a theme change, as the Dashboard does when the user switches theme. */
  notifyTheme(theme: Theme): void;
  /** Sends `closing` and closes the channel, as the Dashboard does when it unmounts the frame. */
  close(): void;
}

const DEFAULT_CONTEXT: EmbedContext = {
  workspace: 'demo',
  service: { id: 'demo', name: 'Demo' },
  kinds: [],
  user: { name: 'user@example.com' },
  theme: 'light',
};

type Handlers = {
  [O in Operation]: (params: OperationParams<O>) => OperationResult<O>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** RFC 7386: objects merge recursively, `null` removes a member, anything else replaces. */
function mergePatch(target: unknown, patch: unknown): unknown {
  if (!isPlainObject(patch)) return patch;
  const result: Record<string, unknown> = isPlainObject(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete result[key];
    else result[key] = mergePatch(result[key], value);
  }
  return result;
}

/**
 * Starts an in-memory host and returns a client connected to it. The host applies no access
 * rules: an operation fails only when `fail` says so, or when the object it names does not exist
 * (`not-found`) or already exists (`conflict`). An omitted namespace matches any namespace.
 */
export function createMockHost(options: MockHostOptions = {}): MockHost {
  const context: EmbedContext = { ...DEFAULT_CONTEXT, ...options.context };
  const store = new Map<string, KdpObject[]>(
    Object.entries(options.objects ?? {}).map(([kind, list]) => [kind, structuredClone([...list])]),
  );
  const { port1: hostPort, port2: pagePort } = new MessageChannel();

  const objectsOf = (kind: string): KdpObject[] => store.get(kind) ?? [];
  const inNamespace = (object: KdpObject, namespace: string | undefined) =>
    namespace === undefined || object.metadata.namespace === namespace;
  const indexOf = (kind: string, name: string, namespace: string | undefined): number => {
    const index = objectsOf(kind).findIndex(
      (object) => object.metadata.name === name && inNamespace(object, namespace),
    );
    if (index === -1) throw new KdpEmbedError('not-found', `${kind} ${name} was not found`);
    return index;
  };

  const handlers: Handlers = {
    listObjects: ({ kind, namespace }) =>
      objectsOf(kind).filter((object) => inNamespace(object, namespace)),
    getObject: ({ kind, name, namespace }) =>
      objectsOf(kind)[indexOf(kind, name, namespace)] as KdpObject,
    createObject: ({ kind, object, namespace }) => {
      const created: KdpObject =
        namespace === undefined
          ? object
          : { ...object, metadata: { ...object.metadata, namespace } };
      const { name, namespace: ns } = created.metadata;
      const list = objectsOf(kind);
      if (list.some((o) => o.metadata.name === name && o.metadata.namespace === ns)) {
        throw new KdpEmbedError('conflict', `${kind} ${String(name)} already exists`);
      }
      store.set(kind, [...list, created]);
      return created;
    },
    patchObject: ({ kind, name, patch, namespace }) => {
      const list = objectsOf(kind);
      const index = indexOf(kind, name, namespace);
      const patched = mergePatch(list[index], patch);
      if (!isPlainObject(patched) || !isPlainObject(patched.metadata)) {
        throw new KdpEmbedError('invalid', 'The patch must leave an object with metadata');
      }
      list[index] = patched as KdpObject;
      return list[index];
    },
    deleteObject: ({ kind, name, namespace }) => {
      objectsOf(kind).splice(indexOf(kind, name, namespace), 1);
      return null;
    },
    getRelated: ({ kind, name, identifier }) => [
      ...(options.related?.[`${kind}/${name}/${identifier}`] ?? []),
    ],
    getFieldOptions: ({ kind, field }) =>
      structuredClone([...(options.fieldOptions?.[kind]?.[field] ?? [])]),
    can: (check) =>
      typeof options.can === 'function' ? options.can(check) : (options.can ?? true),
  };

  function handle(operation: string, params: unknown): unknown {
    if (!isOperation(operation)) {
      throw new KdpEmbedError('protocol', `Unknown operation ${operation}`);
    }
    const forced = options.fail?.[operation];
    if (forced !== undefined) throw new KdpEmbedError(forced);
    // Each request's params match its operation; the union cannot express that pairing here.
    const handler = handlers[operation] as (params: unknown) => unknown;
    return handler(params);
  }

  const send = (message: ResponseMessage | NotifyMessage) => hostPort.postMessage(message);

  hostPort.addEventListener('message', (event: MessageEvent) => {
    const message: unknown = event.data;
    if (!isRequestMessage(message)) return;
    try {
      const result = handle(message.operation, message.params);
      send({ type: RESPONSE, id: message.id, ok: true, result });
    } catch (error) {
      const failure = isKdpEmbedError(error) ? error : new KdpEmbedError('upstream', String(error));
      send({
        type: RESPONSE,
        id: message.id,
        ok: false,
        failure: { code: failure.code, message: failure.message },
      });
    }
  });
  hostPort.start();

  const client = createClient({
    port: pagePort,
    context,
    hostProtocolVersion: PROTOCOL_VERSION,
  });

  return {
    client,
    get objects() {
      return Object.fromEntries([...store].map(([kind, list]) => [kind, structuredClone(list)]));
    },
    notifyTheme(theme) {
      send({ type: NOTIFY, event: 'theme', theme });
    },
    close() {
      send({ type: NOTIFY, event: 'closing' });
      hostPort.close();
    },
  };
}
