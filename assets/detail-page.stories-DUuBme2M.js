import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{r,t as i}from"./button-DkUjhKwZ.js";import{o as a,s as o}from"./page-B3RnUbmI.js";import{n as s,t as c}from"./refresh-cw-mDHRkEFK.js";import{n as l,t as u}from"./trash-cZkYgweg.js";import{r as d,t as f}from"./status-badge-CTg2LHIU.js";import{Bt as p,Ct as m,D as h,O as g,St as _,bt as v,vt as y,xt as b,yt as x,zt as S}from"./iframe-BH6v6twT.js";var C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{s(),l(),C=t(),r(),p(),m(),g(),o(),d(),v(),w=n(),T=[{value:`overview`,label:`Overview`,content:(0,w.jsx)(a,{title:`Overview`,children:(0,w.jsxs)(_,{children:[(0,w.jsx)(b,{term:`Namespace`,children:`billing`}),(0,w.jsx)(b,{term:`Secret store`,children:`vault-backend`}),(0,w.jsx)(b,{term:`Refresh interval`,children:`1h`}),(0,w.jsx)(b,{term:`Keys`,children:`username, password`})]})})},{value:`yaml`,label:`YAML`,content:(0,w.jsx)(a,{title:`Manifest`,children:(0,w.jsx)(S,{language:`yaml`,children:`apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: billing
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore`})})},{value:`events`,label:`Events`,content:(0,w.jsx)(a,{title:`Recent events`,children:(0,w.jsxs)(y,{children:[(0,w.jsx)(x,{tone:`success`,title:`Synced`,timestamp:`2 minutes ago`,children:`2 keys written.`}),(0,w.jsx)(x,{tone:`warning`,title:`Retried`,timestamp:`18 minutes ago`,children:`Provider returned 429.`})]})})}],E={title:`Templates/DetailPage`,component:h,parameters:{layout:`fullscreen`,docs:{description:{component:"One resource, with tabs — the other shape both products repeat: a back link, the resource name with its status beside it, a row of actions, and Overview / YAML / Events / Conditions tabs. One product extracted the tab bar alone into `DetailTabs` after noticing four byte-identical copies; this is the rest of the page around it, including the three states those pages each re-implement.\n\n`notFound` is deliberately a separate prop from `error`, because they need different affordances: a 404 on a detail page is a normal outcome — someone deleted it, or followed a stale link — and a retry button on a resource that has been deleted just fails again.\n\nTabs can be controlled, which is how the tab ends up in the URL. A detail page whose tab resets on reload loses your place every time you share a link."}}},args:{title:`db-credentials`}},D={render:function(){let[e,t]=(0,C.useState)(`overview`);return(0,w.jsx)(`div`,{className:`p-6`,children:(0,w.jsx)(h,{back:{label:`Back to external secrets`,href:`#external-secrets`},title:`db-credentials`,description:`Reconciled hourly from vault-backend.`,status:(0,w.jsx)(f,{tone:`success`,dot:!0,children:`Synced`}),actions:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsxs)(i,{variant:`outline`,children:[(0,w.jsx)(c,{}),`Force sync`]}),(0,w.jsxs)(i,{variant:`destructive`,children:[(0,w.jsx)(u,{}),`Delete`]})]}),tabs:T,tab:e,onTabChange:t})})}},O={args:{loading:!0,title:`db-credentials`},render:e=>(0,w.jsx)(`div`,{className:`p-6`,children:(0,w.jsx)(h,{...e})})},k={args:{title:`db-credentials`,error:Error(`dial tcp 10.0.4.2:8200: connect: connection refused`),onRetry:()=>{}},render:e=>(0,w.jsx)(`div`,{className:`p-6`,children:(0,w.jsx)(h,{...e})})},A={args:{title:`db-credentials`,notFound:!0,back:{label:`Back to external secrets`,href:`#external-secrets`}},render:e=>(0,w.jsx)(`div`,{className:`p-6`,children:(0,w.jsx)(h,{...e})})},j={globals:{theme:`dark`},tags:[`!autodocs`],render:D.render},M=[`Playground`,`Loading`,`Failed`,`NotFound`,`PlaygroundDark`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: function PlaygroundStory() {
    const [tab, setTab] = useState('overview');
    return <div className="p-6">
        <DetailPage back={{
        label: 'Back to external secrets',
        href: '#external-secrets'
      }} title="db-credentials" description="Reconciled hourly from vault-backend." status={<StatusBadge tone="success" dot>
              Synced
            </StatusBadge>} actions={<>
              <Button variant="outline">
                <RefreshCw />
                Force sync
              </Button>
              <Button variant="destructive">
                <Trash2 />
                Delete
              </Button>
            </>} tabs={TABS} tab={tab} onTabChange={setTab} />
      </div>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    title: 'db-credentials'
  },
  render: args => <div className="p-6">
      <DetailPage {...args} />
    </div>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'db-credentials',
    error: new Error('dial tcp 10.0.4.2:8200: connect: connection refused'),
    onRetry: () => {}
  },
  render: args => <div className="p-6">
      <DetailPage {...args} />
    </div>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'db-credentials',
    notFound: true,
    back: {
      label: 'Back to external secrets',
      href: '#external-secrets'
    }
  },
  render: args => <div className="p-6">
      <DetailPage {...args} />
    </div>
}`,...A.parameters?.docs?.source},description:{story:`Deleted, or a stale link. A retry would just fail again, so there is none.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Playground.render
}`,...j.parameters?.docs?.source}}}})))()}N();export{k as Failed,O as Loading,A as NotFound,D as Playground,j as PlaygroundDark,M as __namedExportsOrder,E as default};