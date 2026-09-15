import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{n as i,t as a}from"./text-1WvMJMha.js";import{n as o,t as s}from"./arrow-right-DxoHGwtb.js";import{n as c,t as l}from"./check-BaG4Ubyj.js";import{Jt as u,qt as d}from"./iframe-BH6v6twT.js";var f,p,m,h,g;function _(){return(_=e((()=>{o(),c(),u(),n(),i(),f=t(),p={title:`Foundations/Showcase`,parameters:{docs:{description:{component:`The palette and the type hierarchy working together. Switch the theme in the toolbar — every colour here is a semantic role, so the dark variant needs no separate markup.`}}}},m={render:()=>(0,f.jsxs)(`div`,{className:`max-w-xl space-y-6`,children:[(0,f.jsxs)(`div`,{className:`space-y-2`,children:[(0,f.jsx)(a,{variant:`h1`,children:`Manage Kubernetes At Scale`}),(0,f.jsx)(a,{variant:`subline`,children:`One Control Plane, Every Cloud`}),(0,f.jsx)(a,{variant:`body`,tone:`muted`,children:`Ubuntu Bold for the headline, Roboto Bold for the subline, Roboto for this paragraph — and Cerulean on the call to action.`})]}),(0,f.jsxs)(`div`,{className:`flex flex-wrap gap-3`,children:[(0,f.jsxs)(r,{children:[`Create Cluster`,(0,f.jsx)(s,{})]}),(0,f.jsx)(r,{variant:`outline`,children:`View Docs`})]}),(0,f.jsxs)(`div`,{className:`bg-muted/60 space-y-3 rounded-lg border p-4`,children:[(0,f.jsxs)(`div`,{className:`flex items-center justify-between gap-4`,children:[(0,f.jsx)(a,{variant:`h3`,as:`h2`,children:`production-eu-01`}),(0,f.jsxs)(d,{variant:`accent`,children:[(0,f.jsx)(l,{}),`Running`]})]}),(0,f.jsx)(a,{variant:`small`,tone:`muted`,children:`v1.31.2 · 6 nodes · Frankfurt`}),(0,f.jsxs)(`div`,{className:`flex flex-wrap gap-2 pt-1`,children:[(0,f.jsx)(d,{variant:`secondary`,children:`openstack`}),(0,f.jsx)(d,{variant:`honey`,children:`Upgrade Available`}),(0,f.jsx)(d,{variant:`rose`,children:`Beta`})]})]}),(0,f.jsxs)(`div`,{className:`border-destructive space-y-1 rounded-lg border p-4`,children:[(0,f.jsx)(a,{variant:`subline`,tone:`destructive`,className:`text-base`,children:`Quota Exceeded`}),(0,f.jsx)(a,{variant:`small`,children:`Maroon carries negatives and warnings — 10.14:1 on the light background and 4.64:1 on the dark one.`})]})]})},h={globals:{theme:`dark`},tags:[`!autodocs`],render:m.render},g=[`ClusterCard`,`ClusterCardDark`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Text variant="h1">Manage Kubernetes At Scale</Text>
        <Text variant="subline">One Control Plane, Every Cloud</Text>
        <Text variant="body" tone="muted">
          Ubuntu Bold for the headline, Roboto Bold for the subline, Roboto for this paragraph — and
          Cerulean on the call to action.
        </Text>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>
          Create Cluster
          <ArrowRight />
        </Button>
        <Button variant="outline">View Docs</Button>
      </div>

      <div className="bg-muted/60 space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-4">
          <Text variant="h3" as="h2">
            production-eu-01
          </Text>
          <Badge variant="accent">
            <Check />
            Running
          </Badge>
        </div>
        <Text variant="small" tone="muted">
          v1.31.2 · 6 nodes · Frankfurt
        </Text>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">openstack</Badge>
          <Badge variant="honey">Upgrade Available</Badge>
          <Badge variant="rose">Beta</Badge>
        </div>
      </div>

      {/*
        No \`bg-destructive/10\` here, deliberately. An opacity tint composites to
        a colour outside the token set (#14192c on the dark palette), and
        Maroon-on-that measures 4.27:1 — the axe run caught exactly that. Solid
        roles only: the border carries the semantics, the text keeps a verified
        pair.
       */}
      <div className="border-destructive space-y-1 rounded-lg border p-4">
        <Text variant="subline" tone="destructive" className="text-base">
          Quota Exceeded
        </Text>
        <Text variant="small">
          Maroon carries negatives and warnings — 10.14:1 on the light background and 4.64:1 on the
          dark one.
        </Text>
      </div>
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  render: ClusterCard.render
}`,...h.parameters?.docs?.source}}}})))()}_();export{m as ClusterCard,h as ClusterCardDark,g as __namedExportsOrder,p as default};