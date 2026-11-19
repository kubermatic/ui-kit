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
  type GroupKind,
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
  /**
   * Merged over a default context: workspace `demo`, service `demo`, theme `light`. Without
   * `kinds`, the service offers every kind seeded in `objects`, `related` and `fieldOptions`, in
   * the core group.
   */
  context?: Partial<EmbedContext>;
  /** Kinds that are cluster-scoped. Every other kind is namespaced. */
  clusterScoped?: readonly string[];
  /** The objects each kind starts with. They are copied, so the arrays are never changed. */
  objects?: Record<string, readonly KdpObject[]>;
  /**
   * What `getRelated(kind, name, identifier)` returns, keyed by `` `${kind}/${name}/${identifier}` ``,
   * where `kind` and `name` identify the source object, not the related ones. The namespace is not
   * part of the key. The source object must be seeded in `objects`, or the call fails with
   * `not-found`; a seeded source without an entry has no related objects.
   */
  related?: Record<string, readonly KdpObject[]>;
  /**
   * What `getFieldOptions(kind, field)` returns, keyed by kind and then by field path, e.g.
   * `{ LLMAccess: { 'spec.llmModels[].id': [...] } }`. The namespace is not part of the key. A kind
   * or field without an entry has no field source and fails with `not-found`.
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

// Seeds are readonly; the port clones every result anyway.
type Handlers = {
  [O in Operation]: (params: OperationParams<O>) => Readonly<OperationResult<O>>;
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

const DNS_LABEL = /^[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?$/;
const FIELD_PATH = /^[A-Za-z0-9_-]+(\[\])?(\.[A-Za-z0-9_-]+(\[\])?)*$/;
const VERBS: readonly unknown[] = ['get', 'list', 'create', 'patch', 'delete'];

const invalidPayload = (message: string) => new KdpEmbedError('invalid-payload', message);

function checkNamespace(value: unknown, field: string): void {
  if (value !== undefined && (typeof value !== 'string' || !DNS_LABEL.test(value))) {
    throw invalidPayload(`"${field}" must be a DNS-1123 label`);
  }
}

/** The Dashboard's shape checks, which run before any other. */
function checkPayload(params: Record<string, unknown>): void {
  for (const field of ['kind', 'name', 'identifier', 'field']) {
    const value = params[field];
    if (field !== 'kind' && value === undefined) continue;
    if (typeof value !== 'string' || value === '') {
      throw invalidPayload(`"${field}" must be a non-empty string`);
    }
  }
  if (params.name === '.' || params.name === '..') {
    throw invalidPayload('"name" must not be "." or ".."');
  }
  checkNamespace(params.namespace, 'namespace');
  if ('object' in params) {
    if (!isPlainObject(params.object)) throw invalidPayload('"object" must be an object');
    const { metadata } = params.object;
    if (metadata !== undefined) {
      if (!isPlainObject(metadata)) throw invalidPayload('"metadata" must be an object');
      // An empty namespace means unset, as in Kubernetes.
      if (metadata.namespace !== '') checkNamespace(metadata.namespace, 'metadata.namespace');
    }
  }
  if ('patch' in params && !isPlainObject(params.patch)) {
    throw invalidPayload('"patch" must be an object');
  }
  if ('verb' in params && !VERBS.includes(params.verb)) {
    throw invalidPayload(`"verb" must be one of ${VERBS.join(', ')}`);
  }
  if (typeof params.field === 'string' && !FIELD_PATH.test(params.field)) {
    throw invalidPayload(
      '"field" must be dot-separated property names, each optionally followed by []',
    );
  }
}

function seededKinds({ objects, related, fieldOptions }: MockHostOptions): GroupKind[] {
  const kinds = new Set([
    ...Object.keys(objects ?? {}),
    ...Object.keys(related ?? {}).map((key) => key.split('/')[0]!),
    ...Object.keys(fieldOptions ?? {}),
  ]);
  return [...kinds].map((kind) => ({ group: '', kind }));
}

/**
 * Starts an in-memory host and returns a client connected to it. It checks payload shape, scope
 * and namespaces as the Dashboard does, but applies no access rules: declaration and consent are only simulated
 * through `can` and `fail`. Otherwise an operation fails only when the object it names does not
 * exist (`not-found`), already exists (`conflict`), or a field has no seeded options (`not-found`).
 */
