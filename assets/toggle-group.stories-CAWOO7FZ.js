import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./createLucideIcon-CFOFi7Up.js";import{At as a,Ot as o,kt as s}from"./iframe-BH6v6twT.js";var c,l;function u(){return(u=e((()=>{r(),c={name:`layout-grid`,size:24,node:[[`rect`,{width:`7`,height:`7`,x:`3`,y:`3`,rx:`1`,key:`1g98yp`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`3`,rx:`1`,key:`6d4xhi`}],[`rect`,{width:`7`,height:`7`,x:`14`,y:`14`,rx:`1`,key:`nxv5o0`}],[`rect`,{width:`7`,height:`7`,x:`3`,y:`14`,rx:`1`,key:`1bb6yr`}]]},c.node,l=i(c)})))()}var d,f;function p(){return(p=e((()=>{r(),d={name:`list`,size:24,node:[[`path`,{d:`M3 5h.01`,key:`18ugdj`}],[`path`,{d:`M3 12h.01`,key:`nlz23k`}],[`path`,{d:`M3 19h.01`,key:`noohij`}],[`path`,{d:`M8 5h13`,key:`1pao27`}],[`path`,{d:`M8 12h13`,key:`1za7za`}],[`path`,{d:`M8 19h13`,key:`m83p4d`}]]},d.node,f=i(d)})))()}var m,h;function g(){return(g=e((()=>{r(),m={name:`rows-3`,size:24,node:[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}],[`path`,{d:`M21 9H3`,key:`1338ky`}],[`path`,{d:`M21 15H3`,key:`9uk58r`}]],aliases:[`panels-top-bottom`]},m.node,h=i(m)})))()}var _,v,y,b,x,S;function C(){return(C=e((()=>{u(),p(),g(),_=t(),a(),v=n(),y={title:`Forms/ToggleGroup`,component:o,parameters:{layout:`centered`,docs:{description:{component:"A segmented control, for view switches: table/grid, light/dark/system, YAML/form. Distinct from `Switch`, which changes a setting — this changes a selection, and Base UI gives it the roving-tabindex behaviour that implies: one tab stop for the group, arrow keys within it."}}}},b={render:function(){let[e,t]=(0,_.useState)([`table`]);return(0,v.jsxs)(o,{value:e,onValueChange:t,multiple:!1,"aria-label":`View`,children:[(0,v.jsx)(s,{value:`table`,"aria-label":`Table`,children:(0,v.jsx)(f,{})}),(0,v.jsx)(s,{value:`rows`,"aria-label":`Compact rows`,children:(0,v.jsx)(h,{})}),(0,v.jsx)(s,{value:`grid`,"aria-label":`Grid`,children:(0,v.jsx)(l,{})})]})}},x={render:function(){let[e,t]=(0,_.useState)([`form`]);return(0,v.jsxs)(o,{value:e,onValueChange:t,multiple:!1,"aria-label":`Editor`,children:[(0,v.jsx)(s,{value:`form`,children:`Form`}),(0,v.jsx)(s,{value:`yaml`,children:`YAML`})]})}},S=[`Playground`,`WithLabels`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function PlaygroundStory() {
    const [view, setView] = useState(['table']);
    return <ToggleGroup value={view} onValueChange={setView} multiple={false} aria-label="View">
        <ToggleGroupItem value="table" aria-label="Table">
          <List />
        </ToggleGroupItem>
        <ToggleGroupItem value="rows" aria-label="Compact rows">
          <Rows3 />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid">
          <LayoutGrid />
        </ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: function WithLabelsStory() {
    const [format, setFormat] = useState(['form']);
    return <ToggleGroup value={format} onValueChange={setFormat} multiple={false} aria-label="Editor">
        <ToggleGroupItem value="form">Form</ToggleGroupItem>
        <ToggleGroupItem value="yaml">YAML</ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...x.parameters?.docs?.source}}}})))()}C();export{b as Playground,x as WithLabels,S as __namedExportsOrder,y as default};