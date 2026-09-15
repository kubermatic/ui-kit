import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{r,t as i}from"./button-DkUjhKwZ.js";import{n as a,t as o}from"./text-1WvMJMha.js";import{n as s,t as c}from"./arrow-right-DxoHGwtb.js";import{n as l,t as u}from"./check-BaG4Ubyj.js";import{n as d,t as f}from"./triangle-alert-9J3f0Ci3.js";import{F as p,I as m,Jt as h,L as g,qt as _}from"./iframe-BH6v6twT.js";function v({tokens:e,children:t}){let{resolvedTheme:n}=g(),r=(0,b.useRef)(null),i=(0,b.useCallback)(()=>r.current,[]);return(0,x.jsx)(`div`,{ref:r,className:`h-full`,children:(0,x.jsx)(p,{defaultTheme:n,storageKey:null,getThemeRoot:i,tokens:e,children:(0,x.jsx)(`div`,{className:`bg-background text-foreground h-full rounded-lg border p-5`,children:t})},n)})}function y({label:e}){return(0,x.jsxs)(`div`,{className:`space-y-5`,children:[(0,x.jsxs)(`div`,{className:`space-y-1`,children:[(0,x.jsx)(o,{variant:`small`,tone:`muted`,className:`font-mono text-xs`,children:e}),(0,x.jsx)(o,{variant:`h2`,children:`Manage Kubernetes At Scale`}),(0,x.jsx)(o,{variant:`subline`,children:`One Control Plane, Every Cloud`})]}),(0,x.jsx)(o,{variant:`body`,tone:`muted`,children:`Not one component below knows which palette it is in. They read semantic roles, and the roles are re-pointed above them.`}),(0,x.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,x.jsxs)(i,{children:[`Create Cluster`,(0,x.jsx)(c,{})]}),(0,x.jsx)(i,{variant:`outline`,children:`View Docs`}),(0,x.jsx)(i,{variant:`ghost`,children:`Cancel`})]}),(0,x.jsxs)(`div`,{className:`bg-muted space-y-3 rounded-lg p-4`,children:[(0,x.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,x.jsx)(o,{variant:`h3`,as:`h3`,children:`production-eu-01`}),(0,x.jsxs)(_,{variant:`accent`,children:[(0,x.jsx)(u,{}),`Running`]})]}),(0,x.jsx)(o,{variant:`small`,tone:`muted`,children:`v1.31.2 · 6 nodes · Frankfurt`}),(0,x.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,x.jsx)(_,{variant:`secondary`,children:`openstack`}),(0,x.jsx)(_,{variant:`primary`,children:`Managed`})]})]}),(0,x.jsxs)(`div`,{className:`border-destructive space-y-1 rounded-lg border p-4`,children:[(0,x.jsxs)(o,{variant:`subline`,tone:`destructive`,className:`text-base`,children:[(0,x.jsx)(f,{className:`mr-1 inline size-4`,"aria-hidden":!0}),`Quota Exceeded`]}),(0,x.jsx)(o,{variant:`small`,children:`The destructive role is re-pointed too.`})]})]})}var b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{s(),l(),d(),b=t(),h(),r(),a(),m(),x=n(),S={light:{background:`#ffffff`,foreground:`#1e1b2e`,heading:`#5b21b6`,primary:`#6d28d9`,"primary-foreground":`#ffffff`,secondary:`#f5f3ff`,"secondary-foreground":`#1e1b2e`,accent:`#ddd6fe`,"accent-foreground":`#1e1b2e`,muted:`#f5f3ff`,"muted-foreground":`#686f7d`,border:`#948faf`,ring:`#6d28d9`,destructive:`#9f1239`,"destructive-foreground":`#ffffff`,radius:`1rem`},dark:{background:`#17132a`,foreground:`#ffffff`,heading:`#c4b5fd`,primary:`#a78bfa`,"primary-foreground":`#17132a`,secondary:`#2a2342`,"secondary-foreground":`#ffffff`,accent:`#a78bfa`,"accent-foreground":`#17132a`,muted:`#2a2342`,"muted-foreground":`#918cab`,border:`#66617f`,ring:`#a78bfa`,destructive:`#fda4af`,"destructive-foreground":`#17132a`,radius:`1rem`}},C={title:`Foundations/Custom Theme`,parameters:{layout:`fullscreen`,docs:{description:{component:"Components read **semantic roles**, never raw colours, and `@theme inline` compiles each utility straight to `var(--primary)` with no intermediate variable. So re-pointing a role on any ancestor restyles everything beneath it — which is the whole theming mechanism. Pass `tokens` to `ThemeProvider` to do that at runtime, or override the same properties in CSS to do it at build time."}}}},w={parameters:{docs:{source:{code:[`import { ThemeProvider, type ThemeOverrides } from '@kubermatic/ui-kit';`,``,`const tenant: ThemeOverrides = {`,`  light: { primary: '#6d28d9', heading: '#5b21b6', radius: '1rem' },`,`  dark: { primary: '#a78bfa', 'primary-foreground': '#17132a' },`,`};`,``,`<ThemeProvider tokens={tenant}>`,`  <App />`,`</ThemeProvider>`].join(`
`)}}},render:()=>(0,x.jsxs)(`div`,{className:`grid items-start gap-6 p-2 lg:grid-cols-2`,children:[(0,x.jsx)(v,{children:(0,x.jsx)(y,{label:`default — Kubermatic brand tokens`})}),(0,x.jsx)(v,{tokens:S,children:(0,x.jsx)(y,{label:`tokens={VIOLET_TENANT} — supplied at runtime`})})]})},T={globals:{theme:`dark`},tags:[`!autodocs`],render:w.render},E={parameters:{docs:{source:{code:[`// Unspecified roles keep their brand values — this is a patch, not a replacement.`,`<ThemeProvider tokens={{ light: { primary: '#b45309', radius: '0rem' } }}>`,`  <App />`,`</ThemeProvider>`].join(`
`)}}},render:()=>(0,x.jsxs)(`div`,{className:`grid items-start gap-6 p-2 lg:grid-cols-2`,children:[(0,x.jsx)(v,{children:(0,x.jsx)(y,{label:`default`})}),(0,x.jsx)(v,{tokens:{light:{primary:`#b45309`,ring:`#b45309`,radius:`0rem`},dark:{primary:`#fdba74`,"primary-foreground":`#001128`,radius:`0rem`}},children:(0,x.jsx)(y,{label:`only primary + radius overridden`})})]})},D=[`SideBySide`,`SideBySideDark`,`PartialOverride`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      source: {
        code: ["import { ThemeProvider, type ThemeOverrides } from '@kubermatic/ui-kit';", '', 'const tenant: ThemeOverrides = {', "  light: { primary: '#6d28d9', heading: '#5b21b6', radius: '1rem' },", "  dark: { primary: '#a78bfa', 'primary-foreground': '#17132a' },", '};', '', '<ThemeProvider tokens={tenant}>', '  <App />', '</ThemeProvider>'].join('\\n')
      }
    }
  },
  render: () => <div className="grid items-start gap-6 p-2 lg:grid-cols-2">
      <ThemeScope>
        <DemoPage label="default — Kubermatic brand tokens" />
      </ThemeScope>
      <ThemeScope tokens={VIOLET_TENANT}>
        <DemoPage label="tokens={VIOLET_TENANT} — supplied at runtime" />
      </ThemeScope>
    </div>
}`,...w.parameters?.docs?.source},description:{story:`Same markup, two palettes, side by side. Toggle the toolbar theme too.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: SideBySide.render
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      source: {
        code: ['// Unspecified roles keep their brand values — this is a patch, not a replacement.', "<ThemeProvider tokens={{ light: { primary: '#b45309', radius: '0rem' } }}>", '  <App />', '</ThemeProvider>'].join('\\n')
      }
    }
  },
  render: () => <div className="grid items-start gap-6 p-2 lg:grid-cols-2">
      <ThemeScope>
        <DemoPage label="default" />
      </ThemeScope>
      <ThemeScope tokens={{
      // 5.02:1 under white text; \`accent\` is untouched, so Teal remains.
      light: {
        primary: '#b45309',
        ring: '#b45309',
        radius: '0rem'
      },
      dark: {
        primary: '#fdba74',
        'primary-foreground': '#001128',
        radius: '0rem'
      }
    }}>
        <DemoPage label="only primary + radius overridden" />
      </ThemeScope>
    </div>
}`,...E.parameters?.docs?.source},description:{story:"A partial override. Only `primary` and `radius` are supplied; every other\nrole falls through to the brand palette, so the Teal accent badge survives.",...E.parameters?.docs?.description}}}})))()}O();export{E as PartialOverride,w as SideBySide,T as SideBySideDark,D as __namedExportsOrder,C as default};