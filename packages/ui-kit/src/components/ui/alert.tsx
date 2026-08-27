import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const alertVariants = cva(
  'grid w-full grid-cols-[auto_1fr] items-start gap-x-3 rounded-lg border p-4 [&>svg]:mt-0.5 [&>svg]:size-4 [&>:not(svg)]:col-start-2',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground [&>svg]:text-foreground',
        error:
          'border-destructive/30 bg-destructive/10 text-error-foreground [&>svg]:text-error-foreground',
        info: 'border-info/30 bg-info/10 text-info-soft [&>svg]:text-info-soft',
        success:
          'border-success/30 bg-success/10 text-success-soft [&>svg]:text-success-soft',
        warning:
          'border-warning/30 bg-warning/10 text-warning-soft [&>svg]:text-warning-soft',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    ref?: React.Ref<HTMLDivElement>;
  }) {
  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
}) {
  return (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn('mb-1 leading-none font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
