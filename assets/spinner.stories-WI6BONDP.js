import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./spinner-B_0NBVlt.js";import{n as i}from"./variant-matrix-ZkcJTxA_.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),a=t(),o=i({sm:!0,default:!0,lg:!0}),s={title:`Primitives/Spinner`,component:r,parameters:{layout:`centered`,docs:{description:{component:'An indeterminate busy indicator. `role="status"` with a polite live region, so the label is announced when it appears without interrupting. Prefer `Skeleton` when the shape of the arriving content is known — it does not move the layout when it resolves.'}}},args:{label:`Loading clusters`}},c={},l={parameters:{controls:{disable:!0}},render:()=>(0,a.jsx)(`div`,{className:`flex items-center gap-6`,children:o.map(e=>(0,a.jsx)(r,{size:e,label:`Loading (${e})`},e))})},u={args:{showLabel:!0,label:`Loading clusters…`}},d={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:l.render},f=[`Playground`,`Sizes`,`WithVisibleLabel`,`SizesDark`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex items-center gap-6">
      {SIZES.map(size => <Spinner key={size} size={size} label={\`Loading (\${size})\`} />)}
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: true,
    label: 'Loading clusters…'
  }
}`,...u.parameters?.docs?.source},description:{story:`The label can be shown as well as announced, for a full-page load.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}}})))()}p();export{c as Playground,l as Sizes,d as SizesDark,u as WithVisibleLabel,f as __namedExportsOrder,s as default};