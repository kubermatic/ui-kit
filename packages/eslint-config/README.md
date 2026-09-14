# @kubermatic/eslint-config

Shared ESLint flat config for Kubermatic frontend projects.

## Install

```bash
npm install --save-dev @kubermatic/eslint-config eslint
```

## Use

```js
// eslint.config.js
import kubermatic from '@kubermatic/eslint-config';

export default [...kubermatic];
```

Bundles `@eslint/js` recommended, `typescript-eslint` `recommendedTypeChecked`,
the React Hooks rules (including the React Compiler–aware set) and the Storybook
plugin, with `eslint-config-prettier` last.

Type-aware rules use `projectService`, so each package needs its own
`tsconfig.json`. To point them at a different root:

```js
import { kubermaticConfig } from '@kubermatic/eslint-config';

export default kubermaticConfig({ tsconfigRootDir: import.meta.dirname });
```

## Licence

Apache-2.0
