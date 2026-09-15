import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./search-BkmbTaLi.js";import{n as i,t as a}from"./input-DbSNTTLZ.js";import{n as o}from"./variant-matrix-ZkcJTxA_.js";var s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),i(),s=t(),c=o({sm:!0,default:!0,lg:!0}),l={title:`Forms/Input`,component:a,parameters:{docs:{description:{component:"Base UI's input, which wires itself to an enclosing `Field`. The adornment props exist because both products hand-roll the same absolutely-positioned magnifier over a padded input on every table toolbar — and when neither is given, the markup is a bare `<input>` with no wrapper to fight with in a flex layout."}}},args:{placeholder:`db-credentials`,"aria-label":`Name`}},u={render:e=>(0,s.jsx)(`div`,{className:`w-80`,children:(0,s.jsx)(a,{...e})})},d={parameters:{controls:{disable:!0}},render:()=>(0,s.jsx)(`div`,{className:`flex w-80 flex-col gap-3`,children:c.map(e=>(0,s.jsx)(a,{size:e,"aria-label":e,placeholder:e},e))})},f={name:`With an adornment`,parameters:{controls:{disable:!0}},render:()=>(0,s.jsx)(`div`,{className:`w-80`,children:(0,s.jsx)(a,{"aria-label":`Search secrets`,placeholder:`Search…`,startAdornment:(0,s.jsx)(r,{})})})},p={args:{"aria-invalid":!0,defaultValue:`Not a valid name`},render:e=>(0,s.jsx)(`div`,{className:`w-80`,children:(0,s.jsx)(a,{...e})})},m={args:{disabled:!0,defaultValue:`kube-system`},render:e=>(0,s.jsx)(`div`,{className:`w-80`,children:(0,s.jsx)(a,{...e})})},h=[`Playground`,`Sizes`,`Search_`,`Invalid`,`Disabled`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="w-80">
      <Input {...args} />
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex w-80 flex-col gap-3">
      {SIZES.map(size => <Input key={size} size={size} aria-label={size} placeholder={size} />)}
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'With an adornment',
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="w-80">
      <Input aria-label="Search secrets" placeholder="Search…" startAdornment={<Search />} />
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-invalid': true,
    defaultValue: 'Not a valid name'
  },
  render: args => <div className="w-80">
      <Input {...args} />
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: 'kube-system'
  },
  render: args => <div className="w-80">
      <Input {...args} />
    </div>
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Disabled,p as Invalid,u as Playground,f as Search_,d as Sizes,h as __namedExportsOrder,l as default};