import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./utils-Dm4OyE3Q.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";function i({className:e,...t}){return(0,o.jsx)(`div`,{"data-slot":`skeleton`,className:n(`animate-pulse rounded-md bg-muted`,e),...t})}function a({lines:e=3,className:t,...r}){return(0,o.jsx)(`div`,{"data-slot":`skeleton-text`,className:n(`flex flex-col gap-2`,t),...r,children:Array.from({length:e},(t,r)=>(0,o.jsx)(i,{className:n(`h-4`,r===e-1&&e>1?`w-2/3`:`w-full`)},r))})}var o;function s(){return(s=e((()=>{t(),o=r();try{i.displayName=`Skeleton`,i.__docgenInfo={description:`Skeleton — a loading placeholder.

\`bg-muted\`, not a Tailwind palette grey. One product's version is
\`bg-slate-200\`, which is invisible on the dark palette and unreachable by
any theme override.

No \`role="status"\`: a page full of skeletons would announce a dozen busy
regions. Put one \`aria-busy\` region around the area that is loading, which
is what the templates in this kit do.`,displayName:`Skeleton`,filePath:`/home/prow/go/src/github.com/kubermatic/ui-kit/packages/ui-kit/src/components/ui/skeleton.tsx`,methods:[],props:{},tags:{}}}catch{}try{a.displayName=`SkeletonText`,a.__docgenInfo={description:`SkeletonText — several lines, the last one short.

The short last line is the detail that makes it read as a paragraph rather
than as a stack of bars.`,displayName:`SkeletonText`,filePath:`/home/prow/go/src/github.com/kubermatic/ui-kit/packages/ui-kit/src/components/ui/skeleton.tsx`,methods:[],props:{lines:{defaultValue:{value:`3`},declarations:[{fileName:`ui-kit/packages/ui-kit/src/components/ui/skeleton.tsx`,name:`SkeletonTextProps`}],description:`Number of lines.`,name:`lines`,parent:{fileName:`ui-kit/packages/ui-kit/src/components/ui/skeleton.tsx`,name:`SkeletonTextProps`},required:!1,tags:{},type:{name:`number`}}},tags:{}}}catch{}})))()}export{a as n,s as r,i as t};