import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{r,t as i}from"./button-DkUjhKwZ.js";import{n as a,t as o}from"./trash-cZkYgweg.js";import{at as s,it as c}from"./iframe-BH6v6twT.js";var l,u,d,f,p,m,h;function g(){return(g=e((()=>{a(),l=t(),r(),s(),u=n(),d={title:`Overlays/ConfirmDialog`,component:c,parameters:{layout:`centered`,docs:{description:{component:'Base UI\'s **AlertDialog**, not `Dialog`: an alert dialog does not close on an outside click or on Escape, and its role is `alertdialog`, so the description is announced immediately rather than only when focus reaches it. For "delete this cluster" that is the difference between a confirmation and a speed bump — A plain `ConfirmModal` dialog lets a stray backdrop click dismisses it, which trains people to click through.\n\nThe typed guard is *disabled-until-match* rather than validate-on-submit: leaving the confirm button enabled and then rejecting the click means the destructive action is one keystroke away from a mistyped name.'}}},args:{open:!0,onOpenChange:()=>{},onConfirm:()=>{},title:`Delete db-credentials?`}},f={args:{description:`The Kubernetes Secret it manages will be deleted too.`,confirmLabel:`Delete`,tone:`destructive`,confirmIcon:(0,u.jsx)(o,{})},render:function(e){let[t,n]=(0,l.useState)(!1);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{variant:`destructive`,onClick:()=>n(!0),children:`Delete`}),(0,u.jsx)(c,{...e,open:t,onOpenChange:n,onConfirm:()=>n(!1)})]})}},p={args:{title:`Delete cluster prod-eu-1?`,description:`Every ExternalSecret reconciling against it will stop.`,confirmLabel:`Delete cluster`,tone:`destructive`,verification:{value:`prod-eu-1`}},render:function(e){let[t,n]=(0,l.useState)(!1);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{variant:`destructive`,onClick:()=>n(!0),children:`Delete cluster`}),(0,u.jsx)(c,{...e,open:t,onOpenChange:n,onConfirm:()=>n(!1)})]})}},m={args:{confirmLabel:`Deleting…`,tone:`destructive`,busy:!0},render:function(e){let[t,n]=(0,l.useState)(!1);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{variant:`destructive`,onClick:()=>n(!0),children:`Delete`}),(0,u.jsx)(c,{...e,open:t,onOpenChange:n})]})}},h=[`Playground`,`WithTypedConfirmation`,`Busy`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    description: 'The Kubernetes Secret it manages will be deleted too.',
    confirmLabel: 'Delete',
    tone: 'destructive',
    confirmIcon: <Trash2 />
  },
  render: function PlaygroundStory(args) {
    const [open, setOpen] = useState(false);
    return <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} onConfirm={() => setOpen(false)} />
      </>;
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Delete cluster prod-eu-1?',
    description: 'Every ExternalSecret reconciling against it will stop.',
    confirmLabel: 'Delete cluster',
    tone: 'destructive',
    verification: {
      value: 'prod-eu-1'
    }
  },
  render: function TypedStory(args) {
    const [open, setOpen] = useState(false);
    return <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete cluster
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} onConfirm={() => setOpen(false)} />
      </>;
  }
}`,...p.parameters?.docs?.source},description:{story:`The "type the name to delete it" guard, for anything irreversible.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    confirmLabel: 'Deleting…',
    tone: 'destructive',
    busy: true
  },
  render: function BusyStory(args) {
    const [open, setOpen] = useState(false);
    return <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>;
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Busy,f as Playground,p as WithTypedConfirmation,h as __namedExportsOrder,d as default};