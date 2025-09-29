// src/hooks/useSelectedNode.ts

import { useState, useCallback } from "react";

/**
 * Hook para gestionar el nodo seleccionado en el editor.
 *
 * @param initialSelectedId - ID inicial seleccionado (opcional)
 * @returns Objeto con selectedId, setSelectedId, clearSelection y isSelected
 */
export const useSelectedNode = (initialSelectedId: string | null = null) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId,
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const isSelected = useCallback(
    (id: string): boolean => {
      return selectedId === id;
    },
    [selectedId],
  );

  return {
    selectedId,
    setSelectedId,
    clearSelection,
    isSelected,
  };
};
