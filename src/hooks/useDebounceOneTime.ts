/* eslint-disable import/prefer-default-export */
import { useEffect, useState, useRef } from 'react';

export const useDebounceOneTime = (ms = 1000): [boolean, () => void] => {
  const [debounceDone, setDebounceDone] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceOneTimeTouch = () => {
    if (debounceDone) {
      setDebounceDone(false);
    }
    setCurrentValue((prev) => prev + 1);
  };

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setCurrentValue(0);
      setDebounceDone(true);
      timeoutId.current = null;
    }, ms);
  }, [currentValue, ms]);

  return [debounceDone, debounceOneTimeTouch];
};
