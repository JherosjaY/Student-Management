import { useEffect, useState, type ReactElement } from 'react';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { Input } from './Input';
import './SearchInput.css';
 
interface SearchInputProps {
  value: string;
  onDebouncedChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  ariaLabel?: string;
}
 
// Controlled input that fires `onDebouncedChange` only after the user stops
// typing for `delay` ms. Local state keeps typing snappy; the debounced effect
// pushes upstream when the user pauses.
export const SearchInput = ({
  value: external,
  onDebouncedChange,
  placeholder = 'Search…',
  delay = 300,
  ariaLabel = 'Search',
}: SearchInputProps): ReactElement => {
  const [local, setLocal] = useState(external);
  const debounced = useDebouncedValue(local, delay);
 
  // Push debounced changes outward
  useEffect(() => {
    if (debounced !== external) {
      onDebouncedChange(debounced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);
 
  // Sync local from outside (e.g., URL change from a back-button navigation)
  useEffect(() => {
    setLocal(external);
  }, [external]);
 
  return (
    <div className="search-input">
      <svg
        className="search-input__icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <Input
        type="search"
        className="search-input__field"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
        }}
      />
    </div>
  );
};
