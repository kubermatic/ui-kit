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
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Code, CodeBlock } from './code-block';

const MANIFEST = `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: billing
type: Opaque
stringData:
  username: app
  password: hunter2`;

const meta = {
  title: 'Primitives/CodeBlock',
  component: CodeBlock,
  parameters: {
    docs: {
      description: {
        component:
          'A read-only block of YAML, JSON or a shell command. Not a highlighter and not ' +
          'an editor — an editable manifest wants Monaco or CodeMirror, which is a ' +
          'megabyte-scale dependency and does not belong in a primitives package. ' +
          'The `<pre>` is focusable so the keyboard can scroll it, which SC 2.1.1 requires ' +
          'and a `<pre>` does not give you for free.',
      },
    },
  },
  args: { children: MANIFEST, language: 'yaml' },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutCopy: Story = {
  args: { copyable: false, language: undefined, children: 'kubectl get secrets -n billing' },
};

/** `Code` is the inline form — a resource name, a field path, a flag. */
export const Inline: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="max-w-prose font-sans text-sm">
      Set <Code>spec.refreshInterval</Code> to <Code>1h</Code> to reconcile the{' '}
      <Code>ExternalSecret</Code> hourly.
    </p>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
};
