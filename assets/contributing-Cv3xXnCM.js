import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks-Dp9DwWr6.js";function o(e){let t={a:`a`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/Contributing`}),`
`,(0,c.jsx)(t.h1,{id:`contributing`,children:`Contributing`}),`
`,(0,c.jsxs)(t.p,{children:[`The full guide lives in
`,(0,c.jsx)(t.a,{href:`https://github.com/kubermatic/ui-kit/blob/main/CONTRIBUTING.md`,rel:`nofollow`,children:`CONTRIBUTING.md`}),`.
This page is the part a product team needs before opening a pull request
against a library four other teams depend on.`]}),`
`,(0,c.jsx)(t.h2,{id:`proposing-a-component`,children:`Proposing a component`}),`
`,(0,c.jsx)(t.p,{children:`Ask first, in an issue. A component in a shared kit is a permanent commitment
for everyone, and the wrong ones are much more expensive than the missing ones.
Three questions decide it:`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Is it needed by more than one product?`}),` If not, it belongs in that
product. A component with one consumer is a component with one opinion.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Does Base UI already have the primitive?`}),` If it does, we style that
rather than reimplement its keyboard handling and ARIA wiring — the part
that is easy to get subtly wrong and hard to notice.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Can it be built from existing roles?`}),` A component that needs a new colour
needs a new `,(0,c.jsx)(t.em,{children:`measured`}),` colour, in both palettes, which is a bigger change
than the component.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`the-rules-that-are-enforced-rather-than-documented`,children:`The rules that are enforced rather than documented`}),`
`,(0,c.jsx)(t.p,{children:`Lint rules, not conventions, because a convention in a shared repo is a thing
new contributors have to be told:`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Rule`}),(0,c.jsx)(t.th,{children:`What it stops`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`kubermatic/no-color-literals`})}),(0,c.jsxs)(t.td,{children:[`A hardcoded colour, which escapes theming `,(0,c.jsx)(t.em,{children:`and`}),` the WCAG checks.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`kubermatic/require-use-client`})}),(0,c.jsx)(t.td,{children:`A missing directive, which breaks in the consumer's build.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`kubermatic/license-header`})}),(0,c.jsx)(t.td,{children:`A file without the Apache-2.0 grant.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`no-restricted-imports`})}),(0,c.jsxs)(t.td,{children:[`A `,(0,c.jsx)(t.code,{children:`@/`}),` alias in shipped source — it survives into the emitted `,(0,c.jsx)(t.code,{children:`.d.ts`}),` and does not resolve for consumers.`]})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`npm run lint:fix`}),` fixes most of them, including stamping the licence header.`]}),`
`,(0,c.jsx)(t.h2,{id:`two-habits-that-matter-more-than-they-look`,children:`Two habits that matter more than they look`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsxs)(t.strong,{children:[`Use `,(0,c.jsx)(t.code,{children:`variantKeys<T>`}),` for variant lists in stories.`]}),` It takes a
`,(0,c.jsx)(t.code,{children:`Record<T, true>`}),`, so a variant added to a component's `,(0,c.jsx)(t.code,{children:`cva`}),` config but not to
its story fails typecheck. Unrendered means unscanned by axe and unreviewed on
a palette change, and nothing else would have caught it.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsxs)(t.strong,{children:[`Add a `,(0,c.jsx)(t.code,{children:`globals: { theme: 'dark' }`}),` counterpart.`]}),` The accessibility run
renders each story once, at one theme. Without a dark counterpart the dark
palette is never scanned — and the dark palette is exactly where `,(0,c.jsx)(t.code,{children:`--primary`}),`
flips from carrying white text to carrying dark text.`]}),`
`,(0,c.jsx)(t.h2,{id:`changesets`,children:`Changesets`}),`
`,(0,c.jsxs)(t.p,{children:[`Any change that reaches a consumer needs one: `,(0,c.jsx)(t.code,{children:`npm run changeset`}),`. Releases are
generated from them, so a PR without one ships nothing.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Describe the change `,(0,c.jsx)(t.strong,{children:`for someone upgrading`}),`, not for someone reading the
diff. "fix button" is worth nothing to the person whose build just broke.`]}),`
`,(0,c.jsxs)(t.p,{children:[`A token value change is a `,(0,c.jsx)(t.strong,{children:`minor`}),`, not a patch. The palette is part of the
contract, and somebody's screenshot tests will notice.`]}),`
`,(0,c.jsx)(t.h2,{id:`before-you-push`,children:`Before you push`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-bash`,children:`npm run verify
`})}),`
`,(0,c.jsx)(t.p,{children:`Lint → typecheck → unit and accessibility tests → build → package and consumer
checks. Exactly what CI runs, so there are no surprises waiting on the PR.`})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};