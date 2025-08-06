import { useState, useEffect } from "react";

/**
 * Custom hook for managing pinned quirks in localStorage
 * @param storageKey - The key to use for localStorage (e.g., "canon" or "username-collection")
 * @returns Object with pinned quirk IDs, pin, unpin, and toggle functions
 */
export function usePinnedQuirks(storageKey: string) {
  const [pinnedQuirkIds, setPinnedQuirkIds] = useState<string[]>([]);

  // Load pinned quirks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`pinned-quirks-${storageKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedQuirkIds(parsed);
        }
      }
    } catch (error) {
      console.warn("Failed to load pinned quirks from localStorage:", error);
    }
  }, [storageKey]);

  // Save to localStorage whenever pinned quirks change
  useEffect(() => {
    try {
      localStorage.setItem(
        `pinned-quirks-${storageKey}`,
        JSON.stringify(pinnedQuirkIds),
      );
    } catch (error) {
      console.warn("Failed to save pinned quirks to localStorage:", error);
    }
  }, [pinnedQuirkIds, storageKey]);

  const pinQuirk = (quirkId: string) => {
    setPinnedQuirkIds((prev) => {
      if (!prev.includes(quirkId)) {
        return [...prev, quirkId];
      }
      return prev;
    });
  };

  const unpinQuirk = (quirkId: string) => {
    setPinnedQuirkIds((prev) => prev.filter((id) => id !== quirkId));
  };

  const togglePin = (quirkId: string) => {
    if (pinnedQuirkIds.includes(quirkId)) {
      unpinQuirk(quirkId);
    } else {
      pinQuirk(quirkId);
    }
  };

  const isPinned = (quirkId: string) => pinnedQuirkIds.includes(quirkId);

  return {
    pinnedQuirkIds,
    pinQuirk,
    unpinQuirk,
    togglePin,
    isPinned,
  };
}
