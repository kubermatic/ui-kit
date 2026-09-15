import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,r,t as i}from"./status-badge-CTg2LHIU.js";import{n as a}from"./variant-matrix-ZkcJTxA_.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{r(),o=t(),s=a({success:!0,warning:!0,error:!0,info:!0,pending:!0,neutral:!0}),c={title:`Data/StatusBadge`,component:i,parameters:{docs:{description:{component:'A resource\'s state, as a chip. Both products invented their own tone list and then hardcoded Tailwind palette colours (`bg-green-50 text-green-700`) that no theme can reach and nothing measures. The names here are about *meaning*, so a product mapping "Synced", "Ready" and "Available" all onto `success` keeps one visual language.\n\nThere is deliberately **no tinted variant.** The obvious design is a pale wash — `bg-success/10` with `text-success` — and it is not available, because an opacity tint composites to a colour outside the token set whose contrast nothing measures. `solid` is a measured surface/foreground pair and `outline` is a measured foreground on `--background`; a tint would only *look* like it was AA.'}}},args:{children:`Synced`,tone:`success`},argTypes:{tone:{control:`select`,options:s}}},l={},u={parameters:{controls:{disable:!0}},render:()=>(0,o.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,o.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:s.map(e=>(0,o.jsx)(i,{tone:e,dot:!0,children:e},e))}),(0,o.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:s.map(e=>(0,o.jsx)(i,{tone:e,variant:`outline`,dot:!0,children:e},e))})]})},d={parameters:{controls:{disable:!0}},render:()=>(0,o.jsx)(`div`,{className:`flex flex-col gap-2 font-sans text-sm`,children:s.map(e=>(0,o.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(n,{tone:e,label:e}),e]},e))})},f={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:u.render},p={globals:{theme:`dark`},tags:[`!autodocs`],parameters:{controls:{disable:!0}},render:d.render},m=[`Playground`,`Tones`,`Dots`,`TonesDark`,`DotsDark`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map(tone => <StatusBadge key={tone} tone={tone} dot>
            {tone}
          </StatusBadge>)}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map(tone => <StatusBadge key={tone} tone={tone} variant="outline" dot>
            {tone}
          </StatusBadge>)}
      </div>
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-2 font-sans text-sm">
      {TONES.map(tone => <span key={tone} className="flex items-center gap-2">
          <StatusDot tone={tone} label={tone} />
          {tone}
        </span>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:"The compact indicator, for a table cell or a picker row. Every tone here\nclears 3:1 against `--background` in both palettes — which is why `success`\nand `warning` are the darkened roles rather than brand Teal and Honey: those\nmeasure 1.77:1 and 1.87:1 on white, so as a bare dot on a light page they\nwould be decoration that happens to be invisible.",...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
  render: Dots.render
}`,...p.parameters?.docs?.source}}}})))()}h();export{d as Dots,p as DotsDark,l as Playground,u as Tones,f as TonesDark,m as __namedExportsOrder,c as default};