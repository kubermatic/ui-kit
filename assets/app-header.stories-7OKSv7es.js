import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,r}from"./button-DkUjhKwZ.js";import{c as i,l as a,o,r as s,s as c,t as l}from"./app-fixtures-HbU67Au5.js";import{h as u,v as d}from"./sidebar-mFs_ak_5.js";import{c as f,l as p}from"./breadcrumb-C4Q8hVNv.js";import{n as m,r as h,t as g}from"./brand-GQK0IzLm.js";import{H as _,M as v,U as y,j as b}from"./iframe-BH6v6twT.js";var x,S,C,w,T,E;function D(){return(D=e((()=>{a(),c(),y(),h(),p(),r(),d(),v(),x=t(),S={title:`App Frame/AppHeader`,component:_,parameters:{layout:`fullscreen`,docs:{description:{component:'Slots rather than a fixed composition, because the two products put different things here and neither is wrong: one has the brand, an organisation selector and the user menu; the other has a breadcrumb, a cluster picker, a namespace picker and the user menu. Both are `brand` / `children` / `actions` / `user`.\n\nA real `<header>`, which is a `banner` landmark — so "jump to banner" works and the header is not just the first `<div>` on the page.\n\n`sidebarTrigger` defaults to `mobile`, which is the right answer for a `header-first` layout: the rail has its own trigger on desktop, and the header\'s would be a second control for the same thing.'}}}},C={render:()=>(0,x.jsx)(g,{brand:s,children:(0,x.jsx)(u,{children:(0,x.jsx)(_,{brand:(0,x.jsx)(m,{}),actions:(0,x.jsxs)(`a`,{href:`#catalog`,className:n(),children:[(0,x.jsx)(i,{}),`Service Catalog`]}),user:(0,x.jsx)(b,{user:o,onSignOut:()=>{},showName:!0})})})})},w={render:()=>(0,x.jsx)(g,{brand:l,children:(0,x.jsx)(u,{children:(0,x.jsx)(_,{user:(0,x.jsx)(b,{user:o,onSignOut:()=>{}}),children:(0,x.jsx)(f,{items:[{label:`Secrets`,href:`#secrets`},{label:`External Secrets`}]})})})})},T={globals:{theme:`dark`},tags:[`!autodocs`],render:C.render},E=[`WithBrand`,`WithBreadcrumbs`,`WithBrandDark`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={PLATFORM}>
      <SidebarProvider>
        <AppHeader brand={<Logo />} actions={<a href="#catalog" className={buttonVariants()}>
              <Shapes />
              Service Catalog
            </a>} user={<UserMenu user={USER} onSignOut={() => {}} showName />} />
      </SidebarProvider>
    </BrandProvider>
}`,...C.parameters?.docs?.source},description:{story:`The brand lives here, because the header spans the corner.

\`<Logo />\`, not \`<SidebarBrand />\` — the latter shrinks to a square mark
when the rail collapses, which is right in a 3.5rem rail and wrong in a
full-width header.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={CONSOLE}>
      <SidebarProvider>
        <AppHeader user={<UserMenu user={USER} onSignOut={() => {}} />}>
          <Breadcrumbs items={[{
          label: 'Secrets',
          href: '#secrets'
        }, {
          label: 'External Secrets'
        }]} />
        </AppHeader>
      </SidebarProvider>
    </BrandProvider>
}`,...w.parameters?.docs?.source},description:{story:`The sidebar already shows the brand, so this holds the trail.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: WithBrand.render
}`,...T.parameters?.docs?.source}}}})))()}D();export{C as WithBrand,T as WithBrandDark,w as WithBreadcrumbs,E as __namedExportsOrder,S as default};