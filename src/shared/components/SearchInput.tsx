import { useState, useEffect, useCallback } from 'react';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  disabled = false
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  const debouncedOnChange = useCallback(
    debounce(onChange, debounceMs),
    [onChange, debounceMs]
  );

  useEffect(() => {
    debouncedOnChange(localValue);
    return () => {
      debouncedOnChange.cancel?.();
    };
  }, [localValue, debouncedOnChange]);

  const handleInputChange = (inputValue: string) => {
    setLocalValue(inputValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={localValue}
      onValueChange={handleInputChange}
      onClear={handleClear}
      isClearable
      isDisabled={disabled}
      startContent={
        <Search 
          className="text-default-400 pointer-events-none flex-shrink-0" 
          size={18} 
        />
      }
      classNames={{
        base: "max-w-full sm:max-w-[20rem]",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
      }}
      size="sm"
    />
  );
}

function debounce(func: (value: string) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = ((value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(value), wait);
  }) as typeof func & { cancel: () => void };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
}