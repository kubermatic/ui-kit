import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./check-BaG4Ubyj.js";import{n as i,t as a}from"./triangle-alert-9J3f0Ci3.js";import{Jt as o,qt as s}from"./iframe-BH6v6twT.js";import{n as c}from"./variant-matrix-ZkcJTxA_.js";var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{i(),n(),o(),l=t(),u=c({accent:!0,rose:!0,honey:!0,primary:!0,destructive:!0,secondary:!0,outline:!0}),d={title:`Primitives/Badge`,component:s,parameters:{layout:`centered`,docs:{description:{component:`Where the brand highlight colours live. Teal, Rosé and Honey each measure under 3:1 against white, so they cannot be text or a functional border on a light background — but as a filled surface carrying Dark Azure they reach 10.67:1, 7.35:1 and 10.11:1.`}}},args:{children:`Healthy`,variant:`accent`},argTypes:{variant:{control:`select`,options:u},as:{table:{disable:!0}}}},f={},p={parameters:{controls:{disable:!0},docs:{source:{code:[`import { Badge } from '@kubermatic/ui-kit';`,``,...u.map(e=>`<Badge variant="${e}">${e}</Badge>`)].join(`
`)}}},render:()=>(0,l.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:u.map(e=>(0,l.jsx)(s,{variant:e,children:e},e))})},m={parameters:{controls:{disable:!0},docs:{source:{code:[`import { Badge } from '@kubermatic/ui-kit';`,`import { AlertTriangle, Check } from 'lucide-react';`,``,`<Badge variant="accent">`,`  <Check />`,`  Running`,`</Badge>`,`<Badge variant="honey">`,`  <AlertTriangle />`,`  Degraded`,`</Badge>`].join(`
`)}}},render:()=>(0,l.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,l.jsxs)(s,{variant:`accent`,children:[(0,l.jsx)(r,{}),`Running`]}),(0,l.jsxs)(s,{variant:`honey`,children:[(0,l.jsx)(a,{}),`Degraded`]}),(0,l.jsxs)(s,{variant:`destructive`,children:[(0,l.jsx)(a,{}),`Failed`]})]})},h={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:p.render},g=[`Playground`,`Variants`,`WithIcon`,`VariantsDark`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: ["import { Badge } from '@kubermatic/ui-kit';", '', ...VARIANTS.map(variant => \`<Badge variant="\${variant}">\${variant}</Badge>\`)].join('\\n')
      }
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map(variant => <Badge key={variant} variant={variant}>
          {variant}
        </Badge>)}
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: ["import { Badge } from '@kubermatic/ui-kit';", "import { AlertTriangle, Check } from 'lucide-react';", '', '<Badge variant="accent">', '  <Check />', '  Running', '</Badge>', '<Badge variant="honey">', '  <AlertTriangle />', '  Degraded', '</Badge>'].join('\\n')
      }
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-2">
      <Badge variant="accent">
        <Check />
        Running
      </Badge>
      <Badge variant="honey">
        <AlertTriangle />
        Degraded
      </Badge>
      <Badge variant="destructive">
        <AlertTriangle />
        Failed
      </Badge>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Badges read as status, so they usually carry an icon.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  },
  render: Variants.render
}`,...h.parameters?.docs?.source}}}})))()}_();export{f as Playground,p as Variants,h as VariantsDark,m as WithIcon,g as __namedExportsOrder,d as default};