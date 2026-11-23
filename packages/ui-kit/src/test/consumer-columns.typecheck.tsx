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
 * Column definitions written the way a product writes them, checked by
 * `npm run typecheck` and never executed.
 *
 * It imports only from the package entry point, so it sees exactly the type
 * surface a consumer sees. If a TanStack upgrade changes what `ColumnDef`
 * accepts, this file stops compiling before any product does. Not a `.test`
 * file on purpose: vitest skips it, and `src/test/` is outside the build.
 */
import { DataTable, createColumnHelper, type ColumnDef } from '../index.js';

interface Row {
  name: string;
  namespace: string;
  replicas: number;
  labels: Record<string, string>;
  spec: { image: string };
}

const columns: ColumnDef<Row, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => (
      <a href={`/workloads/${info.row.original.namespace}`}>{String(info.getValue())}</a>
    ),
    size: 240,
  },
  {
    id: 'labels',
    accessorFn: (row) => Object.keys(row.labels).length,
    header: 'Labels',
    cell: (info) => `${String(info.getValue())} on ${info.row.original.name}`,
  },
  {
    accessorKey: 'replicas',
    header: 'Replicas',
    size: 120,
  },
  {
    accessorKey: 'spec.image',
    header: 'Image',
  },
  {
    id: 'actions',
    cell: (info) => <button type="button">Edit {info.row.original.name}</button>,
  },
  {
    // @ts-expect-error — `owner` is not a field of `Row`.
    accessorKey: 'owner',
    header: 'Owner',
  },
];

const columnHelper = createColumnHelper<Row>();

const helperColumns = [
  columnHelper.accessor('replicas', {
    header: 'Replicas',
    cell: (info) => info.getValue().toFixed(0),
    size: 120,
  }),
  columnHelper.accessor((row) => row.namespace, {
    id: 'namespace',
    cell: (info) => info.getValue().toUpperCase(),
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => <button type="button">Edit {info.row.original.name}</button>,
  }),
  // @ts-expect-error — `owner` is not a field of `Row`.
  columnHelper.accessor('owner', { header: 'Owner' }),
];

export function ConsumerTables({ rows }: { rows: Row[] }) {
  return (
    <>
      <DataTable<Row> data={rows} columns={columns} getRowId={(row) => row.name} />
      <DataTable<Row> data={rows} columns={helperColumns} />
    </>
  );
}
