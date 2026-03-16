"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrl = false
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (ctrl && !e.ctrlKey && !e.metaKey) return;
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, ctrl]);
}
