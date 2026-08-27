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
 * Bans raw colour values in TypeScript and JSX.
 *
 * Colour belongs in `theme.css` as a token, so that a re-brand is an override
 * of a custom property rather than a grep across three repos, and so that the
 * WCAG AA work done at the token level cannot be routed around by a component
 * that hardcodes `#0f766e`.
 *
 * This rule only sees JS/TS. The stylesheet is where colours are *defined* and
 * is not linted here — the CSS regression guard covers that side.
 */

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNCTIONAL = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\s*\(/;

/** @param {string} value */
function findColour(value) {
  const hex = value.match(HEX);
  if (hex) return hex[0];
  const fn = value.match(FUNCTIONAL);
  if (fn) return fn[0];
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'ban raw colour literals; use a design token instead',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            description: 'regex sources for values that may carry a colour',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      colour:
        'Raw colour "{{colour}}". Use a design token (a `--color-*` custom property or a Tailwind class that maps to one).',
    },
  },

  create(context) {
    const allow = (context.options[0]?.allow ?? []).map((s) => new RegExp(s));

    /** @param {string} value */
    function check(node, value) {
      if (typeof value !== 'string') return;
      if (allow.some((re) => re.test(value))) return;

      const colour = findColour(value);
      if (colour)
        context.report({ node, messageId: 'colour', data: { colour } });
    }

    return {
      Literal(node) {
        /*
         * Import specifiers are paths, and a path may legitimately contain a
         * `#` fragment. They can never be a colour, so skip them outright
         * rather than trying to tell a fragment from a hex triplet.
         */
        const parent = node.parent;
        if (
          parent?.type === 'ImportDeclaration' ||
          parent?.type === 'ExportNamedDeclaration' ||
          parent?.type === 'ExportAllDeclaration' ||
          parent?.type === 'ImportExpression'
        ) {
          return;
        }
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};
