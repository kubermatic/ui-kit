# @kubermatic/embed

Client for pages embedded in the Kubermatic Developer Platform (KDP) Dashboard as `embedded` UI
extensions. The Dashboard opens your page in an `iframe`; this package performs the `postMessage`
handshake with it and gives you a typed client for reading and changing your service's objects.
Every request is carried out by the Dashboard, with the signed-in user's credentials — your page
never sees a token. It also ships React bindings (`@kubermatic/embed/react`) and an in-memory mock
host for unit tests (`@kubermatic/embed/testing`).

## Install

```bash
npm install @kubermatic/embed
```

ESM only, no runtime dependencies. `react` (^19) is an optional peer, needed only for
`@kubermatic/embed/react`.

## Quick start

```ts
import { connect } from '@kubermatic/embed';

const outcome = await connect({ expectedOrigins: ['https://kdp.example.com'] });

switch (outcome.status) {
  case 'connected': {
    const { client } = outcome;
    applyTheme(client.context.theme);
    client.on('theme', applyTheme);
    client.on('disconnected', () => showMessage('The Dashboard closed the connection.'));
    renderList(await client.listObjects('LLMAccess'));
    break;
  }
  case 'not-embedded':
    showMessage('Open this page from the KDP Dashboard.');
    break;
  case 'version-mismatch':
    showMessage(`This page does not support Dashboard protocol ${outcome.hostProtocolVersion}.`);
    break;
  case 'timed-out':
    showMessage('Could not connect to the Dashboard.');
    break;
}
```

### React

`KdpProvider` connects on mount and closes the connection on unmount. `useKdp()` returns the
connection, `useKdpTheme()` the Dashboard's current theme.

```tsx
import { useEffect, useState } from 'react';

import type { KdpObject } from '@kubermatic/embed';
import { KdpProvider, useKdp, useKdpTheme } from '@kubermatic/embed/react';

export function App() {
  return (
    <KdpProvider options={{ expectedOrigins: ['https://kdp.example.com'] }}>
      <Accesses />
    </KdpProvider>
  );
}

function Accesses() {
  const { state, client, context, disconnected } = useKdp();
  const theme = useKdpTheme();
  const [accesses, setAccesses] = useState<KdpObject[]>([]);

  useEffect(() => {
    void client?.listObjects('LLMAccess').then(setAccesses, () => setAccesses([]));
  }, [client]);

  if (state === 'connecting') return <p>Connecting…</p>;
  if (state !== 'connected') return <p>Open this page from the KDP Dashboard ({state}).</p>;

  return (
    <main data-theme={theme}>
      {disconnected && <p role="alert">The Dashboard closed the connection.</p>}
      <h1>{context?.service.name}</h1>
      <ul>
        {accesses.map((access) => (
          <li key={access.metadata.name}>{access.metadata.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

| `useKdp()` field | Meaning                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `state`          | `connecting`, then one of the `connect()` outcome statuses                                                                                 |
| `client`         | The `KdpClient`, set while `state` is `connected`                                                                                          |
| `context`        | `client.context`, following theme changes                                                                                                  |
| `outcome`        | The handshake's result; unset while connecting and for an injected `client`                                                                |
| `disconnected`   | `true` once the connection ended. `state` stays `connected` so `client` and `context` stay readable; calls then reject with `disconnected` |

`useKdp()` throws outside a `KdpProvider`. `options` is read once, on mount.

## `connect(options?)`

Announces the page to the parent window and waits for the Dashboard to accept it. It never rejects;
it resolves with one of four outcomes.

| Option               | Default | Meaning                                                                                                                                |
| -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `expectedOrigins`    | any     | Origins the Dashboard may answer from, e.g. `['https://kdp.example.com']`. Answers are always required to come from the parent window. |
| `handshakeTimeoutMs` | 10 000  | How long to wait for the Dashboard to answer                                                                                           |
| `requestTimeoutMs`   | 30 000  | How long each request waits for its response before rejecting with `timeout`                                                           |

| Outcome            | Fields                          | When                                                                                                                                                                                 |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `connected`        | `client`, `hostProtocolVersion` | The Dashboard accepted the page                                                                                                                                                      |
| `not-embedded`     | —                               | The page is not in a frame, e.g. it was opened directly                                                                                                                              |
| `version-mismatch` | `hostProtocolVersion`           | The Dashboard speaks an incompatible protocol version                                                                                                                                |
| `timed-out`        | —                               | Nothing accepted the page in time. The most common cause is a framing header on your page — see [Framing headers](#framing-headers) — or a Dashboard origin not in `expectedOrigins` |

## Client

`client.context` is available immediately, without a request:

| Field       | Meaning                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| `workspace` | The workspace path without the `root:` prefix, e.g. `acme:team`. Every request runs in this workspace        |
| `service`   | `{ id, name }` of the service that registered the extension                                                  |
| `kinds`     | The service's kinds as `{ group, kind }` pairs — the kinds the client can address                            |
| `object`    | For a `ServiceObjectContextMenu` extension, the object it was opened on: `{ group, kind, name, namespace? }` |
| `user`      | `{ name }` of the signed-in user                                                                             |
| `theme`     | `light` or `dark`; updated when a `theme` event arrives                                                      |

`client.status` is `connected` or `disconnected`; `client.hostProtocolVersion` is the Dashboard's
protocol version.

Every `kind` argument is a kind name from `context.kinds`, such as `LLMAccess`. Every method returns
a promise that rejects with a [`KdpEmbedError`](#errors). The object methods take a type parameter
for the object shape (`client.getObject<LLMAccess>(…)`); it is not checked at runtime.

| Method                                           | Resolves with                                  |
| ------------------------------------------------ | ---------------------------------------------- |
| `listObjects(kind, namespace?)`                  | A list of objects                              |
| `getObject(kind, name, namespace?)`              | The object                                     |
| `createObject(kind, object, namespace?)`         | The created object                             |
| `patchObject(kind, name, patch, namespace?)`     | The patched object                             |
| `deleteObject(kind, name, namespace?)`           | `null`                                         |
| `getRelated(kind, name, identifier, namespace?)` | A list of related objects, possibly empty      |
| `getFieldOptions(kind, field, namespace?)`       | A list of `{ value, label }`, possibly empty   |
| `can(verb, kind, namespace?)`                    | `true` or `false`                              |
| `on(event, listener)`                            | — returns a function that removes the listener |
| `close()`                                        | — ends the connection; idempotent              |

```ts
const accesses = await client.listObjects('LLMAccess');
const access = await client.getObject('LLMAccess', 'team-a', 'default');

