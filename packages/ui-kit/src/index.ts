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
// Styles are shipped as separate entry points: `@kubermatic/ui-kit/theme.css`
// and `@kubermatic/ui-kit/preflight.css`.
//
// Relative specifiers carry an explicit `.js` extension. TypeScript resolves
// them back to the `.tsx` sources, and it is what makes the emitted
// declarations resolvable under Node16 ESM — without it, a consumer on
// `moduleResolution: nodenext` cannot resolve any of this package's types.

/* ------------------------------------------------------------- primitives */

export { Badge, badgeVariants, type BadgeProps } from './components/ui/badge.js';
export { Button, buttonVariants, type ButtonProps } from './components/ui/button.js';
export { Text, textVariants, type TextProps } from './components/ui/text.js';
export { Separator, type SeparatorProps } from './components/ui/separator.js';
export { Spinner, spinnerVariants, type SpinnerProps } from './components/ui/spinner.js';
export { Skeleton, SkeletonText, type SkeletonTextProps } from './components/ui/skeleton.js';
export { Avatar, avatarVariants, initialsOf, type AvatarProps } from './components/ui/avatar.js';
export { ScrollArea, type ScrollAreaProps } from './components/ui/scroll-area.js';
export {
  Code,
  CodeBlock,
  type CodeBlockProps,
  type CodeProps,
} from './components/ui/code-block.js';
export { CopyButton, type CopyButtonProps } from './components/ui/copy-button.js';

/* ------------------------------------------------------------------ forms */

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
  type FieldProps,
} from './components/ui/field.js';
export { Input, inputVariants, type InputProps } from './components/ui/input.js';
export { Textarea, type TextareaProps } from './components/ui/textarea.js';
export {
  FilterSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type FilterSelectProps,
  type SelectContentProps,
  type SelectItemProps,
  type SelectOption,
  type SelectTriggerProps,
} from './components/ui/select.js';
export {
  Combobox,
  MultiCombobox,
  type ComboboxItem,
  type ComboboxOption,
  type ComboboxProps,
  type MultiComboboxProps,
} from './components/ui/combobox.js';
export { Checkbox, type CheckboxProps } from './components/ui/checkbox.js';
export { Switch, type SwitchProps } from './components/ui/switch.js';
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioProps,
} from './components/ui/radio-group.js';
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupItemProps,
  type ToggleGroupProps,
} from './components/ui/toggle-group.js';
export {
  KeyValueEditor,
  type KeyValueEditorProps,
  type KeyValuePair,
} from './components/ui/key-value-editor.js';
export { TagInput, type TagInputProps } from './components/ui/tag-input.js';

/* ----------------------------------------------------------- data display */

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
  type CardTitleProps,
} from './components/ui/card.js';
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableRowProps,
} from './components/ui/table.js';
export {
  DescriptionItem,
  DescriptionList,
  type DescriptionItemProps,
  type DescriptionListProps,
} from './components/ui/description-list.js';
export {
  Timeline,
  TimelineItem,
  type TimelineItemProps,
  type TimelineProps,
} from './components/ui/timeline.js';
export {
  StatusBadge,
  StatusDot,
  statusBadgeVariants,
  statusDotVariants,
  type StatusBadgeProps,
  type StatusDotProps,
  type StatusTone,
} from './components/ui/status-badge.js';

/* --------------------------------------------------------------- feedback */

export { Alert, alertVariants, type AlertProps, type AlertTone } from './components/ui/alert.js';
export { EmptyState, type EmptyStateProps } from './components/ui/empty-state.js';
export { ErrorState, errorMessage, type ErrorStateProps } from './components/ui/error-state.js';
export {
  ToastProvider,
  Toaster,
  useToast,
  type ToastOptions,
  type ToastTone,
  type ToasterProps,
  type UseToastResult,
} from './components/ui/toast.js';

/* --------------------------------------------------------------- overlays */

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
  type DialogContentProps,
  type DialogFooterProps,
} from './components/ui/dialog.js';
export { ConfirmDialog, type ConfirmDialogProps } from './components/ui/confirm-dialog.js';
export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  drawerContentVariants,
  type DrawerContentProps,
} from './components/ui/drawer.js';
export {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  type PopoverContentProps,
} from './components/ui/popover.js';
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  type TooltipContentProps,
  type TooltipProps,
} from './components/ui/tooltip.js';
export {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuContentProps,
  type MenuItemProps,
  type MenuLinkItemProps,
} from './components/ui/menu.js';

/* ------------------------------------------------------------- navigation */

