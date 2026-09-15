import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{n,t as r}from"./utils-Dm4OyE3Q.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{i as a,r as o}from"./avatar-BaCXRDoI.js";function s({brand:e,children:t}){let{name:n,shortName:r,logo:i,mark:a,href:o,homeLink:s,company:c,docsUrl:l}=e,p=(0,u.useMemo)(()=>({name:n,shortName:r,logo:i,mark:a,href:o,homeLink:s,company:c,docsUrl:l}),[n,r,i,a,o,s,c,l]);return(0,d.jsx)(f.Provider,{value:p,children:t})}function c(){let e=(0,u.useContext)(f);if(!e)throw Error("useBrand must be used inside a <BrandProvider>. Mount it once at your app root with at least a `name`.");return e}function l({variant:e=`full`,asLink:t=!0,className:n,...i}){let o=c(),s=o.shortName??a(o.name),l=e===`mark`?o.mark??(0,d.jsx)(`span`,{"aria-hidden":`true`,className:`flex size-7 shrink-0 items-center justify-center rounded-md bg-primary font-display text-xs font-bold text-primary-foreground`,children:s}):o.logo??(0,d.jsx)(`span`,{"aria-hidden":`true`,className:`font-display text-base font-bold text-heading`,children:o.shortName??o.name}),f=(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`span`,{"data-slot":`logo`,className:r(`flex items-center gap-2`,n),children:l}),(0,d.jsx)(`span`,{className:`sr-only`,children:o.name})]});if(!t)return(0,d.jsx)(`span`,{className:`flex items-center`,...i,children:f});let p=`flex items-center rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`;return o.homeLink?(0,u.cloneElement)(o.homeLink,{className:r(p,o.homeLink.props.className)},f):(0,d.jsx)(`a`,{href:o.href??`/`,className:p,children:f})}var u,d,f;function p(){return(p=e((()=>{u=t(),n(),o(),d=i(),f=(0,u.createContext)(null);try{s.displayName=`BrandProvider`,s.__docgenInfo={description:`BrandProvider — the product's identity, in one place.

This is the answer to "we have a different logo per product". The kit ships
**no artwork at all**, for the same reason it ships no font files: a
component library carrying one product's PNG either forces every other
product to override it, or grows a \`product\` enum that has to be edited here
whenever a new one appears.

Instead each app mounts this once at its root:

  <BrandProvider
    brand={{
      name: 'Example Console',
      logo: <img src="/console.svg" alt="" className="h-7" />,
      mark: <img src="/console-mark.svg" alt="" className="size-6" />,
      company: 'Kubermatic',
      docsUrl: 'https://example.com/docs',
    }}
  >

and \`AppHeader\`, \`Sidebar\` and \`AppFooter\` read it from context. Nothing
below has a logo prop to thread through, and adding a fourth product touches
no file in this package.

\`alt=""\` above is not an oversight: \`Logo\` wraps the artwork in a link that
is already named from \`brand.name\`, so alt text on the image would make a
screen reader announce the product twice.`,displayName:`BrandProvider`,filePath:`/home/prow/go/src/github.com/kubermatic/ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,methods:[],props:{brand:{defaultValue:null,declarations:[{fileName:`ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,name:`BrandProviderProps`}],description:``,name:`brand`,parent:{fileName:`ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,name:`BrandProviderProps`},required:!0,tags:{},type:{name:`Brand`}}},tags:{}}}catch{}try{c.displayName=`useBrand`,c.__docgenInfo={description:`The current brand.

Throws without a provider, like \`useSidebar\` and unlike an earlier version of
this file, which returned \`{ name: 'Untitled' }\` so that a single component
could be dropped into a story with no scaffolding. That convenience was the
wrong trade for an app-level provider: forgetting to mount \`BrandProvider\`
then ships "Untitled" to production instead of failing on the first render.

The convenience is bought back where it belongs — Storybook mounts a brand
globally in \`.storybook/with-brand.tsx\`, so no story needs boilerplate and
nothing in the catalogue depends on a fallback.`,displayName:`useBrand`,filePath:`/home/prow/go/src/github.com/kubermatic/ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,methods:[],props:{},tags:{}}}catch{}try{l.displayName=`Logo`,l.__docgenInfo={description:"Logo — the brand, rendered.\n\nFalls all the way back — `logo` → `name` as a wordmark, `mark` → initials in\na tinted square — so the shell looks deliberate on day one, before any\nartwork exists.",displayName:`Logo`,filePath:`/home/prow/go/src/github.com/kubermatic/ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,methods:[],props:{variant:{defaultValue:{value:`full`},declarations:[{fileName:`ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,name:`LogoProps`}],description:"`full` renders the lockup, `mark` the square glyph. The collapsed sidebar\nuses `mark`; everything else uses `full`.",name:`variant`,parent:{fileName:`ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,name:`LogoProps`},required:!1,tags:{},type:{name:`enum`,raw:`"mark" | "full"`,value:[{value:`"mark"`},{value:`"full"`}]}},asLink:{defaultValue:{value:`true`},declarations:[{fileName:`ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,name:`LogoProps`}],description:`Renders static content instead of a link to the home route.`,name:`asLink`,parent:{fileName:`ui-kit/packages/ui-kit/src/components/ui/brand.tsx`,name:`LogoProps`},required:!1,tags:{},type:{name:`boolean`}}},tags:{}}}catch{}})))()}export{c as i,l as n,p as r,s as t};