await client.createObject(
  'LLMAccess',
  { metadata: { name: 'team-b' }, spec: { model: 'llama' } },
  'default',
);
await client.patchObject('LLMAccess', 'team-a', { spec: { model: 'mistral' } }, 'default');

if (await client.can('delete', 'LLMAccess', 'default')) {
  await client.deleteObject('LLMAccess', 'team-b', 'default');
}

const secrets = await client.getRelated('LLMAccess', 'team-a', 'connection-details', 'default');
```

- **Namespaces.** An omitted `namespace` is sent as omitted, and the Dashboard decides what it
  means: `listObjects` without one lists across every namespace the user can read. `getObject`,
  `patchObject`, `deleteObject` and `getRelated` on a namespaced kind need a namespace and fail with
  `invalid` without one; a namespace for a cluster-scoped kind fails with `invalid` too. For
  `createObject` the namespace can come from the argument or from `metadata.namespace`, but not two
  different ones.
- **Patches** are JSON merge patches ([RFC 7386](https://www.rfc-editor.org/rfc/rfc7386)): objects
  merge, `null` removes a field, anything else replaces it.
- **`getRelated`** takes the _source_ object (`kind`, `name`, `namespace`) and the related-resource
  `identifier` from your `PublishedResource`, and returns every related object for that identifier.
  See [Related objects](#related-objects) for what the objects must carry.
- **`getFieldOptions`** returns the choices the Dashboard's forms offer for a field. See
  [Field options](#field-options).
- **`can`** is advisory, for deciding whether to show a button. It asks the Dashboard every time and
  is not cached. It answers `true` only when the request would pass the Dashboard's checks (for a
  mutating verb: declared and consented) and the user's permissions allow it. A `true` is not a
  guarantee: the request can still fail, e.g. with `forbidden` if permissions changed in between.

### Events

| Event          | Listener          | When                                                                                                                                        |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`        | `(theme) => void` | The user switched the Dashboard's theme; `client.context.theme` is already updated                                                          |
| `disconnected` | `() => void`      | The Dashboard closed the connection, or you called `close()`. Pending requests reject with `disconnected`; listeners are removed afterwards |

## Errors

Every rejection is a `KdpEmbedError` with a `code`, a human-readable `message`, optional `details`
and a `kind` derived from the code. `isBoundary` is shorthand for `kind === 'boundary'`.

