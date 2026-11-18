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

/*
 * The code examples from README.md, kept close to verbatim so that they typecheck and run. When an
 * example in the README changes, change it here too.
 */

import { render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type ConnectOutcome,
  type KdpClient,
  type KdpObject,
  type Theme,
  connect,
  isKdpEmbedError,
} from '@kubermatic/embed';
import { KdpProvider, useKdp, useKdpTheme } from '@kubermatic/embed/react';
import { type MockHost, createMockHost } from '@kubermatic/embed/testing';

vi.mock('@kubermatic/embed', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  connect: vi.fn(),
}));

const connectMock = vi.mocked(connect);

let messages: string[];
let themes: Theme[];
let lists: KdpObject[][];
let hosts: MockHost[];

const showMessage = (message: string) => messages.push(message);
const applyTheme = (theme: Theme) => themes.push(theme);
const renderList = (objects: KdpObject[]) => lists.push(objects);

function mockHost(...args: Parameters<typeof createMockHost>): MockHost {
  const host = createMockHost(...args);
  hosts.push(host);
  return host;
}

const teamA: KdpObject = { metadata: { name: 'team-a', namespace: 'default' }, spec: {} };

beforeEach(() => {
  messages = [];
  themes = [];
  lists = [];
  hosts = [];
});

afterEach(() => {
  for (const host of hosts) host.close();
  vi.restoreAllMocks();
});

// README: Quick start
async function quickStart() {
  const outcome = await connect({ expectedOrigins: ['https://kdp.example.com'] });

  switch (outcome.status) {
    case 'connected': {
      const { client } = outcome;
      applyTheme(client.context.theme);
      client.on('theme', applyTheme);
      client.on('disconnected', () => showMessage('The Dashboard closed the connection.'));
      renderList(await client.listObjects('LLMAccess'));
      break;
    }
    case 'not-embedded':
      showMessage('Open this page from the KDP Dashboard.');
      break;
    case 'version-mismatch':
      showMessage(`This page does not support Dashboard protocol ${outcome.hostProtocolVersion}.`);
      break;
    case 'timed-out':
      showMessage('Could not connect to the Dashboard.');
      break;
  }
}

// README: React
function App() {
  return (
    <KdpProvider options={{ expectedOrigins: ['https://kdp.example.com'] }}>
      <Accesses />
    </KdpProvider>
  );
}

function Accesses() {
  const { state, client, context, disconnected } = useKdp();
  const theme = useKdpTheme();
  const [accesses, setAccesses] = useState<KdpObject[]>([]);

  useEffect(() => {
    void client?.listObjects('LLMAccess').then(setAccesses, () => setAccesses([]));
  }, [client]);

  if (state === 'connecting') return <p>Connecting…</p>;
  if (state !== 'connected') return <p>Open this page from the KDP Dashboard ({state}).</p>;

  return (
    <main data-theme={theme}>
      {disconnected && <p role="alert">The Dashboard closed the connection.</p>}
      <h1>{context?.service.name}</h1>
      <ul>
        {accesses.map((access) => (
          <li key={access.metadata.name}>{access.metadata.name}</li>
        ))}
      </ul>
    </main>
  );
}

// README: Client
async function clientTour(client: KdpClient) {
  const accesses = await client.listObjects('LLMAccess');
  const access = await client.getObject('LLMAccess', 'team-a', 'default');

  await client.createObject(
    'LLMAccess',
    { metadata: { name: 'team-b' }, spec: { model: 'llama' } },
    'default',
  );
  await client.patchObject('LLMAccess', 'team-a', { spec: { model: 'mistral' } }, 'default');

  if (await client.can('delete', 'LLMAccess', 'default')) {
    await client.deleteObject('LLMAccess', 'team-b', 'default');
  }

  const secrets = await client.getRelated('LLMAccess', 'team-a', 'connection-details', 'default');
  return { accesses, access, secrets };
}

