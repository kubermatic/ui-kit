import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{s as n,t as r}from"./field-Cai4h5yn.js";import{Mt as i,Nt as a,jt as o}from"./iframe-BH6v6twT.js";var s,c,l,u,d;function f(){return(f=e((()=>{n(),a(),s=t(),c={title:`Forms/RadioGroup`,component:o,parameters:{docs:{description:{component:`The label wraps the control, so the hit target is the whole row — a 16px dot on its own fails WCAG 2.2's 24px target-size minimum, which the axe run checks with real layout geometry.`}}}},l={render:()=>(0,s.jsx)(`div`,{className:`w-96`,children:(0,s.jsx)(r,{label:`Scope`,children:(0,s.jsxs)(o,{defaultValue:`namespace`,"aria-label":`Scope`,children:[(0,s.jsx)(i,{value:`cluster`,children:`The whole cluster`}),(0,s.jsx)(i,{value:`namespace`,children:`One namespace`}),(0,s.jsx)(i,{value:`selector`,children:`Anything matching a selector`})]})})})},u={render:()=>(0,s.jsxs)(o,{defaultValue:`yaml`,orientation:`horizontal`,"aria-label":`Format`,children:[(0,s.jsx)(i,{value:`yaml`,children:`YAML`}),(0,s.jsx)(i,{value:`json`,children:`JSON`})]})},d=[`Playground`,`Horizontal`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-96">
      <Field label="Scope">
        <RadioGroup defaultValue="namespace" aria-label="Scope">
          <RadioGroupItem value="cluster">The whole cluster</RadioGroupItem>
          <RadioGroupItem value="namespace">One namespace</RadioGroupItem>
          <RadioGroupItem value="selector">Anything matching a selector</RadioGroupItem>
        </RadioGroup>
      </Field>
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="yaml" orientation="horizontal" aria-label="Format">
      <RadioGroupItem value="yaml">YAML</RadioGroupItem>
      <RadioGroupItem value="json">JSON</RadioGroupItem>
    </RadioGroup>
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as Horizontal,l as Playground,d as __namedExportsOrder,c as default};