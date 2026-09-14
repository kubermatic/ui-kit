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
'use client';

import {
  cloneElement,
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../lib/utils.js';
import { initialsOf } from './avatar.js';

/**
 * A link element supplied by the consuming app's router.
 *
 * Typed as an element rather than a component so the product writes the
 * destination once — `<Link href="/" />` — instead of this file having to know
 * whether the router's prop is called `href` or `to`.
 */
export type BrandLinkElement = ReactElement<{ className?: string; children?: ReactNode }>;

export interface Brand {
  /**
   * The product's name — "Example Platform", "Example Console".
   *
   * The only required field, and it does real work: it is the accessible name
   * of the home link and the wordmark that renders when no artwork exists, so
   * the shell is never unlabelled while a logo is still being designed.
   */
  name: string;
  /** Short form for tight spaces — "Platform". Falls back to `name`. */
  shortName?: string;
  /**
   * The full lockup, as a node. An `<img>`, an inline `<svg>`, a Next
   * `<Image>` — whatever the product already has.
   */
  logo?: ReactNode;
  /**
   * The square mark, for the collapsed sidebar and anywhere the lockup would
   * be squashed. Falls back to the initials of `shortName ?? name`.
   */
  mark?: ReactNode;
  /** Where the logo links to. Defaults to `/`. Ignored when `homeLink` is set. */
  href?: string;
  /**
   * The router's link element, rendered instead of a plain `<a>`:
   *
   *   homeLink: <Link href="/" />      // Next
   *   homeLink: <NavLink to="/" />     // React Router
   */
  homeLink?: BrandLinkElement;
  /** Who to credit in the footer — "Kubermatic". */
  company?: string;
  /** Documentation URL for the footer link. */
  docsUrl?: string;
}

const BrandContext = createContext<Brand | null>(null);

export interface BrandProviderProps {
  brand: Brand;
  children: ReactNode;
}

/**
 * BrandProvider — the product's identity, in one place.
 *
 * This is the answer to "we have a different logo per product". The kit ships
 * **no artwork at all**, for the same reason it ships no font files: a
 * component library carrying one product's PNG either forces every other
 * product to override it, or grows a `product` enum that has to be edited here
 * whenever a new one appears.
 *
 * Instead each app mounts this once at its root:
 *
 *   <BrandProvider
 *     brand={{
 *       name: 'Example Console',
 *       logo: <img src="/console.svg" alt="" className="h-7" />,
 *       mark: <img src="/console-mark.svg" alt="" className="size-6" />,
 *       company: 'Kubermatic',
 *       docsUrl: 'https://example.com/docs',
 *     }}
 *   >
 *
 * and `AppHeader`, `Sidebar` and `AppFooter` read it from context. Nothing
 * below has a logo prop to thread through, and adding a fourth product touches
 * no file in this package.
 *
 * `alt=""` above is not an oversight: `Logo` wraps the artwork in a link that
 * is already named from `brand.name`, so alt text on the image would make a
 * screen reader announce the product twice.
 */
export function BrandProvider({ brand, children }: BrandProviderProps) {
  /*
   * Memoised field-wise, not on the object. The natural way to write a brand
   * is inline at the call site, which produces a fresh object identity on
   * every render — and every consumer of this context would re-render with it.
   */
  const { name, shortName, logo, mark, href, homeLink, company, docsUrl } = brand;

  const value = useMemo<Brand>(
    () => ({ name, shortName, logo, mark, href, homeLink, company, docsUrl }),
    [name, shortName, logo, mark, href, homeLink, company, docsUrl],
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

/**
 * The current brand.
 *
 * Throws without a provider, like `useSidebar` and unlike an earlier version of
 * this file, which returned `{ name: 'Untitled' }` so that a single component
 * could be dropped into a story with no scaffolding. That convenience was the
 * wrong trade for an app-level provider: forgetting to mount `BrandProvider`
 * then ships "Untitled" to production instead of failing on the first render.
 *
 * The convenience is bought back where it belongs — Storybook mounts a brand
 * globally in `.storybook/with-brand.tsx`, so no story needs boilerplate and
 * nothing in the catalogue depends on a fallback.
 */
export function useBrand(): Brand {
  const brand = useContext(BrandContext);
  if (!brand) {
    throw new Error(
      'useBrand must be used inside a <BrandProvider>. Mount it once at your app root with at least a `name`.',
    );
  }
  return brand;
}

export interface LogoProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * `full` renders the lockup, `mark` the square glyph. The collapsed sidebar
   * uses `mark`; everything else uses `full`.
   */
  variant?: 'full' | 'mark';
  /** Renders static content instead of a link to the home route. */
  asLink?: boolean;
}

/**
 * Logo — the brand, rendered.
 *
 * Falls all the way back — `logo` → `name` as a wordmark, `mark` → initials in
 * a tinted square — so the shell looks deliberate on day one, before any
 * artwork exists.
 */
export function Logo({ variant = 'full', asLink = true, className, ...props }: LogoProps) {
  const brand = useBrand();

  /*
   * `shortName` is used verbatim, and only `name` is reduced to initials.
   * Running `initialsOf` over both turns a `shortName` of "SG" into "S" —
   * which is the wrong answer, because a short name is *already* the
   * abbreviation. That is what the field is for.
   */
  const markText = brand.shortName ?? initialsOf(brand.name);

  const artwork =
    variant === 'mark'
      ? (brand.mark ?? (
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary font-display text-xs font-bold text-primary-foreground"
          >
            {markText}
          </span>
        ))
      : (brand.logo ?? (
          <span aria-hidden="true" className="font-display text-base font-bold text-heading">
            {brand.shortName ?? brand.name}
          </span>
        ));

  const content = (
    <>
      <span data-slot="logo" className={cn('flex items-center gap-2', className)}>
        {artwork}
      </span>
      {/* The artwork is `aria-hidden` or carries `alt=""`, so this is the
          accessible name of the whole thing. */}
      <span className="sr-only">{brand.name}</span>
    </>
  );

  if (!asLink) {
    return (
      <span className="flex items-center" {...props}>
        {content}
      </span>
    );
  }

  const linkClasses =
    'flex items-center rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

  if (brand.homeLink) {
    /*
     * The product's own link element, cloned with our content and classes.
     * `cloneElement` rather than a render-prop protocol because the only
     * things being merged are `children` and `className` — and the element
     * already carries its own destination, which is the part that differs
     * between routers.
     */
    return cloneElement(
      brand.homeLink,
      { className: cn(linkClasses, brand.homeLink.props.className) },
      content,
    );
  }

  return (
    <a href={brand.href ?? '/'} className={linkClasses}>
      {content}
    </a>
  );
}
