import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{r as n,t as r}from"./button-DkUjhKwZ.js";import{_t as i,gt as a}from"./iframe-BH6v6twT.js";import{n as o}from"./variant-matrix-ZkcJTxA_.js";var s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{i(),n(),s=t(),c=o({info:!0,success:!0,warning:!0,error:!0}),l={title:`Feedback/Alert`,component:a,parameters:{docs:{description:{component:'An inline message about the page, not about a field. `role="alert"` on the error and warning tones only: `alert` is an *assertive* live region — it interrupts the screen reader mid-sentence, which is correct for "Saving failed" and rude for "Your changes were saved". The quiet tones get `role="status"`.\n\nBoth products render their error banner with no role at all, so a failure that appears after an async call is never announced: the user presses Save and hears nothing.\n\nOutlined rather than tinted, for the reason `StatusBadge` documents — the tone is carried by the border and the icon, both measured against `--background`, and the body text stays at `--foreground`, i.e. 18.9:1.'}}},args:{tone:`info`,title:`Reconciliation is paused`,children:`Resume it to resume syncing.`},argTypes:{tone:{control:`select`,options:c}}},u={render:e=>(0,s.jsx)(`div`,{className:`w-[36rem]`,children:(0,s.jsx)(a,{...e})})},d={parameters:{controls:{disable:!0}},render:()=>(0,s.jsxs)(`div`,{className:`flex w-[36rem] flex-col gap-3`,children:[(0,s.jsx)(a,{tone:`info`,title:`Reconciliation is paused`,children:`Resume it to resume syncing.`}),(0,s.jsx)(a,{tone:`success`,title:`Secret created`,children:`db-credentials is now available in the billing namespace.`}),(0,s.jsx)(a,{tone:`warning`,title:`Provider is rate-limiting`,children:`Backing off; the next attempt is in 30 seconds.`}),(0,s.jsx)(a,{tone:`error`,title:`Could not reach the provider`,children:`dial tcp 10.0.4.2:8200: connect: connection refused`})]})},f={parameters:{controls:{disable:!0}},render:()=>(0,s.jsx)(`div`,{className:`w-[36rem]`,children:(0,s.jsx)(a,{tone:`error`,title:`Could not load the secret stores`,action:(0,s.jsx)(r,{variant:`outline`,size:`sm`,children:`Retry`}),children:`The API returned 503.`})})},p={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:d.render},m=[`Playground`,`Tones`,`WithAction`,`TonesDark`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="w-[36rem]">
      <Alert {...args} />
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex w-[36rem] flex-col gap-3">
      <Alert tone="info" title="Reconciliation is paused">
        Resume it to resume syncing.
      </Alert>
      <Alert tone="success" title="Secret created">
        db-credentials is now available in the billing namespace.
      </Alert>
      <Alert tone="warning" title="Provider is rate-limiting">
        Backing off; the next attempt is in 30 seconds.
      </Alert>
      <Alert tone="error" title="Could not reach the provider">
        dial tcp 10.0.4.2:8200: connect: connection refused
      </Alert>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="w-[36rem]">
      <Alert tone="error" title="Could not load the secret stores" action={<Button variant="outline" size="sm">
            Retry
          </Button>}>
        The API returned 503.
      </Alert>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  },
  render: Tones.render
}`,...p.parameters?.docs?.source}}}})))()}h();export{u as Playground,d as Tones,p as TonesDark,f as WithAction,m as __namedExportsOrder,l as default};