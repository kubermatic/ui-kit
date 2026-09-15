import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./react-Bl2r1tuC.js";import{a as i,o as a}from"./blocks-Dp9DwWr6.js";function o(e){let t={a:`a`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/Accessibility`}),`
`,(0,c.jsx)(t.h1,{id:`accessibility`,children:`Accessibility`}),`
`,(0,c.jsx)(t.p,{children:`What this kit guarantees, how it is checked, and — the part usually left out —
what the checking does not prove.`}),`
`,(0,c.jsx)(t.h2,{id:`two-independent-checks`,children:`Two independent checks`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`1. The palette, computed.`}),` `,(0,c.jsx)(t.code,{children:`theme.test.ts`}),` parses `,(0,c.jsx)(t.code,{children:`theme.css`}),`, resolves the
`,(0,c.jsx)(t.code,{children:`var()`}),` chains, and computes the WCAG ratio for every pair in the token
contract, in `,(0,c.jsx)(t.strong,{children:`both`}),` palettes. It runs in milliseconds with no browser. When
it fails, the message names the token: `,(0,c.jsxs)(t.em,{children:[(0,c.jsx)(t.code,{children:`--muted-foreground`}),` on `,(0,c.jsx)(t.code,{children:`--muted`}),` is
4.38:1, below 4.5:1`]}),`.`]}),`
`,(0,c.jsxs)(t.p,{children:[`It also checks the ratios written in the comments beside the tokens. A comment
that says `,(0,c.jsx)(t.code,{children:`4.65:1`}),` next to a colour that no longer measures 4.65:1 fails the
build, because documentation nobody verifies is documentation that is
eventually wrong.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`2. The rendered output, scanned.`}),` `,(0,c.jsx)(t.code,{children:`npm run test:a11y`}),` renders `,(0,c.jsx)(t.strong,{children:`every
story`}),` in headless Chromium and runs axe-core over it. A story `,(0,c.jsx)(t.em,{children:`is`}),` the test:
add one and it is covered. Violations fail the run.`]}),`
`,(0,c.jsx)(t.p,{children:`The ruleset is pinned to the tags that make up WCAG 2.2 Level AA:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
`})}),`
`,(0,c.jsxs)(t.p,{children:[`The two overlap, and that is intentional. The computed check knows `,(0,c.jsx)(t.em,{children:`which`}),`
pairs matter but not whether a component actually renders them; axe sees what
is really painted — including composited backgrounds and opacity — but only
for the pairs some story happens to produce.`]}),`
`,(0,c.jsx)(t.h2,{id:`why-a-real-browser`,children:`Why a real browser`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`target-size`}),` and `,(0,c.jsx)(t.code,{children:`color-contrast`}),` both need layout geometry and computed
colour. jsdom has neither, so under jsdom those rules are `,(0,c.jsx)(t.strong,{children:`skipped silently`}),`
and the suite goes green having never checked the two things most likely to
break. That is the whole reason the accessibility project pays for a Chromium
download while the unit tests stay in jsdom.`]}),`
`,(0,c.jsx)(t.h2,{id:`what-a-green-run-does-not-prove`,children:`What a green run does not prove`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`It is a regression guard, not a compliance certificate.`}),` Automated tooling
catches roughly a third of WCAG failures, and the gap is widest exactly where
WCAG 2.2 added criteria. In axe-core 4.13 the `,(0,c.jsx)(t.code,{children:`wcag22aa`}),` tag resolves to a
single rule — `,(0,c.jsx)(t.code,{children:`target-size`}),`. There is no `,(0,c.jsx)(t.code,{children:`wcag22a`}),` tag at all.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`WCAG 2.2 criterion`}),(0,c.jsx)(t.th,{children:`Automatable?`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`2.4.11 Focus Not Obscured (Minimum)`}),(0,c.jsx)(t.td,{children:`No`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`2.5.7 Dragging Movements`}),(0,c.jsx)(t.td,{children:`No`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`2.5.8 Target Size (Minimum)`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.strong,{children:`Yes`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`3.2.6 Consistent Help`}),(0,c.jsx)(t.td,{children:`No`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`3.3.7 Redundant Entry`}),(0,c.jsx)(t.td,{children:`No`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`3.3.8 Accessible Authentication`}),(0,c.jsx)(t.td,{children:`No`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`The rest are judgements about flows, not snapshots of a DOM. Treat green as
"no `,(0,c.jsx)(t.em,{children:`detectable`}),` regression" and keep manual keyboard and screen-reader passes
for anything interactive.`]}),`
`,(0,c.jsx)(t.h2,{id:`what-the-palette-does-about-the-brand`,children:`What the palette does about the brand`}),`
`,(0,c.jsx)(t.p,{children:`Two of the brand colours cannot do the job they are specified for, and the
token layer is where that is resolved rather than in each component.`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Cerulean fails at exactly its specified use.`}),` `,(0,c.jsx)(t.code,{children:`#0081AE`}),` measures 4.42:1 on
white — 0.08 short of the text minimum — and fails identically as a button
surface under white text. `,(0,c.jsx)(t.code,{children:`--primary`}),` is therefore darkened by 0.012 OKLCH
lightness to `,(0,c.jsx)(t.code,{children:`#007DAA`}),` (4.65:1), a shift of three hex units that is visually
indistinguishable. `,(0,c.jsx)(t.code,{children:`--brand-cerulean`}),` keeps the exact specified value for
graphic elements, where the threshold is 3:1 and it passes comfortably.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Teal, Rosé and Honey cannot be text or borders on light backgrounds.`}),` They
measure 1.77:1, 2.57:1 and 1.87:1 against white — below even the 3:1 non-text
threshold. As filled surfaces carrying Dark Azure they reach 10.67:1, 7.35:1
and 10.11:1, which is how the kit exposes them: as `,(0,c.jsx)(t.code,{children:`Badge`}),` variants and
`,(0,c.jsx)(t.code,{children:`accent`}),` surfaces. `,(0,c.jsx)(t.code,{children:`Text`}),` offers `,(0,c.jsx)(t.strong,{children:`no`}),` tone for them, so the component API
cannot produce the violation in the first place.`]}),`
`,(0,c.jsx)(t.p,{children:`That last point is the pattern worth copying: where a combination is not
accessible, the preferred fix is to make it unrepresentable in the API rather
than to document it as a rule people must remember.`}),`
`,(0,c.jsx)(t.h2,{id:`opacity-tints-are-not-tokens`,children:`Opacity tints are not tokens`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`bg-destructive/10`}),` composites to a colour that is not in the token set —
`,(0,c.jsx)(t.code,{children:`#14192C`}),` on the dark palette — and Maroon on that measures 4.27:1. The axe run
caught precisely this in the Showcase story.`]}),`
`,(0,c.jsx)(t.p,{children:`Compose from solid roles. If a tinted surface is genuinely needed, it needs its
own measured foreground token, not a guess.`}),`
`,(0,c.jsx)(t.h2,{id:`your-palette-is-not-covered-by-any-of-this`,children:`Your palette is not covered by any of this`}),`
`,(0,c.jsxs)(t.p,{children:[`Everything above measures the built-in tokens. A palette supplied through
`,(0,c.jsx)(t.code,{children:`ThemeProvider`}),`'s `,(0,c.jsx)(t.code,{children:`tokens`}),` prop is measured by nobody until you measure it —
see `,(0,c.jsx)(t.a,{href:`./?path=/docs/guides-theming--docs`,children:`Theming → A custom palette leaves the verified set`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`checking-the-harness-still-bites`,children:`Checking the harness still bites`}),`
`,(0,c.jsx)(t.p,{children:`A passing suite is only meaningful if failure is possible. Drop a deliberately
broken story in and confirm it fails:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`// packages/ui-kit/src/components/ui/__tripwire.stories.tsx
export const TargetTooSmall: Story = {
  render: () => (
    <div className="flex gap-0">
      <Button className="size-4 p-0" aria-label="One" />
      <Button className="size-4 p-0" aria-label="Two" />
    </div>
  ),
};
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`npm run test:a11y`}),` should fail with `,(0,c.jsx)(t.code,{children:`(target-size)`}),`. Delete the file
afterwards.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};