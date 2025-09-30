/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  const ref = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => callback(...args), delay);
  };
}
