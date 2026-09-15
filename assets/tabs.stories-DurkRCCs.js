import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{J as n,K as r,X as i,Y as a,q as o}from"./iframe-BH6v6twT.js";var s,c,l,u,d,f;function p(){return(p=e((()=>{i(),s=t(),c={title:`Navigation/Tabs`,component:r,parameters:{docs:{description:{component:"The detail-page section switcher. One product's `DetailTabs` is a row of `<button>`s with an `onChange`, which gives no `role=\"tablist\"`, no arrow-key movement between tabs, and no `aria-controls` linking a tab to its panel — so a screen reader announces four unrelated buttons and the panel below them is not connected to any of them.\n\nBase UI activates on Enter rather than on arrow-key focus. That is the right default for tabs whose panels cost something to render: automatic activation would fetch every tab's data on the way past it.\n\nTwo visual variants, because both products have both: `underline` for page-level sections, `pill` for a segmented switch inside a panel."}}}},l={render:()=>(0,s.jsx)(`div`,{className:`w-[36rem]`,children:(0,s.jsxs)(r,{defaultValue:`overview`,className:`flex flex-col gap-4`,children:[(0,s.jsxs)(o,{children:[(0,s.jsx)(a,{value:`overview`,children:`Overview`}),(0,s.jsx)(a,{value:`yaml`,children:`YAML`}),(0,s.jsx)(a,{value:`events`,children:`Events`}),(0,s.jsx)(a,{value:`conditions`,children:`Conditions`})]}),(0,s.jsx)(n,{value:`overview`,className:`font-sans text-sm text-muted-foreground`,children:`Two keys, refreshed hourly from vault-backend.`}),(0,s.jsx)(n,{value:`yaml`,className:`font-sans text-sm text-muted-foreground`,children:`The rendered manifest.`}),(0,s.jsx)(n,{value:`events`,className:`font-sans text-sm text-muted-foreground`,children:`Recent Kubernetes events.`}),(0,s.jsx)(n,{value:`conditions`,className:`font-sans text-sm text-muted-foreground`,children:`Status conditions reported by the controller.`})]})})},u={render:()=>(0,s.jsxs)(r,{defaultValue:`form`,className:`flex flex-col gap-4`,children:[(0,s.jsxs)(o,{variant:`pill`,children:[(0,s.jsx)(a,{value:`form`,variant:`pill`,children:`Form`}),(0,s.jsx)(a,{value:`yaml`,variant:`pill`,children:`YAML`})]}),(0,s.jsx)(n,{value:`form`,className:`font-sans text-sm text-muted-foreground`,children:`A generated form.`}),(0,s.jsx)(n,{value:`yaml`,className:`font-sans text-sm text-muted-foreground`,children:`The raw manifest.`})]})},d={globals:{theme:`dark`},tags:[`!autodocs`],render:l.render},f=[`Underline`,`Pill`,`UnderlineDark`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[36rem]">
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList>
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="yaml">YAML</TabsTab>
          <TabsTab value="events">Events</TabsTab>
          <TabsTab value="conditions">Conditions</TabsTab>
        </TabsList>
        <TabsPanel value="overview" className="font-sans text-sm text-muted-foreground">
          Two keys, refreshed hourly from vault-backend.
        </TabsPanel>
        <TabsPanel value="yaml" className="font-sans text-sm text-muted-foreground">
          The rendered manifest.
        </TabsPanel>
        <TabsPanel value="events" className="font-sans text-sm text-muted-foreground">
          Recent Kubernetes events.
        </TabsPanel>
        <TabsPanel value="conditions" className="font-sans text-sm text-muted-foreground">
          Status conditions reported by the controller.
        </TabsPanel>
      </Tabs>
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="form" className="flex flex-col gap-4">
      <TabsList variant="pill">
        <TabsTab value="form" variant="pill">
          Form
        </TabsTab>
        <TabsTab value="yaml" variant="pill">
          YAML
        </TabsTab>
      </TabsList>
      <TabsPanel value="form" className="font-sans text-sm text-muted-foreground">
        A generated form.
      </TabsPanel>
      <TabsPanel value="yaml" className="font-sans text-sm text-muted-foreground">
        The raw manifest.
      </TabsPanel>
    </Tabs>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Underline.render
}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Pill,l as Underline,d as UnderlineDark,f as __namedExportsOrder,c as default};