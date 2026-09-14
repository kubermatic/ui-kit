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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CopyButton } from './copy-button';

const writeText = vi.fn(async () => {});

function setClipboard() {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
});

describe('CopyButton', () => {
  /* Six copy buttons on a page otherwise announce "Copy" six times. */
  it('is named after what it copies', () => {
    setClipboard();
    render(<CopyButton value="abc" label="Copy kubeconfig" />);
    expect(screen.getByRole('button', { name: 'Copy kubeconfig' })).toBeInTheDocument();
  });

  it('writes the value', async () => {
    setClipboard();
    render(<CopyButton value="kubectl get pods" />);

    await userEvent.click(screen.getByRole('button'));
    expect(writeText).toHaveBeenCalledWith('kubectl get pods');
  });

  /*
   * Swapping the icon tells a sighted user it worked and tells a screen-reader
   * user nothing. Both products' versions change only the icon.
   */
  it('announces the result', async () => {
    setClipboard();
    render(<CopyButton value="abc" copiedLabel="Copied!" />);

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());
  });

  it('announces a failure', async () => {
    // No clipboard: an insecure origin, which is every port-forward.
    render(<CopyButton value="abc" />);

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/secure origin/)).toBeInTheDocument());
  });

  /*
   * Disabling it after a copy — which one of the two apps does for two
   * seconds — takes focus off the button and stops you copying twice.
   */
  it('stays enabled after copying', async () => {
    setClipboard();
    render(<CopyButton value="abc" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button).toBeEnabled();
  });

  it('takes visible text instead of being icon-only', () => {
    setClipboard();
    render(<CopyButton value="abc">Copy token</CopyButton>);
    expect(screen.getByRole('button', { name: 'Copy token' })).toBeInTheDocument();
  });
});