export function createMockHost(options: MockHostOptions = {}): MockHost {
  const context: EmbedContext = {
    ...DEFAULT_CONTEXT,
    kinds: seededKinds(options),
    ...options.context,
  };
  const store = new Map<string, KdpObject[]>(
    Object.entries(options.objects ?? {}).map(([kind, list]) => [kind, structuredClone([...list])]),
  );
  const { port1: hostPort, port2: pagePort } = new MessageChannel();

  const groupsOf = (kind: string) =>
    new Set(context.kinds.filter((k) => k.kind === kind).map((k) => k.group));
  const requireScope = (kind: string) => {
    const groups = groupsOf(kind);
    if (groups.size === 0) throw new KdpEmbedError('out-of-scope', `Kind ${kind} is out of scope`);
    if (groups.size > 1) {
      throw new KdpEmbedError('invalid', `Kind ${kind} is offered in more than one group`);
    }
  };
  const isNamespaced = (kind: string) => !options.clusterScoped?.includes(kind);
  /** For a call that may span namespaces: only a cluster-scoped kind refuses a namespace. */
  const allowNamespace = (kind: string, namespace: string | undefined) => {
    if (!isNamespaced(kind) && namespace !== undefined) {
      throw new KdpEmbedError('invalid', `Kind ${kind} is cluster-scoped`);
    }
  };
  /** For a call on one object: a namespaced kind also needs one. */
  const requireNamespace = (kind: string, namespace: string | undefined) => {
    allowNamespace(kind, namespace);
    if (isNamespaced(kind) && namespace === undefined) {
      throw new KdpEmbedError('invalid', `Kind ${kind} needs a namespace`);
    }
  };

  const objectsOf = (kind: string): KdpObject[] => store.get(kind) ?? [];
  // The Dashboard takes it from the Service's resource. The mock knows only the group, so it
  // prefers a seeded object's version, then the one sent if its group matches, then `v1`.
  const apiVersionOf = (kind: string, sent: string | undefined): string => {
    const seeded = options.objects?.[kind]?.find((o) => o.apiVersion)?.apiVersion;
    if (seeded) return seeded;
    const group = context.kinds.find((k) => k.kind === kind)?.group ?? '';
    const sentGroup = sent?.includes('/') ? sent.slice(0, sent.lastIndexOf('/')) : '';
    if (sent && sentGroup === group) return sent;
    return group ? `${group}/v1` : 'v1';
  };
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
    listObjects: ({ kind, namespace }) => {
      requireScope(kind);
      allowNamespace(kind, namespace);
      return objectsOf(kind).filter((object) => inNamespace(object, namespace));
    },
    getObject: ({ kind, name, namespace }) => {
      requireScope(kind);
      requireNamespace(kind, namespace);
      return objectsOf(kind)[indexOf(kind, name, namespace)] as KdpObject;
    },
    createObject: ({ kind, object, namespace }) => {
      requireScope(kind);
      const metadata = object.metadata ?? {};
      const objectNamespace = metadata.namespace || undefined;
      if (
        namespace !== undefined &&
        objectNamespace !== undefined &&
        namespace !== objectNamespace
      ) {
        throw new KdpEmbedError('invalid', 'The namespace parameter and metadata.namespace differ');
      }
      const ns = namespace ?? objectNamespace;
      requireNamespace(kind, ns);
      const created: KdpObject = {
        ...object,
        apiVersion: apiVersionOf(kind, object.apiVersion),
        kind,
        metadata: ns === undefined ? metadata : { ...metadata, namespace: ns },
      };
      const { name } = created.metadata;
      const list = objectsOf(kind);
      if (list.some((o) => o.metadata.name === name && o.metadata.namespace === ns)) {
        throw new KdpEmbedError('conflict', `${kind} ${String(name)} already exists`);
      }
      store.set(kind, [...list, created]);
      return created;
    },
    patchObject: ({ kind, name, patch, namespace }) => {
      requireScope(kind);
      requireNamespace(kind, namespace);
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
      requireScope(kind);
      requireNamespace(kind, namespace);
      objectsOf(kind).splice(indexOf(kind, name, namespace), 1);
      return null;
    },
    getRelated: ({ kind, name, identifier, namespace }) => {
      requireScope(kind);
      requireNamespace(kind, namespace);
      indexOf(kind, name, namespace);
      return options.related?.[`${kind}/${name}/${identifier}`] ?? [];
    },
    getFieldOptions: ({ kind, field }) => {
      requireScope(kind);
      const choices = options.fieldOptions?.[kind]?.[field];
      if (!choices)
        throw new KdpEmbedError('not-found', `Kind ${kind} has no field source on ${field}`);
      return choices;
    },
    can: (check) => {
      if (groupsOf(check.kind).size === 0) return false;
      requireScope(check.kind);
      allowNamespace(check.kind, check.namespace);
      return typeof options.can === 'function' ? options.can(check) : (options.can ?? true);
    },
  };

  function handle(operation: string, params: unknown): unknown {
    if (!isOperation(operation)) {
      throw new KdpEmbedError('protocol', `Unknown operation ${operation}`);
    }
    checkPayload(params as Record<string, unknown>);
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
