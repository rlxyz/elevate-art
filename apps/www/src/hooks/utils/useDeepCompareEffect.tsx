import { dequal as deepEqual } from "dequal";
import { useEffect, useRef } from "react";

export function useDeepEqualMemo<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(callback: () => void, dependencies: any) {
  useEffect(callback, dependencies.map(useDeepEqualMemo));
}
