"use client";

import { useState, useEffect } from "react";

interface UserPreferences {
  theme: "light" | "dark";
  compactMode: boolean;
  showCompleted: boolean;
  sortOrder: "date" | "priority" | "title";
}

const defaults: UserPreferences = {
  theme: "light",
  compactMode: false,
  showCompleted: true,
  sortOrder: "date",
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaults);

  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      try {
        setPreferences({ ...defaults, ...JSON.parse(saved) });
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem("userPreferences", JSON.stringify(updated));
  };

  return { preferences, updatePreference };
}
