import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{n as i,t as a}from"./key-round-DljD0rwp.js";import{n as o,t as s}from"./plus-0juRcA5B.js";import{r as c,t as l}from"./status-badge-CTg2LHIU.js";import{n as u,t as d}from"./empty-state-5pogfj9o.js";import{A as f,k as p}from"./iframe-BH6v6twT.js";var m,h,g,_,v,y,b;function x(){return(x=e((()=>{i(),o(),n(),u(),f(),c(),m=t(),h={title:`Templates/ListPage`,component:p,parameters:{layout:`fullscreen`,docs:{description:{component:'A titled page whose body is a resource table — the single most repeated shape across both products. One has eleven of them (organisations, projects, members, secrets, config maps, service accounts, roles, services, service objects, blueprints, namespaces) and the other has nine. Each is a heading, a description, a "New …" button and a table, and each one currently spells that out again — so the gap above the table and the position of the action button differ page to page.\n\nEvery `DataTable` prop passes straight through, so the loading, empty and error states are the table\'s and there is nothing new to learn. When a page needs more than a table under the heading, compose `Page` + `PageHeader` + `DataTable` directly: this is the common case, not a base class.'}}},args:{title:`External Secrets`,data:[{name:`db-credentials`,namespace:`billing`,store:`vault-backend`,status:`success`,statusLabel:`Synced`},{name:`api-token`,namespace:`billing`,store:`aws-secretsmanager`,status:`error`,statusLabel:`Error`},{name:`tls-cert`,namespace:`ingress`,store:`vault-backend`,status:`warning`,statusLabel:`Degraded`}],columns:[{accessorKey:`name`,header:`Name`},{accessorKey:`namespace`,header:`Namespace`},{accessorKey:`store`,header:`Secret store`},{accessorKey:`statusLabel`,header:`Status`,cell:({row:e})=>(0,m.jsx)(l,{tone:e.original.status,dot:!0,children:e.original.statusLabel})}],caption:`External secrets`}},g={args:{description:`Reconciled from a provider into a Kubernetes Secret.`,actions:(0,m.jsxs)(r,{children:[(0,m.jsx)(s,{}),`New external secret`]})},render:e=>(0,m.jsx)(`div`,{className:`p-6`,children:(0,m.jsx)(p,{...e})})},_={args:{loading:!0},render:e=>(0,m.jsx)(`div`,{className:`p-6`,children:(0,m.jsx)(p,{...e})})},v={args:{data:[],empty:(0,m.jsx)(d,{icon:(0,m.jsx)(a,{}),title:`No external secrets yet`,description:`An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret.`,action:(0,m.jsxs)(r,{children:[(0,m.jsx)(s,{}),`New external secret`]})})},render:e=>(0,m.jsx)(`div`,{className:`p-6`,children:(0,m.jsx)(p,{...e})})},y={args:{error:Error(`The API returned 503.`),onRetry:()=>{}},render:e=>(0,m.jsx)(`div`,{className:`p-6`,children:(0,m.jsx)(p,{...e})})},b=[`Playground`,`Loading`,`Empty`,`Failed`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    description: 'Reconciled from a provider into a Kubernetes Secret.',
    actions: <Button>
        <Plus />
        New external secret
      </Button>
  },
  render: args => <div className="p-6">
      <ListPage {...args} />
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  },
  render: args => <div className="p-6">
      <ListPage {...args} />
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    empty: <EmptyState icon={<KeyRound />} title="No external secrets yet" description="An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret." action={<Button>
            <Plus />
            New external secret
          </Button>} />
  },
  render: args => <div className="p-6">
      <ListPage {...args} />
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('The API returned 503.'),
    onRetry: () => {}
  },
  render: args => <div className="p-6">
      <ListPage {...args} />
    </div>
}`,...y.parameters?.docs?.source}}}})))()}x();export{v as Empty,y as Failed,_ as Loading,g as Playground,b as __namedExportsOrder,h as default};