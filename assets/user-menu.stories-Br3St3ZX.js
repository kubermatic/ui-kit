import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n,o as r,s as i}from"./menu-C5Lh23eq.js";import{d as a,o,s,u as c}from"./app-fixtures-HbU67Au5.js";import{n as l,t as u}from"./key-round-DljD0rwp.js";import{M as d,j as f}from"./iframe-BH6v6twT.js";var p,m,h,g,_,v,y;function b(){return(b=e((()=>{l(),a(),s(),n(),d(),p=t(),m={title:`App Frame/UserMenu`,component:f,parameters:{layout:`centered`,docs:{description:{component:`Who is signed in, and how to stop being signed in. Renders nothing when there is no user, so a product with authentication disabled — which one product supports — gets no empty affordance rather than an avatar of nobody.

The trigger's accessible name is the person, not "User menu": on a dashboard where people hold an admin session and a normal one, which account you are about to sign out of is the whole question.`}}},args:{user:o,onSignOut:()=>{}}},h={},g={args:{showName:!0}},_={args:{children:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(i,{render:(0,p.jsx)(`a`,{href:`#settings`}),children:[(0,p.jsx)(c,{}),`Settings`]}),(0,p.jsxs)(r,{children:[(0,p.jsx)(u,{}),`API tokens`]})]})}},v={args:{user:void 0},render:e=>(0,p.jsxs)(`div`,{className:`font-sans text-sm text-muted-foreground`,children:[(0,p.jsx)(f,{...e}),`(nothing rendered)`]})},y=[`Playground`,`WithName`,`WithExtraItems`,`NoUser`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    showName: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <MenuLinkItem render={<a href="#settings" />}>
          <Settings />
          Settings
        </MenuLinkItem>
        <MenuItem>
          <KeyRound />
          API tokens
        </MenuItem>
      </>
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    user: undefined
  },
  render: args => <div className="font-sans text-sm text-muted-foreground">
      <UserMenu {...args} />
      (nothing rendered)
    </div>
}`,...v.parameters?.docs?.source},description:{story:`Authentication disabled: nothing at all.`,...v.parameters?.docs?.description}}}})))()}b();export{v as NoUser,h as Playground,_ as WithExtraItems,g as WithName,y as __namedExportsOrder,m as default};