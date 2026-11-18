---
'@kubermatic/embed': minor
---

Add `@kubermatic/embed`, the client for pages embedded in the KDP Dashboard as `embedded` UI
extensions.

`connect()` performs the `postMessage` handshake with the Dashboard and resolves with
`connected`, `not-embedded`, `version-mismatch` or `timed-out`. The connected client reads and
changes the service's objects (`listObjects`, `getObject`, `createObject`, `patchObject`,
`deleteObject`, `getRelated`), asks `can()`, and follows the Dashboard's theme. Failures are
`KdpEmbedError`s whose `kind` tells a Dashboard refusal (`boundary`) from a platform or transport
failure.

`@kubermatic/embed/react` adds `KdpProvider`, `useKdp` and `useKdpTheme`, and
`@kubermatic/embed/testing` adds `createMockHost` for unit tests without a Dashboard. See the
package README for registering an extension, consent and the required framing headers.
