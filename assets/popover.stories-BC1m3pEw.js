import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{n as i,t as a}from"./createLucideIcon-CFOFi7Up.js";import{s as o,t as s}from"./field-Cai4h5yn.js";import{n as c,t as l}from"./input-DbSNTTLZ.js";import{$ as u,Q as d,Z as f,et as p,nt as m,rt as h,tt as g}from"./iframe-BH6v6twT.js";var _,v;function y(){return(y=e((()=>{i(),_={name:`funnel`,size:24,node:[[`path`,{d:`M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z`,key:`sc7q7i`}]],aliases:[`filter`]},_.node,v=a(_)})))()}var b,x,S,C;function w(){return(w=e((()=>{y(),n(),o(),c(),h(),b=t(),x={title:`Overlays/Popover`,component:f,parameters:{layout:`centered`,docs:{description:{component:"An anchored panel with interactive content. Distinct from `Tooltip`, which is a description and cannot hold anything focusable, and from `Menu`, which is a list of commands with arrow-key navigation. This is the one that holds a form — An organisation selector and a metadata filter are both popovers."}}}},S={render:()=>(0,b.jsxs)(f,{children:[(0,b.jsx)(m,{render:(0,b.jsxs)(r,{variant:`outline`,children:[(0,b.jsx)(v,{}),`Filter by label`]})}),(0,b.jsx)(u,{align:`start`,className:`w-80`,children:(0,b.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,b.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,b.jsx)(g,{children:`Filter by label`}),(0,b.jsx)(p,{children:`Matches are combined with AND.`})]}),(0,b.jsx)(s,{label:`Key`,children:(0,b.jsx)(l,{placeholder:`app`})}),(0,b.jsx)(s,{label:`Value`,children:(0,b.jsx)(l,{placeholder:`billing`})}),(0,b.jsxs)(`div`,{className:`flex justify-end gap-2`,children:[(0,b.jsx)(d,{render:(0,b.jsx)(r,{variant:`outline`,size:`sm`,children:`Cancel`})}),(0,b.jsx)(r,{size:`sm`,children:`Apply`})]})]})})]})},C=[`Playground`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger render={<Button variant="outline">
            <Filter />
            Filter by label
          </Button>} />
      <PopoverContent align="start" className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <PopoverTitle>Filter by label</PopoverTitle>
            <PopoverDescription>Matches are combined with AND.</PopoverDescription>
          </div>
          <Field label="Key">
            <Input placeholder="app" />
          </Field>
          <Field label="Value">
            <Input placeholder="billing" />
          </Field>
          <div className="flex justify-end gap-2">
            <PopoverClose render={<Button variant="outline" size="sm">
                  Cancel
                </Button>} />
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as Playground,C as __namedExportsOrder,x as default};