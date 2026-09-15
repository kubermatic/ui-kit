import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{a as i,i as a,n as o,o as s,r as c,s as l}from"./page-B3RnUbmI.js";import{t as u,u as d}from"./select-J5GgisDY.js";import{n as f,t as p}from"./plus-0juRcA5B.js";import{n as m,t as h}from"./refresh-cw-mDHRkEFK.js";import{r as g,t as _}from"./status-badge-CTg2LHIU.js";import{Bt as v,Ct as y,St as b,xt as x,zt as S}from"./iframe-BH6v6twT.js";var C,w,T,E,D,O;function k(){return(k=e((()=>{f(),m(),n(),v(),y(),l(),d(),g(),C=t(),w={title:`Templates/Page`,component:o,parameters:{layout:`fullscreen`,docs:{description:{component:"The vertical rhythm of a route. Both products set the gap between the title block, the toolbar and the content by hand on every page, so no two pages agree — this is the one place it is decided.\n\n`PageHeader` renders the title as an `<h1>` and there should be exactly one per route. Both products currently emit either none — the page title is a `<div>` with large text — or several, because each card title is also an `<h2>` under no `<h1>`. Either way the outline a screen-reader user navigates by is unusable.\n\n`Section` is the `<Card title subtitle actions>` shape under a name that says what it is. It emits a real heading and a `<section>` labelled by it, which makes it a region a screen reader can list and jump between — how you skim a detail page with six panels on it."}}}},T={render:()=>(0,C.jsx)(`div`,{className:`p-6`,children:(0,C.jsxs)(o,{children:[(0,C.jsx)(a,{breadcrumbs:[{label:`Secrets`,href:`#secrets`},{label:`External Secrets`}],title:`External Secrets`,description:`Reconciled from a provider into a Kubernetes Secret.`,status:(0,C.jsx)(_,{tone:`success`,dot:!0,children:`Reconciling`}),actions:(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)(r,{variant:`outline`,children:[(0,C.jsx)(h,{}),`Sync all`]}),(0,C.jsxs)(r,{children:[(0,C.jsx)(p,{}),`New external secret`]})]})}),(0,C.jsxs)(i,{children:[(0,C.jsx)(u,{label:`Status`,value:`All`,onValueChange:()=>{},options:[`All`,`Synced`]}),(0,C.jsx)(u,{label:`Namespace`,value:`billing`,onValueChange:()=>{},options:[`billing`,`ingress`]})]}),(0,C.jsxs)(c,{children:[(0,C.jsx)(s,{title:`Overview`,description:`What this resource is doing right now.`,children:(0,C.jsxs)(b,{children:[(0,C.jsx)(x,{term:`Secret store`,children:`vault-backend`}),(0,C.jsx)(x,{term:`Refresh interval`,children:`1h`}),(0,C.jsx)(x,{term:`Keys`,children:`2`})]})}),(0,C.jsx)(s,{title:`Manifest`,actions:(0,C.jsx)(r,{variant:`ghost`,size:`sm`,children:`Edit`}),children:(0,C.jsx)(S,{language:`yaml`,children:`apiVersion: external-secrets.io/v1
kind: ExternalSecret`})})]})]})})},E={render:()=>(0,C.jsx)(`div`,{className:`p-6`,children:(0,C.jsxs)(o,{children:[(0,C.jsx)(a,{title:`Settings`,as:`h1`}),(0,C.jsxs)(c,{children:[(0,C.jsx)(s,{title:`General`,description:`Applies to the whole organization.`,plain:!0,children:(0,C.jsx)(`p`,{className:`font-sans text-sm text-muted-foreground`,children:`Nothing to configure yet.`})}),(0,C.jsx)(s,{title:`Danger zone`,as:`h2`,plain:!0,children:(0,C.jsx)(r,{variant:`destructive`,size:`sm`,children:`Delete organization`})})]})]})})},D={globals:{theme:`dark`},tags:[`!autodocs`],render:T.render},O=[`Playground`,`PlainSections`,`PlaygroundDark`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6">
      <Page>
        <PageHeader breadcrumbs={[{
        label: 'Secrets',
        href: '#secrets'
      }, {
        label: 'External Secrets'
      }]} title="External Secrets" description="Reconciled from a provider into a Kubernetes Secret." status={<StatusBadge tone="success" dot>
              Reconciling
            </StatusBadge>} actions={<>
              <Button variant="outline">
                <RefreshCw />
                Sync all
              </Button>
              <Button>
                <Plus />
                New external secret
              </Button>
            </>} />
        <PageToolbar>
          <FilterSelect label="Status" value="All" onValueChange={() => {}} options={['All', 'Synced']} />
          <FilterSelect label="Namespace" value="billing" onValueChange={() => {}} options={['billing', 'ingress']} />
        </PageToolbar>
        <PageContent>
          <Section title="Overview" description="What this resource is doing right now.">
            <DescriptionList>
              <DescriptionItem term="Secret store">vault-backend</DescriptionItem>
              <DescriptionItem term="Refresh interval">1h</DescriptionItem>
              <DescriptionItem term="Keys">2</DescriptionItem>
            </DescriptionList>
          </Section>
          <Section title="Manifest" actions={<Button variant="ghost" size="sm">
                Edit
              </Button>}>
            <CodeBlock language="yaml">
              {'apiVersion: external-secrets.io/v1\\nkind: ExternalSecret'}
            </CodeBlock>
          </Section>
        </PageContent>
      </Page>
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6">
      <Page>
        <PageHeader title="Settings" as="h1" />
        <PageContent>
          <Section title="General" description="Applies to the whole organization." plain>
            <p className="font-sans text-sm text-muted-foreground">Nothing to configure yet.</p>
          </Section>
          <Section title="Danger zone" as="h2" plain>
            <Button variant="destructive" size="sm">
              Delete organization
            </Button>
          </Section>
        </PageContent>
      </Page>
    </div>
}`,...E.parameters?.docs?.source},description:{story:"`plain` drops the card surface but keeps the heading and the region.",...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Playground.render
}`,...D.parameters?.docs?.source}}}})))()}k();export{E as PlainSections,T as Playground,D as PlaygroundDark,O as __namedExportsOrder,w as default};