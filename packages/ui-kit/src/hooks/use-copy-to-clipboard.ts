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
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCopyToClipboardOptions {
  /** How long `copied` stays true, in milliseconds. */
  resetAfter?: number;
}

export interface UseCopyToClipboardResult {
  copy: (value: string) => Promise<boolean>;
  /** True for `resetAfter` after a successful copy. Drives the tick icon. */
  copied: boolean;
  /** Set when the write was rejected — insecure origin, denied permission. */
  error: Error | null;
}

/**
 * Copy text to the clipboard, with the transient "Copied" state.
 *
 * Both products have a version of this and both assume `navigator.clipboard`
 * exists. It does not on an insecure origin, which is every developer's
 * `http://<node-ip>:30080` port-forward — and there the promise rejects, the
 * icon never changes, and nothing says why. So the failure is returned rather
 * than thrown: a caller can show "Copy failed" instead of appearing to work.
 *
 * The timeout is cleared on unmount and on a second copy, so copying twice
 * quickly does not reset the flag early from the first timer.
 */
export function useCopyToClipboard({
  resetAfter = 2000,
}: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (value: string) => {
      if (timer.current) clearTimeout(timer.current);

      if (!navigator.clipboard) {
        setCopied(false);
        setError(new Error('The clipboard API is unavailable — it needs a secure origin.'));
        return false;
      }

      try {
        await navigator.clipboard.writeText(value);
        setError(null);
        setCopied(true);
        timer.current = setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch (cause) {
        setCopied(false);
        setError(cause instanceof Error ? cause : new Error('Copy failed.'));
        return false;
      }
    },
    [resetAfter],
  );

  return { copy, copied, error };
}
