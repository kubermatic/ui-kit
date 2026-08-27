/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

/**
 * Turns a variant set into the array a story's `argTypes` and render both read.
 *
 * The point is the parameter type. `Record<T, true>` cannot be satisfied by an
 * object literal that is missing one of `T`'s members, so a variant added to a
 * component's `cva` config and not added to its story fails `npm run typecheck`
 * instead of quietly going unrendered. An extra or misspelled key fails the
 * same way, through the excess-property check.
 *
 * Passing the union explicitly is what arms it — inference would widen `T` to
 * whatever keys happen to be present and prove nothing:
 *
 * ```ts
 * type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
 * const VARIANTS = variantKeys<ButtonVariant>({ default: true, secondary: true });
 * //                          ^ errors until every ButtonVariant is listed
 * ```
 *
 * The values carry no meaning; the keys are the data. A plain `as const` array
 * would read better but cannot be checked for completeness, and the matrix
 * falling silently behind the component is the failure this exists to prevent —
 * `badge` had shipped `ghost` and `link` variants that no story rendered.
 *
 * Stories only. Nothing here is exported from the package.
 */
export function variantKeys<T extends string>(set: Record<T, true>): T[] {
  return Object.keys(set) as T[];
}
