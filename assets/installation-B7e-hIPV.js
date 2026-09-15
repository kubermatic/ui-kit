import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks-Dp9DwWr6.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/Installation`}),`
`,(0,c.jsx)(t.h1,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(t.h2,{id:`1-point-the-scope-at-the-registry`,children:`1. Point the scope at the registry`}),`
`,(0,c.jsxs)(t.p,{children:[`The package is published to GitHub Packages, not the public npm registry, so
the `,(0,c.jsx)(t.code,{children:`@kubermatic`}),` scope needs redirecting:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ini`,children:`# .npmrc
@kubermatic:registry=https://npm.pkg.github.com
`})}),`
`,(0,c.jsxs)(t.p,{children:[`GitHub Packages requires authentication even for reads. In CI, `,(0,c.jsx)(t.code,{children:`GITHUB_TOKEN`}),`
is enough; locally, a personal access token with `,(0,c.jsx)(t.code,{children:`read:packages`}),`.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-bash`,children:`npm install @kubermatic/ui-kit
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Peer dependencies you must already have: `,(0,c.jsx)(t.code,{children:`react`}),` and `,(0,c.jsx)(t.code,{children:`react-dom`}),` (^19), and
`,(0,c.jsx)(t.code,{children:`tailwindcss`}),` (^4.3).`]}),`
`,(0,c.jsx)(t.h2,{id:`2-import-the-stylesheets`,children:`2. Import the stylesheets`}),`
`,(0,c.jsx)(t.p,{children:`Order matters. Tailwind first, then the tokens:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@import 'tailwindcss';
@import '@kubermatic/ui-kit/theme.css';
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`theme.css`}),` does two things. It declares the tokens, and it carries an
`,(0,c.jsx)(t.code,{children:`@source`}),` directive pointing at the package's compiled components.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Do not strip that directive.`}),` Tailwind v4 does not scan `,(0,c.jsx)(t.code,{children:`node_modules`}),`, so
without it your build generates none of the utility classes the components
reference — `,(0,c.jsx)(t.code,{children:`bg-primary`}),`, `,(0,c.jsx)(t.code,{children:`inline-flex`}),`, `,(0,c.jsx)(t.code,{children:`h-9`}),` — and every component renders as
unstyled markup. It looks like a broken install rather than a missing scan
path, which is what makes it worth calling out.`]}),`
`,(0,c.jsx)(t.p,{children:`If your setup resolves the package somewhere unusual, add the path yourself:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@source '../node_modules/@kubermatic/ui-kit/dist';
`})}),`
`,(0,c.jsx)(t.h3,{id:`the-base-layer-is-opt-in`,children:`The base layer is opt-in`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`theme.css`}),` sets tokens and nothing else — importing design tokens should not
take over your page. If you want the kit to own the body background, text
colour and typeface, ask for it:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@import '@kubermatic/ui-kit/preflight.css';
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Skip it if your app already sets those, for instance a Next.js app injecting a
typeface through `,(0,c.jsx)(t.code,{children:`next/font`}),`. Otherwise the winner is decided by import order,
which is not a thing you want deciding your typography.`]}),`
`,(0,c.jsx)(t.h3,{id:`fonts`,children:`Fonts`}),`
`,(0,c.jsxs)(t.p,{children:[`The kit names `,(0,c.jsx)(t.code,{children:`Ubuntu`}),` and `,(0,c.jsx)(t.code,{children:`Roboto`}),` in `,(0,c.jsx)(t.code,{children:`--font-display`}),` and `,(0,c.jsx)(t.code,{children:`--font-sans`}),` but
does not load them — a component library that injects `,(0,c.jsx)(t.code,{children:`@font-face`}),` rules
fights with every app that has its own font strategy. Load them however you
already load fonts, or re-point the two roles at faces you do have.`]}),`
`,(0,c.jsx)(t.h2,{id:`3-wrap-the-app`,children:`3. Wrap the app`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { ThemeProvider } from '@kubermatic/ui-kit';

export default function App({ children }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`ThemeProvider`}),` resolves `,(0,c.jsx)(t.code,{children:`system`}),` against `,(0,c.jsx)(t.code,{children:`prefers-color-scheme`}),`, persists the
choice to localStorage, and toggles the `,(0,c.jsx)(t.code,{children:`.dark`}),` class the palette keys off.`]}),`
`,(0,c.jsx)(t.h2,{id:`4-server-rendered-add-the-no-flash-script`,children:`4. Server-rendered? Add the no-flash script`}),`
`,(0,c.jsx)(t.p,{children:`React can only apply the theme class in an effect, by which time the
server-rendered HTML has already painted. A user who chose dark sees a white
flash on every fresh document.`}),`
`,(0,c.jsxs)(t.p,{children:[`The fix is a synchronous script in `,(0,c.jsx)(t.code,{children:`<head>`}),`, above the stylesheets. It ships
with the package so it cannot drift from the provider:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { themeScript } from '@kubermatic/ui-kit';

// app/layout.tsx
<head>
  <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
</head>;
`})}),`
`,(0,c.jsxs)(t.p,{children:[`If you passed a custom `,(0,c.jsx)(t.code,{children:`storageKey`}),` to `,(0,c.jsx)(t.code,{children:`ThemeProvider`}),`, pass the same one here
— they have to agree about where the preference is stored.`]}),`
`,(0,c.jsx)(t.h2,{id:`server-components`,children:`Server Components`}),`
`,(0,c.jsxs)(t.p,{children:[`Every component and hook module carries `,(0,c.jsx)(t.code,{children:`'use client'`}),`, and the build preserves
modules rather than bundling, so the directives survive per file. You can
import from `,(0,c.jsx)(t.code,{children:`@kubermatic/ui-kit`}),` inside a Server Component; the parts that need
a client boundary declare their own.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`themeScript`}),`, `,(0,c.jsx)(t.code,{children:`cn`}),`, `,(0,c.jsx)(t.code,{children:`contrastRatio`}),` and the token metadata have no directive
and no DOM dependency, so they run on the server too.`]}),`
`,(0,c.jsx)(t.h2,{id:`icons`,children:`Icons`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`lucide-react`}),` comes with the package — do not install your own copy. It is
re-exported behind its own entry point, so importing a component does not pull
an icon barrel into your module graph:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Server, KeyRound } from '@kubermatic/ui-kit/icons';
`})}),`
`,(0,c.jsxs)(t.p,{children:[`The same applies to TanStack Table: `,(0,c.jsx)(t.code,{children:`ColumnDef`}),`, `,(0,c.jsx)(t.code,{children:`flexRender`}),` and
`,(0,c.jsx)(t.code,{children:`createColumnHelper`}),` come from the root export, because `,(0,c.jsx)(t.code,{children:`DataTable`}),` owns the
dependency.`]}),`
`,(0,c.jsx)(t.h2,{id:`check-it-worked`,children:`Check it worked`}),`
`,(0,c.jsx)(t.p,{children:`Three failure modes, and how they look:`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Symptom`}),(0,c.jsx)(t.th,{children:`Cause`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components render but unstyled`}),(0,c.jsxs)(t.td,{children:[`Tailwind is not scanning `,(0,c.jsx)(t.code,{children:`dist`}),` — see `,(0,c.jsx)(t.code,{children:`@source`}),`.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Colours are wrong or absent`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`theme.css`}),` imported before `,(0,c.jsx)(t.code,{children:`tailwindcss`}),`.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Dark mode flashes light on load`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`themeScript()`}),` is not in `,(0,c.jsx)(t.code,{children:`<head>`}),`.`]})]})]})]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};