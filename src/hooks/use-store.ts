"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "balcony-garden-v1";

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("balcony-garden-update", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("balcony-garden-update", handler);
  };
}

function getSnapshot() {
  return Date.now();
}

export function useStoreVersion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

export function useRefreshStore() {
  const version = useStoreVersion();
  const refresh = useCallback(() => {
    window.dispatchEvent(new Event("balcony-garden-update"));
  }, []);
  return { version, refresh };
}
