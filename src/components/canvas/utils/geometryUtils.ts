import { VNode } from "../types";

export function snapToGrid(value: number, gridSize: number = 8): number {
  return Math.round(value / gridSize) * gridSize;
}

export function getNodeBounds(node: VNode) {
  return {
    left: node.x,
    top: node.y,
    right: node.x + (node.width || 100),
    bottom: node.y + (node.height || 50),
    width: node.width || 100,
    height: node.height || 50,
    centerX: node.x + (node.width || 100) / 2,
    centerY: node.y + (node.height || 50) / 2,
  };
}

export function findSnapGuides(
  movingNode: VNode,
  allNodes: VNode[],
  threshold = 8,
) {
  const guides = { x: [] as number[], y: [] as number[] };
  const movingBounds = getNodeBounds(movingNode);
  allNodes.forEach((node) => {
    if (node.id === movingNode.id) return;
    const bounds = getNodeBounds(node);
    // Vertical guides (X)
    if (Math.abs(movingBounds.left - bounds.left) < threshold)
      guides.x.push(bounds.left);
    if (Math.abs(movingBounds.right - bounds.right) < threshold)
      guides.x.push(bounds.right);
    if (Math.abs(movingBounds.centerX - bounds.centerX) < threshold)
      guides.x.push(bounds.centerX);
    if (Math.abs(movingBounds.left - bounds.right) < threshold)
      guides.x.push(bounds.right);
    if (Math.abs(movingBounds.right - bounds.left) < threshold)
      guides.x.push(bounds.left);
    // Horizontal guides (Y)
    if (Math.abs(movingBounds.top - bounds.top) < threshold)
      guides.y.push(bounds.top);
    if (Math.abs(movingBounds.bottom - bounds.bottom) < threshold)
      guides.y.push(bounds.bottom);
    if (Math.abs(movingBounds.centerY - bounds.centerY) < threshold)
      guides.y.push(bounds.centerY);
    if (Math.abs(movingBounds.top - bounds.bottom) < threshold)
      guides.y.push(bounds.bottom);
    if (Math.abs(movingBounds.bottom - bounds.top) < threshold)
      guides.y.push(bounds.top);
  });
  return {
    x: [...new Set(guides.x)],
    y: [...new Set(guides.y)],
  };
}
