## What changed

<!-- What a reviewer needs to know, and why this approach. -->

## Checklist

- [ ] `npm run verify` passes
- [ ] Added a changeset (`npm run changeset`), or this cannot reach a consumer
- [ ] New variants are listed in the story's `variantKeys` matrix
- [ ] New colour roles are in `tokens.ts`, defined in **both** palettes, and
      their pairs are listed in `CONTRAST_PAIRS`
- [ ] Stories added or updated, including a dark-theme counterpart

<!--
Reviewer notes — the checks that are easy to skip because they pass silently:

* A token change is a MINOR, not a patch. The palette is part of the contract.
* A bump to either package's `dependencies` reaches consumers and needs a
  changeset. Dependabot cannot write one.
* Shipped source must not import through `@/` — the alias survives into the
  emitted `.d.ts` and does not resolve for consumers. Lint is the only thing
  that catches this.
-->
