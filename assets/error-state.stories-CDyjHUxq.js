import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{r as i,t as a}from"./error-state-DbBGnOFa.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i(),o=t(),s={title:`Feedback/ErrorState`,component:a,parameters:{docs:{description:{component:'A whole region failed to load. The counterpart to `Alert tone="error"`, which is for a message *beside* content that is still there — this replaces the content.\n\n`role="alert"`, so it is announced when it replaces a spinner, and the retry is a real button rather than the clickable div both products use. `error` accepts anything a `catch` or a query hook produces: a string, an `Error`, or the plain `{ message }` object axios throws.'}}},args:{error:Error(`dial tcp 10.0.4.2:8200: connect: connection refused`)}},c={args:{onRetry:()=>{}},render:e=>(0,o.jsx)(`div`,{className:`w-[36rem]`,children:(0,o.jsx)(a,{...e})})},l={args:{title:`Could not reach the cluster`,onRetry:()=>{},action:(0,o.jsx)(r,{variant:`ghost`,size:`sm`,children:`Choose another cluster`})},render:e=>(0,o.jsx)(`div`,{className:`w-[36rem]`,children:(0,o.jsx)(a,{...e})})},u={globals:{theme:`dark`},tags:[`!autodocs`],args:c.args,render:c.render},d=[`Playground`,`WithExtraAction`,`PlaygroundDark`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    onRetry: () => {}
  },
  render: args => <div className="w-[36rem]">
      <ErrorState {...args} />
    </div>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Could not reach the cluster',
    onRetry: () => {},
    action: <Button variant="ghost" size="sm">
        Choose another cluster
      </Button>
  },
  render: args => <div className="w-[36rem]">
      <ErrorState {...args} />
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  args: Playground.args,
  render: Playground.render
}`,...u.parameters?.docs?.source}}}})))()}f();export{c as Playground,u as PlaygroundDark,l as WithExtraAction,d as __namedExportsOrder,s as default};