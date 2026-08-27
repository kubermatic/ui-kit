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
 * Requires the `'use client'` directive on component and hook modules.
 *
 * Applied bluntly — to every component file, not only the ones that currently
 * use a hook. That is deliberate:
 *
 *   - The failure is asymmetric. A component that needs the directive and lacks
 *     it throws in the consumer's build ("you're importing a component that
 *     needs useState"). A component that carries it needlessly ships a few
 *     hundred bytes of extra client JavaScript. One of those is an outage in
 *     someone else's repo; the other is a rounding error.
 *   - "Every component file has the directive" is mechanically checkable.
 *     "Every component that needs the directive has it" is not — it depends on
 *     what the component's dependencies do today, so a file passes until an
 *     unrelated refactor inside Base UI makes it fail.
 *
 * The fix inserts before the first token rather than at offset 0, which puts
 * the directive *after* the licence header comment. That ordering is required:
 * a directive has to be the first statement, but comments may precede it.
 */

const DIRECTIVE = 'use client';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: "require the 'use client' directive on component modules",
    },
    fixable: 'code',
    schema: [],
    messages: {
      missing:
        "Missing 'use client'. Components in this package are client components; without the directive a consumer importing this into a server component gets a build error.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      Program(node) {
        // Only the leading run of string-expression statements are directives.
        // A bare string further down the file is an expression, not a prologue.
        for (const statement of node.body) {
          if (statement.type !== 'ExpressionStatement') break;

          const { expression } = statement;
          const isStringLiteral =
            expression.type === 'Literal' &&
            typeof expression.value === 'string';
          if (!isStringLiteral) break;

          if (expression.value === DIRECTIVE) return;
        }

        const firstToken = sourceCode.ast.tokens[0];
        // Nothing but comments — there is no module here to mark.
        if (!firstToken) return;

        context.report({
          node,
          messageId: 'missing',
          fix: (fixer) =>
            fixer.insertTextBeforeRange(
              firstToken.range,
              `'${DIRECTIVE}';\n\n`,
            ),
        });
      },
    };
  },
};
