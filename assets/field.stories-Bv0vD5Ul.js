import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{s as n,t as r}from"./field-Cai4h5yn.js";import{n as i,t as a}from"./input-DbSNTTLZ.js";import{Ft as o,It as s,Lt as c,Pt as l}from"./iframe-BH6v6twT.js";var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),o(),c(),u=t(),d={title:`Forms/Field`,component:r,parameters:{docs:{description:{component:"The label / description / error scaffold every form row needs. Base UI's `Field` generates the control's id, points the label at it, and collects the description and error into `aria-describedby` — the part that is easy to get subtly wrong.\n\n`error` is a plain node rather than a validation result, because react-hook-form is a singleton peer dependency: a library that imported it would risk a second copy and a form that cannot see its own provider. So the integration is one line at the call site — `error={errors.name?.message}`."}}},args:{label:`Name`}},f={args:{description:`Lowercase letters, numbers and dashes.`},render:e=>(0,u.jsx)(`div`,{className:`w-80`,children:(0,u.jsx)(r,{...e,children:(0,u.jsx)(a,{placeholder:`db-credentials`})})})},p={args:{label:`Name`,required:!0,error:`A name is required.`},render:e=>(0,u.jsx)(`div`,{className:`w-80`,children:(0,u.jsx)(r,{...e,children:(0,u.jsx)(a,{required:!0,"aria-invalid":!0})})})},m={args:{label:`Description`,description:`Shown in the service catalogue.`},render:e=>(0,u.jsx)(`div`,{className:`w-80`,children:(0,u.jsx)(r,{...e,children:(0,u.jsx)(s,{rows:4})})})},h={args:{label:`Reconcile automatically`,orientation:`horizontal`},render:e=>(0,u.jsx)(`div`,{className:`w-96`,children:(0,u.jsx)(r,{...e,children:(0,u.jsx)(l,{})})})},g={globals:{theme:`dark`},tags:[`!autodocs`],args:p.args,render:p.render},_=[`Playground`,`WithError`,`WithTextarea`,`Horizontal`,`WithErrorDark`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    description: 'Lowercase letters, numbers and dashes.'
  },
  render: args => <div className="w-80">
      <Field {...args}>
        <Input placeholder="db-credentials" />
      </Field>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Name',
    required: true,
    error: 'A name is required.'
  },
  render: args => <div className="w-80">
      <Field {...args}>
        <Input required aria-invalid />
      </Field>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Description',
    description: 'Shown in the service catalogue.'
  },
  render: args => <div className="w-80">
      <Field {...args}>
        <Textarea rows={4} />
      </Field>
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Reconcile automatically',
    orientation: 'horizontal'
  },
  render: args => <div className="w-96">
      <Field {...args}>
        <Switch />
      </Field>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Horizontal, for a settings row where the control is small.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  args: WithError.args,
  render: WithError.render
}`,...g.parameters?.docs?.source}}}})))()}v();export{h as Horizontal,f as Playground,p as WithError,g as WithErrorDark,m as WithTextarea,_ as __namedExportsOrder,d as default};