import { VNode } from "../types";

export function findNode(root: VNode, id: string): VNode | null {
  if (root.id === id) return root;
  for (const c of root.children) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
}

export function updateNode(
  root: VNode,
  id: string,
  updater: (n: VNode) => void,
): VNode {
  if (root.id === id) {
    const copy = structuredClone(root);
    updater(copy);
    return copy;
  }
  return {
    ...root,
    children: root.children.map((c) => updateNode(c, id, updater)),
  };
}

export function removeNode(root: VNode, id: string): VNode {
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== id)
      .map((c) => removeNode(c, id)),
  };
}

export function appendChild(
  root: VNode,
  parentId: string,
  child: VNode,
): VNode {
  return updateNode(root, parentId, (n) => {
    n.children = [...n.children, child];
  });
}

export function flattenTree(
  n: VNode,
  depth = 0,
): {
  id: string;
  tag: string;
  depth: number;
  text?: string;
  locked?: boolean;
}[] {
  const nodeInfo = {
    id: n.id,
    tag: n.tag,
    depth,
    text: n.text
      ? n.text.slice(0, 15) + (n.text.length > 15 ? "..." : "")
      : undefined,
    locked: n.locked,
  };
  return [nodeInfo, ...n.children.flatMap((c) => flattenTree(c, depth + 1))];
}
