import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./utils-Dm4OyE3Q.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";function i({target:e=`main-content`,className:t,children:r=`Skip to content`,...i}){return(0,a.jsx)(`a`,{"data-slot":`skip-link`,href:`#${e}`,className:n(`sr-only font-sans text-sm font-medium`,`focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100`,`focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground`,`focus:outline-none focus:ring-[3px] focus:ring-ring/50`,t),...i,children:r})}var a;function o(){return(o=e((()=>{t(),a=r();try{i.displayName=`SkipLink`,i.__docgenInfo={description:`SkipLink — the first thing in the tab order.

A keyboard user landing on a page with a 30-item sidebar otherwise presses
Tab thirty times before reaching the content, on every navigation. WCAG 2.2
SC 2.4.1 asks for this and it is two elements.

Visually hidden until focused, rather than \`display: none\` — a hidden
element is not focusable, so the usual \`sr-only\` trick has to be undone on
\`:focus\`, which is what the utilities below do.

The target needs \`tabIndex={-1}\`, or the browser moves the *scroll* position
without moving focus and the next Tab continues from the skip link.
\`AppShell\` sets it on the content wrapper.`,displayName:`SkipLink`,filePath:`/home/prow/go/src/github.com/kubermatic/ui-kit/packages/ui-kit/src/components/ui/skip-link.tsx`,methods:[],props:{target:{defaultValue:{value:`main-content`},declarations:[{fileName:`ui-kit/packages/ui-kit/src/components/ui/skip-link.tsx`,name:`SkipLinkProps`}],description:"Id of the element to jump to, without the `#`.",name:`target`,parent:{fileName:`ui-kit/packages/ui-kit/src/components/ui/skip-link.tsx`,name:`SkipLinkProps`},required:!1,tags:{},type:{name:`string`}}},tags:{}}}catch{}})))()}export{o as n,i as t};