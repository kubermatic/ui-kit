'use client';

import { Separator as SeparatorPrimitive } from '@base-ui/react';

import { cn } from '@/lib/utils';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorPrimitive.Props & {
  /**
   * When true the separator is presentational only and hidden from the
   * accessibility tree. Mirrors the ARIA `separator` / `none` role split.
   */
  decorative?: boolean;
}) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      {...(decorative ? { role: 'none', 'aria-orientation': undefined } : {})}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
