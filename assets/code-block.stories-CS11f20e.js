import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{Bt as n,Rt as r,zt as i}from"./iframe-BH6v6twT.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),a=t(),o={title:`Primitives/CodeBlock`,component:i,parameters:{docs:{description:{component:"A read-only block of YAML, JSON or a shell command. Not a highlighter and not an editor — an editable manifest wants Monaco or CodeMirror, which is a megabyte-scale dependency and does not belong in a primitives package. The `<pre>` is focusable so the keyboard can scroll it, which SC 2.1.1 requires and a `<pre>` does not give you for free."}}},args:{children:`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: billing
type: Opaque
stringData:
  username: app
  password: hunter2`,language:`yaml`}},s={},c={args:{copyable:!1,language:void 0,children:`kubectl get secrets -n billing`}},l={parameters:{controls:{disable:!0}},render:()=>(0,a.jsxs)(`p`,{className:`max-w-prose font-sans text-sm`,children:[`Set `,(0,a.jsx)(r,{children:`spec.refreshInterval`}),` to `,(0,a.jsx)(r,{children:`1h`}),` to reconcile the`,` `,(0,a.jsx)(r,{children:`ExternalSecret`}),` hourly.`]})},u={globals:{theme:`dark`},tags:[`!autodocs`]},d=[`Playground`,`WithoutCopy`,`Inline`,`PlaygroundDark`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    copyable: false,
    language: undefined,
    children: 'kubectl get secrets -n billing'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <p className="max-w-prose font-sans text-sm">
      Set <Code>spec.refreshInterval</Code> to <Code>1h</Code> to reconcile the{' '}
      <Code>ExternalSecret</Code> hourly.
    </p>
}`,...l.parameters?.docs?.source},description:{story:"`Code` is the inline form — a resource name, a field path, a flag.",...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  tags: ['!autodocs']
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as Inline,s as Playground,u as PlaygroundDark,c as WithoutCopy,d as __namedExportsOrder,o as default};