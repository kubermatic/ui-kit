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
 * Requires an Apache-2.0 licence header.
 *
 * Matching is deliberately asymmetric: loose on the year, strict on the grant.
 * Pinning the year would turn every January into a churn commit across every
 * file, and the point is to prove a file carries the Apache-2.0 grant — not
 * that someone re-ran a script recently.
 *
 * Only the leading comment region is scanned, not the whole file. A module
 * that merely mentions Apache-2.0 in a docstring further down does not carry
 * the grant, and should not pass.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

const GRANT = /Licensed under the Apache License, Version 2\.0 \(the "License"\)/;
const COPYRIGHT = /Copyright\s+(\d{4})(?:-\d{4})?\s+(.+)/;

const header = (owner, year) => `/*
 * Copyright ${year} ${owner}
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
`;

const rule = {
  meta: {
    type: 'suggestion',
    fixable: 'whitespace',
    docs: { description: 'Require an Apache-2.0 licence header' },
    schema: [
      {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          year: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing: 'Missing the Apache-2.0 licence header.',
      wrongOwner: 'Licence header names "{{found}}"; expected "{{expected}}".',
    },
  },

  create(context) {
    const owner = context.options[0]?.owner ?? 'The Kubermatic Authors';
    const year = context.options[0]?.year ?? String(new Date().getFullYear());

    return {
      Program(node) {
        const sourceCode = context.sourceCode;
        const text = sourceCode.getText();
        const firstToken = sourceCode.getFirstToken(node);

        // Everything before the first token is the leading comment region.
        const head = firstToken ? text.slice(0, firstToken.range[0]) : text;

        if (!GRANT.test(head)) {
          context.report({
            node,
            messageId: 'missing',
            fix(fixer) {
              // Keep a shebang on line 1: insert after it, not at offset 0.
              if (text.startsWith('#!')) {
                const eol = text.indexOf('\n');
                const at = eol === -1 ? text.length : eol + 1;
                return fixer.insertTextAfterRange([0, at], header(owner, year));
              }
              return fixer.insertTextBeforeRange([0, 0], header(owner, year));
            },
          });
          return;
        }

        const found = COPYRIGHT.exec(head);
        // Trailing punctuation is noise, not a different owner.
        const foundOwner = found?.[2]?.trim().replace(/[.,;]$/, '');
        if (foundOwner && foundOwner !== owner) {
          context.report({
            node,
            messageId: 'wrongOwner',
            data: { found: foundOwner, expected: owner },
          });
        }
      },
    };
  },
};

export default rule;
