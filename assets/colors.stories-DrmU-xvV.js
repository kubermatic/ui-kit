import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./text-1WvMJMha.js";import{C as a,E as o,S as s,T as c,w as l,x as u}from"./iframe-BH6v6twT.js";function d(e,t){let[n,r]=(0,m.useState)({});return(0,m.useLayoutEffect)(()=>{if(!e.current)return;let n=getComputedStyle(e.current);r(Object.fromEntries(t.map(e=>[e,n.getPropertyValue(`--${e}`).trim()])))},[e]),n}function f({children:e}){return(0,h.jsx)(`div`,{className:`overflow-hidden rounded-lg border`,children:e})}function p({title:e,detail:t}){return(0,h.jsxs)(`div`,{className:`bg-background space-y-0.5 px-3 py-2`,children:[(0,h.jsx)(i,{variant:`small`,weight:`bold`,children:e}),t]})}var m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{m=t(),r(),a(),o(),h=n(),g=Object.keys(c),_=[`brand-teal`,`brand-rose`,`brand-honey`],v={title:`Foundations/Colors`,parameters:{docs:{description:{component:"The brand palette is exposed as `--brand-*` reference tokens, and separately as semantic roles that components actually use. The indirection matters: it lets a role carry an accessibility-corrected value while `--brand-*` stays exactly as the marketing document specifies. Every value and ratio below is read from the live stylesheet, so this page cannot disagree with `theme.css`."}}}},y={render:function(){let e=(0,m.useRef)(null),t=d(e,g);return(0,h.jsxs)(`div`,{ref:e,className:`space-y-4`,children:[(0,h.jsx)(i,{variant:`h2`,children:`Brand Palette`}),(0,h.jsx)(`div`,{className:`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,children:g.map(e=>(0,h.jsxs)(f,{children:[(0,h.jsx)(`div`,{className:`h-20`,style:{backgroundColor:`var(--${e})`}}),(0,h.jsx)(p,{title:e,detail:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(i,{variant:`small`,tone:`muted`,className:`font-mono text-xs`,children:(t[e]??``).toUpperCase()}),(0,h.jsx)(i,{variant:`small`,tone:`muted`,children:c[e]})]})})]},e))})]})}},b={render:function(){let e=(0,m.useRef)(null),[t,n]=(0,m.useState)(null);return(0,m.useLayoutEffect)(()=>{e.current&&n(u(e.current))},[]),(0,h.jsxs)(`div`,{ref:e,className:`space-y-4`,children:[(0,h.jsx)(i,{variant:`h2`,children:`Semantic Pairs`}),(0,h.jsx)(`div`,{className:`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,children:t?.measured.map(({pair:e,ratio:t,passes:n})=>{let r=e.minimumRatio>=l,a=`${e.foreground}-on-${e.surface}`;return(0,h.jsxs)(f,{children:[(0,h.jsx)(`div`,{className:`flex h-20 items-center justify-center`,style:{backgroundColor:`var(--${e.surface})`,color:`var(--${e.foreground})`},children:r?(0,h.jsx)(`span`,{className:`font-sans text-sm font-bold`,children:`Aa`}):(0,h.jsx)(`span`,{"aria-hidden":!0,className:`h-10 w-24 rounded-md border-2`,style:{borderColor:`var(--${e.foreground})`}})}),(0,h.jsx)(p,{title:a,detail:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(i,{variant:`small`,tone:n?`muted`:`destructive`,className:`font-mono text-xs`,children:[s(t),` · needs `,e.minimumRatio,`:1`,n?``:` · FAILS`]}),(0,h.jsx)(i,{variant:`small`,tone:`muted`,children:e.because})]})})]},a)})})]})}},x={render:function(){let e=(0,m.useRef)(null),t=d(e,_);return(0,h.jsxs)(`div`,{ref:e,className:`space-y-4`,children:[(0,h.jsx)(i,{variant:`h2`,children:`Highlights Are Surfaces`}),(0,h.jsxs)(`div`,{className:`grid max-w-2xl gap-6 sm:grid-cols-2`,children:[(0,h.jsxs)(`div`,{className:`space-y-2`,children:[(0,h.jsx)(i,{variant:`subline`,children:`As a surface`}),(0,h.jsx)(`div`,{className:`bg-accent text-accent-foreground rounded-md px-3 py-2`,children:(0,h.jsx)(i,{variant:`small`,as:`span`,weight:`bold`,children:`Teal`})}),(0,h.jsx)(`div`,{className:`bg-highlight-rose text-highlight-rose-foreground rounded-md px-3 py-2`,children:(0,h.jsx)(i,{variant:`small`,as:`span`,weight:`bold`,children:`Rosé`})}),(0,h.jsx)(`div`,{className:`bg-highlight-honey text-highlight-honey-foreground rounded-md px-3 py-2`,children:(0,h.jsx)(i,{variant:`small`,as:`span`,weight:`bold`,children:`Honey`})})]}),(0,h.jsxs)(`div`,{className:`space-y-2`,children:[(0,h.jsx)(i,{variant:`subline`,children:`As text on white`}),(0,h.jsxs)(i,{variant:`small`,tone:`muted`,children:[`Each measures below the 4.5:1 minimum against white, which is why no`,(0,h.jsx)(`code`,{className:`font-mono`,children:` tone `}),`exposes them. Shown here as swatches rather than coloured text so this story does not itself ship a violation.`]}),(0,h.jsx)(`div`,{className:`flex gap-2`,children:_.map(e=>(0,h.jsx)(`div`,{className:`size-10 rounded-md border`,style:{backgroundColor:`var(--${e})`},title:t[e]},e))})]})]})]})}},S={globals:{theme:`dark`},tags:[`!autodocs`],render:b.render},C=[`BrandPalette`,`SemanticPairs`,`WhyHighlightsAreSurfaces`,`SemanticPairsDark`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function BrandPaletteStory() {
    const ref = useRef<HTMLDivElement>(null);
    const values = useComputedTokens(ref, BRAND_NAMES);
    return <div ref={ref} className="space-y-4">
        <Text variant="h2">Brand Palette</Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_NAMES.map(name => <Swatch key={name}>
              <div className="h-20" style={{
            backgroundColor: \`var(--\${name})\`
          }} />
              <Caption title={name} detail={<>
                    <Text variant="small" tone="muted" className="font-mono text-xs">
                      {(values[name] ?? '').toUpperCase()}
                    </Text>
                    <Text variant="small" tone="muted">
                      {BRAND_ROLES[name]}
                    </Text>
                  </>} />
            </Swatch>)}
        </div>
      </div>;
  }
}`,...y.parameters?.docs?.source},description:{story:`The marketing palette, verbatim, with its documented role.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function SemanticPairsStory() {
    const ref = useRef<HTMLDivElement>(null);
    const [report, setReport] = useState<ContrastReport | null>(null);
    useLayoutEffect(() => {
      if (ref.current) setReport(auditThemeContrast(ref.current));
    }, []);
    return <div ref={ref} className="space-y-4">
        <Text variant="h2">Semantic Pairs</Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report?.measured.map(({
          pair,
          ratio,
          passes
        }) => {
          const isText = pair.minimumRatio >= AA_TEXT;
          const key = \`\${pair.foreground}-on-\${pair.surface}\`;
          return <Swatch key={key}>
                <div className="flex h-20 items-center justify-center" style={{
              backgroundColor: \`var(--\${pair.surface})\`,
              color: \`var(--\${pair.foreground})\`
            }}>
                  {isText ? <span className="font-sans text-sm font-bold">Aa</span> : <span aria-hidden className="h-10 w-24 rounded-md border-2" style={{
                borderColor: \`var(--\${pair.foreground})\`
              }} />}
                </div>
                <Caption title={key} detail={<>
                      <Text variant="small" tone={passes ? 'muted' : 'destructive'} className="font-mono text-xs">
                        {formatRatio(ratio)} · needs {pair.minimumRatio}:1
                        {passes ? '' : ' · FAILS'}
                      </Text>
                      <Text variant="small" tone="muted">
                        {pair.because}
                      </Text>
                    </>} />
              </Swatch>;
        })}
        </div>
      </div>;
  }
}`,...b.parameters?.docs?.source},description:{story:`Every pair in the contract, measured against the palette that is actually
applied. Text pairs are shown carrying text; the 3:1 pairs are shown as the
graphics they are, because rendering a 3.09:1 border colour *as text* would
be a genuine violation — and axe would rightly fail this story for it.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: function WhyHighlightsAreSurfacesStory() {
    const ref = useRef<HTMLDivElement>(null);
    const values = useComputedTokens(ref, HIGHLIGHTS);
    return <div ref={ref} className="space-y-4">
        <Text variant="h2">Highlights Are Surfaces</Text>
        <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Text variant="subline">As a surface</Text>
            <div className="bg-accent text-accent-foreground rounded-md px-3 py-2">
              <Text variant="small" as="span" weight="bold">
                Teal
              </Text>
            </div>
            <div className="bg-highlight-rose text-highlight-rose-foreground rounded-md px-3 py-2">
              <Text variant="small" as="span" weight="bold">
                Rosé
              </Text>
            </div>
            <div className="bg-highlight-honey text-highlight-honey-foreground rounded-md px-3 py-2">
              <Text variant="small" as="span" weight="bold">
                Honey
              </Text>
            </div>
          </div>
          <div className="space-y-2">
            <Text variant="subline">As text on white</Text>
            <Text variant="small" tone="muted">
              Each measures below the 4.5:1 minimum against white, which is why no
              <code className="font-mono"> tone </code>
              exposes them. Shown here as swatches rather than coloured text so this story does not
              itself ship a violation.
            </Text>
            <div className="flex gap-2">
              {HIGHLIGHTS.map(name => <div key={name} className="size-10 rounded-md border" style={{
              backgroundColor: \`var(--\${name})\`
            }} title={values[name]} />)}
            </div>
          </div>
        </div>
      </div>;
  }
}`,...x.parameters?.docs?.source},description:{story:`Why the highlight trio is never text on a light background. Both columns
hold the same three colours; only the left one is legible.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  render: SemanticPairs.render
}`,...S.parameters?.docs?.source},description:{story:`The same pairs under the dark palette. Present as a separate story because
the a11y run renders each story once, at whatever the \`theme\` global says —
without this, the dark tokens would never be scanned.`,...S.parameters?.docs?.description}}}})))()}w();export{y as BrandPalette,b as SemanticPairs,S as SemanticPairsDark,x as WhyHighlightsAreSurfaces,C as __namedExportsOrder,v as default};