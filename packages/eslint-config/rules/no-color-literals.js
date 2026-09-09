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
 * Bans raw colour values in TypeScript and JSX.
 *
 * The kit's central invariant is that components reference semantic roles —
 * `bg-primary`, `text-heading` — and never a colour. Everything else depends
 * on it: the palette is measured against WCAG AA at token level, and runtime
 * theming works by re-pointing those roles. A component that hardcodes
 * `#0f766e` routes around both, and does so invisibly.
 *
 * Stylesheets are exempt by construction (this only visits JS/TS ASTs), which
 * is correct — `theme.css` is where colours are supposed to live.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw colour literals; use a semantic design token instead',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            description: 'Regex sources for values that are permitted anyway',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      colorLiteral:
        'Raw colour "{{value}}". Use a semantic token (bg-primary, text-heading, …) so theming and the WCAG guarantees still apply.',
    },
  },

  create(context) {
    const allow = (context.options[0]?.allow ?? []).map((source) => new RegExp(source));

    const HEX = /#[0-9a-fA-F]{3,8}\b/;
    const FUNCTIONAL = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\s*\(/;

    /** Module specifiers may legitimately contain a `#` fragment. */
    const isModuleSpecifier = (node) => {
      const parentType = node.parent?.type;
      return (
        parentType === 'ImportDeclaration' ||
        parentType === 'ExportNamedDeclaration' ||
        parentType === 'ExportAllDeclaration' ||
        parentType === 'ImportExpression'
      );
    };

    const check = (node, value) => {
      if (typeof value !== 'string') return;
      if (!HEX.test(value) && !FUNCTIONAL.test(value)) return;
      if (allow.some((pattern) => pattern.test(value))) return;

      context.report({ node, messageId: 'colorLiteral', data: { value } });
    };

    return {
      Literal(node) {
        if (isModuleSpecifier(node)) return;
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

export default rule;
