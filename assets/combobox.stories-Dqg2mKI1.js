import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./server-CL8pjvpO.js";import{r as a,t as o}from"./combobox-DRvbdjRc.js";import{n as s,r as c}from"./status-badge-CTg2LHIU.js";var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{r(),l=t(),a(),c(),u=n(),d=[`prod-eu-1`,`prod-us-1`,`staging`,`dev-sandbox`],f={"prod-eu-1":`success`,"prod-us-1":`success`,staging:`error`,"dev-sandbox":`neutral`},p={title:`Forms/Combobox`,component:o,parameters:{docs:{description:{component:'A searchable single-select. Configured rather than exposed as parts, unlike `Select`: the compound form is twenty-odd parts and every use across both products is the same shape — type to filter a flat list of names, pick one.\n\nFiltering is Base UI\'s, which matches with `Intl.Collator` — so "uber" finds "über" and the comparison is not a `toLowerCase().includes()` that gets accents and Turkish dotless i wrong.'}}},args:{options:d,value:null,onValueChange:()=>{}}},m={render:function(){let[e,t]=(0,l.useState)(`staging`);return(0,u.jsx)(`div`,{className:`w-72`,children:(0,u.jsx)(o,{options:d,value:e,onValueChange:t,clearable:!0,"aria-label":`Cluster`})})}},h={render:function(){let[e,t]=(0,l.useState)(null);return(0,u.jsx)(`div`,{className:`w-72`,children:(0,u.jsx)(o,{options:d,value:e,onValueChange:t,placeholder:`All clusters`,"aria-label":`Cluster`,startAdornment:(0,u.jsx)(i,{}),renderItem:e=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`span`,{className:`truncate`,children:e.label}),(0,u.jsx)(s,{tone:f[e.value]??`neutral`,label:f[e.value]===`success`?`Connected`:`Disconnected`,className:`ml-auto`})]})})})}},g={globals:{theme:`dark`},tags:[`!autodocs`],render:h.render},_=[`Playground`,`WithStatus`,`WithStatusDark`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: function PlaygroundStory() {
    const [value, setValue] = useState<string | null>('staging');
    return <div className="w-72">
        <Combobox options={CLUSTERS} value={value} onValueChange={setValue} clearable aria-label="Cluster" />
      </div>;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: function WithStatusStory() {
    const [value, setValue] = useState<string | null>(null);
    return <div className="w-72">
        <Combobox options={CLUSTERS} value={value} onValueChange={setValue} placeholder="All clusters" aria-label="Cluster" startAdornment={<Server />} renderItem={item => <>
              <span className="truncate">{item.label}</span>
              <StatusDot tone={STATUS[item.value] ?? 'neutral'} label={STATUS[item.value] === 'success' ? 'Connected' : 'Disconnected'} className="ml-auto" />
            </>} />
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:"`renderItem` decorates the list without changing what the input displays —\nwhich is exactly what a cluster picker needs.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: WithStatus.render
}`,...g.parameters?.docs?.source}}}})))()}v();export{m as Playground,h as WithStatus,g as WithStatusDark,_ as __namedExportsOrder,p as default};