| Kind        | Codes                                                       | Meaning                                                                                                                            |
| ----------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `boundary`  | `out-of-scope`, `not-declared`, `not-consented`             | The Dashboard refused: the kind is not one of the service's, the extension did not declare the verb, or the user has not consented |
| `platform`  | `forbidden`, `not-found`, `conflict`, `invalid`, `upstream` | The platform rejected the request made with the user's credentials, or failed handling it                                          |
| `transport` | `timeout`, `disconnected`, `protocol`, `invalid-payload`    | The channel failed: no response in time, connection closed, malformed message, or a value that cannot be sent (e.g. a function)    |
| `unknown`   | anything else                                               | A code this version does not know, e.g. one added by a newer Dashboard. `message` is still set                                     |

```ts
import { isKdpEmbedError } from '@kubermatic/embed';

try {
  await client.deleteObject('LLMAccess', 'team-a', 'default');
} catch (error) {
  if (!isKdpEmbedError(error)) throw error;
  if (error.isBoundary) showMessage('This extension may not delete accesses.');
  else if (error.code === 'forbidden') showMessage('You may not delete this access.');
  else showMessage(error.message);
}
```

The code lists are exported as `BOUNDARY_ERROR_CODES`, `PLATFORM_ERROR_CODES`,
`TRANSPORT_ERROR_CODES` and `EMBED_ERROR_CODES`, and `errorKind(code)` maps a code to its kind.

## Testing

`createMockHost()` from `@kubermatic/embed/testing` starts an in-memory Dashboard and returns a
client already connected to it over a real `MessageChannel`. It applies no access rules: a call
fails only when `fail` says so, or with `not-found` / `conflict` for a missing or existing object.

| Option         | Meaning                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `context`      | Merged over a default context (workspace `demo`, service `demo`, theme `light`)                                               |
| `objects`      | The objects each kind starts with, e.g. `{ LLMAccess: [...] }`. Copied; an omitted namespace matches any                      |
| `related`      | What `getRelated` returns, keyed by `` `${kind}/${name}/${identifier}` ``; other keys return `[]`                             |
| `fieldOptions` | What `getFieldOptions` returns per kind and field, e.g. `{ LLMAccess: { 'spec.llmModels[].id': [...] } }`; others return `[]` |
| `can`          | The answer to every `can`, or a function `({ verb, kind, namespace }) => boolean`. Defaults to `true`                         |
| `fail`         | Makes an operation always fail with a code, e.g. `{ deleteObject: 'not-consented' }`                                          |

The host exposes `client`, `objects` (a copy of the current state per kind, reflecting the client's
changes), `notifyTheme(theme)` and `close()`, which disconnects the client as the Dashboard does.

```ts
import { createMockHost } from '@kubermatic/embed/testing';

const host = createMockHost({
  objects: { LLMAccess: [{ metadata: { name: 'team-a', namespace: 'default' }, spec: {} }] },
  related: {
    'LLMAccess/team-a/connection-details': [
      { apiVersion: 'v1', kind: 'Secret', metadata: { name: 'team-a-key', namespace: 'default' } },
    ],
  },
  can: ({ verb }) => verb !== 'delete',
  fail: { deleteObject: 'not-consented' },
});

await host.client.patchObject('LLMAccess', 'team-a', { spec: { model: 'llama' } }, 'default');
expect(host.objects.LLMAccess?.[0]?.spec).toEqual({ model: 'llama' });
host.close();
```

With React, pass the mock client to `KdpProvider`. It then skips the handshake, reports `connected`,
and leaves closing the client to you:

```tsx
import { render, screen } from '@testing-library/react';

import { KdpProvider } from '@kubermatic/embed/react';
import { createMockHost } from '@kubermatic/embed/testing';

it('lists the accesses', async () => {
  const host = createMockHost({
    context: { service: { id: 'llm', name: 'LLM' } },
    objects: { LLMAccess: [{ metadata: { name: 'team-a', namespace: 'default' } }] },
  });

  render(
    <KdpProvider client={host.client}>
      <Accesses />
    </KdpProvider>,
  );

  expect(await screen.findByText('team-a')).toBeInTheDocument();
  host.close();
});
```

## Registering an extension

