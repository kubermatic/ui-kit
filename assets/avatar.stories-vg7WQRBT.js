import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./avatar-BaCXRDoI.js";import{n as i}from"./variant-matrix-ZkcJTxA_.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),a=t(),o=i({sm:!0,default:!0,lg:!0}),s={title:`Primitives/Avatar`,component:r,parameters:{layout:`centered`,docs:{description:{component:'A person, with an initials fallback shown while the image loads and if it errors. The whole thing is `aria-hidden`, because an avatar beside a name is decoration — announcing "AL, Ada Lovelace" reads the same person twice. Label it at the call site if it appears without the name.'}}},args:{name:`Ada Lovelace`}},c={},l={parameters:{controls:{disable:!0}},render:()=>(0,a.jsx)(`div`,{className:`flex items-center gap-3`,children:o.map(e=>(0,a.jsx)(r,{size:e,name:`Ada Lovelace`},e))})},u={args:{name:`ada@example.com`}},d=[`Playground`,`Sizes`,`FromAnEmailAddress`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex items-center gap-3">
      {SIZES.map(size => <Avatar key={size} size={size} name="Ada Lovelace" />)}
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'ada@example.com'
  }
}`,...u.parameters?.docs?.source},description:{story:`An email address has no spaces, so it yields one initial — which is the
right answer, since the alternative is inventing a surname from the domain.`,...u.parameters?.docs?.description}}}})))()}f();export{u as FromAnEmailAddress,c as Playground,l as Sizes,d as __namedExportsOrder,s as default};