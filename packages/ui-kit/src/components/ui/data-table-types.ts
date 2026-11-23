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
 * The kit's table type surface: TanStack's types bound to `DataTableFeatures`,
 * with the v8-shaped generics consumers already write. This module is the only
 * seam a future TanStack major has to touch.
 */
import {
  createColumnHelper as tanstackCreateColumnHelper,
  flexRender as tanstackFlexRender,
  type AccessorFn,
  type AccessorFnColumnDef as TanstackAccessorFnColumnDef,
  type Cell as TanstackCell,
  type Column as TanstackColumn,
  type ColumnDef as TanstackColumnDef,
  type ColumnDefBase,
  type ColumnVisibilityState,
  type DeepKeys,
  type DeepValue,
  type DisplayColumnDef as TanstackDisplayColumnDef,
  type Header as TanstackHeader,
  type IdIdentifier,
  type IdentifiedColumnDef,
  type ReactTable,
  type Renderable,
  type Row as TanstackRow,
  type RowData,
  type StringHeaderIdentifier,
  type StringOrTemplateHeader,
} from '@tanstack/react-table';
import type { JSX, ReactNode } from 'react';

import type { DataTableFeatures } from './data-table-features.js';

export type { RowData, RowSelectionState, SortingState } from '@tanstack/react-table';

/*
 * The `never` markers keep the union strict. Without them, an object with a
 * misspelled `accessorKey` structurally matches the display member and
 * TypeScript never reports the excess property.
 */
interface NoAccessor {
  accessorKey?: never;
  accessorFn?: never;
}

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown,
> = TanstackAccessorFnColumnDef<DataTableFeatures, TData, TValue> & { accessorKey?: never };

/** Unlike TanStack's `(string & {}) | keyof TData`, a typo here fails to compile. */
export type AccessorKeyColumnDef<TData extends RowData, TValue = unknown> = ColumnDefBase<
  DataTableFeatures,
  TData,
  TValue
> & {
  id?: string;
  header?: StringOrTemplateHeader<DataTableFeatures, TData, TValue>;
  accessorKey: DeepKeys<TData>;
  accessorFn?: never;
};

export type DisplayColumnDef<TData extends RowData, TValue = unknown> = TanstackDisplayColumnDef<
  DataTableFeatures,
  TData,
  TValue
> &
  NoAccessor;

export type GroupColumnDef<TData extends RowData, TValue = unknown> = ColumnDefBase<
  DataTableFeatures,
  TData,
  TValue
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- children carry their own value types
  columns?: ReadonlyArray<ColumnDef<TData, any>>;
} & (IdIdentifier<DataTableFeatures, TData, TValue> | StringHeaderIdentifier) &
  NoAccessor;

export type ColumnDef<TData extends RowData, TValue = unknown> =
  | AccessorFnColumnDef<TData, TValue>
  | AccessorKeyColumnDef<TData, TValue>
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>;

export type Column<TData extends RowData, TValue = unknown> = TanstackColumn<
  DataTableFeatures,
  TData,
  TValue
>;
export type Row<TData extends RowData> = TanstackRow<DataTableFeatures, TData>;
export type Cell<TData extends RowData, TValue = unknown> = TanstackCell<
  DataTableFeatures,
  TData,
  TValue
>;
export type Header<TData extends RowData, TValue = unknown> = TanstackHeader<
  DataTableFeatures,
  TData,
  TValue
>;
export type TableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;
export type VisibilityState = ColumnVisibilityState;

export interface ColumnHelper<TData extends RowData> {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends (TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never),
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? TanstackDisplayColumnDef<DataTableFeatures, TData, TValue>
      : IdentifiedColumnDef<DataTableFeatures, TData, TValue>,
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TData, TValue>
    : AccessorKeyColumnDef<TData, TValue>;
  display: (column: DisplayColumnDef<TData>) => DisplayColumnDef<TData>;
  group: (column: GroupColumnDef<TData>) => GroupColumnDef<TData>;
}

export function createColumnHelper<TData extends RowData>(): ColumnHelper<TData> {
  /*
   * Same runtime object, narrower return types: TanStack's helper spreads the
   * key it was given into `accessorKey`, and that key is already constrained to
   * `DeepKeys<TData>` by the parameter, so the strict result type is accurate.
   */
  return tanstackCreateColumnHelper<DataTableFeatures, TData>() as unknown as ColumnHelper<TData>;
}

export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): ReactNode | JSX.Element {
  return tanstackFlexRender(Comp, props);
}

/*
 * Compile-time check that the strict union flows into `useTable` without a
 * cast. Exported only so `noUnusedLocals` keeps it; not part of the index.
 */
type AssertAssignable<T extends U, U> = T;
export type _StrictColumnDefIsTanstackColumnDef<TData extends RowData, TValue> = AssertAssignable<
  ColumnDef<TData, TValue>,
  TanstackColumnDef<DataTableFeatures, TData, TValue>
>;
