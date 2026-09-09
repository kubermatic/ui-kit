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
 * Requires the `'use client'` directive on component and hook files.
 *
 * Applied bluntly, to every file the config points it at, rather than trying
 * to detect which files "need" it. Two reasons:
 *
 * 1. The failure is asymmetric. A missing directive is a build error in the
 *    *consumer's* repo — usually a confusing one about hooks in a Server
 *    Component, pointing at our compiled output. A needless directive costs a
 *    few hundred bytes.
 * 2. "Every component file has the directive" is mechanically checkable.
 *    "Every component that needs one has one" is not: it depends on whether a
 *    Base UI part happens to use a hook internally today, which is not our
 *    contract to rely on.
 *
 * The fixer inserts before the first *token* rather than at offset 0, so the
 * directive lands after a licence header. A directive must be the first
 * statement, but comments may precede it.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: "Require the 'use client' directive in component and hook files",
    },
    schema: [],
    messages: {
      missing:
        "Missing 'use client'. Without it this module fails to build when a consumer imports it from a React Server Component.",
    },
  },

  create(context) {
    return {
      Program(node) {
        // Walk the directive prologue: consecutive string-literal statements.
        for (const statement of node.body) {
          if (
            statement.type !== 'ExpressionStatement' ||
            statement.expression.type !== 'Literal' ||
            typeof statement.expression.value !== 'string'
          ) {
            break;
          }
          if (statement.expression.value === 'use client') return;
        }

        const sourceCode = context.sourceCode;
        const firstToken = sourceCode.getFirstToken(node);

        context.report({
          node,
          messageId: 'missing',
          fix(fixer) {
            return firstToken
              ? fixer.insertTextBefore(firstToken, "'use client';\n\n")
              : fixer.insertTextAfterRange([0, 0], "'use client';\n");
          },
        });
      },
    };
  },
};

export default rule;
