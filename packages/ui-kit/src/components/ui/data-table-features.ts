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
import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table';

/**
 * The one feature set every `DataTable` is built with. Internal: consumers see
 * it only through the aliases in `data-table-types.ts`.
 *
 * Module-level so its identity is stable across renders.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  // Not used directly: v9 requires it alongside `globalFilteringFeature`.
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  columnSizingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  /*
   * Exactly the names `'auto'` can resolve to. An unregistered `text` or
   * `alphanumeric` silently falls back to `basic`, which sorts case-sensitively.
   */
  sortFns: {
    text: sortFn_text,
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
});

export type DataTableFeatures = typeof dataTableFeatures;
