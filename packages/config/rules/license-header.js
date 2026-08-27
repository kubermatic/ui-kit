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
 * Requires an Apache-2.0 header on every source file.
 *
 * Written here rather than pulled from a plugin because the check is fifty
 * lines and the alternative is a dependency whose only job is to hold a regex.
 *
 * The match is deliberately loose on the year and tight on the licence body:
 * the point is to prove a file carries the Apache-2.0 grant, not to force a
 * churn commit through every file each January.
 */

const LICENCE_BODY =
  /Licensed under the Apache License, Version 2\.0 \(the "License"\)/;
const COPYRIGHT = /Copyright\s+(\d{4})(?:-\d{4})?\s+(.+)/;

/** @param {string} owner */
function headerText(owner) {
  const year = new Date().getFullYear();
  return `/*
 * Copyright ${year} ${owner}.
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
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'require an Apache-2.0 licence header on every source file',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          owner: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing: 'Missing Apache-2.0 licence header.',
      wrongOwner:
        'Licence header names "{{found}}"; this repo uses "{{expected}}".',
    },
  },

  create(context) {
    const owner = context.options[0]?.owner ?? 'The Kubermatic Authors';
    const sourceCode = context.sourceCode;

    return {
      Program(node) {
        const text = sourceCode.getText();

        /*
         * Everything before the first token is the leading comment region —
         * exactly where a header may live. Scanning the whole file instead
         * would pass a file that merely mentions Apache-2.0 in a docstring.
         */
        const firstToken = sourceCode.ast.tokens[0];
        const head = firstToken ? text.slice(0, firstToken.range[0]) : text;

        // A shebang is a token-less prefix that must stay on line 1, so an
        // insert at offset 0 would break the file.
        const shebang = text.startsWith('#!')
          ? text.slice(0, text.indexOf('\n') + 1)
          : '';
        const insertAt = shebang.length;

        if (!LICENCE_BODY.test(head)) {
          context.report({
            node,
            messageId: 'missing',
            fix: (fixer) =>
              fixer.insertTextAfterRange(
                [insertAt, insertAt],
                headerText(owner),
              ),
          });
          return;
        }

        const found = head.match(COPYRIGHT);
        // Trailing punctuation on the copyright line is cosmetic; the owner is not.
        const foundOwner = found?.[2]?.replace(/[.\s]+$/, '');
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
