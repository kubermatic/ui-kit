import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{s as r,t as i}from"./field-Cai4h5yn.js";import{Tt as a,wt as o}from"./iframe-BH6v6twT.js";var s,c,l,u,d,f;function p(){return(p=e((()=>{s=t(),r(),a(),c=n(),l={title:`Forms/TagInput`,component:o,parameters:{docs:{description:{component:`Free-text tokens, as chips. Backspace on an empty input removes the last chip, which is the behaviour everyone tries first, and blur commits the pending text — losing what you typed because you clicked "Save" instead of pressing Enter is the single most common complaint about this control. Comma commits too, because pasting a comma-separated list is how people enter several at once.`}}},args:{value:[],onValueChange:()=>{}}},u={render:function(){let[e,t]=(0,s.useState)([`production`,`eu-west`]);return(0,c.jsx)(`div`,{className:`w-96`,children:(0,c.jsx)(i,{label:`Tags`,description:`Enter or comma to add.`,children:(0,c.jsx)(o,{value:e,onValueChange:t})})})}},d={globals:{theme:`dark`},tags:[`!autodocs`],render:u.render},f=[`Playground`,`PlaygroundDark`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: function PlaygroundStory() {
    const [tags, setTags] = useState(['production', 'eu-west']);
    return <div className="w-96">
        <Field label="Tags" description="Enter or comma to add.">
          <TagInput value={tags} onValueChange={setTags} />
        </Field>
      </div>;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Playground.render
}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Playground,d as PlaygroundDark,f as __namedExportsOrder,l as default};