A service registers its extension through a `ServiceInstancePageButton` (a button on the service's
objects page) or a `ServiceObjectContextMenu` (an entry in a service object's menu), with an
`embedded` target:

```yaml
apiVersion: ui.kdp.k8c.io/v1alpha1
kind: ServiceInstancePageButton
metadata:
  name: llm-console
spec:
  title: 'LLM Console'
  description: 'Manage LLM accesses'
  target:
    embedded:
      url: 'https://llm.example.com/kdp/console?workspace={{workspace}}'
      access:
        - resources:
            - group: ai.kdp.k8c.io
              kind: LLMAccess
          verbs: ['create', 'patch', 'delete']
```

- **`access`** declares only the mutating verbs `create`, `patch` and `delete`. Reading
  (`listObjects`, `getObject`, `getRelated`, `getFieldOptions`) every kind of the service is
  implicit. A mutation that is not declared fails with `not-declared` without reaching the platform.
  Omit `access` for a read-only extension.
- **`url`** must be absolute and on a different origin than the Dashboard; use `https`. A URL on the
  Dashboard's own origin is not rendered.
- **Placeholders** in the URL are replaced by the Dashboard: `{{workspace}}` and `{{connector}}` (the
  ID of the OIDC connector the user signed in with), and for a `ServiceObjectContextMenu` also
  `{{objectName}}`, `{{objectNamespace}}` and `{{objectKind}}`. In a `ServiceInstancePageButton` the
  object placeholders are replaced by empty strings. The same values are in `client.context`, so you
  do not need them to connect.

### Consent

Before an extension may mutate anything, the Dashboard shows the user what it declared — service,
origin, kinds and verbs — and asks for consent. Until the user allows it, every mutation fails with
`not-consented` and `can()` answers `false`; the page still renders and reads, so treat it as
read-only. Widening `access` asks the user again. Consent never grants more than the user's own
permissions: requests still go out with their credentials.

## Framing headers

Your page must allow the Dashboard to frame it. Send

```http
Content-Security-Policy: frame-ancestors https://kdp.example.com
```

with the Dashboard's origin, and do **not** send `X-Frame-Options: DENY` or
`X-Frame-Options: SAMEORIGIN`. If either is wrong, the browser leaves the frame blank, the page
never runs or never reaches the Dashboard, and `connect()` (or `useKdp().state`) ends in
`timed-out`.

## Related objects

`getRelated` returns objects that the api-syncagent links to a service object through the
related-resources annotation, e.g. on an `LLMAccess`:

```yaml
annotations:
  related-resources.syncagent.kcp.io/connection-details.0: '{"namespace":"default","name":"team-a-key","apiVersion":"v1","kind":"Secret"}'
```

The identifier (`connection-details`) is the `related[].identifier` from your `PublishedResource`.
Because a provider could annotate any object, the Dashboard also requires each related object to
carry a label naming the source resource as `<plural>.<group>`:

```yaml
labels:
  services.kdp.k8c.io/owned-by: llmaccesses.ai.kdp.k8c.io
```

Objects without that label, or with one naming another resource, are left out of the result.

## Field options

`getFieldOptions(kind, field, namespace?)` returns the value choices that the CRD of `kind` declares
for `field`, as `{ value, label }` pairs: the same list the Dashboard's own form shows for that
field. Use it to fill a picker, e.g. the models an `LLMAccess` may reference:

```ts
const models = await client.getFieldOptions('LLMAccess', 'spec.llmModels[].id', 'default');
renderPicker(models.map(({ value, label }) => ({ id: value, name: label })));
```

- **Field paths** are dot-separated property names rooted at the object, with `[]` after a property
  whose value is an array, to step into its items: `spec.llmModels[].id` is the `id` of each item of
  `spec.llmModels`. A path names a schema field only; it carries no URL or query. An empty path or
  an empty segment (`spec..id`) fails with `invalid-payload`.
- **The source** is the field source the CRD author declared on that field (a `kdp:options` block).
  The Dashboard resolves it in the current workspace and namespace and fetches the options with the
  user's credentials, so the source kinds (here `LLMModel` from the service catalog) need not be
  among `context.kinds`. A field without a declared source fails with `not-found`.
- **It is a read**, so it needs no `access` declaration and no consent.

## Protocol versioning

The wire protocol has its own `major.minor` version (`PROTOCOL_VERSION`), independent of the package
version. The page and the Dashboard connect when their majors are equal; additive changes raise the
minor, breaking changes the major. Error codes added in a later minor arrive with kind `unknown`.

The page announces itself to the parent window with target `*`, so the announcement carries only
the type, the protocol version and an `instanceId`. It is repeated every 250 ms until answered.
`connect()` picks a new random `instanceId` per call and sends it with every repeat; the Dashboard
ignores repeats of the instance it is already connected to and replaces the channel only for a new
one, e.g. after a reload.

`@kubermatic/embed/protocol` exports the wire contract for the Dashboard's side of the channel.
Extension authors do not need it.

## Licence

Apache-2.0
