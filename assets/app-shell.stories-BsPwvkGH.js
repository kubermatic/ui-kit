import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,r as i,t as ee}from"./button-DkUjhKwZ.js";import{t as te,u as ne}from"./select-J5GgisDY.js";import{a,c as re,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./app-fixtures-HbU67Au5.js";import{_ as p,c as m,i as h,m as g,n as _,t as v,v as y}from"./sidebar-mFs_ak_5.js";import{n as b,t as x}from"./plus-0juRcA5B.js";import{n as ie,t as ae}from"./server-CL8pjvpO.js";import{r as S,t as C}from"./combobox-DRvbdjRc.js";import{r as w,t as T}from"./status-badge-CTg2LHIU.js";import{c as E,l as D}from"./breadcrumb-C4Q8hVNv.js";import{n as O,r as k,t as A}from"./brand-GQK0IzLm.js";import{A as j,B as M,H as N,M as P,N as F,P as I,R as L,U as R,V as z,j as B,k as V,z as H}from"./iframe-BH6v6twT.js";var U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{b(),ie(),s(),U=t(),d(),z(),R(),H(),k(),D(),i(),S(),j(),ne(),y(),w(),I(),P(),W=n(),G=[{name:`db-credentials`,namespace:`billing`,status:`success`,statusLabel:`Synced`},{name:`api-token`,namespace:`billing`,status:`error`,statusLabel:`Error`},{name:`tls-cert`,namespace:`ingress`,status:`warning`,statusLabel:`Degraded`}],K=[{accessorKey:`name`,header:`Name`},{accessorKey:`namespace`,header:`Namespace`},{accessorKey:`statusLabel`,header:`Status`,cell:({row:e})=>(0,W.jsx)(T,{tone:e.original.status,dot:!0,children:e.original.statusLabel})}],q={title:`App Frame/AppShell`,component:L,parameters:{layout:`fullscreen`,docs:{description:{component:'The frame. Everything in it is a composition you could assemble yourself; the value is that the four things that are easy to get wrong are already right:\n\n- **`<main>` exists, once, with an id.** A page needs exactly one main landmark. Neither product has one — both nest the content in divs, so "jump to main content" has nothing to jump to and one skip link points at a `<div>`.\n- **`tabIndex={-1}` on it**, or the skip link scrolls without moving focus and the next Tab starts from the top again.\n- **Only the content scrolls.** The sidebar and header are outside the scroll container, so a long table does not scroll the navigation away.\n- **The providers are in the right order**, with the tooltip provider above the sidebar so collapsed-rail tooltips share one delay.\n\n`layout` is the one prop that had to exist. Both products are "a sidebar, a header and a content area", and they disagree about which of the two spans the corner — so a single hardcoded frame would have forced one of them to rebuild it.\n\n`ThemeProvider` is deliberately *not* mounted here: it owns the `.dark` class on `<html>`, which is above the shell, and an app rendering two shells side by side — a tenant preview — must not get two of them.'}}},args:{children:null}},J={render:function(){let[e,t]=(0,U.useState)(`prod-eu-1`),[n,r]=(0,U.useState)(`billing`);return(0,W.jsx)(A,{brand:f,children:(0,W.jsx)(L,{layout:`sidebar-first`,sidebar:(0,W.jsxs)(v,{children:[(0,W.jsx)(m,{children:(0,W.jsx)(_,{})}),(0,W.jsx)(g,{sections:c}),(0,W.jsxs)(h,{className:`flex-row items-center justify-between`,children:[(0,W.jsx)(F,{}),(0,W.jsx)(p,{})]})]}),header:(0,W.jsx)(N,{actions:(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(C,{options:[`prod-eu-1`,`prod-us-1`,`staging`],value:e,onValueChange:t,startAdornment:(0,W.jsx)(ae,{}),className:`w-48`,"aria-label":`Cluster`}),(0,W.jsx)(te,{label:`Namespace`,value:n,onValueChange:r,options:[`billing`,`ingress`,`kube-system`],triggerClassName:`w-40`})]}),user:(0,W.jsx)(B,{user:l,onSignOut:()=>{}}),children:(0,W.jsx)(E,{items:[{label:`Secrets`,href:`#secrets`},{label:`External Secrets`}]})}),children:(0,W.jsx)(V,{title:`External Secrets`,description:`Reconciled from vault-backend into the billing namespace.`,actions:(0,W.jsxs)(ee,{children:[(0,W.jsx)(x,{}),`New external secret`]}),data:G,columns:K,caption:`External secrets`})})})}},Y={render:()=>(0,W.jsx)(A,{brand:u,children:(0,W.jsx)(L,{layout:`header-first`,sidebar:(0,W.jsxs)(v,{children:[(0,W.jsx)(g,{sections:o,footerSections:a}),(0,W.jsx)(h,{className:`flex-row items-center justify-end`,children:(0,W.jsx)(p,{})})]}),header:(0,W.jsx)(N,{brand:(0,W.jsx)(O,{}),actions:(0,W.jsxs)(`a`,{href:`#catalog`,className:r(),children:[(0,W.jsx)(re,{}),`Service Catalog`]}),user:(0,W.jsx)(B,{user:l,onSignOut:()=>{},showName:!0})}),footer:(0,W.jsx)(M,{actions:(0,W.jsx)(F,{})}),children:(0,W.jsx)(V,{title:`Service objects`,description:`Everything provisioned in this organization.`,data:G,columns:K,caption:`Service objects`})})})},X={globals:{theme:`dark`},tags:[`!autodocs`],render:J.render},Z={globals:{theme:`dark`},tags:[`!autodocs`],render:Y.render},Q=[`SidebarFirst`,`HeaderFirst`,`SidebarFirstDark`,`HeaderFirstDark`],J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: function SidebarFirstStory() {
    const [cluster, setCluster] = useState<string | null>('prod-eu-1');
    const [namespace, setNamespace] = useState('billing');
    return <BrandProvider brand={CONSOLE}>
        <AppShell layout="sidebar-first" sidebar={<Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={CONSOLE_NAV} />
              <SidebarFooter className="flex-row items-center justify-between">
                <ThemeToggle />
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>} header={<AppHeader actions={<>
                  <Combobox options={['prod-eu-1', 'prod-us-1', 'staging']} value={cluster} onValueChange={setCluster} startAdornment={<Server />} className="w-48" aria-label="Cluster" />
                  <FilterSelect label="Namespace" value={namespace} onValueChange={setNamespace} options={['billing', 'ingress', 'kube-system']} triggerClassName="w-40" />
                </>} user={<UserMenu user={USER} onSignOut={() => {}} />}>
              <Breadcrumbs items={[{
          label: 'Secrets',
          href: '#secrets'
        }, {
          label: 'External Secrets'
        }]} />
            </AppHeader>}>
          <ListPage title="External Secrets" description="Reconciled from vault-backend into the billing namespace." actions={<Button>
                <Plus />
                New external secret
              </Button>} data={SECRETS} columns={COLUMNS} caption="External secrets" />
        </AppShell>
      </BrandProvider>;
  }
}`,...J.parameters?.docs?.source},description:{story:`\`sidebar-first\`. The sidebar is full height and
the header sits inside the content column beside it, holding the breadcrumb
and the cluster/namespace pickers.`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={PLATFORM}>
      <AppShell layout="header-first" sidebar={<Sidebar>
            <SidebarNav sections={PLATFORM_NAV} footerSections={PLATFORM_NAV_FOOTER} />
            <SidebarFooter className="flex-row items-center justify-end">
              <SidebarTrigger />
            </SidebarFooter>
          </Sidebar>} header={<AppHeader brand={<Logo />} actions={<a href="#catalog" className={buttonVariants()}>
                <Shapes />
                Service Catalog
              </a>} user={<UserMenu user={USER} onSignOut={() => {}} showName />} />} footer={<AppFooter actions={<ThemeToggle />} />}>
        <ListPage title="Service objects" description="Everything provisioned in this organization." data={SECRETS} columns={COLUMNS} caption="Service objects" />
      </AppShell>
    </BrandProvider>
}`,...Y.parameters?.docs?.source},description:{story:"`header-first`. The header spans the whole width with\nthe brand and the organisation switcher in it, and the sidebar starts below.",...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: SidebarFirst.render
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: HeaderFirst.render
}`,...Z.parameters?.docs?.source}}}})))()}$();export{Y as HeaderFirst,Z as HeaderFirstDark,J as SidebarFirst,X as SidebarFirstDark,Q as __namedExportsOrder,q as default};