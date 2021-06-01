import { useState } from "react";
import { useError } from "service";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  serializeFn?: (value: T) => string,
  deserializeFn?: (value: string) => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const identity = (x: any): any => x;
  const serialize = serializeFn ?? identity;
  const deserialize = deserializeFn ?? identity;

  const { handleError } = useError();
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      handleError(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, serialize(valueToStore));
    } catch (error) {
      handleError(error);
    }
  };

  return [storedValue, setValue];
}
