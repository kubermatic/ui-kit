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

import { FileQuestion } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import type { BreadcrumbEntry } from './breadcrumb.js';
import { EmptyState } from './empty-state.js';
import { ErrorState } from './error-state.js';
import { BackButton, Page, PageHeader, type BackTarget } from './page.js';
import { Skeleton, SkeletonText } from './skeleton.js';
import { Tabs, TabsList, TabsPanel, TabsTab } from './tabs.js';

export interface DetailTab {
  /** Stable id. Put this in the URL so a tab survives a reload. */
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface DetailPageProps {
  breadcrumbs?: readonly BreadcrumbEntry[];
  /** "Back to secrets". */
  back?: BackTarget;
  title: ReactNode;
  description?: ReactNode;
  /** Beside the title — a `StatusBadge` for the resource's condition. */
  status?: ReactNode;
  actions?: ReactNode;

  /** Tab bar and panels. Omit for a single-pane detail page. */
  tabs?: readonly DetailTab[];
  /** Selected tab. Pass with `onTabChange` to drive it from the URL. */
  tab?: string;
  onTabChange?: (value: string) => void;
  defaultTab?: string;

  /** Skeletons in place of the body. The header still renders. */
  loading?: boolean;
  /** Replaces the body with an `ErrorState`. */
  error?: unknown;
  onRetry?: () => void;
  /**
   * The resource does not exist. Distinct from `error`: a 404 on a detail page
   * is a normal outcome — someone deleted it, or followed a stale link — and
   * it needs a way back, not a retry button.
   */
  notFound?: boolean;
  notFoundMessage?: ReactNode;

  children?: ReactNode;
  className?: string;
}

/**
 * DetailPage — one resource, with tabs.
 *
 * The other shape both products repeat: a back link, the resource name with
 * its status beside it, a row of actions, and Overview / YAML / Events /
 * Conditions tabs. One product extracted the tab bar alone into `DetailTabs`
 * after noticing four byte-identical copies; this is the rest of the page
 * around it, including the three states those pages each re-implement
 * (`DetailLoading`, `DetailNotFound`, and an error banner).
 *
 * `notFound` is deliberately a separate prop from `error`, because they need
 * different affordances. A retry button on a resource that has been deleted
 * just fails again.
 *
 * Tabs can be controlled, which is how the tab ends up in the URL — a detail
 * page whose tab resets on reload loses your place every time you share a
 * link:
 *
 *   const [tab, setTab] = useSearchParamState('tab', 'overview');
 *   <DetailPage tab={tab} onTabChange={setTab} tabs={…} />
 */
export function DetailPage({
  breadcrumbs,
  back,
  title,
  description,
  status,
  actions,
  tabs,
  tab,
  onTabChange,
  defaultTab,
  loading = false,
  error,
  onRetry,
  notFound = false,
  notFoundMessage = 'It may have been deleted, or the link may be out of date.',
  children,
  className,
}: DetailPageProps) {
  const body = (() => {
    if (notFound) {
      return (
        <EmptyState
          variant="placeholder"
          icon={<FileQuestion />}
          title="Not found"
          description={notFoundMessage}
          action={back ? <BackButton {...back} /> : null}
        />
      );
    }

    if (error) {
      return <ErrorState error={error} onRetry={onRetry} />;
    }

    if (loading) {
      return (
        <div aria-busy="true" className="flex flex-col gap-6">
          <Skeleton className="h-32 w-full" />
          <SkeletonText lines={4} />
        </div>
      );
    }

    if (tabs?.length) {
      return (
        <Tabs
          value={tab}
          defaultValue={defaultTab ?? tabs[0]?.value}
          onValueChange={(value) => onTabChange?.(value as string)}
          className="flex flex-col gap-6"
        >
          <TabsList data-testid="detail-tabs">
            {tabs.map((item) => (
              <TabsTab key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </TabsTab>
            ))}
          </TabsList>
          {tabs.map((item) => (
            <TabsPanel key={item.value} value={item.value} className="flex flex-col gap-6">
              {item.content}
            </TabsPanel>
          ))}
        </Tabs>
      );
    }

    return children;
  })();

  return (
    <Page data-slot="detail-page" className={cn(className)}>
      <PageHeader
        breadcrumbs={breadcrumbs}
        back={back}
        title={title}
        description={description}
        status={status}
        actions={actions}
      />
      {body}
    </Page>
  );
}
