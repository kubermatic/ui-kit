import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,s as r}from"./app-fixtures-HbU67Au5.js";import{r as i,t as a}from"./brand-GQK0IzLm.js";import{B as o,N as s,P as c,V as l}from"./iframe-BH6v6twT.js";var u,d,f,p,m;function h(){return(h=e((()=>{r(),l(),i(),c(),u=t(),d={title:`App Frame/AppFooter`,component:o,parameters:{layout:`fullscreen`,docs:{description:{component:'The credit line and the theme switch. Reads `company` and `docsUrl` from `BrandProvider`, so this is another file with no product knowledge in it. Both fields are optional and the corresponding element is simply absent when they are — a footer reading "Powered by undefined" is the failure mode of doing this with props.\n\nThe docs link is named "Documentation", not "Docs": a link\'s accessible name should make sense read out of context, which is how a screen reader\'s link list presents it.'}}}},f={render:()=>(0,u.jsx)(a,{brand:n,children:(0,u.jsx)(o,{actions:(0,u.jsx)(s,{})})})},p={render:()=>(0,u.jsx)(a,{brand:{name:`Example Console`},children:(0,u.jsx)(o,{actions:(0,u.jsx)(s,{variant:`button`})})})},m=[`Playground`,`Bare`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={PLATFORM}>
      <AppFooter actions={<ThemeToggle />} />
    </BrandProvider>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={{
    name: 'Example Console'
  }}>
      <AppFooter actions={<ThemeToggle variant="button" />} />
    </BrandProvider>
}`,...p.parameters?.docs?.source},description:{story:"With no `company` or `docsUrl`, there is nothing to say and nothing is said.",...p.parameters?.docs?.description}}}})))()}h();export{p as Bare,f as Playground,m as __namedExportsOrder,d as default};