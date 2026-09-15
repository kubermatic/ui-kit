import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,r,t as i}from"./brand-GQK0IzLm.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{r(),a=t(),o={name:`Example Platform`,shortName:`EP`,company:`Kubermatic`,docsUrl:`https://example.com/docs`},s={name:`Example Console`,shortName:`EC`,company:`Kubermatic`},c={title:`App Frame/Brand`,component:n,parameters:{layout:`centered`,docs:{description:{component:'This is the answer to "we have a different logo per product".\n\nThe kit ships **no artwork at all** — for the same reason it ships no font files: a component library carrying one product\'s PNG either forces every other product to override it, or grows a `product` enum that has to be edited here whenever a new one appears. Instead each app mounts `BrandProvider` once at its root:\n\n```tsx\n<BrandProvider\n  brand={{\n    name: \'Example Console\',\n    logo: <img src="/console.svg" alt="" className="h-7" />,\n    mark: <img src="/console-mark.svg" alt="" className="size-6" />,\n    company: \'Kubermatic\',\n    docsUrl: \'https://example.com/docs\',\n  }}\n>\n```\n\n…and `AppHeader`, `Sidebar` and `AppFooter` read it from context. Nothing below has a logo prop to thread through, and adding a fourth product touches no file in this package.\n\n`alt=""` above is not an oversight: `Logo` wraps the artwork in a link already named from `brand.name`, so alt text on the image would announce the product twice.\n\nOnly `name` is required, and it falls all the way back — `logo` → the name as a wordmark, `mark` → initials in a tinted square — so the shell looks deliberate on day one, before any artwork exists.'}}}},l={render:()=>(0,a.jsx)(`div`,{className:`flex flex-col gap-6`,children:[o,s].map(e=>(0,a.jsx)(i,{brand:e,children:(0,a.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,a.jsx)(n,{}),(0,a.jsx)(n,{variant:`mark`})]})},e.name))})},u={render:()=>(0,a.jsx)(i,{brand:{...s,logo:(0,a.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,a.jsx)(`span`,{"aria-hidden":`true`,className:`flex size-7 items-center justify-center rounded-md bg-accent font-display text-xs font-bold text-accent-foreground`,children:`SG`}),(0,a.jsx)(`span`,{"aria-hidden":`true`,className:`font-display text-base font-bold text-heading`,children:`Example Console`})]})},children:(0,a.jsx)(n,{})})},d={globals:{theme:`dark`},tags:[`!autodocs`],render:l.render},f=[`Fallbacks`,`WithArtwork`,`FallbacksDark`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      {[PLATFORM, CONSOLE].map(brand => <BrandProvider key={brand.name} brand={brand}>
          <div className="flex items-center gap-6">
            <Logo />
            <Logo variant="mark" />
          </div>
        </BrandProvider>)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`With no artwork supplied: the name, and initials for the square mark.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <BrandProvider brand={{
    ...CONSOLE,
    logo: <span className="flex items-center gap-2">
            <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-md bg-accent font-display text-xs font-bold text-accent-foreground">
              SG
            </span>
            <span aria-hidden="true" className="font-display text-base font-bold text-heading">
              Example Console
            </span>
          </span>
  }}>
      <Logo />
    </BrandProvider>
}`,...u.parameters?.docs?.source},description:{story:"With artwork. Anything that renders is accepted — an `<img>`, an inline SVG.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Fallbacks.render
}`,...d.parameters?.docs?.source}}}})))()}p();export{l as Fallbacks,d as FallbacksDark,u as WithArtwork,f as __namedExportsOrder,c as default};