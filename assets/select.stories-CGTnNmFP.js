import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{a as r,c as i,i as a,l as o,n as s,o as c,r as l,s as u,t as d,u as f}from"./select-J5GgisDY.js";var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{p=t(),f(),m=n(),h={title:`Forms/Select`,component:s,parameters:{docs:{description:{component:"Exposed as parts rather than a single configured component, because the two products need genuinely different item rendering — one puts a role description in each row, the other puts a connection-status dot after the cluster name. A single `options` prop would have grown a `renderOption` escape hatch within a week.\n\nFor the common toolbar case — a flat list filtering a table — use `FilterSelect`, which *is* that configured component and says so."}}}},g={render:()=>(0,m.jsx)(`div`,{className:`w-64`,children:(0,m.jsxs)(s,{defaultValue:`billing`,children:[(0,m.jsx)(i,{"aria-label":`Namespace`,children:(0,m.jsx)(o,{placeholder:`All namespaces`})}),(0,m.jsxs)(l,{children:[(0,m.jsx)(c,{value:`billing`,children:`billing`}),(0,m.jsx)(c,{value:`ingress`,children:`ingress`}),(0,m.jsx)(c,{value:`kube-system`,children:`kube-system`})]})]})})},_={render:()=>(0,m.jsx)(`div`,{className:`w-64`,children:(0,m.jsxs)(s,{children:[(0,m.jsx)(i,{"aria-label":`Namespace`,children:(0,m.jsx)(o,{placeholder:`Pick a namespace`})}),(0,m.jsxs)(l,{children:[(0,m.jsxs)(a,{children:[(0,m.jsx)(r,{children:`Workloads`}),(0,m.jsx)(c,{value:`billing`,children:`billing`}),(0,m.jsx)(c,{value:`checkout`,children:`checkout`})]}),(0,m.jsx)(u,{}),(0,m.jsxs)(a,{children:[(0,m.jsx)(r,{children:`System`}),(0,m.jsx)(c,{value:`kube-system`,children:`kube-system`})]})]})]})})},v={render:function(){let[e,t]=(0,p.useState)(`All`);return(0,m.jsx)(d,{label:`Status`,value:e,onValueChange:t,options:[`All`,`Synced`,`Degraded`,`Error`]})}},y={globals:{theme:`dark`},tags:[`!autodocs`],render:v.render},b=[`Playground`,`Grouped`,`Filter`,`FilterDark`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select defaultValue="billing">
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="All namespaces" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="billing">billing</SelectItem>
          <SelectItem value="ingress">ingress</SelectItem>
          <SelectItem value="kube-system">kube-system</SelectItem>
        </SelectContent>
      </Select>
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="Pick a namespace" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Workloads</SelectGroupLabel>
            <SelectItem value="billing">billing</SelectItem>
            <SelectItem value="checkout">checkout</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectGroupLabel>System</SelectGroupLabel>
            <SelectItem value="kube-system">kube-system</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: function FilterStory() {
    const [status, setStatus] = useState('All');
    return <FilterSelect label="Status" value={status} onValueChange={setStatus} options={['All', 'Synced', 'Degraded', 'Error']} />;
  }
}`,...v.parameters?.docs?.source},description:{story:`The inline label is *associated* with the control, not merely adjacent —
otherwise a toolbar of four filters announces "All, All, Synced, All" with
no way to tell which is which.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Filter.render
}`,...y.parameters?.docs?.source}}}})))()}x();export{v as Filter,y as FilterDark,_ as Grouped,g as Playground,b as __namedExportsOrder,h as default};