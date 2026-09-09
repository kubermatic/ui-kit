/*
 * Copyright 2026 The Kubermatic Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';

import { BrandProvider, Logo, type Brand } from './brand';

const PLATFORM: Brand = {
  name: 'Example Platform',
  shortName: 'EP',
  company: 'Kubermatic',
  docsUrl: 'https://example.com/docs',
};

const CONSOLE: Brand = {
  name: 'Example Console',
  shortName: 'EC',
  company: 'Kubermatic',
};

const meta = {
  title: 'App Frame/Brand',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This is the answer to "we have a different logo per product".\n\n' +
          'The kit ships **no artwork at all** — for the same reason it ships no font ' +
          "files: a component library carrying one product's PNG either forces every other " +
          'product to override it, or grows a `product` enum that has to be edited here ' +
          'whenever a new one appears. Instead each app mounts `BrandProvider` once at its ' +
          'root:\n\n' +
          '```tsx\n' +
          '<BrandProvider\n' +
          '  brand={{\n' +
          "    name: 'Example Console',\n" +
          '    logo: <img src="/console.svg" alt="" className="h-7" />,\n' +
          '    mark: <img src="/console-mark.svg" alt="" className="size-6" />,\n' +
          "    company: 'Kubermatic',\n" +
          "    docsUrl: 'https://example.com/docs',\n" +
          '  }}\n' +
          '>\n' +
          '```\n\n' +
          '…and `AppHeader`, `Sidebar` and `AppFooter` read it from context. Nothing below ' +
          'has a logo prop to thread through, and adding a fourth product touches no file ' +
          'in this package.\n\n' +
          '`alt=""` above is not an oversight: `Logo` wraps the artwork in a link already ' +
          'named from `brand.name`, so alt text on the image would announce the product ' +
          'twice.\n\n' +
          'Only `name` is required, and it falls all the way back — `logo` → the name as a ' +
          'wordmark, `mark` → initials in a tinted square — so the shell looks deliberate ' +
          'on day one, before any artwork exists.',
      },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With no artwork supplied: the name, and initials for the square mark. */
export const Fallbacks: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {[PLATFORM, CONSOLE].map((brand) => (
        <BrandProvider key={brand.name} brand={brand}>
          <div className="flex items-center gap-6">
            <Logo />
            <Logo variant="mark" />
          </div>
        </BrandProvider>
      ))}
    </div>
  ),
};

/** With artwork. Anything that renders is accepted — an `<img>`, an inline SVG. */
export const WithArtwork: Story = {
  render: () => (
    <BrandProvider
      brand={{
        ...CONSOLE,
        logo: (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-accent font-display text-xs font-bold text-accent-foreground"
            >
              SG
            </span>
            <span aria-hidden="true" className="font-display text-base font-bold text-heading">
              Example Console
            </span>
          </span>
        ),
      }}
    >
      <Logo />
    </BrandProvider>
  ),
};

export const FallbacksDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Fallbacks.render,
};
