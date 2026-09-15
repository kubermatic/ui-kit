import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{s as r,t as i}from"./field-Cai4h5yn.js";import{Dt as a,Et as o}from"./iframe-BH6v6twT.js";var s,c,l,u,d,f,p;function m(){return(m=e((()=>{s=t(),r(),a(),c=n(),l={title:`Forms/KeyValueEditor`,component:o,parameters:{docs:{description:{component:`Rows of key/value inputs with add and remove — labels, annotations, config-map data, environment variables. Both products ship one of these and both had the same two bugs: the row key was the array index, so removing a row above the one you were typing in moved your cursor and your value; and the remove button was an icon with no accessible name, so a screen reader announced eleven identical "button"s.

Rows are deliberately **not** deduplicated: a duplicate key is a validation concern the consumer's schema owns, and silently dropping a row the user typed is worse than showing them the conflict.`}}},args:{value:[],onValueChange:()=>{}}},u={render:function(){let[e,t]=(0,s.useState)([{key:`app`,value:`billing`},{key:`tier`,value:`backend`}]);return(0,c.jsx)(`div`,{className:`w-[32rem]`,children:(0,c.jsx)(i,{label:`Labels`,description:`Applied to the generated Secret.`,children:(0,c.jsx)(o,{value:e,onValueChange:t})})})}},d={render:function(){let[e,t]=(0,s.useState)([]);return(0,c.jsx)(`div`,{className:`w-[32rem]`,children:(0,c.jsx)(o,{value:e,onValueChange:t,emptyMessage:`No labels yet.`,addLabel:`Add label`})})}},f={args:{value:[{key:`app`,value:`billing`}],readOnly:!0},render:e=>(0,c.jsx)(`div`,{className:`w-[32rem]`,children:(0,c.jsx)(o,{...e})})},p=[`Playground`,`Empty`,`ReadOnly`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: function PlaygroundStory() {
    const [pairs, setPairs] = useState<KeyValuePair[]>([{
      key: 'app',
      value: 'billing'
    }, {
      key: 'tier',
      value: 'backend'
    }]);
    return <div className="w-[32rem]">
        <Field label="Labels" description="Applied to the generated Secret.">
          <KeyValueEditor value={pairs} onValueChange={setPairs} />
        </Field>
      </div>;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: function EmptyStory() {
    const [pairs, setPairs] = useState<KeyValuePair[]>([]);
    return <div className="w-[32rem]">
        <KeyValueEditor value={pairs} onValueChange={setPairs} emptyMessage="No labels yet." addLabel="Add label" />
      </div>;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: [{
      key: 'app',
      value: 'billing'
    }],
    readOnly: true
  },
  render: args => <div className="w-[32rem]">
      <KeyValueEditor {...args} />
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as Empty,u as Playground,f as ReadOnly,p as __namedExportsOrder,l as default};