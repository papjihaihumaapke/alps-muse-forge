import { useSyncExternalStore } from "react";

let current: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openInnovation(slugOrKey: string) {
  current = slugOrKey;
  emit();
}

export function closeInnovation() {
  current = null;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useInnovationId(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
