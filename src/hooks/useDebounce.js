import { useEffect, useState } from 'react';

/**
 * Debounces a rapidly changing value (e.g., search query input)
 *
 * @param {any} value
 * @param {number} [delay=300]
 * @returns {any}
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

