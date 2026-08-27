import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Skeleton } from './skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A lone box is close to worthless to review — `animate-pulse` on a rounded
 * `bg-accent` is the whole component. What is worth reviewing is whether a
 * skeleton *layout* matches the shape of the content that replaces it, which is
 * what the two stories below show.
 */
export const Playground: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
};

/**
 * Compare against `Primitives/Table → Playground`: the column widths and the
 * row height should line up, or the table visibly jolts when the data lands.
 */
export const TableLoading: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Node</TableHead>
          <TableHead className="text-right">vCPU</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 4 }, (_, row) => (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="flex justify-end">
              <Skeleton className="h-4 w-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-20 rounded-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** The card equivalent — mirrors `Primitives/Card → Playground`. */
export const CardLoading: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  ),
};
