export type VNode = {
  id: string;
  tag: string;
  attrs: Record<string, string>;
  children: VNode[];
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  locked?: boolean;
  zIndex?: number;
};

export type Project = {
  name: string;
  tree: VNode;
  timestamp: number;
  version: string;
};

export type SelectionBox = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
