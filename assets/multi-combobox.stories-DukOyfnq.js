import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{s as r,t as i}from"./field-Cai4h5yn.js";import{n as a,r as o}from"./combobox-DRvbdjRc.js";import{n as s,r as c}from"./status-badge-CTg2LHIU.js";var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{l=t(),o(),r(),c(),u=n(),d=[`backend`,`payments`,`ingress`,`data-pipeline`,`auth`,`monitoring`],f={title:`Forms/MultiCombobox`,component:a,parameters:{docs:{description:{component:"A searchable multi-select. The same Base UI primitive as `Combobox` wearing a different control: `multiple` mode, with the selection shown as chips inside the field.\n\nThe chips are Base UI's `Chip`/`ChipRemove` parts, so arrow keys move between them and Backspace removes the last — the thing a `<span>` with an X icon cannot do."}}},args:{options:d,value:[],onValueChange:()=>{}}},p={render:function(){let[e,t]=(0,l.useState)([`backend`,`payments`]);return(0,u.jsx)(`div`,{className:`w-96`,children:(0,u.jsx)(a,{options:d,value:e,onValueChange:t,placeholder:`Select namespaces…`,"aria-label":`Namespaces`})})}},m={render:function(){let[e,t]=(0,l.useState)([]);return(0,u.jsx)(`div`,{className:`w-96`,children:(0,u.jsx)(a,{options:d,value:e,onValueChange:t,placeholder:`Select namespaces…`,"aria-label":`Namespaces`})})}},h={render:function(){let[e,t]=(0,l.useState)([`backend`]);return(0,u.jsx)(`div`,{className:`w-96`,children:(0,u.jsx)(i,{label:`Target namespaces`,description:`Where the operator will be active.`,required:!0,children:(0,u.jsx)(a,{options:d,value:e,onValueChange:t,placeholder:`Select namespaces…`})})})}},g={render:function(){let[e,t]=(0,l.useState)([`payments`]);return(0,u.jsx)(`div`,{className:`w-96`,children:(0,u.jsx)(a,{options:d,value:e,onValueChange:t,placeholder:`Select namespaces…`,"aria-label":`Namespaces`,renderItem:e=>(0,u.jsxs)(u.Fragment,{children:[e.label,(0,u.jsx)(s,{tone:e.value===`ingress`?`error`:`success`,label:e.value===`ingress`?`unreachable`:`healthy`})]})})})}},_=[`Playground`,`Empty`,`InAField`,`WithStatus`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: function PlaygroundStory() {
    const [value, setValue] = useState<string[]>(['backend', 'payments']);
    return <div className="w-96">
        <MultiCombobox options={NAMESPACES} value={value} onValueChange={setValue} placeholder="Select namespaces…" aria-label="Namespaces" />
      </div>;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: function EmptyStory() {
    const [value, setValue] = useState<string[]>([]);
    return <div className="w-96">
        <MultiCombobox options={NAMESPACES} value={value} onValueChange={setValue} placeholder="Select namespaces…" aria-label="Namespaces" />
      </div>;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: function InAFieldStory() {
    const [value, setValue] = useState<string[]>(['backend']);
    return <div className="w-96">
        <Field label="Target namespaces" description="Where the operator will be active." required>
          <MultiCombobox options={NAMESPACES} value={value} onValueChange={setValue} placeholder="Select namespaces…" />
        </Field>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:"Inside a `Field`, the label is wired to the input and no `aria-label` is needed.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: function WithStatusStory() {
    const [value, setValue] = useState<string[]>(['payments']);
    return <div className="w-96">
        <MultiCombobox options={NAMESPACES} value={value} onValueChange={setValue} placeholder="Select namespaces…" aria-label="Namespaces" renderItem={item => <>
              {item.label}
              <StatusDot tone={item.value === 'ingress' ? 'error' : 'success'} label={item.value === 'ingress' ? 'unreachable' : 'healthy'} />
            </>} />
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:"`renderItem` decorates the list rows; the chips keep using `label`.",...g.parameters?.docs?.description}}}})))()}v();export{m as Empty,h as InAField,p as Playground,g as WithStatus,_ as __namedExportsOrder,f as default};