// README: Errors
async function deleteWithErrors(client: KdpClient) {
  try {
    await client.deleteObject('LLMAccess', 'team-a', 'default');
  } catch (error) {
    if (!isKdpEmbedError(error)) throw error;
    if (error.isBoundary) showMessage('This extension may not delete accesses.');
    else if (error.code === 'forbidden') showMessage('You may not delete this access.');
    else showMessage(error.message);
  }
}

describe('README examples', () => {
  it('quick start handles a connection', async () => {
    const host = mockHost({ objects: { LLMAccess: [teamA] } });
    connectMock.mockResolvedValue({
      status: 'connected',
      client: host.client,
      hostProtocolVersion: '1.0',
    });

    await quickStart();
    expect(connectMock).toHaveBeenCalledWith({ expectedOrigins: ['https://kdp.example.com'] });
    expect(themes).toEqual(['light']);
    expect(lists).toEqual([[teamA]]);

    host.close();
    await vi.waitFor(() => expect(messages).toEqual(['The Dashboard closed the connection.']));
  });

  it.each<[ConnectOutcome, string]>([
    [{ status: 'not-embedded' }, 'Open this page from the KDP Dashboard.'],
    [
      { status: 'version-mismatch', hostProtocolVersion: '2.0' },
      'This page does not support Dashboard protocol 2.0.',
    ],
    [{ status: 'timed-out' }, 'Could not connect to the Dashboard.'],
  ])('quick start handles %o', async (outcome, message) => {
    connectMock.mockResolvedValue(outcome);
    await quickStart();
    expect(messages).toEqual([message]);
  });

  it('the React app reports a page that is not embedded', async () => {
    render(<App />);
    expect(await screen.findByText(/not-embedded/)).toBeInTheDocument();
  });

  it('the client tour runs against the mock host', async () => {
    const secret: KdpObject = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name: 'team-a-key', namespace: 'default' },
    };
    const host = mockHost({
      objects: { LLMAccess: [teamA] },
      related: { 'LLMAccess/team-a/connection-details': [secret] },
    });

    const { accesses, access, secrets } = await clientTour(host.client);
    expect(accesses).toEqual([teamA]);
    expect(access).toEqual(teamA);
    expect(secrets).toEqual([secret]);
    expect(host.objects.LLMAccess).toEqual([{ ...teamA, spec: { model: 'mistral' } }]);
  });

  it.each([
    ['not-consented', 'This extension may not delete accesses.'],
    ['forbidden', 'You may not delete this access.'],
    ['upstream', 'The platform failed to handle the request'],
  ])('error handling reports %s', async (code, message) => {
    const host = mockHost({ objects: { LLMAccess: [teamA] }, fail: { deleteObject: code } });
    await deleteWithErrors(host.client);
    expect(messages).toEqual([message]);
  });

  // README: Testing
  it('the mock host example', async () => {
    const host = createMockHost({
      objects: { LLMAccess: [{ metadata: { name: 'team-a', namespace: 'default' }, spec: {} }] },
      related: {
        'LLMAccess/team-a/connection-details': [
          {
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: { name: 'team-a-key', namespace: 'default' },
          },
        ],
      },
      can: ({ verb }) => verb !== 'delete',
      fail: { deleteObject: 'not-consented' },
    });

    await host.client.patchObject('LLMAccess', 'team-a', { spec: { model: 'llama' } }, 'default');
    expect(host.objects.LLMAccess?.[0]?.spec).toEqual({ model: 'llama' });
    host.close();
  });

  it('lists the accesses', async () => {
    const host = createMockHost({
      context: { service: { id: 'llm', name: 'LLM' } },
      objects: { LLMAccess: [{ metadata: { name: 'team-a', namespace: 'default' } }] },
    });

    render(
      <KdpProvider client={host.client}>
        <Accesses />
      </KdpProvider>,
    );

    expect(await screen.findByText('team-a')).toBeInTheDocument();
    host.close();
  });
});
