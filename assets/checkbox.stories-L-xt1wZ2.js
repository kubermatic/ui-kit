import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./checkbox-DdJQFHHX.js";var i,a,o,s,c;function l(){return(l=e((()=>{n(),i=t(),a={title:`Forms/Checkbox`,component:r,parameters:{layout:`centered`,docs:{description:{component:"Base UI's checkbox, which handles the indeterminate state a table's select-all header needs — `indeterminate` is a real prop there, not a DOM property you have to set in an effect."}}},args:{"aria-label":`Select row`}},o={parameters:{controls:{disable:!0}},render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-3 font-sans text-sm`,children:[(0,i.jsxs)(`label`,{className:`flex min-h-6 items-center gap-2`,children:[(0,i.jsx)(r,{}),`Unchecked`]}),(0,i.jsxs)(`label`,{className:`flex min-h-6 items-center gap-2`,children:[(0,i.jsx)(r,{defaultChecked:!0}),`Checked`]}),(0,i.jsxs)(`label`,{className:`flex min-h-6 items-center gap-2`,children:[(0,i.jsx)(r,{indeterminate:!0,checked:!1}),`Some selected`]}),(0,i.jsxs)(`label`,{className:`flex min-h-6 items-center gap-2 opacity-60`,children:[(0,i.jsx)(r,{disabled:!0}),`Disabled`]})]})},s={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:o.render},c=[`States`,`StatesDark`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-3 font-sans text-sm">
      <label className="flex min-h-6 items-center gap-2">
        <Checkbox />
        Unchecked
      </label>
      <label className="flex min-h-6 items-center gap-2">
        <Checkbox defaultChecked />
        Checked
      </label>
      <label className="flex min-h-6 items-center gap-2">
        <Checkbox indeterminate checked={false} />
        Some selected
      </label>
      <label className="flex min-h-6 items-center gap-2 opacity-60">
        <Checkbox disabled />
        Disabled
      </label>
    </div>
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  },
  render: States.render
}`,...s.parameters?.docs?.source}}}})))()}l();export{o as States,s as StatesDark,c as __namedExportsOrder,a as default};