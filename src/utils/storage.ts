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
      if (error instanceof Error) {
        handleError(error);
      }
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, serialize(valueToStore));
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  };

  return [storedValue, setValue];
}

export const useOcAddress = (): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => useLocalStorage<string | undefined>("oversight-community", "");

export const useOcProposalsAddress = (): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => useLocalStorage<string | undefined>("oversight-community-proposals", "");

export const useApAddress = (): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => useLocalStorage<string | undefined>("arbiter-pool", "");

export const useApProposalsAddress = (): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => useLocalStorage<string | undefined>("arbiter-pool-proposals", "");

export async function getFileImgType(file: File): Promise<"svg" | "png"> {
  const text = await file.text();
  const isSvg = text.trim().endsWith("</svg>");
  return isSvg ? "svg" : "png";
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
