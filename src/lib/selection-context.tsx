"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SelectionContextValue = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

/**
 * Shared across SiteHeader and LocationsExperience so the persistent
 * header CTA always reflects the local the visitor is actually looking
 * at, instead of silently defaulting to one they never chose.
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <SelectionContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within a SelectionProvider");
  return ctx;
}
