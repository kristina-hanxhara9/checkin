"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DB_NAME = "propertycheck";
const STORE = "drafts";
const VERSION = 1;

function isBrowser() {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise<T | null>((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => resolve(null);
  });
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

export function useDraft<T>(key: string, initial: T): [T, (next: T) => void, () => void] {
  const [state, setState] = useState<T>(initial);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    idbGet<T>(key).then((stored) => {
      if (stored !== null && stored !== undefined) setState(stored);
    });
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setState(next);
      if (writeTimer.current) clearTimeout(writeTimer.current);
      writeTimer.current = setTimeout(() => {
        idbSet(key, next).catch(() => {});
      }, 200);
    },
    [key]
  );

  const clear = useCallback(() => {
    setState(initial);
    idbDelete(key).catch(() => {});
  }, [key, initial]);

  return [state, update, clear];
}
