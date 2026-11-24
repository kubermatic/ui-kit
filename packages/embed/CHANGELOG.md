# @kubermatic/embed

## 0.1.0

### Minor Changes

- [#94](https://github.com/kubermatic/ui-kit/pull/94) [`e9e4a85`](https://github.com/kubermatic/ui-kit/commit/e9e4a85cf524bcb30f3a30f92b9189b84e521fcd) Thanks [@mstruebing](https://github.com/mstruebing)! - Add `@kubermatic/embed`, the client for pages embedded in the KDP Dashboard as `embedded` UI
  extensions.
  
  `connect({ expectedOrigins })` performs the `postMessage` handshake with the Dashboard and
  resolves with `connected`, `not-embedded`, `version-mismatch`, `refused` (with the Dashboard's
  reason) or `timed-out`. `expectedOrigins`
  is required: list the Dashboard's origins, or pass `'*'` to accept any framing parent. An
  `AbortSignal` stops a pending handshake. The connected client reads and changes the service's
  objects (`listObjects`, `getObject`, `createObject`, `patchObject`, `deleteObject`, `getRelated`),
  gets the value choices the CRD declares for a field (`getFieldOptions`), asks `can()`, and
  follows the Dashboard's theme. Failures are `KdpEmbedError`s whose `kind` tells a Dashboard
  refusal (`boundary`) from a platform or transport failure.
  
  `@kubermatic/embed/react` adds `KdpProvider`, `useKdp` and `useKdpTheme`, and
  `@kubermatic/embed/testing` adds `createMockHost` for unit tests without a Dashboard. The mock
  host checks payload shape, scope and namespaces as the Dashboard does. See the package README for registering
  an extension, consent and the required framing headers.