export {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  tabsListVariants,
  tabsTabVariants,
  type TabsListProps,
  type TabsTabProps,
} from './components/ui/tabs.js';
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
  type BreadcrumbEntry,
  type BreadcrumbLinkProps,
  type BreadcrumbsProps,
} from './components/ui/breadcrumb.js';

/* ------------------------------------------------------------- data table */

export { DataTable, type DataTableProps } from './components/ui/data-table.js';
export {
  DataTableColumnHeader,
  ariaSort,
  type DataTableColumnHeaderProps,
} from './components/ui/data-table-column-header.js';
export {
  DataTablePagination,
  type DataTablePaginationProps,
} from './components/ui/data-table-pagination.js';
export {
  SELECTION_COLUMN_ID,
  selectionColumn,
  type SelectionColumnOptions,
} from './components/ui/data-table-selection-column.js';

/*
 * The TanStack Table surface a consumer needs to declare columns.
 *
 * Re-exported because `@tanstack/react-table` is a *direct* dependency of this
 * package rather than a peer (ADR 0002, category B: no cross-boundary identity
 * requirement — a table instance is created per call). Products get it
 * transitively and must never install their own copy, and "must never" is only
 * enforceable if they never need to. So the types and helpers required to write
 * a `ColumnDef` come from here.
 */
export {
  createColumnHelper,
  flexRender,
  type Cell,
  type Column,
  type ColumnDef,
  type Header,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TableInstance,
  type VisibilityState,
} from '@tanstack/react-table';

/* ------------------------------------------------------------- app frame */

export {
  BrandProvider,
  Logo,
  useBrand,
  type Brand,
  type BrandLinkElement,
  type BrandProviderProps,
  type LogoProps,
} from './components/ui/brand.js';
export {
  Sidebar,
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarNav,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  type NavItem,
  type NavSection,
  type SidebarContextValue,
  type SidebarMenuButtonProps,
  type SidebarNavProps,
  type SidebarProps,
  type SidebarProviderProps,
  type SidebarState,
  type SidebarTriggerProps,
} from './components/ui/sidebar.js';
export { AppHeader, type AppHeaderProps } from './components/ui/app-header.js';
export { AppFooter, type AppFooterProps } from './components/ui/app-footer.js';
export { AppShell, type AppShellLayout, type AppShellProps } from './components/ui/app-shell.js';
export { SkipLink, type SkipLinkProps } from './components/ui/skip-link.js';
export { ThemeToggle, type ThemeToggleProps } from './components/ui/theme-toggle.js';
export { UserMenu, type UserMenuProps, type UserMenuUser } from './components/ui/user-menu.js';

/* -------------------------------------------------------- page templates */

export {
  BackButton,
  Page,
  PageContent,
  PageHeader,
  PageToolbar,
  Section,
  type BackTarget,
  type PageHeaderProps,
  type SectionProps,
} from './components/ui/page.js';
export { ListPage, type ListPageProps } from './components/ui/list-page.js';
export { DetailPage, type DetailPageProps, type DetailTab } from './components/ui/detail-page.js';

export {
  ThemeProvider,
  useTheme,
  type Theme,
  type ResolvedTheme,
  type ThemeProviderProps,
  type ThemeTokenName,
  type ThemeTokens,
  type ThemeOverrides,
} from './hooks/use-theme.js';
export { useMediaQuery } from './hooks/use-media-query.js';
export {
  useCopyToClipboard,
  type UseCopyToClipboardOptions,
  type UseCopyToClipboardResult,
} from './hooks/use-copy-to-clipboard.js';

export { cn } from './lib/utils.js';

// The no-flash script, as a function rather than a snippet to copy — it has to
// agree with `ThemeProvider` about the storage key and the class name.
export { themeScript, DEFAULT_STORAGE_KEY, type ThemeScriptOptions } from './lib/theme-script.js';

/*
 * Contrast measurement, and the token contract it is measured against.
 *
 * The built-in palette is verified in this repo's CI. A palette supplied
 * through `tokens` is not, so the same check is exported: point
 * `auditThemeContrast` at the element your theme is mounted on and assert the
 * failures are empty in your own test suite.
 */
export {
  auditThemeContrast,
  contrastRatio,
  formatRatio,
  parseColor,
  type ContrastReport,
  type ContrastResult,
} from './lib/contrast.js';

export {
  AA_NON_TEXT,
  AA_TEXT,
  BRAND_ROLES,
  BRAND_ROLE_NAMES,
  COLOR_ROLES,
  COLOR_ROLE_NAMES,
  CONTRAST_PAIRS,
  FONT_ROLES,
  SHAPE_ROLES,
  type BrandRole,
  type ColorRole,
  type ContrastPair,
  type FontRole,
  type ShapeRole,
} from './styles/tokens.js';
