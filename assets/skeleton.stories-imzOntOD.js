import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,r,t as i}from"./skeleton-DSCkNfRR.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{r(),a=t(),o={title:`Primitives/Skeleton`,component:i,parameters:{docs:{description:{component:"A loading placeholder, painted with the `muted` role so it works in both palettes. It announces nothing on its own: a page full of skeletons would report a dozen busy regions, so put one `aria-busy` on the area that is loading instead — which is what the templates in this kit do."}}}},s={render:()=>(0,a.jsx)(i,{className:`h-6 w-48`})},c={render:()=>(0,a.jsx)(n,{lines:4,className:`w-96`})},l={render:()=>(0,a.jsxs)(`div`,{className:`w-96 rounded-lg border border-border p-6`,children:[(0,a.jsx)(i,{className:`mb-4 h-5 w-1/3`}),(0,a.jsx)(n,{lines:3})]})},u={globals:{theme:`dark`},tags:[`!autodocs`],render:l.render},d=[`Default`,`Text`,`CardPlaceholder`,`CardPlaceholderDark`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Skeleton className="h-6 w-48" />
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <SkeletonText lines={4} className="w-96" />
}`,...c.parameters?.docs?.source},description:{story:`The short last line is what makes it read as a paragraph.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-96 rounded-lg border border-border p-6">
      <Skeleton className="mb-4 h-5 w-1/3" />
      <SkeletonText lines={3} />
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: CardPlaceholder.render
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as CardPlaceholder,u as CardPlaceholderDark,s as Default,c as Text,d as __namedExportsOrder,o as default};