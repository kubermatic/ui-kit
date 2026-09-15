import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{a as n,i as r,n as i,r as a,s as o,t as s}from"./app-fixtures-HbU67Au5.js";import{_ as c,c as l,h as u,i as d,m as f,n as p,t as m,v as h}from"./sidebar-mFs_ak_5.js";import{o as g,r as _}from"./tooltip-7h247ucV.js";import{r as v,t as y}from"./brand-GQK0IzLm.js";import{N as b,P as x}from"./iframe-BH6v6twT.js";var S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{o(),v(),h(),x(),g(),S=t(),C={title:`Navigation/Sidebar`,component:m,parameters:{layout:`fullscreen`,docs:{description:{component:'A `<nav>` with an accessible name, because "Primary" and "Secondary" is how a screen-reader user tells two navigation landmarks apart — both products render a bare `<aside>` or a `<div>`. Below the breakpoint it becomes a `Drawer`, which brings the focus trap and escape handling with it; one product\'s sidebar simply stays 224px wide on a phone and eats half the viewport.\n\n`SidebarMenuButton` gets three things right that hand-rolled sidebars usually do not:\n\n1. **`aria-current="page"` when active.** A left border and a background change say "you are here" to someone who can see it. Neither product sets it.\n2. **A real label when collapsed.** The text is `sr-only`, not removed, so the button keeps its accessible name at rail width. The tooltip is *additional* — a tooltip alone is unreachable by touch.\n3. **A disabled item is a disabled control**, not a link to `/` with `pointer-events: none`, which is still focusable and still activatable by Enter.\n\n`SidebarNav` takes the navigation as data, which is how both apps already describe it. Anything that does not fit — a nav item that is a search box — composes `SidebarMenu` and friends directly.'}}}},w={render:()=>(0,S.jsx)(y,{brand:s,children:(0,S.jsx)(_,{children:(0,S.jsx)(u,{children:(0,S.jsxs)(`div`,{className:`flex h-dvh bg-background`,children:[(0,S.jsxs)(m,{children:[(0,S.jsx)(l,{children:(0,S.jsx)(p,{})}),(0,S.jsx)(f,{sections:i}),(0,S.jsxs)(d,{className:`flex-row items-center justify-between`,children:[(0,S.jsx)(b,{}),(0,S.jsx)(c,{})]})]}),(0,S.jsx)(`div`,{className:`flex-1 p-6 font-sans text-sm text-muted-foreground`,children:`Page content sits here.`})]})})})})},T={render:()=>(0,S.jsx)(y,{brand:a,children:(0,S.jsx)(_,{children:(0,S.jsx)(u,{children:(0,S.jsxs)(`div`,{className:`flex h-dvh bg-background`,children:[(0,S.jsxs)(m,{children:[(0,S.jsx)(l,{children:(0,S.jsx)(p,{})}),(0,S.jsx)(f,{sections:r,footerSections:n}),(0,S.jsx)(d,{className:`flex-row items-center justify-end`,children:(0,S.jsx)(c,{})})]}),(0,S.jsx)(`div`,{className:`flex-1 p-6 font-sans text-sm text-muted-foreground`,children:`Page content sits here.`})]})})})})},E={render:()=>(0,S.jsx)(y,{brand:s,children:(0,S.jsx)(_,{children:(0,S.jsx)(u,{defaultCollapsed:!0,children:(0,S.jsxs)(`div`,{className:`flex h-dvh bg-background`,children:[(0,S.jsxs)(m,{children:[(0,S.jsx)(l,{children:(0,S.jsx)(p,{})}),(0,S.jsx)(f,{sections:i}),(0,S.jsx)(d,{className:`items-center`,children:(0,S.jsx)(c,{})})]}),(0,S.jsx)(`div`,{className:`flex-1 p-6 font-sans text-sm text-muted-foreground`,children:`Page content sits here.`})]})})})})},D={render:()=>(0,S.jsx)(y,{brand:a,children:(0,S.jsx)(_,{children:(0,S.jsx)(u,{children:(0,S.jsxs)(`div`,{className:`flex h-dvh bg-background`,children:[(0,S.jsxs)(m,{children:[(0,S.jsx)(l,{children:(0,S.jsx)(p,{})}),(0,S.jsx)(f,{sections:[{label:`Organization`,items:r[0].items},{label:`Services`,items:[],loading:!0},{label:`Blueprints`,items:[],emptyMessage:`No blueprints in this organization.`}]})]}),(0,S.jsx)(`div`,{className:`flex-1 p-6`})]})})})})},O={globals:{theme:`dark`},tags:[`!autodocs`],render:w.render},k=[`Console`,`Nested`,`Collapsed`,`LoadingAndEmpty`,`ConsoleDark`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={CONSOLE}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={CONSOLE_NAV} />
              <SidebarFooter className="flex-row items-center justify-between">
                <ThemeToggle />
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 font-sans text-sm text-muted-foreground">
              Page content sits here.
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
}`,...w.parameters?.docs?.source},description:{story:`Flat groups, a badge, no nesting.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={PLATFORM}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={PLATFORM_NAV} footerSections={PLATFORM_NAV_FOOTER} />
              <SidebarFooter className="flex-row items-center justify-end">
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 font-sans text-sm text-muted-foreground">
              Page content sits here.
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
}`,...T.parameters?.docs?.source},description:{story:`A nested service tree behind disclosures, plus a pinned footer group.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={CONSOLE}>
      <TooltipProvider>
        <SidebarProvider defaultCollapsed>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={CONSOLE_NAV} />
              <SidebarFooter className="items-center">
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 font-sans text-sm text-muted-foreground">
              Page content sits here.
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
}`,...E.parameters?.docs?.source},description:{story:`At rail width the labels are visually hidden but still the buttons'
accessible names, and the brand falls back to its square mark.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={PLATFORM}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={[{
              label: 'Organization',
              items: PLATFORM_NAV[0]!.items
            }, {
              label: 'Services',
              items: [],
              loading: true
            }, {
              label: 'Blueprints',
              items: [],
              emptyMessage: 'No blueprints in this organization.'
            }]} />
            </Sidebar>
            <div className="flex-1 p-6" />
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
}`,...D.parameters?.docs?.source},description:{story:`A section whose data has not arrived, and one that arrived empty.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Console.render
}`,...O.parameters?.docs?.source}}}})))()}A();export{E as Collapsed,w as Console,O as ConsoleDark,D as LoadingAndEmpty,T as Nested,k as __namedExportsOrder,C as default};