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
import type { ComponentPropsWithoutRef, ElementType } from 'react';

/**
 * Props for a component that can be rendered as a different element via `as`.
 *
 * The naive version — `interface Props extends ComponentProps<'span'>` plus an
 * `as?: ElementType` — compiles, but the props stay pinned to the *default*
 * element. `<Badge as="a" href="/tags">` is then a type error on `href`, which
 * is exactly the shape this repo shipped before.
 *
 * `OwnProps` are the component's own variant props; the remainder is picked up
 * from whatever element `as` names, with the component's own names removed so
 * a variant called `variant` is never shadowed by an element attribute.
 */
export type PolymorphicProps<T extends ElementType, OwnProps = object> = OwnProps & {
  /**
   * Element or component to render. Defaults to the component's natural tag.
   */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;
