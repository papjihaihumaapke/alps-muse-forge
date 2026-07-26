import { useSyncExternalStore } from "react";

export type SizeKind = "kids" | "men" | "women" | "unisex";

let current: SizeKind | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openSizeInfo(kind: SizeKind) {
  current = current === kind ? null : kind;
  emit();
}

export function closeSizeInfo() {
  current = null;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useSizeInfo(): SizeKind | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
