import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{n as i,t as a}from"./info-C8d40Wtd.js";import{n as o,t as s}from"./refresh-cw-mDHRkEFK.js";import{o as c,r as l,t as u}from"./tooltip-7h247ucV.js";var d,f,p,m,h;function g(){return(g=e((()=>{i(),o(),n(),c(),d=t(),f={title:`Overlays/Tooltip`,component:u,parameters:{layout:`centered`,docs:{description:{component:'A tooltip is *supplementary* — a description, not a label. It must never be the only place information exists, because it is unreachable by touch: an icon button still needs its own `aria-label` as well.\n\nBase UI renders the popup as `role="presentation"` and sets no `aria-describedby`, which is a defensible default but leaves the *content* unreachable to a screen reader. This wrapper adds `role="tooltip"` and points the trigger\'s `aria-describedby` at it, because the case that matters most is the one where the tooltip says something the label does not — "disabled because you lack permission", a truncated name in full.\n\nThe open delay lives on `TooltipProvider`, not on each tooltip: a per-tooltip delay means a row of icon buttons where each one opens on its own schedule.'}}},args:{content:`Re-reads the provider now`,children:null}},p={render:()=>(0,d.jsx)(l,{children:(0,d.jsx)(u,{content:`Re-reads the provider now`,children:(0,d.jsx)(r,{variant:`outline`,size:`icon`,"aria-label":`Force sync`,children:(0,d.jsx)(s,{})})})})},m={render:()=>(0,d.jsx)(l,{children:(0,d.jsx)(`div`,{className:`flex gap-3`,children:[`top`,`right`,`bottom`,`left`].map(e=>(0,d.jsx)(u,{content:`Opens ${e}`,side:e,children:(0,d.jsx)(r,{variant:`outline`,size:`icon`,"aria-label":`Info, ${e}`,children:(0,d.jsx)(a,{})})},e))})})},h=[`Playground`,`Sides`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <TooltipProvider>
      <Tooltip content="Re-reads the provider now">
        <Button variant="outline" size="icon" aria-label="Force sync">
          <RefreshCw />
        </Button>
      </Tooltip>
    </TooltipProvider>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <TooltipProvider>
      <div className="flex gap-3">
        {(['top', 'right', 'bottom', 'left'] as const).map(side => <Tooltip key={side} content={\`Opens \${side}\`} side={side}>
            <Button variant="outline" size="icon" aria-label={\`Info, \${side}\`}>
              <Info />
            </Button>
          </Tooltip>)}
      </div>
    </TooltipProvider>
}`,...m.parameters?.docs?.source}}}})))()}g();export{p as Playground,m as Sides,h as __namedExportsOrder,f as default};