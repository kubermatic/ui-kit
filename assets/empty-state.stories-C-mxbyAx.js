import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{n as i,t as a}from"./key-round-DljD0rwp.js";import{n as o,t as s}from"./plus-0juRcA5B.js";import{n as c,t as l}from"./empty-state-5pogfj9o.js";var u,d,f,p,m,h;function g(){return(g=e((()=>{i(),o(),n(),c(),u=t(),d={title:`Feedback/EmptyState`,component:l,parameters:{docs:{description:{component:'Nothing here yet, and what to do about it. The title is a `<p>`, not a heading: an empty list sits inside a page that already has an `<h1>`, and "No secrets yet" is not a section of the document — emitting an `<h2>` here puts a phantom entry in the outline a screen-reader user navigates by.'}}},args:{icon:(0,u.jsx)(a,{}),title:`No external secrets yet`,description:`An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret.`}},f={args:{action:(0,u.jsxs)(r,{children:[(0,u.jsx)(s,{}),`New external secret`]})},render:e=>(0,u.jsx)(`div`,{className:`w-[36rem]`,children:(0,u.jsx)(l,{...e})})},p={args:{variant:`placeholder`,action:(0,u.jsxs)(r,{children:[(0,u.jsx)(s,{}),`New external secret`]})},render:e=>(0,u.jsx)(`div`,{className:`w-[36rem]`,children:(0,u.jsx)(l,{...e})})},m={globals:{theme:`dark`},tags:[`!autodocs`],args:p.args,render:p.render},h=[`Playground`,`Placeholder`,`PlaceholderDark`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    action: <Button>
        <Plus />
        New external secret
      </Button>
  },
  render: args => <div className="w-[36rem]">
      <EmptyState {...args} />
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'placeholder',
    action: <Button>
        <Plus />
        New external secret
      </Button>
  },
  render: args => <div className="w-[36rem]">
      <EmptyState {...args} />
    </div>
}`,...p.parameters?.docs?.source},description:{story:`The dashed frame, for a whole empty page rather than an empty table body.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  args: Placeholder.args,
  render: Placeholder.render
}`,...m.parameters?.docs?.source}}}})))()}g();export{p as Placeholder,m as PlaceholderDark,f as Playground,h as __namedExportsOrder,d as default};