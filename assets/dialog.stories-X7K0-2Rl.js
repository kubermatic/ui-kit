import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{s as i,t as a}from"./field-Cai4h5yn.js";import{n as o,t as s}from"./input-DbSNTTLZ.js";import{ct as c,dt as l,ft as u,ht as d,lt as f,mt as p,ot as m,pt as h,st as g,ut as _}from"./iframe-BH6v6twT.js";var v,y,b,x,S;function C(){return(C=e((()=>{n(),d(),i(),o(),v=t(),y={title:`Overlays/Dialog`,component:m,parameters:{layout:`centered`,docs:{description:{component:'Base UI owns the parts that are easy to get wrong and impossible to notice in manual testing: the focus trap, restoring focus to the trigger on close, `aria-modal`, and marking the rest of the page inert so a screen reader cannot wander out of the dialog while it is open.\n\n`DialogTitle` and `DialogDescription` are not decoration — they are what `aria-labelledby` and `aria-describedby` point at, wired automatically by being inside the popup. A dialog rendered without a `DialogTitle` is announced as "dialog" and nothing else, which is the state of several existing ones.\n\nFor a confirmation, use `ConfirmDialog`: it is an *alert* dialog, which does not close on an outside click.'}}}},b={render:()=>(0,v.jsxs)(m,{children:[(0,v.jsx)(p,{render:(0,v.jsx)(r,{children:`New external secret`})}),(0,v.jsxs)(f,{children:[(0,v.jsxs)(u,{children:[(0,v.jsx)(h,{children:`New external secret`}),(0,v.jsx)(_,{children:`It will be created in the namespace selected above.`})]}),(0,v.jsxs)(g,{className:`flex flex-col gap-4 py-2`,children:[(0,v.jsx)(a,{label:`Name`,required:!0,children:(0,v.jsx)(s,{placeholder:`db-credentials`,required:!0})}),(0,v.jsx)(a,{label:`Remote key`,description:`The path in the provider.`,children:(0,v.jsx)(s,{placeholder:`secret/data/billing/db`})})]}),(0,v.jsxs)(l,{children:[(0,v.jsx)(c,{render:(0,v.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,v.jsx)(r,{children:`Create`})]})]})]})},x={render:()=>(0,v.jsx)(`div`,{className:`flex gap-2`,children:[`sm`,`default`,`lg`].map(e=>(0,v.jsxs)(m,{children:[(0,v.jsx)(p,{render:(0,v.jsx)(r,{variant:`outline`,children:e})}),(0,v.jsxs)(f,{size:e,children:[(0,v.jsxs)(u,{children:[(0,v.jsxs)(h,{children:[`Size: `,e]}),(0,v.jsx)(_,{children:`The width steps up with the content.`})]}),(0,v.jsx)(l,{children:(0,v.jsx)(c,{render:(0,v.jsx)(r,{variant:`outline`,children:`Close`})})})]})]},e))})},S=[`Playground`,`Sizes`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger render={<Button>New external secret</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New external secret</DialogTitle>
          <DialogDescription>It will be created in the namespace selected above.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4 py-2">
          <Field label="Name" required>
            <Input placeholder="db-credentials" required />
          </Field>
          <Field label="Remote key" description="The path in the provider.">
            <Input placeholder="secret/data/billing/db" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">
      {(['sm', 'default', 'lg'] as const).map(size => <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline">{size}</Button>} />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size: {size}</DialogTitle>
              <DialogDescription>The width steps up with the content.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>)}
    </div>
}`,...x.parameters?.docs?.source},description:{story:'`size="full"` is for an editor or a graph — the cases that want the full screen.',...x.parameters?.docs?.description}}}})))()}C();export{b as Playground,x as Sizes,S as __namedExportsOrder,y as default};