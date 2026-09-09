/*
Copyright 2026 The Kubermatic Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import type { Decorator } from '@storybook/react-vite';

import { BrandProvider, type Brand } from '../packages/ui-kit/src/components/ui/brand';

/**
 * Storybook's own brand.
 *
 * The point worth understanding: **this catalogue is a consumer of the kit like
 * any product is.** There is no special wiring for Storybook — it mounts
 * `BrandProvider` exactly the way an app does, and this decorator is that
 * mount. The kit ships no artwork, so there is nothing here for a story to
 * inherit by default; something has to supply it, and in the catalogue that is
 * this file.
 *
 * It exists so that `useBrand()` can throw without a provider. That strictness
 * is what stops a product shipping a placeholder name to production, and it
 * would otherwise mean every story touching `Logo`, `SidebarBrand` or
 * `AppFooter` needed its own provider — boilerplate that says nothing about the
 * component being documented.
 *
 * Deliberately neutral, with no `logo` or `mark`, so what a story renders by
 * default is the *fallback* path: the name as a wordmark and its initials as a
 * square mark. That is the state a product is in on day one, before any
 * artwork exists, and it should be visible rather than hidden behind a logo
 * the kit invented.
 *
 * A story that needs a specific identity nests its own provider — the inner
 * one wins. `App Frame → Brand` does exactly that, with two identities side
 * by side, which is the component's actual claim: one component set, two
 * identities.
 */
const STORYBOOK_BRAND: Brand = {
  name: 'Kubermatic UI Kit',
  shortName: 'UI Kit',
  company: 'Kubermatic',
  docsUrl: 'https://github.com/kubermatic/ui-kit#readme',
};

export const withBrand: Decorator = (Story) => (
  <BrandProvider brand={STORYBOOK_BRAND}>
    <Story />
  </BrandProvider>
);
