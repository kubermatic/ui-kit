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

/**
 * Makes a story's variant coverage complete by construction.
 *
 * `Record<T, true>` cannot be satisfied by an object literal missing a member
 * of `T`, and excess-property checking rejects a misspelled or removed one.
 * So a variant added to a component's `cva` config but not to its story fails
 * `npm run typecheck` rather than quietly going unrendered — and unrendered
 * means unscanned by axe and unreviewed on a palette change.
 *
 * Two constraints make this the only workable form:
 *
 * 1. **Pass the union explicitly** — `variantKeys<ButtonVariant>({ … })`.
 *    Letting it infer widens `T` to whatever keys are present, which proves
 *    nothing at all.
 * 2. **Consume the result.** The tempting alternative is an exhaustiveness
 *    check via `Exclude`, but an unused const or type alias trips
 *    `noUnusedLocals` (TS6133) *before* the interesting error surfaces. The
 *    guard has to be something the story genuinely renders.
 */
export function variantKeys<T extends string>(set: Record<T, true>): T[] {
  return Object.keys(set) as T[];
}
