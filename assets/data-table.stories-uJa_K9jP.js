import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{r,t as i}from"./button-DkUjhKwZ.js";import{n as a,t as o}from"./data-table-0YMUpWio.js";import{t as s,u as c}from"./select-J5GgisDY.js";import{h as l,m as u,o as d,r as f,t as p}from"./menu-C5Lh23eq.js";import{n as m,t as h}from"./ellipsis-BnrCXni2.js";import{n as g,t as _}from"./key-round-DljD0rwp.js";import{n as v,t as y}from"./plus-0juRcA5B.js";import{r as b,t as x}from"./status-badge-CTg2LHIU.js";import{n as S,t as C}from"./empty-state-5pogfj9o.js";import{G as w,W as T}from"./iframe-BH6v6twT.js";var E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{g(),m(),v(),E=t(),r(),a(),T(),S(),l(),c(),b(),D=n(),O=[{name:`db-credentials`,namespace:`billing`,store:`vault-backend`,status:`success`,statusLabel:`Synced`},{name:`api-token`,namespace:`billing`,store:`aws-secretsmanager`,status:`error`,statusLabel:`Error`},{name:`tls-cert`,namespace:`ingress`,store:`vault-backend`,status:`warning`,statusLabel:`Degraded`},{name:`smtp-password`,namespace:`notifications`,store:`gcp-secretmanager`,status:`success`,statusLabel:`Synced`},{name:`oidc-client-secret`,namespace:`auth`,store:`vault-backend`,status:`pending`,statusLabel:`Pending`},{name:`redis-password`,namespace:`cache`,store:`vault-backend`,status:`success`,statusLabel:`Synced`}],k=[{accessorKey:`name`,header:`Name`},{accessorKey:`namespace`,header:`Namespace`},{accessorKey:`store`,header:`Secret store`},{accessorKey:`statusLabel`,header:`Status`,cell:({row:e})=>(0,D.jsx)(x,{tone:e.original.status,dot:!0,children:e.original.statusLabel})},{id:`actions`,header:`Actions`,enableSorting:!1,enableHiding:!1,cell:({row:e})=>(0,D.jsxs)(p,{children:[(0,D.jsx)(u,{render:(0,D.jsx)(i,{variant:`ghost`,size:`icon`,"aria-label":`Actions for ${e.original.name}`,children:(0,D.jsx)(h,{})})}),(0,D.jsxs)(f,{children:[(0,D.jsx)(d,{children:`Edit`}),(0,D.jsx)(d,{children:`Force sync`}),(0,D.jsx)(d,{variant:`destructive`,children:`Delete`})]})]})}],A={title:`Data/DataTable`,component:o,parameters:{layout:`fullscreen`,docs:{description:{component:'The resource list, once. One product has one of these and the other has five near-copies, one per resource kind; this is their union. What it fixes on the way:\n\n- **`aria-sort` on the `<th>`** — neither app sets it, so a screen reader is never told a column is sorted, let alone which way.\n- **The column-visibility menu is a menu** — one product\'s is a `<div>` of `<label>`s toggled by `useState`, with no escape handling, no focus management and no click-outside.\n- **`aria-rowcount` is the total**, with an absolute `aria-rowindex` per row, so "row 340 of 4000" is announced correctly even when only fifteen `<tr>`s exist.\n- **Selection survives a refetch**, given `getRowId`.\n\n`onRowClick` deliberately does *not* make the row focusable: a clickable `<tr>` is unreachable by keyboard, and making the row itself a tab stop breaks the grid semantics. Put a real link in the first cell and treat the row click as the shortcut it is.'}}},args:{data:O,columns:k,caption:`External secrets`}},j={render:e=>(0,D.jsx)(`div`,{className:`p-6`,children:(0,D.jsx)(o,{...e})})},M={render:function(e){let[t,n]=(0,E.useState)(`All`),r=t===`All`?O:O.filter(e=>e.store===t);return(0,D.jsx)(`div`,{className:`p-6`,children:(0,D.jsx)(o,{...e,data:r,columns:[w({ariaLabel:e=>`Select ${e.name}`}),...k],enableRowSelection:!0,enableColumnVisibility:!0,getRowId:e=>e.name,pageSize:5,toolbar:(0,D.jsx)(s,{label:`Store`,value:t,onValueChange:n,options:[`All`,`vault-backend`,`aws-secretsmanager`,`gcp-secretmanager`],triggerClassName:`w-52`})})})}},N={args:{loading:!0},render:e=>(0,D.jsx)(`div`,{className:`p-6`,children:(0,D.jsx)(o,{...e})})},P={args:{data:[],empty:(0,D.jsx)(C,{icon:(0,D.jsx)(_,{}),title:`No external secrets yet`,description:`An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret.`,action:(0,D.jsxs)(i,{children:[(0,D.jsx)(y,{}),`New external secret`]})})},render:e=>(0,D.jsx)(`div`,{className:`p-6`,children:(0,D.jsx)(o,{...e})})},F={args:{error:Error(`dial tcp 10.0.4.2:8200: connect: connection refused`)},render:e=>(0,D.jsx)(`div`,{className:`p-6`,children:(0,D.jsx)(o,{...e,onRetry:()=>{}})})},I={globals:{theme:`dark`},tags:[`!autodocs`],render:M.render},L=[`Playground`,`FullyLoaded`,`Loading`,`Empty`,`Failed`,`FullyLoadedDark`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div className="p-6">
      <DataTable {...args} />
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: function FullyLoadedStory(args) {
    const [store, setStore] = useState('All');
    const filtered = store === 'All' ? DATA : DATA.filter(secret => secret.store === store);
    return <div className="p-6">
        <DataTable {...args} data={filtered} columns={[selectionColumn<ExternalSecret>({
        ariaLabel: row => \`Select \${(row as ExternalSecret).name}\`
      }), ...COLUMNS]} enableRowSelection enableColumnVisibility getRowId={row => row.name} pageSize={5} toolbar={<FilterSelect label="Store" value={store} onValueChange={setStore} options={['All', 'vault-backend', 'aws-secretsmanager', 'gcp-secretmanager']} triggerClassName="w-52" />} />
      </div>;
  }
}`,...M.parameters?.docs?.source},description:{story:`Everything on at once: filters, column visibility, selection, paging.`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  },
  render: args => <div className="p-6">
      <DataTable {...args} />
    </div>
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    empty: <EmptyState icon={<KeyRound />} title="No external secrets yet" description="An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret." action={<Button>
            <Plus />
            New external secret
          </Button>} />
  },
  render: args => <div className="p-6">
      <DataTable {...args} />
    </div>
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('dial tcp 10.0.4.2:8200: connect: connection refused')
  },
  render: args => <div className="p-6">
      <DataTable {...args} onRetry={() => {}} />
    </div>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: FullyLoaded.render
}`,...I.parameters?.docs?.source}}}})))()}R();export{P as Empty,F as Failed,M as FullyLoaded,I as FullyLoadedDark,N as Loading,j as Playground,L as __namedExportsOrder,A as default};