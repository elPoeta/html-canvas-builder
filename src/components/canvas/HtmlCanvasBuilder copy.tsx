import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Upload,
  Download,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Plus,
  Layers,
  Type,
  Palette,
  MousePointer2,
  Move,
  SquarePlus,
  Code,
  Search,
  ZoomIn,
  ZoomOut,
  Magnet,
  Eye,
  Save,
  FolderOpen,
  Grid3X3,
  Link,
  Hash,
  Image,
  Play,
  Square,
  Grip,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Lock,
  Unlock,
} from "lucide-react";

// Types
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

type SelectionBox = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

// Helpers
const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_HTML = `
<section class="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
  <div class="max-w-6xl mx-auto px-6 py-16">
    <div class="text-center space-y-6 mb-16">
      <h1 class="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Crea algo increíble
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Un constructor HTML moderno con todas las herramientas que necesitas
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div class="space-y-6">
        <div class="p-8 rounded-3xl bg-white shadow-xl border border-gray-100">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Características</h2>
          <div class="space-y-3 text-gray-600">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
              Grid inteligente y snapping
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-purple-500"></div>
              Drag & Drop avanzado
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-cyan-500"></div>
              Vista previa en vivo
            </div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
        <div class="relative p-8 rounded-3xl bg-white shadow-xl border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Empezar ahora</h3>
          <p class="text-gray-600 mb-6">Arrastra elementos, edita propiedades y crea diseños increíbles</p>
          <button class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-300">
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  </div>
</section>`;

// DOM parsing helpers
function domToVNode(node: Node, x: number = 0, y: number = 0): VNode | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || "").trim();
    if (!text) return null;
    return {
      id: uid(),
      tag: "span",
      attrs: {},
      children: [],
      text,
      x,
      y,
      width: 100,
      height: 20,
    };
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const attrs: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    attrs[a.name] = a.value;
  }
  const children: VNode[] = [];
  for (const child of Array.from(el.childNodes)) {
    const v = domToVNode(child, x, y);
    if (v) children.push(v);
  }
  return {
    id: uid(),
    tag: el.tagName.toLowerCase(),
    attrs,
    children,
    x,
    y,
    width: 200,
    height: 100,
  };
}

function htmlToVNodeTree(html: string): VNode {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const wrapper = document.createElement("div");
  Array.from(doc.body.childNodes).forEach((n) =>
    wrapper.appendChild(n.cloneNode(true)),
  );
  const v = domToVNode(wrapper, 0, 0);
  if (!v) throw new Error("No se pudo parsear el HTML");
  v.tag = "div";
  v.attrs = { ...v.attrs, class: (v.attrs.class || "") + " relative" };
  v.width = 1200;
  v.height = 800;
  return v;
}

