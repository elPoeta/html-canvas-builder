/* eslint-disable @typescript-eslint/no-explicit-any */

export type VNode = {
  id: string;
  tag: string;
  attrs: Record<string, string>;
  children: VNode[];
  text?: string;
};

export type Project = {
  name: string;
  tree: VNode;
  timestamp: number;
  version: string;
};

export type Block = {
  label: string;
  category: string;
  icon: React.ReactNode;
  make: () => VNode;
};

export type TailwindClass = {
  name: string;
  category: TailwindCategory;
  description: string;
};

export type TailwindCategory =
  | "colors"
  | "layout"
  | "flexbox"
  | "grid"
  | "spacing"
  | "sizing"
  | "typography"
  | "borders"
  | "effects"
  | "transitions"
  | "interactivity"
  | "hover"
  | "positioning"
  | "overflow"
  | "transforms";

export type TailwindCatalog = {
  colors: TailwindClass[];
  layout: TailwindClass[];
  flexbox: TailwindClass[];
  grid: TailwindClass[];
  spacing: TailwindClass[];
  sizing: TailwindClass[];
  typography: TailwindClass[];
  borders: TailwindClass[];
  effects: TailwindClass[];
  transitions: TailwindClass[];
  interactivity: TailwindClass[];
  hover: TailwindClass[];
  positioning: TailwindClass[];
  overflow: TailwindClass[];
  transforms: TailwindClass[];
};

export type CommonWebEditorContent = {
  id: string;
  disabled: boolean;
};

export interface DynamicHandlerMap {
  [elementId: string]: {
    [eventType: string]: string; // handler code as string
  };
}

export type HtmlWebEditorContent = {
  enableEvents: boolean;
  source: string;
  classNames: string;
  dynamicHandlers?: DynamicHandlerMap;
  eventContext?: Record<string, any>;
} & CommonWebEditorContent;
