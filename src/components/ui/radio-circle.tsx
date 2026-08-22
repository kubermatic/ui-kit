import { cn } from '@/lib/utils';

export function RadioCircle({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
        checked ? 'border-primary' : 'border-muted-foreground/40',
      )}
    >
      {checked && <div className="bg-primary size-2 rounded-full" />}
    </div>
  );
}
