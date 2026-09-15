import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./skip-link--97EqECP.js";var i,a,o,s;function c(){return(c=e((()=>{n(),i=t(),a={title:`App Frame/SkipLink`,component:r,parameters:{docs:{description:{component:"The first thing in the tab order. A keyboard user landing on a page with a 30-item sidebar otherwise presses Tab thirty times before reaching the content, on every navigation. WCAG 2.2 SC 2.4.1 asks for this and it is two elements.\n\nVisually hidden until focused, rather than `display: none` — a hidden element is not focusable, so the usual `sr-only` has to be undone on `:focus`. The target needs `tabIndex={-1}` or the browser moves the *scroll* position without moving focus; `AppShell` sets it on the main region for you.\n\n**Press Tab in the canvas below to see it.**"}}}},o={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsx)(r,{target:`demo-content`}),(0,i.jsx)(`p`,{className:`font-sans text-sm text-muted-foreground`,children:`Press Tab. The link appears in the top-left corner.`}),(0,i.jsx)(`div`,{id:`demo-content`,tabIndex:-1,className:`rounded-md border border-border p-4 font-sans text-sm`,children:`The main region. Focusable as a target only — it never appears in the tab order.`})]})},s=[`Playground`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <SkipLink target="demo-content" />
      <p className="font-sans text-sm text-muted-foreground">
        Press Tab. The link appears in the top-left corner.
      </p>
      <div id="demo-content" tabIndex={-1} className="rounded-md border border-border p-4 font-sans text-sm">
        The main region. Focusable as a target only — it never appears in the tab order.
      </div>
    </div>
}`,...o.parameters?.docs?.source}}}})))()}c();export{o as Playground,s as __namedExportsOrder,a as default};