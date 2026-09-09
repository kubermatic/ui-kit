# Security policy

## Reporting a vulnerability

**Do not open a public issue.** Report it privately through
[GitHub Security Advisories](https://github.com/kubermatic/ui-kit/security/advisories/new),
or by email to security@kubermatic.com.

You should get an acknowledgement within two working days, and an assessment
with a rough timeline within five.

## What is in scope

This repository publishes two packages. What matters for each is different, so
it is worth being explicit.

**`@kubermatic/ui-kit`** ships React components into other people's
applications. The realistic issues are:

- An XSS vector — a prop reaching `dangerouslySetInnerHTML`, an unescaped value
  in generated markup, or a URL prop accepting `javascript:`.
- `themeScript()` producing a string that escapes its own context. It
  interpolates a caller-supplied storage key into source that runs in `<head>`
  before anything else on the page. The key goes through `JSON.stringify` and
  there is a test for a key containing a quote, but this is the highest-value
  target in the package.
- Anything that causes the package to execute code at install time. It has no
  install scripts, and it should not acquire any.

**`@kubermatic/eslint-config`** runs on developer machines and in CI, with
access to the source tree. A config that could be made to load arbitrary code
is in scope.

## What is not

- Findings in the Storybook catalogue's own build output. It is documentation;
  it holds no secrets and takes no user input.
- `npm audit` output for `devDependencies` with no demonstrated path to
  execution. Report it as a normal issue, and see `.github/workflows/audit.yml`
  — a weekly job already watches for these.
- Accessibility defects. Those are bugs and belong in the public tracker.

## Supported versions

Only the latest published minor of each package receives fixes. The kit is
pre-1.0; there are no maintenance branches, and the expectation is that
consumers stay current.

## How this repository defends itself

Worth knowing before you report, because some classes of finding are already
handled:

- **Actions are pinned by commit SHA**, not by tag, so a moved tag on a
  third-party action cannot reach the release workflow — which holds
  `packages: write`.
- **Dependencies are exact-pinned** (`save-exact=true`), and Dependabot applies
  a cooldown so a freshly published release is not installed the day it lands.
  Security updates bypass that cooldown.
- **Publishing uses the workflow's own `GITHUB_TOKEN`.** There is no long-lived
  npm token to leak or rotate.
- **`npm audit` runs weekly**, separately for the full tree and for the subset
  that actually ships.
