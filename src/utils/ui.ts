import { useEffect, useState } from "react";

const eventType = "resize";

interface WindowSize {
  readonly width: number;
  readonly height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

  function handleResize() {
    setWindowSize({ width: window?.innerWidth ?? 0, height: window?.innerHeight ?? 0 });
  }

  useEffect(() => {
    window.addEventListener(eventType, handleResize);
    // Set initial window size
    handleResize();
    return () => window.removeEventListener(eventType, handleResize);
  }, []);

  return windowSize;
}

export const loadingDelay = 300;
const afterLoadDelay = 400;

export function runAfterLoad(callback: () => void): void {
  setTimeout(callback, afterLoadDelay);
}

export function ellipsifyAddress(str: string): string {
  return str.length > 26 ? `${str.slice(0, 13)}…${str.slice(-13)}` : str;
}

export async function wait(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry(cb: () => boolean, retries = 3): Promise<void> {
  if (retries < 1) throw new Error(`Retries exceeded for ${cb.name}`);
  if (!cb()) {
    await wait();
    await retry(cb, retries - 1);
  }
}
