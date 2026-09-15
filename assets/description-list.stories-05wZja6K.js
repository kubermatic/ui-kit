import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./status-badge-CTg2LHIU.js";import{Bt as i,Ct as a,Rt as o,St as s,xt as c}from"./iframe-BH6v6twT.js";var l,u,d,f,p,m;function h(){return(h=e((()=>{i(),a(),n(),l=t(),u={title:`Data/DescriptionList`,component:s,parameters:{docs:{description:{component:'The metadata block on every detail page, as a real `<dl>`. Both products build this out of a two-column `<table>` or nested divs — a table asserts a relationship between *rows* that does not exist here, and divs assert nothing at all. The list element is what lets a screen reader move term-by-term and announce "Namespace, kube-system" as a pair.\n\n`DescriptionItem` renders a bare `<dt>`/`<dd>` pair with no wrapper, so in the horizontal layout the terms are real grid items and line up down the column. A wrapper per pair is what forces people back to a table.'}}}},d={render:()=>(0,l.jsx)(`div`,{className:`w-[36rem]`,children:(0,l.jsxs)(s,{children:[(0,l.jsx)(c,{term:`Name`,children:`db-credentials`}),(0,l.jsx)(c,{term:`Namespace`,children:`billing`}),(0,l.jsx)(c,{term:`Status`,children:(0,l.jsx)(r,{tone:`success`,dot:!0,children:`Synced`})}),(0,l.jsx)(c,{term:`Refresh interval`,children:(0,l.jsx)(o,{children:`1h`})}),(0,l.jsx)(c,{term:`Secret store`,children:`vault-backend`})]})})},f={render:()=>(0,l.jsx)(`div`,{className:`w-64`,children:(0,l.jsxs)(s,{orientation:`stacked`,children:[(0,l.jsx)(c,{term:`Name`,children:`db-credentials`}),(0,l.jsx)(c,{term:`Namespace`,children:`billing`}),(0,l.jsx)(c,{term:`Token`,truncate:!0,children:`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.very.long`})]})})},p={globals:{theme:`dark`},tags:[`!autodocs`],render:d.render},m=[`Horizontal`,`Stacked`,`HorizontalDark`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[36rem]">
      <DescriptionList>
        <DescriptionItem term="Name">db-credentials</DescriptionItem>
        <DescriptionItem term="Namespace">billing</DescriptionItem>
        <DescriptionItem term="Status">
          <StatusBadge tone="success" dot>
            Synced
          </StatusBadge>
        </DescriptionItem>
        <DescriptionItem term="Refresh interval">
          <Code>1h</Code>
        </DescriptionItem>
        <DescriptionItem term="Secret store">vault-backend</DescriptionItem>
      </DescriptionList>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <DescriptionList orientation="stacked">
        <DescriptionItem term="Name">db-credentials</DescriptionItem>
        <DescriptionItem term="Namespace">billing</DescriptionItem>
        <DescriptionItem term="Token" truncate>
          eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.very.long
        </DescriptionItem>
      </DescriptionList>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Stacked, for a narrow drawer or a sidebar panel.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Horizontal.render
}`,...p.parameters?.docs?.source}}}})))()}h();export{d as Horizontal,p as HorizontalDark,f as Stacked,m as __namedExportsOrder,u as default};