// Serialization
function vnodeToHtml(v: VNode): string {
  const attrsStr = Object.entries(v.attrs || {})
    .filter(([k]) => !k.startsWith("data-"))
    .map(([k, val]) => `${k}="${val.replace(/"/g, "&quot;")}"`)
    .join(" ");
  const open = attrsStr ? `<${v.tag} ${attrsStr}>` : `<${v.tag}>`;
  if (v.children?.length) {
    return `${open}${v.children.map(vnodeToHtml).join("")}</${v.tag}>`;
  }
  if (v.text != null) return `${open}${escapeHtml(v.text)}</${v.tag}>`;
  return `${open}</${v.tag}>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Tree operations
function findNode(root: VNode, id: string): VNode | null {
  if (root.id === id) return root;
  for (const c of root.children) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
}

function updateNode(
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

function removeNode(root: VNode, id: string): VNode {
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== id)
      .map((c) => removeNode(c, id)),
  };
}

function appendChild(root: VNode, parentId: string, child: VNode): VNode {
  return updateNode(root, parentId, (n) => {
    n.children = [...n.children, child];
  });
}

// Geometric helpers
function snapToGrid(value: number, gridSize: number = 8): number {
  return Math.round(value / gridSize) * gridSize;
}

function getNodeBounds(node: VNode) {
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

function doRectsOverlap(rect1: any, rect2: any, threshold = 5) {
  return !(
    rect1.right < rect2.left + threshold ||
    rect2.right < rect1.left + threshold ||
    rect1.bottom < rect2.top + threshold ||
    rect2.bottom < rect1.top + threshold
  );
}

function findSnapGuides(movingNode: VNode, allNodes: VNode[], threshold = 8) {
  const guides = { x: [], y: [] } as { x: number[]; y: number[] };
  const movingBounds = getNodeBounds(movingNode);
  allNodes.forEach((node) => {
    if (node.id === movingNode.id) return;
    const bounds = getNodeBounds(node);
    // Vertical guides (X positions)
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
    // Horizontal guides (Y positions)
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

// Block definitions
const BLOCKS: {
  label: string;
  make: () => VNode;
  icon: React.ReactNode;
  category: string;
}[] = [
  {
    label: "Título H1",
    category: "Texto",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "h1",
      attrs: { class: "text-4xl font-bold text-gray-800" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Nuevo título",
          x: 0,
          y: 0,
        },
      ],
      x: 0,
      y: 0,
      width: 300,
      height: 60,
    }),
  },
  {
    label: "Párrafo",
    category: "Texto",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "p",
      attrs: { class: "text-gray-600 leading-relaxed" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Texto de ejemplo...",
          x: 0,
          y: 0,
        },
      ],
      x: 0,
      y: 0,
      width: 400,
      height: 80,
    }),
  },
  {
    label: "Botón Primario",
    category: "Botones",
    icon: <SquarePlus className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-300",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Botón",
          x: 0,
          y: 0,
        },
      ],
      x: 0,
      y: 0,
      width: 120,
      height: 50,
    }),
  },
  {
    label: "Tarjeta",
    category: "Layout",
    icon: <Layers className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: {
        class: "p-8 rounded-3xl bg-white shadow-xl border border-gray-100",
      },
      children: [],
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    }),
  },
  {
    label: "Imagen",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "img",
      attrs: {
        class: "rounded-2xl object-cover",
        src: "https://via.placeholder.com/300x200/6366f1/ffffff?text=Imagen",
        alt: "Imagen",
      },
      children: [],
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    }),
  },
];

// Resizable panel component
const ResizablePanel = ({
  children,
  className = "",
  minWidth = 250,
  maxWidth = 600,
  defaultWidth = 300,
  onWidthChange,
  side = "left",
}: {
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  side?: "left" | "right";
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX =
        side === "left"
          ? e.clientX - startX.current
          : startX.current - e.clientX;
      const newWidth = Math.min(
        maxWidth,
        Math.max(minWidth, startWidth.current + deltaX),
      );
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, maxWidth, minWidth, onWidthChange, side]);
  return (
    <div className={`relative flex ${className}`} style={{ width }}>
      {side === "right" && (
        <div
          className="w-1 bg-gray-200 hover:bg-indigo-400 cursor-ew-resize transition-colors flex-shrink-0"
          onMouseDown={handleMouseDown}
        />
      )}
      <div className="flex-1 min-w-0">{children}</div>
      {side === "left" && (
        <div
          className="w-1 bg-gray-200 hover:bg-indigo-400 cursor-ew-resize transition-colors flex-shrink-0"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};

// Main component
export function HtmlCanvasBuilder() {
  const [rawHtml, setRawHtml] = useState<string>(DEFAULT_HTML);
  const [tree, setTree] = useState<VNode>(() => htmlToVNodeTree(DEFAULT_HTML));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [snap, setSnap] = useState(true);
  const [gridSize, setGridSize] = useState(8);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<VNode[]>([]);
  const [future, setFuture] = useState<VNode[]>([]);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({
    x: [],
    y: [],
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string>(
    "Proyecto sin título",
  );
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  // Selection and interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(
    null,
  );
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragData = useRef<{
    nodeIds: string[];
    startX: number;
    startY: number;
    originalPositions: Map<string, { x: number; y: number }>;
  } | null>(null);

  const selectedNodes = useMemo(
    () =>
      Array.from(selectedIds)
        .map((id) => findNode(tree, id))
        .filter(Boolean) as VNode[],
    [tree, selectedIds],
  );
  const primarySelectedNode = selectedNodes[0] || null;

  // Flatten tree for easier operations
  const flattenNodes = useCallback((node: VNode): VNode[] => {
    return [node, ...node.children.flatMap((child) => flattenNodes(child))];
  }, []);
  const allNodes = useMemo(() => flattenNodes(tree), [tree, flattenNodes]);

  const pushHistory = (next: VNode) => {
    setHistory((h) => [...h, tree]);
    setFuture([]);
    setTree(next);
  };

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [tree, ...f]);
      setTree(prev);
      return h.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setHistory((h) => [...h, tree]);
      setTree(next);
      return f.slice(1);
    });
  };

  // Canvas interaction handlers
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (previewMode) return;
      const target = e.target as HTMLElement;
      const nodeElement = target.closest("[data-node-id]");
      const nodeId = nodeElement?.getAttribute("data-node-id");
      if (nodeId && !target.closest("[data-resize-handle]")) {
        e.preventDefault();
        e.stopPropagation();
        if (e.metaKey || e.ctrlKey) {
          setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
              newSet.delete(nodeId);
            } else {
              newSet.add(nodeId);
            }
            return newSet;
          });
        } else if (e.shiftKey && selectedIds.size > 0) {
          setSelectedIds((prev) => new Set([...prev, nodeId]));
        } else {
          setSelectedIds(new Set([nodeId]));
        }
        const selectedNodes = nodeId
          ? [nodeId, ...Array.from(selectedIds)]
          : [];
        const uniqueSelected = [...new Set(selectedNodes)];
        setIsDragging(true);
        const originalPositions = new Map();
        uniqueSelected.forEach((id) => {
          const node = findNode(tree, id);
          if (node) {
            originalPositions.set(id, { x: node.x, y: node.y });
          }
        });
        dragData.current = {
          nodeIds: uniqueSelected,
          startX: e.clientX,
          startY: e.clientY,
          originalPositions,
        };
      } else if (!nodeId) {
        if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
          setSelectedIds(new Set());
        }
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
          const startX = (e.clientX - canvasRect.left) / zoom;
          const startY = (e.clientY - canvasRect.top) / zoom;
          setIsSelecting(true);
          setSelectionBox({ startX, startY, endX: startX, endY: startY });
        }
      }
    },
    [previewMode, selectedIds, tree, zoom],
  );

  const handleCanvasMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && dragData.current) {
        const deltaX = (e.clientX - dragData.current.startX) / zoom;
        const deltaY = (e.clientY - dragData.current.startY) / zoom;
        let newTree = tree;
        const currentGuides = { x: [], y: [] } as { x: number[]; y: number[] };
        dragData.current.nodeIds.forEach((nodeId) => {
          const original = dragData.current!.originalPositions.get(nodeId);
          if (original) {
            let newX = original.x + deltaX;
            let newY = original.y + deltaY;
            if (showGuides && snap) {
              const node = findNode(newTree, nodeId);
              if (node) {
                const tempNode = { ...node, x: newX, y: newY };
                const guides = findSnapGuides(
                  tempNode,
                  allNodes.filter((n) => n.id !== nodeId),
                );
                guides.x.forEach((guideX) => {
                  const snapDistance = 8;
                  const bounds = getNodeBounds(tempNode);
                  if (Math.abs(bounds.left - guideX) < snapDistance) {
                    newX = guideX;
                    currentGuides.x.push(guideX);
                  } else if (Math.abs(bounds.right - guideX) < snapDistance) {
                    newX = guideX - (bounds.width || 100);
                    currentGuides.x.push(guideX);
                  } else if (Math.abs(bounds.centerX - guideX) < snapDistance) {
                    newX = guideX - (bounds.width || 100) / 2;
                    currentGuides.x.push(guideX);
                  }
                });
                guides.y.forEach((guideY) => {
                  const snapDistance = 8;
                  const bounds = getNodeBounds(tempNode);
                  if (Math.abs(bounds.top - guideY) < snapDistance) {
                    newY = guideY;
                    currentGuides.y.push(guideY);
                  } else if (Math.abs(bounds.bottom - guideY) < snapDistance) {
                    newY = guideY - (bounds.height || 50);
                    currentGuides.y.push(guideY);
                  } else if (Math.abs(bounds.centerY - guideY) < snapDistance) {
                    newY = guideY - (bounds.height || 50) / 2;
                    currentGuides.y.push(guideY);
                  }
                });
              }
            }
            if (snap) {
              newX = snapToGrid(newX, gridSize);
              newY = snapToGrid(newY, gridSize);
            }
            newX = Math.max(0, newX);
            newY = Math.max(0, newY);
            newTree = updateNode(newTree, nodeId, (node) => {
              node.x = newX;
              node.y = newY;
            });
          }
        });
        setTree(newTree);
        setGuides(currentGuides);
      } else if (isSelecting && selectionBox && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const endX = (e.clientX - canvasRect.left) / zoom;
        const endY = (e.clientY - canvasRect.top) / zoom;
        setSelectionBox({ ...selectionBox, endX, endY });
        const minX = Math.min(selectionBox.startX, endX);
        const maxX = Math.max(selectionBox.startX, endX);
        const minY = Math.min(selectionBox.startY, endY);
        const maxY = Math.max(selectionBox.startY, endY);
        const nodesInSelection = allNodes.filter((node) => {
          const bounds = getNodeBounds(node);
          return (
            bounds.left >= minX &&
            bounds.right <= maxX &&
            bounds.top >= minY &&
            bounds.bottom <= maxY &&
            node.id !== tree.id
          );
        });
        setSelectedIds(new Set(nodesInSelection.map((n) => n.id)));
      }
    },
    [
      isDragging,
      isSelecting,
      selectionBox,
      tree,
      zoom,
      snap,
      showGuides,
      gridSize,
      allNodes,
    ],
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      dragData.current = null;
      setGuides({ x: [], y: [] });
    }
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionBox(null);
    }
  }, [isDragging, isSelecting]);

  useEffect(() => {
    if (isDragging || isSelecting) {
      document.addEventListener("mousemove", handleCanvasMouseMove);
      document.addEventListener("mouseup", handleCanvasMouseUp);
      document.body.style.cursor = isDragging ? "grabbing" : "crosshair";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleCanvasMouseMove);
      document.removeEventListener("mouseup", handleCanvasMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, isSelecting, handleCanvasMouseMove, handleCanvasMouseUp]);

  // Block drag and drop
  const handleBlockDragStart = (e: React.DragEvent, blockIndex: number) => {
    setDraggedBlockIndex(blockIndex);
    e.dataTransfer.setData("text/plain", blockIndex.toString());
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlockIndex === null || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, (e.clientX - canvasRect.left) / zoom);
    const y = Math.max(0, (e.clientY - canvasRect.top) / zoom);
    const newNode = BLOCKS[draggedBlockIndex].make();
    newNode.x = snap ? snapToGrid(x, gridSize) : x;
    newNode.y = snap ? snapToGrid(y, gridSize) : y;
    pushHistory(appendChild(tree, tree.id, newNode));
    setDraggedBlockIndex(null);
  };

  // Render nodes
  const renderNode = (
    node: VNode,
    parentBounds?: { x: number; y: number },
  ): React.ReactNode => {
    const isSelected = selectedIds.has(node.id);
    const bounds = getNodeBounds(node);
    const positionStyle =
      node.id !== tree.id
        ? {
            position: "absolute" as const,
            left: node.x,
            top: node.y,
            width: node.width || "auto",
            height: node.height || "auto",
            zIndex: node.zIndex || (isSelected ? 1000 : 1),
          }
        : undefined;

    const element = React.createElement(
      node.tag,
      {
        key: node.id,
        "data-node-id": node.id,
        className: `${node.attrs.class || ""} ${!previewMode && isSelected ? "ring-2 ring-sky-500" : ""}`,
        style: {
          ...positionStyle,
          ...(node.text != null && !previewMode ? { outline: "none" } : {}),
        },
        ...(node.text != null && !previewMode
          ? {
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e: any) => {
                const text = e.currentTarget.textContent || "";
                setTree((currentTree) =>
                  updateNode(currentTree, node.id, (n) => {
                    n.text = text;
                  }),
                );
              },
            }
          : {}),
        ...Object.fromEntries(
          Object.entries(node.attrs).filter(([k]) => k !== "class"),
        ),
      },
      node.text != null
        ? node.text
        : node.children.map((child) => renderNode(child)),
    );

    if (previewMode || node.id === tree.id) {
      return element;
    }

    return (
      <div key={node.id} className="relative">
        {element}
        {isSelected && (
          <>
            {["nw", "ne", "sw", "se", "n", "s", "e", "w"].map((handle) => (
              <div
                key={handle}
                data-resize-handle={handle}
                className={`absolute w-2 h-2 bg-indigo-500 border border-white rounded-sm cursor-${
                  handle.includes("n") && handle.includes("w")
                    ? "nw-resize"
                    : handle.includes("n") && handle.includes("e")
                      ? "ne-resize"
                      : handle.includes("s") && handle.includes("w")
                        ? "sw-resize"
                        : handle.includes("s") && handle.includes("e")
                          ? "se-resize"
                          : handle.includes("n") || handle.includes("s")
                            ? "ns-resize"
                            : "ew-resize"
                }`}
                style={{
                  left: handle.includes("w")
                    ? -4
                    : handle.includes("e")
                      ? bounds.width - 4
                      : bounds.width / 2 - 4,
                  top: handle.includes("n")
                    ? -4
                    : handle.includes("s")
                      ? bounds.height - 4
                      : bounds.height / 2 - 4,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setResizeHandle(`${node.id}:${handle}`);
                }}
              />
            ))}
            <div className="absolute -top-6 left-0 text-xs bg-sky-600 text-white px-2 py-1 rounded">
              {node.tag}
            </div>
          </>
        )}
      </div>
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.contentEditable === "true" ||
          e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "a":
            e.preventDefault();
            setSelectedIds(
              new Set(
                allNodes.filter((n) => n.id !== tree.id).map((n) => n.id),
              ),
            );
            break;
          case "d":
            e.preventDefault();
            if (selectedIds.size > 0) {
              let newTree = tree;
              selectedIds.forEach((id) => {
                const node = findNode(tree, id);
                if (node) {
                  const duplicated = structuredClone(node);
                  duplicated.id = uid();
                  duplicated.x += 20;
                  duplicated.y += 20;
                  const reassignIds = (n: VNode): VNode => ({
                    ...n,
                    id: uid(),
                    children: n.children.map(reassignIds),
                  });
                  const finalNode = reassignIds(duplicated);
                  newTree = appendChild(newTree, tree.id, finalNode);
                }
              });
              pushHistory(newTree);
            }
            break;
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (selectedIds.size > 0) {
          let newTree = tree;
          selectedIds.forEach((id) => {
            if (id !== tree.id) {
              newTree = removeNode(newTree, id);
            }
          });
          pushHistory(newTree);
          setSelectedIds(new Set());
        }
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (selectedIds.size > 0) {
          const nudgeDistance = e.shiftKey ? gridSize * 4 : gridSize;
          let newTree = tree;
          selectedIds.forEach((id) => {
            newTree = updateNode(newTree, id, (node) => {
              switch (e.key) {
                case "ArrowUp":
                  node.y = Math.max(0, node.y - nudgeDistance);
                  break;
                case "ArrowDown":
                  node.y += nudgeDistance;
                  break;
                case "ArrowLeft":
                  node.x = Math.max(0, node.x - nudgeDistance);
                  break;
                case "ArrowRight":
                  node.x += nudgeDistance;
                  break;
              }
            });
          });
          setTree(newTree);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, tree, gridSize, allNodes, undo, redo, pushHistory]);

  // Import/Export
  const handleImport = () => {
    try {
      const v = htmlToVNodeTree(rawHtml);
      pushHistory(v);
      setSelectedIds(new Set());
    } catch (e) {
      alert("HTML inválido o no parseable");
      console.error(e);
    }
  };

  const handleExport = () => {
    const inner = vnodeToHtml(tree);
    const doc = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProject}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="antialiased">
    ${inner}
</body>
</html>`;
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Project management
  const saveProject = () => {
    const project: Project = {
      name: currentProject,
      tree: structuredClone(tree),
      timestamp: Date.now(),
      version: "1.0",
    };
    const existingIndex = projects.findIndex((p) => p.name === project.name);
    if (existingIndex >= 0) {
      setProjects((prev) =>
        prev.map((p, i) => (i === existingIndex ? project : p)),
      );
    } else {
      setProjects((prev) => [...prev, project]);
    }
  };

  const loadProject = (project: Project) => {
    pushHistory(project.tree);
    setCurrentProject(project.name);
    setSelectedIds(new Set());
    setRawHtml(vnodeToHtml(project.tree));
  };

  // Layer operations
  const moveNodeInLayer = (nodeId: string, direction: "up" | "down") => {
    const findParentAndIndex = (
      root: VNode,
      targetId: string,
    ): { parent: VNode | null; index: number } | null => {
      for (let i = 0; i < root.children.length; i++) {
        if (root.children[i].id === targetId) {
          return { parent: root, index: i };
        }
        const result = findParentAndIndex(root.children[i], targetId);
        if (result) return result;
      }
      return null;
    };
    const result = findParentAndIndex(tree, nodeId);
    if (!result || !result.parent) return;
    const { parent, index } = result;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= parent.children.length) return;
    const newTree = structuredClone(tree);
    const newParent = findNode(newTree, parent.id);
    if (!newParent) return;
    const temp = newParent.children[index];
    newParent.children[index] = newParent.children[newIndex];
    newParent.children[newIndex] = temp;
    pushHistory(newTree);
  };

  const flatten = (
    n: VNode,
    depth = 0,
  ): {
    id: string;
    tag: string;
    depth: number;
    text?: string;
    locked?: boolean;
  }[] => {
    const nodeInfo = {
      id: n.id,
      tag: n.tag,
      depth,
      text: n.text
        ? n.text.slice(0, 15) + (n.text.length > 15 ? "..." : "")
        : undefined,
      locked: n.locked,
    };
    return [nodeInfo, ...n.children.flatMap((c) => flatten(c, depth + 1))];
  };

  const layers = useMemo(() => flatten(tree), [tree]);

  // Property panel helpers
  const updateClasses = (cls: string) => {
    if (!primarySelectedNode) return;
    pushHistory(
      updateNode(tree, primarySelectedNode.id, (n) => {
        n.attrs.class = cls;
      }),
    );
  };

  const updateAttribute = (attr: string, value: string) => {
    if (!primarySelectedNode) return;
    pushHistory(
      updateNode(tree, primarySelectedNode.id, (n) => {
        if (value.trim() === "") {
          delete n.attrs[attr];
        } else {
          n.attrs[attr] = value;
        }
      }),
    );
  };

  const blocksByCategory = useMemo(() => {
    const groups: Record<string, typeof BLOCKS> = {};
    BLOCKS.forEach((block) => {
      if (!groups[block.category]) groups[block.category] = [];
      groups[block.category].push(block);
    });
    return groups;
  }, []);

  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="rounded-full gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"
            >
              <Code className="h-4 w-4" />
              <span className="font-semibold">HTML Builder Pro</span>
            </Badge>
            <Input
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              className="w-48 h-8 text-sm border-gray-200 focus:border-indigo-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!history.length}
                className="h-8 px-3"
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Deshacer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!future.length}
                className="h-8 px-3"
              >
                <Redo2 className="h-4 w-4 mr-1" />
                Rehacer
              </Button>
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))
                }
                className="h-8 px-2"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="px-3 text-sm font-medium text-gray-600 tabular-nums min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))
                }
                className="h-8 px-2"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <Button
                variant={showGrid ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={snap ? "default" : "ghost"}
                size="sm"
                onClick={() => setSnap(!snap)}
                className="h-8 px-3"
              >
                <Magnet className="h-4 w-4 mr-1" />
                Snap
              </Button>
            </div>
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="h-8 px-4"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Editar" : "Vista Previa"}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveProject}
                className="h-8 px-4"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button
                size="sm"
                onClick={handleExport}
                className="h-8 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar HTML
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Left panel */}
        <ResizablePanel
          defaultWidth={leftPanelWidth}
          minWidth={250}
          maxWidth={500}
          onWidthChange={setLeftPanelWidth}
          side="left"
          className="bg-white/70 backdrop-blur-sm"
        >
          <div className="h-full flex flex-col p-4">
            <Card className="shadow-lg border-0 bg-transparent flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <Palette className="h-5 w-5 text-indigo-600" />
                  Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-2">
                  {primarySelectedNode ? (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                              {"<"}
                              {primarySelectedNode.tag}
                              {">"}
                            </span>
                            <span className="text-gray-500">
                              #{primarySelectedNode.id.slice(-6)}
                            </span>
                          </div>
                          {selectedIds.size > 1 && (
                            <div className="text-xs text-indigo-600 font-medium">
                              +{selectedIds.size - 1} más seleccionados
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                            <span>
                              X: {Math.round(primarySelectedNode.x)}px
                            </span>
                            <span>
                              Y: {Math.round(primarySelectedNode.y)}px
                            </span>
                            <span>
                              W: {primarySelectedNode.width || "auto"}px
                            </span>
                            <span>
                              H: {primarySelectedNode.height || "auto"}px
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Posición y Tamaño
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              X
                            </label>
                            <Input
                              type="number"
                              value={primarySelectedNode.x}
                              onChange={(e) => {
                                const newX = parseFloat(e.target.value) || 0;
                                let newTree = tree;
                                selectedIds.forEach((id) => {
                                  newTree = updateNode(newTree, id, (node) => {
                                    node.x = newX;
                                  });
                                });
                                setTree(newTree);
                              }}
                              className="text-xs h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              Y
                            </label>
                            <Input
                              type="number"
                              value={primarySelectedNode.y}
                              onChange={(e) => {
                                const newY = parseFloat(e.target.value) || 0;
                                let newTree = tree;
                                selectedIds.forEach((id) => {
                                  newTree = updateNode(newTree, id, (node) => {
                                    node.y = newY;
                                  });
                                });
                                setTree(newTree);
                              }}
                              className="text-xs h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              Ancho
                            </label>
                            <Input
                              type="number"
                              value={primarySelectedNode.width || ""}
                              onChange={(e) => {
                                const newWidth =
                                  parseFloat(e.target.value) || undefined;
                                let newTree = tree;
                                selectedIds.forEach((id) => {
                                  newTree = updateNode(newTree, id, (node) => {
                                    node.width = newWidth;
                                  });
                                });
                                setTree(newTree);
                              }}
                              className="text-xs h-8"
                              placeholder="auto"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              Alto
                            </label>
                            <Input
                              type="number"
                              value={primarySelectedNode.height || ""}
                              onChange={(e) => {
                                const newHeight =
                                  parseFloat(e.target.value) || undefined;
                                let newTree = tree;
                                selectedIds.forEach((id) => {
                                  newTree = updateNode(newTree, id, (node) => {
                                    node.height = newHeight;
                                  });
                                });
                                setTree(newTree);
                              }}
                              className="text-xs h-8"
                              placeholder="auto"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Atributos
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              ID
                            </label>
                            <Input
                              value={primarySelectedNode.attrs.id || ""}
                              onChange={(e) =>
                                updateAttribute("id", e.target.value)
                              }
                              placeholder="mi-elemento"
                              className="text-xs h-8"
                            />
                          </div>
                          {primarySelectedNode.tag === "a" && (
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">
                                Href
                              </label>
                              <Input
                                value={primarySelectedNode.attrs.href || ""}
                                onChange={(e) =>
                                  updateAttribute("href", e.target.value)
                                }
                                placeholder="https://example.com"
                                className="text-xs h-8"
                              />
                            </div>
                          )}
                          {primarySelectedNode.tag === "img" && (
                            <>
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">
                                  Src
                                </label>
                                <Input
                                  value={primarySelectedNode.attrs.src || ""}
                                  onChange={(e) =>
                                    updateAttribute("src", e.target.value)
                                  }
                                  placeholder="https://example.com/imagen.jpg"
                                  className="text-xs h-8"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">
                                  Alt
                                </label>
                                <Input
                                  value={primarySelectedNode.attrs.alt || ""}
                                  onChange={(e) =>
                                    updateAttribute("alt", e.target.value)
                                  }
                                  placeholder="Descripción de la imagen"
                                  className="text-xs h-8"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Clases Tailwind
                        </h4>
                        <Textarea
                          value={primarySelectedNode.attrs.class || ""}
                          onChange={(e) => updateClasses(e.target.value)}
                          placeholder="p-4 rounded-xl bg-white shadow-lg"
                          className="font-mono text-xs min-h-[80px] resize-none"
                        />
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">
                            Clases comunes:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {[
                              "p-4",
                              "p-6",
                              "p-8",
                              "rounded-xl",
                              "rounded-2xl",
                              "bg-white",
                              "shadow-lg",
                              "shadow-xl",
                              "border",
                              "flex",
                              "grid",
                              "gap-4",
                              "items-center",
                              "justify-center",
                              "text-center",
                              "font-bold",
                              "text-gray-600",
                              "text-gray-800",
                              "hover:shadow-xl",
                            ].map((cls) => (
                              <button
                                key={cls}
                                onClick={() => {
                                  const currentClasses = (
                                    primarySelectedNode.attrs.class || ""
                                  )
                                    .split(/\s+/)
                                    .filter(Boolean);
                                  if (!currentClasses.includes(cls)) {
                                    updateClasses(
                                      [...currentClasses, cls].join(" "),
                                    );
                                  }
                                }}
                                className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                              >
                                {cls}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              let newTree = tree;
                              selectedIds.forEach((id) => {
                                const node = findNode(tree, id);
                                if (node) {
                                  const duplicated = structuredClone(node);
                                  duplicated.id = uid();
                                  duplicated.x += 20;
                                  duplicated.y += 20;
                                  const reassignIds = (n: VNode): VNode => ({
                                    ...n,
                                    id: uid(),
                                    children: n.children.map(reassignIds),
                                  });
                                  const finalNode = reassignIds(duplicated);
                                  newTree = appendChild(
                                    newTree,
                                    tree.id,
                                    finalNode,
                                  );
                                }
                              });
                              pushHistory(newTree);
                            }}
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              let newTree = tree;
                              selectedIds.forEach((id) => {
                                newTree = updateNode(newTree, id, (node) => {
                                  node.locked = !node.locked;
                                });
                              });
                              pushHistory(newTree);
                            }}
                            className="flex-1"
                          >
                            {primarySelectedNode.locked ? (
                              <>
                                <Unlock className="h-4 w-4 mr-1" />
                                Desbloquear
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-1" />
                                Bloquear
                              </>
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            let newTree = tree;
                            selectedIds.forEach((id) => {
                              if (id !== tree.id) {
                                newTree = removeNode(newTree, id);
                              }
                            });
                            pushHistory(newTree);
                            setSelectedIds(new Set());
                          }}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar ({selectedIds.size})
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Selecciona un elemento</p>
                      <p className="text-xs text-gray-400 mt-1">
                        para ver sus propiedades
                      </p>
                      <div className="mt-8 text-left space-y-2">
                        <h5 className="font-semibold text-gray-700 text-sm">
                          Atajos de teclado:
                        </h5>
                        <div className="text-xs space-y-1 text-gray-600">
                          <div>⌘/Ctrl + A: Seleccionar todo</div>
                          <div>⌘/Ctrl + D: Duplicar</div>
                          <div>⌘/Ctrl + Z: Deshacer</div>
                          <div>⌘/Ctrl + Shift + Z: Rehacer</div>
                          <div>Flechas: Mover 8px</div>
                          <div>Shift + Flechas: Mover 32px</div>
                          <div>Supr/Delete: Eliminar</div>
                          <div>Clic + Arrastrar: Selección múltiple</div>
                          <div>⌘/Ctrl + Clic: Agregar a selección</div>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>

        {/* Canvas */}
        <div className="flex-1 flex flex-col min-h-0 p-4">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm flex-1 flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <MousePointer2 className="h-5 w-5 text-indigo-600" />
                  {previewMode ? "Vista Previa" : "Canvas Editable"}
                </CardTitle>
                {!previewMode && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{selectedIds.size} seleccionados</span>
                    <span>•</span>
                    <span>Grid: {gridSize}px</span>
                    <span>•</span>
                    <span>Zoom: {Math.round(zoom * 100)}%</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative overflow-hidden min-h-0">
              <div
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
                className={`relative w-full h-full overflow-auto ${
                  showGrid && !previewMode
                    ? "bg-[linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px)]"
                    : "bg-gradient-to-br from-gray-50 to-white"
                }`}
                style={{
                  backgroundSize:
                    showGrid && !previewMode
                      ? `${gridSize * zoom}px ${gridSize * zoom}px`
                      : undefined,
                }}
              >
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    minHeight: "1000px",
                    minWidth: "100%",
                    position: "relative",
                  }}
                >
                  {renderNode(tree)}
                  {selectionBox && (
                    <div
                      className="absolute border-2 border-indigo-400 bg-indigo-100/20 pointer-events-none"
                      style={{
                        left: Math.min(selectionBox.startX, selectionBox.endX),
                        top: Math.min(selectionBox.startY, selectionBox.endY),
                        width: Math.abs(
                          selectionBox.endX - selectionBox.startX,
                        ),
                        height: Math.abs(selectionBox.endY - selectionBox.endY),
                      }}
                    />
                  )}
                  {showGuides &&
                    guides.x.map((x, i) => (
                      <div
                        key={`guide-x-${i}`}
                        className="absolute w-px bg-indigo-500 pointer-events-none"
                        style={{ left: x, top: 0, height: "100%" }}
                      />
                    ))}
                  {showGuides &&
                    guides.y.map((y, i) => (
                      <div
                        key={`guide-y-${i}`}
                        className="absolute h-px bg-indigo-500 pointer-events-none"
                        style={{ top: y, left: 0, width: "100%" }}
                      />
                    ))}
                </div>
                {draggedBlockIndex !== null && (
                  <div className="pointer-events-none absolute inset-4 border-2 border-dashed border-indigo-400 rounded-2xl bg-indigo-50/50 flex items-center justify-center">
                    <div className="text-indigo-600 font-medium">
                      Suelta aquí para agregar {BLOCKS[draggedBlockIndex].label}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <ResizablePanel
          defaultWidth={rightPanelWidth}
          minWidth={250}
          maxWidth={500}
          onWidthChange={setRightPanelWidth}
          side="right"
          className="bg-white/70 backdrop-blur-sm"
        >
          <div className="h-full flex flex-col p-4">
            <Card className="shadow-lg border-0 bg-transparent flex-1 min-h-0">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <Layers className="h-5 w-5 text-indigo-600" />
                  Elementos
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 px-0">
                <Tabs
                  defaultValue="blocks"
                  className="w-full h-full flex flex-col"
                >
                  <TabsList className="grid w-full grid-cols-3 flex-shrink-0 mx-6">
                    <TabsTrigger value="blocks">Bloques</TabsTrigger>
                    <TabsTrigger value="layers">Capas</TabsTrigger>
                    <TabsTrigger value="projects">Proyectos</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="blocks"
                    className="flex-1 mt-4 min-h-0 px-6"
                  >
                    <ScrollArea className="h-full pr-2">
                      <div className="space-y-4">
                        {Object.entries(blocksByCategory).map(
                          ([category, blocks]) => (
                            <div key={category}>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 px-1">
                                {category}
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {blocks.map((block, i) => {
                                  const globalIndex = BLOCKS.indexOf(block);
                                  return (
                                    <div
                                      key={globalIndex}
                                      draggable
                                      onDragStart={(e) =>
                                        handleBlockDragStart(e, globalIndex)
                                      }
                                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-grab active:cursor-grabbing transition-all duration-200"
                                    >
                                      <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
                                        {block.icon}
                                      </div>
                                      <span className="text-sm font-medium text-gray-700 truncate">
                                        {block.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent
                    value="layers"
                    className="flex-1 mt-4 min-h-0 px-6"
                  >
                    <ScrollArea className="h-full">
                      <div className="space-y-1 min-w-0">
                        {layers.map((layer, index) => (
                          <div
                            key={layer.id}
                            className={`group rounded-lg transition-all duration-200 min-w-0 ${
                              selectedIds.has(layer.id)
                                ? "bg-indigo-100 border border-indigo-300"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className="flex items-center gap-2 p-2 min-w-0"
                              style={{ paddingLeft: 8 + layer.depth * 12 }}
                            >
                              <button
                                onClick={() =>
                                  setSelectedIds(new Set([layer.id]))
                                }
                                className="flex items-center gap-2 flex-1 text-left min-w-0 overflow-hidden"
                              >
                                <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border flex-shrink-0">
                                  {layer.tag}
                                </span>
                                <span
                                  className={`text-sm truncate min-w-0 ${
                                    selectedIds.has(layer.id)
                                      ? "text-indigo-700 font-medium"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {layer.text || `#${layer.id.slice(-4)}`}
                                </span>
                                {layer.locked && (
                                  <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                )}
                              </button>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveNodeInLayer(layer.id, "up")
                                  }
                                  disabled={index <= 1}
                                  className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                  title="Mover arriba"
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveNodeInLayer(layer.id, "down")
                                  }
                                  disabled={index >= layers.length - 1}
                                  className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                  title="Mover abajo"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newTree = removeNode(tree, layer.id);
                                    pushHistory(newTree);
                                    setSelectedIds(new Set());
                                  }}
                                  disabled={layer.id === tree.id}
                                  className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent
                    value="projects"
                    className="flex-1 mt-4 min-h-0 px-6"
                  >
                    <div className="h-full flex flex-col">
                      <Button
                        size="sm"
                        onClick={saveProject}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 mb-3 flex-shrink-0"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Actual
                      </Button>
                      <ScrollArea className="flex-1 min-h-0">
                        <div className="space-y-2">
                          {projects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">
                                No hay proyectos guardados
                              </p>
                            </div>
                          ) : (
                            projects.map((project, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-xl bg-white border border-gray-100 hover:border-indigo-200 transition-all duration-200"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-800 text-sm truncate">
                                    {project.name}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    v{project.version}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">
                                  {new Date(
                                    project.timestamp,
                                  ).toLocaleDateString("es-ES")}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadProject(project)}
                                  className="w-full h-8"
                                >
                                  <FolderOpen className="h-3 w-3 mr-2" />
                                  Cargar
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            {/* HTML Import */}
            <Card className="shadow-lg border-0 bg-transparent mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  HTML Raw
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={rawHtml}
                  onChange={(e) => setRawHtml(e.target.value)}
                  className="font-mono text-xs min-h-[120px] border-gray-200 focus:border-indigo-400"
                  placeholder="Pega tu HTML aquí..."
                />
                <Button
                  size="sm"
                  onClick={handleImport}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar al Canvas
                </Button>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </div>
    </div>
  );
}
