import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{bt as n,vt as r,yt as i}from"./iframe-BH6v6twT.js";var a,o,s,c,l;function u(){return(u=e((()=>{n(),a=t(),o={title:`Data/Timeline`,component:r,parameters:{docs:{description:{component:"A chronological list of events — a sync history, both products' Kubernetes event lists. An `<ol>`, because the order is the content: reversed chronology is a claim about the data, and a `<ul>` does not make it.\n\nThe connecting line is drawn per item rather than as a rail on the container, so an item of any height connects to the next one and the last item's line stops rather than dangling."}}}},s={render:()=>(0,a.jsx)(`div`,{className:`w-[32rem]`,children:(0,a.jsxs)(r,{children:[(0,a.jsxs)(i,{tone:`success`,title:`Synced`,timestamp:`2 minutes ago`,children:[`2 keys written to `,(0,a.jsx)(`span`,{className:`font-mono`,children:`billing/db-credentials`}),`.`]}),(0,a.jsx)(i,{tone:`warning`,title:`Retried`,timestamp:`18 minutes ago`,children:`Provider returned 429; backing off for 30s.`}),(0,a.jsx)(i,{tone:`error`,title:`Sync failed`,timestamp:`1 hour ago`,children:`dial tcp 10.0.4.2:8200: connect: connection refused`}),(0,a.jsx)(i,{tone:`neutral`,title:`Created`,timestamp:`3 days ago`})]})})},c={globals:{theme:`dark`},tags:[`!autodocs`],render:s.render},l=[`Playground`,`PlaygroundDark`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[32rem]">
      <Timeline>
        <TimelineItem tone="success" title="Synced" timestamp="2 minutes ago">
          2 keys written to <span className="font-mono">billing/db-credentials</span>.
        </TimelineItem>
        <TimelineItem tone="warning" title="Retried" timestamp="18 minutes ago">
          Provider returned 429; backing off for 30s.
        </TimelineItem>
        <TimelineItem tone="error" title="Sync failed" timestamp="1 hour ago">
          dial tcp 10.0.4.2:8200: connect: connection refused
        </TimelineItem>
        <TimelineItem tone="neutral" title="Created" timestamp="3 days ago" />
      </Timeline>
    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs'],
  render: Playground.render
}`,...c.parameters?.docs?.source}}}})))()}u();export{s as Playground,c as PlaygroundDark,l as __namedExportsOrder,o as default};