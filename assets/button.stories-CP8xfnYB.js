import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{n as i,t as a}from"./rocket-CPSs9EDA.js";import{n as o}from"./variant-matrix-ZkcJTxA_.js";var s,c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{i(),n(),s=t(),c=o({default:!0,secondary:!0,destructive:!0,outline:!0,ghost:!0,link:!0}),l=o({sm:!0,default:!0,lg:!0,icon:!0}),u={title:`Primitives/Button`,component:r,parameters:{layout:`centered`,docs:{description:{component:"shadcn styling over Base UI’s button primitive. Use `render` to compose it with a link or a router component."}}},args:{children:`Deploy cluster`,variant:`default`,size:`default`,disabled:!1},argTypes:{variant:{control:`select`,options:c},size:{control:`select`,options:l},render:{table:{disable:!0}}}},d={},f={parameters:{controls:{disable:!0},docs:{source:{code:[`import { Button } from '@kubermatic/ui-kit';`,``,...c.map(e=>`<Button variant="${e}">${e}</Button>`)].join(`
`)}}},render:()=>(0,s.jsx)(`div`,{className:`flex flex-wrap items-center gap-3`,children:c.map(e=>(0,s.jsx)(r,{variant:e,children:e},e))})},p={parameters:{controls:{disable:!0},docs:{source:{code:[`import { Button } from '@kubermatic/ui-kit';`,`import { Rocket } from 'lucide-react';`,``,`<Button size="sm">Small</Button>`,`<Button size="default">Default</Button>`,`<Button size="lg">Large</Button>`,`<Button size="icon" aria-label="Deploy">`,`  <Rocket />`,`</Button>`].join(`
`)}}},render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,s.jsx)(r,{size:`sm`,children:`Small`}),(0,s.jsx)(r,{size:`default`,children:`Default`}),(0,s.jsx)(r,{size:`lg`,children:`Large`}),(0,s.jsx)(r,{size:`icon`,"aria-label":`Deploy`,children:(0,s.jsx)(a,{})})]})},m={args:{children:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a,{}),`Deploy cluster`]})}},h={args:{disabled:!0}},g={parameters:{controls:{disable:!0},docs:{source:{code:[`import { Button } from '@kubermatic/ui-kit';`,``,"// `nativeButton={false}` is required whenever the rendered element",`// is not a <button>, so Base UI applies link semantics instead.`,`<Button nativeButton={false} render={<a href="https://kubermatic.com" />}>`,`  Open docs`,`</Button>`].join(`
`)}}},render:()=>(0,s.jsx)(r,{nativeButton:!1,render:(0,s.jsx)(`a`,{href:`https://kubermatic.com`}),children:`Open docs`})},_={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:f.render},v={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:p.render},y=[`Playground`,`Variants`,`Sizes`,`WithIcon`,`Disabled`,`AsLink`,`VariantsDark`,`SizesDark`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    // Snippet derived from the same list as the render, so the two cannot
    // drift; stories built with \`render\` otherwise show the raw CSF object.
    docs: {
      source: {
        code: ["import { Button } from '@kubermatic/ui-kit';", '', ...VARIANTS.map(variant => \`<Button variant="\${variant}">\${variant}</Button>\`)].join('\\n')
      }
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(variant => <Button key={variant} variant={variant}>
          {variant}
        </Button>)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Every variant, so a change to the palette is visible in one glance.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: ["import { Button } from '@kubermatic/ui-kit';", "import { Rocket } from 'lucide-react';", '', '<Button size="sm">Small</Button>', '<Button size="default">Default</Button>', '<Button size="lg">Large</Button>', '<Button size="icon" aria-label="Deploy">', '  <Rocket />', '</Button>'].join('\\n')
      }
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Deploy">
        <Rocket />
      </Button>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Rocket />
        Deploy cluster
      </>
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: ["import { Button } from '@kubermatic/ui-kit';", '', '// \`nativeButton={false}\` is required whenever the rendered element', '// is not a <button>, so Base UI applies link semantics instead.', '<Button nativeButton={false} render={<a href="https://kubermatic.com" />}>', '  Open docs', '</Button>'].join('\\n')
      }
    }
  },
  render: () => <Button nativeButton={false} render={<a href="https://kubermatic.com" />}>
      Open docs
    </Button>
}`,...g.parameters?.docs?.source},description:{story:"`render` swaps the underlying element while keeping the styling. When the\nreplacement is not a `<button>`, `nativeButton={false}` must go with it so\nBase UI applies link semantics instead of button ones.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  },
  render: Variants.render
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  },
  render: Sizes.render
}`,...v.parameters?.docs?.source}}}})))()}b();export{g as AsLink,h as Disabled,d as Playground,p as Sizes,v as SizesDark,f as Variants,_ as VariantsDark,m as WithIcon,y as __namedExportsOrder,u as default};