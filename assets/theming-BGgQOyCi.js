import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks-Dp9DwWr6.js";function o(e){let t={a:`a`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/Theming`}),`
`,(0,c.jsx)(t.h1,{id:`theming`,children:`Theming`}),`
`,(0,c.jsx)(t.p,{children:`Several products share this kit, and they do not all want the same palette.
This page is how you change one without forking anything.`}),`
`,(0,c.jsxs)(t.p,{children:[`See it working in `,(0,c.jsx)(t.a,{href:`./?path=/docs/foundations-custom-theme--docs`,children:`Foundations → Custom Theme`}),`,
which renders the same markup twice under two palettes.`]}),`
`,(0,c.jsx)(t.h2,{id:`how-it-works`,children:`How it works`}),`
`,(0,c.jsx)(t.p,{children:`Three layers, and the middle one is what makes the rest possible.`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`1. Components only ever reference semantic roles.`}),` `,(0,c.jsx)(t.code,{children:`Button`}),` is
`,(0,c.jsx)(t.code,{children:`bg-primary text-primary-foreground`}),`. No component in the kit contains a
literal colour, and the `,(0,c.jsx)(t.code,{children:`kubermatic/no-color-literals`}),` lint rule is what keeps
it that way.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsxs)(t.strong,{children:[`2. `,(0,c.jsx)(t.code,{children:`@theme inline`}),` compiles those utilities straight to the variable.`]}),`
Tailwind emits:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`.bg-primary {
  background-color: var(--primary);
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Note what is `,(0,c.jsx)(t.em,{children:`absent`}),`: no `,(0,c.jsx)(t.code,{children:`--color-primary: var(--primary)`}),` indirection.
Without `,(0,c.jsx)(t.code,{children:`inline`}),`, `,(0,c.jsx)(t.code,{children:`--color-primary`}),` would be computed once on `,(0,c.jsx)(t.code,{children:`:root`}),` and
inherited as a fixed value, and overriding `,(0,c.jsx)(t.code,{children:`--primary`}),` further down the tree
would do nothing at all. Because the utility resolves `,(0,c.jsx)(t.code,{children:`var(--primary)`}),` `,(0,c.jsx)(t.strong,{children:`at the
element`}),`, re-pointing a role on any ancestor restyles everything beneath it.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsxs)(t.strong,{children:[`3. `,(0,c.jsx)(t.code,{children:`.dark`}),` re-points the roles.`]}),` `,(0,c.jsx)(t.code,{children:`theme.css`}),` declares each role twice, once
on `,(0,c.jsx)(t.code,{children:`:root`}),` and once under `,(0,c.jsx)(t.code,{children:`.dark`}),`. Dark mode is not a second set of components
or a second set of utilities — it is the same utilities reading different
values.`]}),`
`,(0,c.jsx)(t.p,{children:`That is also why a theme can be scoped to a subtree rather than the page: the
class and the variables both land on an element you choose.`}),`
`,(0,c.jsx)(t.h2,{id:`build-time--override-in-css`,children:`Build time — override in CSS`}),`
`,(0,c.jsx)(t.p,{children:`Best when a product has one fixed palette. Override the properties after
importing the sheet:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@import 'tailwindcss';
@import '@kubermatic/ui-kit/theme.css';

:root {
  --primary: #6d28d9;
  --primary-foreground: #ffffff;
  --radius: 1rem;
}

.dark {
  --primary: #a78bfa;
  --primary-foreground: #17132a;
}
`})}),`
`,(0,c.jsxs)(t.h2,{id:`runtime--the-tokens-prop`,children:[`Runtime — the `,(0,c.jsx)(t.code,{children:`tokens`}),` prop`]}),`
`,(0,c.jsxs)(t.p,{children:[`Best when the palette is per-tenant, user-chosen, or fetched. `,(0,c.jsx)(t.code,{children:`ThemeProvider`}),`
writes the values as inline custom properties on the theme root:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { ThemeProvider, type ThemeOverrides } from '@kubermatic/ui-kit';

const tenant: ThemeOverrides = {
  light: { primary: '#6d28d9', heading: '#5b21b6', radius: '1rem' },
  dark: { primary: '#a78bfa', 'primary-foreground': '#17132a' },
};

<ThemeProvider tokens={tenant}>
  <App />
</ThemeProvider>;
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`ThemeTokens`}),` is typed to the semantic roles, so `,(0,c.jsx)(t.code,{children:`primary`}),` autocompletes and
`,(0,c.jsx)(t.code,{children:`primrey`}),` is a compile error. The `,(0,c.jsx)(t.code,{children:`--brand-*`}),` reference palette is deliberately
`,(0,c.jsx)(t.strong,{children:`not`}),` overridable — those are the source document's values, and a role that
needs to differ from them should differ at the role, not at the reference.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Overrides are a `,(0,c.jsx)(t.strong,{children:`patch, not a replacement`}),`. Supply only `,(0,c.jsx)(t.code,{children:`primary`}),` and every
other role keeps its brand value; supply only `,(0,c.jsx)(t.code,{children:`light`}),` and the dark palette is
untouched. Roles are removed again when they change or when the provider
unmounts, so nothing lingers on the element.`]}),`
`,(0,c.jsx)(t.h2,{id:`theming-a-subtree`,children:`Theming a subtree`}),`
`,(0,c.jsxs)(t.p,{children:[`Combine `,(0,c.jsx)(t.code,{children:`tokens`}),` with `,(0,c.jsx)(t.code,{children:`getThemeRoot`}),` — a getter rather than an element, so the
lookup happens inside the effect once refs are attached:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`function TenantPreview({ tokens, children }) {
  const ref = useRef(null);
  const getThemeRoot = useCallback(() => ref.current, []);

  return (
    <div ref={ref}>
      <ThemeProvider tokens={tokens} getThemeRoot={getThemeRoot} storageKey={null}>
        {children}
      </ThemeProvider>
    </div>
  );
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`storageKey={null}`}),` because a preview pane should not overwrite the user's
actual preference. That is exactly how this Storybook themes the story canvas
without touching its own chrome.`]}),`
`,(0,c.jsx)(t.h2,{id:`a-custom-palette-leaves-the-verified-set`,children:`A custom palette leaves the verified set`}),`
`,(0,c.jsxs)(t.p,{children:[`Every built-in pair is measured against WCAG 2.2 AA, and CI recomputes all of
them from `,(0,c.jsx)(t.code,{children:`theme.css`}),` on every run. `,(0,c.jsx)(t.strong,{children:`Nothing measures yours.`}),` `,(0,c.jsx)(t.code,{children:`tokens`}),` will
accept a primary at 3.6:1 without complaint, and it will look fine to whoever
picked it.`]}),`
`,(0,c.jsx)(t.p,{children:`So the same check is exported. Point it at the element your theme is mounted
on:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { auditThemeContrast } from '@kubermatic/ui-kit';

it('the tenant palette meets AA', () => {
  render(<ThemeProvider tokens={tenant}>…</ThemeProvider>);
  expect(auditThemeContrast(document.documentElement).failures).toEqual([]);
});
`})}),`
`,(0,c.jsx)(t.p,{children:`It reads the roles as computed custom properties, so it sees the effective
palette — built-in values, CSS overrides and runtime tokens together — and
measures the same pairs the kit's own suite does. It needs a real layout, so
run it in a browser environment rather than jsdom if you want it to reflect
what users see.`}),`
`,(0,c.jsx)(t.p,{children:`Two things it deliberately will not do:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Guess at translucency.`}),` `,(0,c.jsx)(t.code,{children:`bg-primary/10`}),` composites against whatever is
behind it, so it has no contrast of its own. Those pairs come back under
`,(0,c.jsx)(t.code,{children:`unmeasured`}),` rather than being given an invented number.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Check pairs you invented.`}),` It measures the roles in `,(0,c.jsx)(t.code,{children:`CONTRAST_PAIRS`}),`. A
colour combination your product makes up outside the token set is yours to
measure.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`which-roles-exist`,children:`Which roles exist`}),`
`,(0,c.jsxs)(t.p,{children:[`The full list, with what each is for and its measured ratio in both palettes,
is in `,(0,c.jsx)(t.a,{href:`./?path=/docs/foundations-colors--docs`,children:`Foundations → Colors`}),`. The
values on that page are read from the live stylesheet rather than typed in, so
it cannot go stale.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`CONTRAST_PAIRS`}),` and `,(0,c.jsx)(t.code,{children:`COLOR_ROLES`}),` are exported if you want to drive a theme
editor or a settings UI from them.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};