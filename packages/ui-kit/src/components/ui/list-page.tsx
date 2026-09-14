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

import type { ReactNode } from 'react';

import { DataTable, type DataTableProps } from './data-table.js';
import { Page, PageHeader, type BackTarget } from './page.js';
import type { BreadcrumbEntry } from './breadcrumb.js';

export interface ListPageProps<TData> extends DataTableProps<TData> {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: readonly BreadcrumbEntry[];
  back?: BackTarget;
  /** The primary action — "New secret" — and any overflow menu. */
  actions?: ReactNode;
}

/**
 * ListPage — a titled page whose body is a resource table.
 *
 * This is the single most repeated shape across both products: one has eleven
 * of them (organisations, projects, members, secrets, config maps, service
 * accounts, roles, services, service objects, blueprints, namespaces) and the
 * other has nine. Each is a heading, a description, a "New …" button and
 * a table — and each one currently spells that out again, so the gap above the
 * table and the position of the action button differ page to page.
 *
 * Every `DataTable` prop passes straight through, so the loading, empty and
 * error states are the table's and there is nothing new to learn:
 *
 *   <ListPage
 *     title="Secrets"
 *     description="Secrets in the selected namespace."
 *     actions={<Button onClick={openCreate}><Plus />New secret</Button>}
 *     data={secrets}
 *     columns={columns}
 *     loading={isLoading}
 *     error={error}
 *     onRetry={refetch}
 *     emptyMessage="No secrets in this namespace yet."
 *   />
 *
 * When a page needs more than a table under the heading — a summary strip, two
 * tables — compose `Page` + `PageHeader` + `DataTable` directly. This template
 * is the common case, not a base class.
 */
export function ListPage<TData>({
  title,
  description,
  breadcrumbs,
  back,
  actions,
  ...tableProps
}: ListPageProps<TData>) {
  return (
    <Page data-slot="list-page">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        back={back}
        actions={actions}
      />
      <DataTable {...tableProps} caption={tableProps.caption ?? undefined} />
    </Page>
  );
}
