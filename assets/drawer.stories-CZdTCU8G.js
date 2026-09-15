import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{a as i,c as a,d as o,i as s,l as c,n as l,o as u,r as d,s as f,t as p}from"./drawer-DgQJvqae.js";import{Bt as m,zt as h}from"./iframe-BH6v6twT.js";var g,_,v,y,b,x;function S(){return(S=e((()=>{n(),m(),o(),g=t(),_=`Events:
  Type     Reason        Age   Message
  ----     ------        ----  -------
  Warning  UpdateFailed  2m    dial tcp 10.0.4.2:8200: connect: connection refused
  Warning  UpdateFailed  7m    dial tcp 10.0.4.2:8200: connect: connection refused
  Normal   Synced        1h    Secret written`,v={title:`Overlays/Drawer`,component:p,parameters:{layout:`centered`,docs:{description:{component:`A panel that slides in from an edge. Built on Base UI's **Dialog** rather than its \`Drawer\`, deliberately: the dedicated primitive adds swipe-to-dismiss and snap points, which is worth having for a mobile bottom sheet and is not what either product uses this for — both open a right-hand panel with a resource's YAML or an error trace in it. Dialog gives the same focus trap, inert background and escape handling with a fraction of the API.

\`side="left"\` is also what the app sidebar becomes below the mobile breakpoint.`}}}},y={render:()=>(0,g.jsxs)(p,{children:[(0,g.jsx)(c,{render:(0,g.jsx)(r,{variant:`outline`,children:`View sync errors`})}),(0,g.jsxs)(s,{size:`lg`,children:[(0,g.jsxs)(f,{children:[(0,g.jsx)(a,{children:`Sync errors`}),(0,g.jsx)(i,{children:`db-credentials, last 24 hours.`})]}),(0,g.jsx)(l,{children:(0,g.jsx)(h,{copyable:!1,children:_})}),(0,g.jsxs)(u,{children:[(0,g.jsx)(d,{render:(0,g.jsx)(r,{variant:`outline`,children:`Close`})}),(0,g.jsx)(r,{children:`Force sync`})]})]})]})},b={render:()=>(0,g.jsx)(`div`,{className:`flex gap-2`,children:[`left`,`right`,`top`,`bottom`].map(e=>(0,g.jsxs)(p,{children:[(0,g.jsx)(c,{render:(0,g.jsx)(r,{variant:`outline`,children:e})}),(0,g.jsxs)(s,{side:e,children:[(0,g.jsx)(f,{children:(0,g.jsxs)(a,{children:[`From the `,e]})}),(0,g.jsx)(l,{className:`font-sans text-sm text-muted-foreground`,children:`The edge it enters from is the only difference.`})]})]},e))})},x=[`Playground`,`Sides`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Drawer>
      <DrawerTrigger render={<Button variant="outline">View sync errors</Button>} />
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>Sync errors</DrawerTitle>
          <DrawerDescription>db-credentials, last 24 hours.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <CodeBlock copyable={false}>{TRACE}</CodeBlock>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Close</Button>} />
          <Button>Force sync</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">
      {(['left', 'right', 'top', 'bottom'] as const).map(side => <Drawer key={side}>
          <DrawerTrigger render={<Button variant="outline">{side}</Button>} />
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle>From the {side}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="font-sans text-sm text-muted-foreground">
              The edge it enters from is the only difference.
            </DrawerBody>
          </DrawerContent>
        </Drawer>)}
    </div>
}`,...b.parameters?.docs?.source}}}})))()}S();export{y as Playground,b as Sides,x as __namedExportsOrder,v as default};