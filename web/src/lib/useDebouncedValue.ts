import { useEffect, useState } from 'react';
 
// Returns `value` after `delay` ms of stillness. Updates that arrive sooner
// reset the timer. Useful for search inputs to avoid a query per keystroke.
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState<T>(value);
 
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => {
      window.clearTimeout(handle);
    };
  }, [value, delay]);
 
  return debounced;
};
