import { useEffect, useState } from 'react';

export default function useAutoResetStorageValue<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  // Write state method that stores in localstorage and resets on a daily basis
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return initialValue;
    }

    const parsed = JSON.parse(item);
    const today = new Date().toDateString();

    if (parsed.date === today) {
      return parsed.value;
    }

    window.localStorage.removeItem(key);
    return initialValue;
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const valueToStore = {
      date: today,
      value: storedValue,
    };

    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
