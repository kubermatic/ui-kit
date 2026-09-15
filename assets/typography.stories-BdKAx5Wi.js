import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./text-1WvMJMha.js";var i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i=t(),a={title:`Foundations/Typography`,component:r,parameters:{docs:{description:{component:'Three faces, per the brand document: **Ubuntu Bold** for headlines, **Roboto Bold** for sublines, **Roboto** for general text. Both headline and subline levels are written in Title Case — as an authoring convention, not a `text-transform`, since `capitalize` would also upper-case articles ("Deploy A Cluster").'}}},args:{children:`The Cluster Is Provisioning`},argTypes:{variant:{control:`select`,options:[`h1`,`h2`,`h3`,`subline`,`body`,`small`,`code`]},tone:{control:`select`,options:[`default`,`muted`,`heading`,`primary`,`destructive`]},weight:{control:`select`,options:[void 0,`normal`,`medium`,`bold`]},as:{table:{disable:!0}}}},o={},s={parameters:{controls:{disable:!0}},render:()=>(0,i.jsxs)(`div`,{className:`max-w-2xl space-y-4`,children:[(0,i.jsx)(r,{variant:`h1`,children:`Manage Kubernetes At Scale`}),(0,i.jsx)(r,{variant:`subline`,children:`Ubuntu Bold Above, Roboto Bold Here`}),(0,i.jsx)(r,{variant:`body`,children:`General text is set in Roboto. It carries the explanatory copy — the paragraphs that do the actual work of a page — and sits at a comfortable reading measure.`}),(0,i.jsx)(r,{variant:`h2`,children:`A Second-Level Headline`}),(0,i.jsxs)(r,{variant:`body`,children:[`Headlines use Ubuntu Bold and take the `,(0,i.jsx)(`code`,{className:`font-mono`,children:`heading`}),` colour role, which is Aegean on light backgrounds.`]}),(0,i.jsx)(r,{variant:`h3`,children:`A Third-Level Headline`}),(0,i.jsx)(r,{variant:`small`,tone:`muted`,children:`Small muted text, for hints and secondary metadata.`}),(0,i.jsx)(r,{variant:`code`,children:`kubectl get clusters`})]})},c={parameters:{controls:{disable:!0}},render:()=>(0,i.jsxs)(`div`,{className:`space-y-6`,children:[(0,i.jsxs)(`div`,{className:`space-y-1`,children:[(0,i.jsx)(r,{variant:`small`,tone:`muted`,className:`font-mono text-xs`,children:`font-display · Ubuntu Bold · headlines`}),(0,i.jsx)(r,{variant:`h2`,children:`Deploy A Cluster In Minutes`})]}),(0,i.jsxs)(`div`,{className:`space-y-1`,children:[(0,i.jsx)(r,{variant:`small`,tone:`muted`,className:`font-mono text-xs`,children:`font-sans bold · Roboto Bold · sublines`}),(0,i.jsx)(r,{variant:`subline`,children:`Built For Platform Teams`})]}),(0,i.jsxs)(`div`,{className:`space-y-1`,children:[(0,i.jsx)(r,{variant:`small`,tone:`muted`,className:`font-mono text-xs`,children:`font-sans · Roboto · general text`}),(0,i.jsx)(r,{variant:`body`,children:`Roboto at 400 handles body copy, table cells, form labels and everything else that is not a headline or a subline.`})]})]})},l={parameters:{controls:{disable:!0}},render:()=>(0,i.jsxs)(`div`,{className:`space-y-2`,children:[(0,i.jsx)(r,{tone:`default`,children:`Default — foreground`}),(0,i.jsx)(r,{tone:`heading`,children:`Heading — Aegean`}),(0,i.jsx)(r,{tone:`primary`,children:`Primary — Cerulean, corrected to 4.65:1`}),(0,i.jsx)(r,{tone:`muted`,children:`Muted — secondary metadata`}),(0,i.jsx)(r,{tone:`destructive`,children:`Destructive — Maroon`})]})},u={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:l.render},d=[`Playground`,`Hierarchy`,`Faces`,`Tones`,`TonesDark`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="max-w-2xl space-y-4">
      <Text variant="h1">Manage Kubernetes At Scale</Text>
      <Text variant="subline">Ubuntu Bold Above, Roboto Bold Here</Text>
      <Text variant="body">
        General text is set in Roboto. It carries the explanatory copy — the paragraphs that do the
        actual work of a page — and sits at a comfortable reading measure.
      </Text>
      <Text variant="h2">A Second-Level Headline</Text>
      <Text variant="body">
        Headlines use Ubuntu Bold and take the <code className="font-mono">heading</code> colour
        role, which is Aegean on light backgrounds.
      </Text>
      <Text variant="h3">A Third-Level Headline</Text>
      <Text variant="small" tone="muted">
        Small muted text, for hints and secondary metadata.
      </Text>
      <Text variant="code">kubectl get clusters</Text>
    </div>
}`,...s.parameters?.docs?.source},description:{story:`The full hierarchy, in the order it would appear on a page.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="space-y-6">
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          font-display · Ubuntu Bold · headlines
        </Text>
        <Text variant="h2">Deploy A Cluster In Minutes</Text>
      </div>
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          font-sans bold · Roboto Bold · sublines
        </Text>
        <Text variant="subline">Built For Platform Teams</Text>
      </div>
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          font-sans · Roboto · general text
        </Text>
        <Text variant="body">
          Roboto at 400 handles body copy, table cells, form labels and everything else that is not
          a headline or a subline.
        </Text>
      </div>
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Which face each variant actually resolves to.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="space-y-2">
      <Text tone="default">Default — foreground</Text>
      <Text tone="heading">Heading — Aegean</Text>
      <Text tone="primary">Primary — Cerulean, corrected to 4.65:1</Text>
      <Text tone="muted">Muted — secondary metadata</Text>
      <Text tone="destructive">Destructive — Maroon</Text>
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  globals: {
    theme: 'dark'
  },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  },
  render: Tones.render
}`,...u.parameters?.docs?.source}}}})))()}f();export{c as Faces,s as Hierarchy,o as Playground,l as Tones,u as TonesDark,d as __namedExportsOrder,a as default};