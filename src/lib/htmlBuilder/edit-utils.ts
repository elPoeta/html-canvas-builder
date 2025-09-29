import { VNode } from "@/types/htmlBuilder.types";
import { uid } from "./utils";

/**
 * Busca un nodo por su ID en el árbol.
 * @returns El nodo encontrado o `null` si no existe.
 */
export const findNode = (root: VNode, id: string): VNode | null => {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
};

/**
 * Actualiza un nodo en el árbol aplicando una función mutadora (de forma inmutable).
 */
export const updateNode = (
  root: VNode,
  id: string,
  updater: (node: VNode) => void,
): VNode => {
  if (root.id === id) {
    const copy = structuredClone(root);
    updater(copy);
    return copy;
  }
  return {
    ...root,
    children: root.children.map((c) => updateNode(c, id, updater)),
  };
};

/**
 * Elimina un nodo del árbol por su ID (de forma inmutable).
 */
export const removeNode = (root: VNode, id: string): VNode => {
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== id)
      .map((c) => removeNode(c, id)),
  };
};

/**
 * Clona recursivamente un nodo y genera nuevos IDs.
 */
const cloneNodeWithNewIds = (node: VNode): VNode => ({
  ...node,
  id: uid(),
  children: node.children.map(cloneNodeWithNewIds),
});

/**
 * Duplica un nodo hermano inmediatamente después del original.
 */
export const duplicateNode = (root: VNode, id: string): VNode => {
  // Buscar al padre del nodo a duplicar
  let parent: VNode | null = null;
  const findParent = (n: VNode): boolean => {
    for (const child of n.children) {
      if (child.id === id) {
        parent = n;
        return true;
      }
      if (findParent(child)) return true;
    }
    return false;
  };

  findParent(root);
  if (!parent) return root;

  const target = findNode(root, id);
  if (!target) return root;

  const duplicated = cloneNodeWithNewIds(target);
  const newChildren = parent.children.flatMap((child) =>
    child.id === id ? [child, duplicated] : [child],
  );

  // Reemplazar los hijos del padre
  return updateNode(root, parent.id, (n) => {
    n.children = newChildren;
  });
};

/**
 * Añade un nodo hijo a un nodo padre.
 */
export const appendChild = (
  root: VNode,
  parentId: string,
  child: VNode,
): VNode => {
  return updateNode(root, parentId, (n) => {
    n.children = [...n.children, child];
  });
};

/**
 * Inserta un nuevo nodo antes de un nodo objetivo.
 */
export const insertBefore = (
  root: VNode,
  targetId: string,
  newNode: VNode,
): VNode => {
  let parent: VNode | null = null;
  const findParent = (n: VNode): boolean => {
    for (const child of n.children) {
      if (child.id === targetId) {
        parent = n;
        return true;
      }
      if (findParent(child)) return true;
    }
    return false;
  };

  findParent(root);
  if (!parent) return root;

  const targetIndex = parent.children.findIndex((c) => c.id === targetId);
  if (targetIndex === -1) return root;

  const newChildren = [
    ...parent.children.slice(0, targetIndex),
    newNode,
    ...parent.children.slice(targetIndex),
  ];

  return updateNode(root, parent.id, (n) => {
    n.children = newChildren;
  });
};

/**
 * Inserta un nuevo nodo después de un nodo objetivo.
 */
export const insertAfter = (
  root: VNode,
  targetId: string,
  newNode: VNode,
): VNode => {
  let parent: VNode | null = null;
  const findParent = (n: VNode): boolean => {
    for (const child of n.children) {
      if (child.id === targetId) {
        parent = n;
        return true;
      }
      if (findParent(child)) return true;
    }
    return false;
  };

  findParent(root);
  if (!parent) return root;

  const targetIndex = parent.children.findIndex((c) => c.id === targetId);
  if (targetIndex === -1) return root;

  const newChildren = [
    ...parent.children.slice(0, targetIndex + 1),
    newNode,
    ...parent.children.slice(targetIndex + 1),
  ];

  return updateNode(root, parent.id, (n) => {
    n.children = newChildren;
  });
};

/**
 * Mueve un nodo hermano una posición arriba o abajo dentro de su mismo padre.
 * Solo funciona si el nodo tiene hermanos en la dirección indicada.
 */
export const moveNodeInTree = (
  root: VNode,
  nodeId: string,
  direction: "up" | "down",
): VNode => {
  // Buscar al padre del nodo
  let parent: VNode | null = null;
  const findParent = (n: VNode): boolean => {
    for (const child of n.children) {
      if (child.id === nodeId) {
        parent = n;
        return true;
      }
      if (findParent(child)) return true;
    }
    return false;
  };

  findParent(root);
  if (!parent) return root;

  const currentIndex = parent.children.findIndex((c) => c.id === nodeId);
  if (currentIndex === -1) return root;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= parent.children.length) return root;

  // Clonar el árbol y reordenar
  const newChildren = [...parent.children];
  [newChildren[currentIndex], newChildren[targetIndex]] = [
    newChildren[targetIndex],
    newChildren[currentIndex],
  ];

  return updateNode(root, parent.id, (n) => {
    n.children = newChildren;
  });
};

export const findVNodeById = (node: VNode, id: string): VNode | null => {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findVNodeById(child, id);
    if (found) return found;
  }
  return null;
};
