import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `BreadcrumbPage` is the current location: it carries `aria-current="page"`
 * and is deliberately not a link.
 */
export const Playground: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Clusters</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">default</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>web-frontend-01</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Kubernetes paths overflow long before a generic three-crumb example would —
 * cluster, namespace, workload, pod is the routine case, not the edge one.
 * Collapsing the middle keeps the root and the current page, which are the two
 * crumbs anyone actually navigates by.
 */
export const Truncated: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Clusters</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            {/*
              The ellipsis goes *inside* the trigger rather than being rendered
              as it. `BreadcrumbEllipsis` is a presentational span, so using it
              via `render` would both drop native button semantics — Base UI
              warns about exactly this — and leave the control unnamed, because
              its `aria-hidden` also hides the sr-only "More" it carries.
            */}
            <DropdownMenuTrigger
              aria-label="Show collapsed path"
              className="focus-visible:ring-ring/50 flex items-center rounded-md outline-none focus-visible:ring-[3px]"
            >
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>production-eu</DropdownMenuItem>
              <DropdownMenuItem>kube-system</DropdownMenuItem>
              <DropdownMenuItem>deployment/web-frontend</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">web-frontend</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-mono text-xs">
            web-frontend-01
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** Wrapping is the fallback when the path is long but nothing is collapsible. */
export const Wrapping: Story = {
  render: () => (
    <div className="max-w-xs">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">production-eu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">kube-system</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">deployment/web-frontend</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono text-xs">
              batch-worker-07.cluster.local
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};
