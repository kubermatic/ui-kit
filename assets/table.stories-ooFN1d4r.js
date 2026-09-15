import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{c as n,i as r,l as i,n as a,o,r as s,s as c,t as l}from"./table-ug6xIs-u.js";import{r as u,t as d}from"./status-badge-CTg2LHIU.js";var f,p,m,h;function g(){return(g=e((()=>{i(),u(),f=t(),p={title:`Data/Table`,component:l,parameters:{docs:{description:{component:'The semantic table elements, styled. A real `<table>`, not a grid of divs: row and column headers are what let a screen reader announce "Status, Degraded" instead of "Degraded", and there is no ARIA that reproduces that as well as the element does.\n\nFor a resource list, reach for `DataTable` instead — it adds search, sorting, column visibility, selection and the loading/empty/error states. These parts are for a table you are laying out by hand.'}}}},m={render:()=>(0,f.jsx)(`div`,{className:`w-[40rem]`,children:(0,f.jsxs)(l,{children:[(0,f.jsx)(s,{children:`External secrets in the billing namespace.`}),(0,f.jsx)(c,{children:(0,f.jsxs)(n,{children:[(0,f.jsx)(o,{children:`Name`}),(0,f.jsx)(o,{children:`Store`}),(0,f.jsx)(o,{children:`Status`})]})}),(0,f.jsxs)(a,{children:[(0,f.jsxs)(n,{children:[(0,f.jsx)(r,{children:`db-credentials`}),(0,f.jsx)(r,{children:`vault-backend`}),(0,f.jsx)(r,{children:(0,f.jsx)(d,{tone:`success`,dot:!0,children:`Synced`})})]}),(0,f.jsxs)(n,{children:[(0,f.jsx)(r,{children:`api-token`}),(0,f.jsx)(r,{children:`aws-secretsmanager`}),(0,f.jsx)(r,{children:(0,f.jsx)(d,{tone:`error`,dot:!0,children:`Error`})})]})]})]})})},h=[`Playground`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[40rem]">
      <Table>
        <TableCaption>External secrets in the billing namespace.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>db-credentials</TableCell>
            <TableCell>vault-backend</TableCell>
            <TableCell>
              <StatusBadge tone="success" dot>
                Synced
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>api-token</TableCell>
            <TableCell>aws-secretsmanager</TableCell>
            <TableCell>
              <StatusBadge tone="error" dot>
                Error
              </StatusBadge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Playground,h as __namedExportsOrder,p as default};