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
  return str.length > 12 ? `${str.slice(0, 6)}…${str.slice(-6)}` : str;
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

export function getTimeFromSeconds(seconds: number): string {
  const numDays = Math.floor(seconds / (3600 * 24));
  const numHours = Math.floor((seconds % (3600 * 24)) / 3600);
  const numMinutes = Math.floor((seconds % 3600) / 60);
  const numSeconds = Math.floor(seconds % 60);

  const strDays = numDays > 0 ? numDays + (numDays === 1 ? " day, " : " days, ") : "";
  const strHours = numHours > 0 ? numHours + (numHours === 1 ? " hour, " : " hours, ") : "";
  const strMinutes = numMinutes > 0 ? numMinutes + (numMinutes === 1 ? " minute, " : " minutes, ") : "";
  const strSeconds = numSeconds > 0 ? numSeconds + (numSeconds === 1 ? " second" : " seconds") : "";

  const time = strDays + strHours + strMinutes + strSeconds;

  return time.endsWith(", ") ? time.slice(undefined, -2) : time;
}
