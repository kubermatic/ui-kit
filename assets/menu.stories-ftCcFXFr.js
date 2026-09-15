import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{r,t as i}from"./button-DkUjhKwZ.js";import{a,c as o,d as s,f as c,h as l,i as u,l as d,m as f,n as p,o as m,p as h,r as g,s as _,t as v,u as y}from"./menu-C5Lh23eq.js";import{n as b,t as x}from"./ellipsis-BnrCXni2.js";var S,C,w,T,E,D;function O(){return(O=e((()=>{b(),S=t(),r(),l(),C=n(),w={title:`Overlays/Menu`,component:v,parameters:{layout:`centered`,docs:{description:{component:'A list of commands, anchored to a trigger — the row-actions "⋯" button on every table in both products. Base UI gives it the parts that make it a menu rather than a list of buttons in a box: arrow keys move between items, typing jumps to one, Escape closes and returns focus to the trigger, and the items are `role="menuitem"` inside a `role="menu"` so the count is announced.\n\nUse `MenuLinkItem` for anything that navigates. A `MenuItem` with an `onClick` that calls `router.push` is not a link: it cannot be middle-clicked, copied, or opened in a new tab.'}}}},T={render:()=>(0,C.jsxs)(v,{children:[(0,C.jsx)(f,{render:(0,C.jsx)(i,{variant:`ghost`,size:`icon`,"aria-label":`Actions for db-credentials`,children:(0,C.jsx)(x,{})})}),(0,C.jsxs)(g,{children:[(0,C.jsxs)(u,{children:[(0,C.jsx)(a,{children:`db-credentials`}),(0,C.jsx)(m,{children:`Force sync`}),(0,C.jsx)(_,{render:(0,C.jsx)(`a`,{href:`#edit`}),children:`Edit`})]}),(0,C.jsx)(y,{}),(0,C.jsx)(m,{variant:`destructive`,children:`Delete`})]})]})},E={render:function(){let[e,t]=(0,S.useState)(!0),[n,r]=(0,S.useState)(`name`);return(0,C.jsxs)(v,{children:[(0,C.jsx)(f,{render:(0,C.jsx)(i,{variant:`outline`,children:`View`})}),(0,C.jsxs)(g,{align:`start`,className:`min-w-56`,children:[(0,C.jsxs)(u,{children:[(0,C.jsx)(a,{children:`Columns`}),(0,C.jsx)(p,{checked:e,onCheckedChange:t,closeOnClick:!1,children:`Namespace`})]}),(0,C.jsx)(y,{}),(0,C.jsxs)(u,{children:[(0,C.jsx)(a,{children:`Sort by`}),(0,C.jsxs)(o,{value:n,onValueChange:e=>r(e),children:[(0,C.jsx)(d,{value:`name`,children:`Name`}),(0,C.jsx)(d,{value:`age`,children:`Age`})]})]}),(0,C.jsx)(y,{}),(0,C.jsxs)(s,{children:[(0,C.jsx)(h,{children:`Copy as`}),(0,C.jsxs)(c,{children:[(0,C.jsx)(m,{children:`YAML`}),(0,C.jsx)(m,{children:`JSON`})]})]})]})]})}},D=[`RowActions`,`WithSelectionAndSubmenu`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <Menu>
      <MenuTrigger render={<Button variant="ghost" size="icon" aria-label="Actions for db-credentials">
            <MoreHorizontal />
          </Button>} />
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>db-credentials</MenuGroupLabel>
          <MenuItem>Force sync</MenuItem>
          <MenuLinkItem render={<a href="#edit" />}>Edit</MenuLinkItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="destructive">Delete</MenuItem>
      </MenuContent>
    </Menu>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: function SelectionStory() {
    const [showNamespace, setShowNamespace] = useState(true);
    const [sort, setSort] = useState('name');
    return <Menu>
        <MenuTrigger render={<Button variant="outline">View</Button>} />
        <MenuContent align="start" className="min-w-56">
          <MenuGroup>
            <MenuGroupLabel>Columns</MenuGroupLabel>
            <MenuCheckboxItem checked={showNamespace} onCheckedChange={setShowNamespace} closeOnClick={false}>
              Namespace
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Sort by</MenuGroupLabel>
            <MenuRadioGroup value={sort} onValueChange={value => setSort(value as string)}>
              <MenuRadioItem value="name">Name</MenuRadioItem>
              <MenuRadioItem value="age">Age</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>Copy as</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>YAML</MenuItem>
              <MenuItem>JSON</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>;
  }
}`,...E.parameters?.docs?.source}}}})))()}O();export{T as RowActions,E as WithSelectionAndSubmenu,D as __namedExportsOrder,w as default};