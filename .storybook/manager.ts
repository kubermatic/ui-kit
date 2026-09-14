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
import { addons } from 'storybook/manager-api';

import { dark, light } from './theme';

/*
 * The manager theme is fixed at load — there is no toolbar control for it, and
 * re-theming the whole app on a media-query change would remount the sidebar.
 * Reading the OS preference once is the useful 90%: someone working in a dark
 * environment gets a dark catalogue without configuring anything.
 *
 * Independent of the `theme` toolbar global, which themes the *stories*. They
 * are genuinely different questions — reviewing the dark palette on a light
 * screen is a normal thing to want to do.
 */
const prefersDark =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: prefersDark ? dark : light,
  sidebar: {
    // Foundations and Primitives are both worth landing on directly.
    showRoots: true,
  },
});
