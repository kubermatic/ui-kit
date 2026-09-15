import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,l as n}from"./breadcrumb-C4Q8hVNv.js";var r,i,a,o;function s(){return(s=e((()=>{n(),r={title:`Navigation/Breadcrumb`,component:t,parameters:{docs:{description:{component:'An `<ol>` inside a labelled `<nav>`, because the order is the meaning. The separators are `aria-hidden` siblings rather than nested items: an `<li>` inside an `<li>` is invalid, and a screen reader announcing "list of 5 items" would be counting the slashes.\n\nThe last entry is always the current page regardless of whether it has an `href` — a trail whose final item links to the page you are already on is a link that does nothing. It is plain text with `aria-current="page"`, deliberately not `role="link" aria-disabled="true"`: that pairing announces a dimmed link and invites you to activate something that is not there.\n\nLabels are passed in rather than derived from the URL. Deriving them by title-casing path segments and gets "Eso deployments" and "Push secrets"; the route knows its own name and the URL does not.'}}},args:{items:[{label:`Organizations`,href:`/organizations`},{label:`Acme`,href:`/organizations/acme`},{label:`External Secrets`}]}},i={},a={args:{items:[{label:`Organizations`,href:`/organizations`},{label:`Acme`,href:`/organizations/acme`},{label:`Services`,href:`/organizations/acme/services`},{label:`Postgres`,href:`/organizations/acme/services/postgres`},{label:`billing-db`}]}},o=[`Playground`,`Deep`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Organizations',
      href: '/organizations'
    }, {
      label: 'Acme',
      href: '/organizations/acme'
    }, {
      label: 'Services',
      href: '/organizations/acme/services'
    }, {
      label: 'Postgres',
      href: '/organizations/acme/services/postgres'
    }, {
      label: 'billing-db'
    }]
  }
}`,...a.parameters?.docs?.source}}}})))()}s();export{a as Deep,i as Playground,o as __namedExportsOrder,r as default};