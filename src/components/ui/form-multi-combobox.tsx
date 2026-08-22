import { useRef } from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';

interface FormMultiComboboxProps {
  items: string[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

export function FormMultiCombobox({
  items,
  value,
  onValueChange,
  placeholder = 'Select...',
  emptyMessage = 'No items found.',
  disabled,
  className,
  hasError,
}: FormMultiComboboxProps) {
  const anchor = useComboboxAnchor();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxChips
          ref={anchor}
          className={className}
          aria-invalid={hasError || undefined}
        >
          <ComboboxValue>
            {value.map((v: string) => (
              <ComboboxChip key={v}>{v}</ComboboxChip>
            ))}
            <ComboboxChipsInput
              placeholder={value.length === 0 ? placeholder : undefined}
              disabled={disabled}
            />
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} container={containerRef}>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                <span className="truncate">{item}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
