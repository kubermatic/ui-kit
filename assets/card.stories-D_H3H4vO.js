import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{a as i,c as a,i as o,n as s,o as c,r as l,s as u,t as d}from"./card-DFhcZFLR.js";var f,p,m,h,g;function _(){return(_=e((()=>{n(),a(),f=t(),p={title:`Data/Card`,component:d,parameters:{docs:{description:{component:"The bordered surface. Compound parts rather than `title`/`actions` props, so migrating an existing `components/ui/card` usage is a change of import specifier and nothing else. The `<Card title subtitle actions>` shape is a *page section*, not a surface, and it is `Section` in the templates layer — keeping them apart is what stops this component growing a header it renders sometimes.\n\n`bg-background` with a hairline, not `bg-muted`: a card on a page is the same plane as the page, and `muted` is for a well *inside* one."}}}},m={render:()=>(0,f.jsxs)(d,{className:`w-96`,children:[(0,f.jsxs)(c,{children:[(0,f.jsx)(u,{children:`db-credentials`}),(0,f.jsx)(o,{children:`Synced 2 minutes ago from Vault.`}),(0,f.jsx)(s,{children:(0,f.jsx)(r,{variant:`outline`,size:`sm`,children:`Edit`})})]}),(0,f.jsx)(l,{className:`font-sans text-sm text-muted-foreground`,children:`Two keys, refreshed hourly.`}),(0,f.jsx)(i,{className:`border-t border-border pt-6`,children:(0,f.jsx)(r,{variant:`ghost`,size:`sm`,children:`View manifest`})})]})},h={globals:{theme:`dark`},tags:[`!autodocs`],render:m.render},g=[`Playground`,`PlaygroundDark`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">
      <CardHeader>
        <CardTitle>db-credentials</CardTitle>
        <CardDescription>Synced 2 minutes ago from Vault.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="font-sans text-sm text-muted-foreground">
        Two keys, refreshed hourly.
      </CardContent>
      <CardFooter className="border-t border-border pt-6">
        <Button variant="ghost" size="sm">
          View manifest
        </Button>
      </CardFooter>
    </Card>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Playground.render
}`,...h.parameters?.docs?.source}}}})))()}_();export{m as Playground,h as PlaygroundDark,g as __namedExportsOrder,p as default};