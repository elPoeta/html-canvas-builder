import { VNode } from "@/types/htmlBuilder.types";
import { useState, useCallback, useMemo } from "react";

export const useBuilderHistory = (initialTree: VNode) => {
  const [tree, setTree] = useState<VNode>(initialTree);
  const [history, setHistory] = useState<VNode[]>([]);
  const [future, setFuture] = useState<VNode[]>([]);

  /**
   * Guarda un nuevo estado en el historial.
   * Limpia el "futuro" al hacer un cambio nuevo.
   */
  const pushHistory = useCallback(
    (newTree: VNode) => {
      setHistory((prev) => [...prev, tree]);
      setFuture([]);
      setTree(newTree);
    },
    [tree],
  );

  /**
   * Deshace la última acción.
   */
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previousTree = prev[prev.length - 1];
      setFuture((f) => [tree, ...f]);
      setTree(previousTree);
      return prev.slice(0, -1);
    });
  }, [tree]);

  /**
   * Rehace una acción deshecha.
   */
  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      const nextTree = prev[0];
      setHistory((h) => [...h, tree]);
      setTree(nextTree);
      return prev.slice(1);
    });
  }, [tree]);

  // Estados derivados para facilitar el uso en UI
  const canUndo = useMemo(() => history.length > 0, [history]);
  const canRedo = useMemo(() => future.length > 0, [future]);

  return {
    tree,
    setTree,
    history,
    future,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
