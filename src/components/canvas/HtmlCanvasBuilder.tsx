import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Code,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Magnet,
  Eye,
  Save,
  Download,
} from "lucide-react";

// Local components
import { ResizablePanel } from "./panels/ResizablePanel";
import { LeftPanel } from "./panels/LeftPanel";
import { RightPanel } from "./panels/RightPanel";
import { CanvasPanel } from "./panels/CanvasPanel";

// Types and utils
import type { VNode, Project, SelectionBox } from "./types";
import { uid } from "./utils/domUtils";
import { htmlToVNodeTree, domToVNode } from "./utils/domUtils";
import { vnodeToHtml } from "./utils/serialization";
import {
  findNode,
  updateNode,
  removeNode,
  appendChild,
  flattenTree,
} from "./utils/treeUtils";
import {
  snapToGrid,
  getNodeBounds,
  findSnapGuides,
} from "./utils/geometryUtils";
import { BLOCKS } from "./blocks/BlockDefinitions";

// Constants
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
  </div>
</section>`;

export function HtmlCanvasBuilder() {
  // === State ===
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

  // Interaction state
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

  const [isResizingElement, setIsResizingElement] = useState(false);
  const resizeData = useRef<{
    nodeId: string;
    handle: string;
    startX: number;
    startY: number;
    original: { x: number; y: number; width: number; height: number };
  } | null>(null);
  // Derived state
  const selectedNodes = useMemo(
    () =>
      Array.from(selectedIds)
        .map((id) => findNode(tree, id))
        .filter(Boolean) as VNode[],
    [tree, selectedIds],
  );
  const primarySelectedNode = selectedNodes[0] || null;
  const allNodes = useMemo(
    () => flattenTree(tree).map((item) => findNode(tree, item.id)!),
    [tree],
  );

  // === History ===
  const pushHistory = useCallback(
    (next: VNode) => {
      setHistory((h) => [...h, tree]);
      setFuture([]);
      setTree(next);
    },
    [setHistory, setFuture, setTree, tree],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [tree, ...f]);
      setTree(prev);
      return h.slice(0, -1);
    });
  }, [setHistory, setFuture, setTree, tree]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setHistory((h) => [...h, tree]);
      setTree(next);
      return f.slice(1);
    });
  }, [setHistory, setFuture, setTree, tree]);

  // === Canvas Interaction ===
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
            newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
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
          if (node) originalPositions.set(id, { x: node.x, y: node.y });
        });
        dragData.current = {
          nodeIds: uniqueSelected,
          startX: e.clientX,
          startY: e.clientY,
          originalPositions,
        };
      } else if (!nodeId) {
        if (!e.shiftKey && !e.metaKey && !e.ctrlKey) setSelectedIds(new Set());
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
        const currentGuides = { x: [] as number[], y: [] as number[] };
        dragData.current!.nodeIds.forEach((nodeId) => {
          const original = dragData.current!.originalPositions.get(nodeId);
          if (original) {
            let newX = original.x + deltaX;
            let newY = original.y + deltaY;
            if (showGuides && snap) {
              const node = findNode(newTree, nodeId);
              if (node) {
                const tempNode = { ...node, x: newX, y: newY };
                const snapGuides = findSnapGuides(
                  tempNode,
                  allNodes.filter((n) => n.id !== nodeId),
                );
                snapGuides.x.forEach((guideX) => {
                  const bounds = getNodeBounds(tempNode);
                  const snapDistance = 8;
                  if (Math.abs(bounds.left - guideX) < snapDistance)
                    newX = guideX;
                  else if (Math.abs(bounds.right - guideX) < snapDistance)
                    newX = guideX - (bounds.width || 100);
                  else if (Math.abs(bounds.centerX - guideX) < snapDistance)
                    newX = guideX - (bounds.width || 100) / 2;
                  currentGuides.x.push(guideX);
                });
                snapGuides.y.forEach((guideY) => {
                  const bounds = getNodeBounds(tempNode);
                  const snapDistance = 8;
                  if (Math.abs(bounds.top - guideY) < snapDistance)
                    newY = guideY;
                  else if (Math.abs(bounds.bottom - guideY) < snapDistance)
                    newY = guideY - (bounds.height || 50);
                  else if (Math.abs(bounds.centerY - guideY) < snapDistance)
                    newY = guideY - (bounds.height || 50) / 2;
                  currentGuides.y.push(guideY);
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
        if (resizeHandle) {
          const [nodeId, handle] = resizeHandle.split(":");
          const node = findNode(tree, nodeId);
          console.log(node);
          if (!node) return;

          const deltaX = (e.clientX - dragData.current?.startX!) / zoom;
          const deltaY = (e.clientY - dragData.current?.startY!) / zoom;

          let newWidth = node.width || 100;
          let newHeight = node.height || 100;
          let newX = node.x;
          let newY = node.y;

          if (handle.includes("e")) newWidth += deltaX;
          if (handle.includes("s")) newHeight += deltaY;
          if (handle.includes("w")) {
            newWidth -= deltaX;
            newX += deltaX;
          }
          if (handle.includes("n")) {
            newHeight -= deltaY;
            newY += deltaY;
          }

          setTree(
            updateNode(tree, nodeId, (n) => {
              n.width = Math.max(20, newWidth);
              n.height = Math.max(20, newHeight);
              n.x = newX;
              n.y = newY;
            }),
          );

          return; // 👈 detener aquí para que no ejecute la lógica de drag
        }
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
      resizeHandle,
    ],
  );

  // const handleCanvasMouseUp = useCallback(() => {
  //   if (isDragging) {
  //     setIsDragging(false);
  //     dragData.current = null;
  //     setGuides({ x: [], y: [] });
  //   }
  //   if (isSelecting) {
  //     setIsSelecting(false);
  //     setSelectionBox(null);
  //   }
  // }, [isDragging, isSelecting]);

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
    if (resizeHandle) {
      setResizeHandle(null);
    }
  }, [isDragging, isSelecting, resizeHandle]);

  useEffect(() => {
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizingElement || !resizeData.current || !canvasRef.current)
        return;
      const { nodeId, handle, startX, startY, original } = resizeData.current;
      const deltaX = (e.clientX - startX) / zoom;
      const deltaY = (e.clientY - startY) / zoom;

      let newTree = tree;
      newTree = updateNode(newTree, nodeId, (node) => {
        const newWidth = Math.max(
          20,
          original.width +
            (handle.includes("e")
              ? deltaX
              : handle.includes("w")
                ? -deltaX
                : 0),
        );
        const newHeight = Math.max(
          20,
          original.height +
            (handle.includes("s")
              ? deltaY
              : handle.includes("n")
                ? -deltaY
                : 0),
        );
        let newX = node.x;
        let newY = node.y;

        if (handle.includes("w"))
          newX = original.x + (original.width - newWidth);
        if (handle.includes("n"))
          newY = original.y + (original.height - newHeight);

        if (snap) {
          newX = snapToGrid(newX, gridSize);
          newY = snapToGrid(newY, gridSize);
          // Ajustar tamaño al grid también (opcional)
          // newWidth = snapToGrid(newWidth, gridSize);
          // newHeight = snapToGrid(newHeight, gridSize);
        }

        node.x = newX;
        node.y = newY;
        node.width = newWidth;
        node.height = newHeight;
      });

      setTree(newTree);
    };

    const handleResizeMouseUp = () => {
      if (isResizingElement) {
        setIsResizingElement(false);
        resizeData.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    if (isResizingElement) {
      document.addEventListener("mousemove", handleResizeMouseMove);
      document.addEventListener("mouseup", handleResizeMouseUp);
      document.body.style.cursor = "ew-resize";
      if (
        resizeData.current?.handle.includes("n") ||
        resizeData.current?.handle.includes("s")
      ) {
        document.body.style.cursor = "ns-resize";
      }
      if (
        (resizeData.current?.handle.includes("n") &&
          resizeData.current?.handle.includes("w")) ||
        (resizeData.current?.handle.includes("s") &&
          resizeData.current?.handle.includes("e"))
      ) {
        document.body.style.cursor = "nwse-resize";
      }
      if (
        (resizeData.current?.handle.includes("n") &&
          resizeData.current?.handle.includes("e")) ||
        (resizeData.current?.handle.includes("s") &&
          resizeData.current?.handle.includes("w"))
      ) {
        document.body.style.cursor = "nesw-resize";
      }
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleResizeMouseMove);
      document.removeEventListener("mouseup", handleResizeMouseUp);
    };
  }, [isResizingElement, tree, zoom, snap, gridSize]);

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

  // === Block Drag & Drop ===
  const handleBlockDragStart = (e: React.DragEvent, blockIndex: number) => {
    setDraggedBlockIndex(blockIndex);
    e.dataTransfer.setData("text/plain", blockIndex.toString());
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // const handleCanvasDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   if (draggedBlockIndex === null || !canvasRef.current) return;
  //   const canvasRect = canvasRef.current.getBoundingClientRect();
  //   const x = Math.max(0, (e.clientX - canvasRect.left) / zoom);
  //   const y = Math.max(0, (e.clientY - canvasRect.top) / zoom);
  //   const newNode = BLOCKS[draggedBlockIndex].make();
  //   newNode.x = snap ? snapToGrid(x, gridSize) : x;
  //   newNode.y = snap ? snapToGrid(y, gridSize) : y;
  //   pushHistory(appendChild(tree, tree.id, newNode));
  //   setDraggedBlockIndex(null);
  // };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlockIndex === null || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, (e.clientX - canvasRect.left) / zoom);
    const y = Math.max(0, (e.clientY - canvasRect.top) / zoom);

    // 🔥 Detectar nodo destino bajo el cursor
    let targetNodeId = tree.id; // fallback al root
    const elementsUnder = document.elementsFromPoint(e.clientX, e.clientY);
    for (const el of elementsUnder) {
      const id = el.getAttribute?.("data-node-id");
      if (id && id !== tree.id) {
        const node = findNode(tree, id);
        if (node && !["img", "br", "input"].includes(node.tag)) {
          targetNodeId = id;
          break;
        }
      }
    }

    const newNode = BLOCKS[draggedBlockIndex].make();
    newNode.x = snap ? snapToGrid(x, gridSize) : x;
    newNode.y = snap ? snapToGrid(y, gridSize) : y;

    pushHistory(appendChild(tree, targetNodeId, newNode));
    setDraggedBlockIndex(null);
  };
  // === Render Node ===
  // const renderNode = (node: VNode): React.ReactNode => {
  //   const isSelected = selectedIds.has(node.id);
  //   const positionStyle =
  //     node.id !== tree.id
  //       ? {
  //           position: "absolute" as const,
  //           left: node.x,
  //           top: node.y,
  //           width: node.width || "auto",
  //           height: node.height || "auto",
  //           zIndex: node.zIndex || (isSelected ? 1000 : 1),
  //         }
  //       : undefined;

  //   const element = React.createElement(
  //     node.tag,
  //     {
  //       key: node.id,
  //       "data-node-id": node.id,
  //       className: `${node.attrs.class || ""} ${!previewMode && isSelected ? "ring-2 ring-indigo-500" : ""}`,
  //       style: {
  //         ...positionStyle,
  //         ...(node.text != null && !previewMode ? { outline: "none" } : {}),
  //       },
  //       ...(node.text != null && !previewMode
  //         ? {
  //             contentEditable: true,
  //             suppressContentEditableWarning: true,
  //             onBlur: (e: any) => {
  //               const text = e.currentTarget.textContent || "";
  //               setTree((currentTree) =>
  //                 updateNode(currentTree, node.id, (n) => (n.text = text)),
  //               );
  //             },
  //           }
  //         : {}),
  //       ...Object.fromEntries(
  //         Object.entries(node.attrs).filter(([k]) => k !== "class"),
  //       ),
  //     },
  //     node.text != null
  //       ? node.text
  //       : node.children.map((child) => renderNode(child)),
  //   );

  //   if (previewMode || node.id === tree.id) return element;

  //   return (
  //     <div key={node.id} className="relative">
  //       {element}
  //       {isSelected && (
  //         <>
  //           {["nw", "ne", "sw", "se", "n", "s", "e", "w"].map((handle) => (
  //             <div
  //               key={handle}
  //               data-resize-handle={handle}
  //               className={`absolute w-2 h-2 bg-indigo-500 border border-white rounded-sm cursor-${
  //                 handle.includes("n") && handle.includes("w")
  //                   ? "nw-resize"
  //                   : handle.includes("n") && handle.includes("e")
  //                     ? "ne-resize"
  //                     : handle.includes("s") && handle.includes("w")
  //                       ? "sw-resize"
  //                       : handle.includes("s") && handle.includes("e")
  //                         ? "se-resize"
  //                         : handle.includes("n") || handle.includes("s")
  //                           ? "ns-resize"
  //                           : "ew-resize"
  //               }`}
  //               style={{
  //                 left: handle.includes("w")
  //                   ? -4
  //                   : handle.includes("e")
  //                     ? (node.width || 100) - 4
  //                     : (node.width || 100) / 2 - 4,
  //                 top: handle.includes("n")
  //                   ? -4
  //                   : handle.includes("s")
  //                     ? (node.height || 50) - 4
  //                     : (node.height || 50) / 2 - 4,
  //               }}
  //             />
  //           ))}
  //           <div className="absolute -top-6 left-0 text-xs bg-indigo-600 text-white px-2 py-1 rounded">
  //             {node.tag}
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   );
  // };

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
    if (node.tag === "text") {
      return node.text; // se renderiza directo como string
    }

    // Elementos void (self-closing) en HTML
    const voidElements = new Set([
      "img",
      "input",
      "br",
      "hr",
      "meta",
      "link",
      "area",
      "base",
      "col",
      "embed",
      "source",
      "track",
      "wbr",
    ]);

    const isVoidElement = ["img", "input", "br", "hr", "meta", "link"].includes(
      node.tag,
    );

    const element = React.createElement(
      node.tag,
      {
        key: node.id,
        "data-node-id": node.id,
        className: `${node.attrs.class || ""} ${
          !previewMode && isSelected ? "ring-2 ring-sky-500" : ""
        }`,
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
      !isVoidElement
        ? node.text != null
          ? node.text
          : node.children.map((child) => renderNode(child))
        : undefined,
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

                  // if (!node) return;
                  // const [nodeId, handle] = `${node.id}:${handle}`.split(":");
                  setIsResizingElement(true);
                  resizeData.current = {
                    nodeId: node.id,
                    handle,
                    startX: e.clientX,
                    startY: e.clientY,
                    original: {
                      x: node.x,
                      y: node.y,
                      width: node.width || 100,
                      height: node.height || 50,
                    },
                  };
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

  // === Keyboard Shortcuts ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const inInput =
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (inInput || (e.target as HTMLElement)?.contentEditable === "true")
        return;

      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        setSelectedIds(
          new Set(allNodes.filter((n) => n.id !== tree.id).map((n) => n.id)),
        );
      } else if ((e.metaKey || e.ctrlKey) && e.key === "d") {
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
              newTree = appendChild(newTree, tree.id, reassignIds(duplicated));
            }
          });
          pushHistory(newTree);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (selectedIds.size > 0) {
          let newTree = tree;
          selectedIds.forEach(
            (id) => id !== tree.id && (newTree = removeNode(newTree, id)),
          );
          pushHistory(newTree);
          setSelectedIds(new Set());
        }
      } else if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        if (selectedIds.size > 0) {
          const nudge = e.shiftKey ? gridSize * 4 : gridSize;
          let newTree = tree;
          selectedIds.forEach((id) => {
            newTree = updateNode(newTree, id, (node) => {
              switch (e.key) {
                case "ArrowUp":
                  node.y = Math.max(0, node.y - nudge);
                  break;
                case "ArrowDown":
                  node.y += nudge;
                  break;
                case "ArrowLeft":
                  node.x = Math.max(0, node.x - nudge);
                  break;
                case "ArrowRight":
                  node.x += nudge;
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

  // === Import/Export ===
  const handleImport = () => {
    try {
      const v = htmlToVNodeTree(rawHtml);
      pushHistory(v);
      setSelectedIds(new Set());
    } catch (e) {
      alert("HTML inválido");
      console.error(e);
    }
  };

  const handleExport = () => {
    const inner = vnodeToHtml(tree);
    const doc = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${currentProject}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="antialiased">${inner}</body>
</html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([doc], { type: "text/html" }));
    a.download = `${currentProject.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
    a.click();
  };

  // === Project Management ===
  const saveProject = () => {
    const project: Project = {
      name: currentProject,
      tree: structuredClone(tree),
      timestamp: Date.now(),
      version: "1.0",
    };
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.name === project.name);
      return idx >= 0
        ? [...prev.slice(0, idx), project, ...prev.slice(idx + 1)]
        : [...prev, project];
    });
  };

  const loadProject = (project: Project) => {
    pushHistory(project.tree);
    setCurrentProject(project.name);
    setSelectedIds(new Set());
    setRawHtml(vnodeToHtml(project.tree));
  };

  // === Layer Operations ===
  const moveNodeInLayer = (nodeId: string, direction: "up" | "down") => {
    const findParentAndIndex = (
      root: VNode,
      targetId: string,
    ): { parent: VNode | null; index: number } | null => {
      for (let i = 0; i < root.children.length; i++) {
        if (root.children[i].id === targetId) return { parent: root, index: i };
        const res = findParentAndIndex(root.children[i], targetId);
        if (res) return res;
      }
      return null;
    };
    const result = findParentAndIndex(tree, nodeId);
    if (!result || !result.parent) return;
    const { parent, index } = result;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= parent.children.length) return;
    const newTree = structuredClone(tree);
    const newParent = findNode(newTree, parent.id)!;
    [newParent.children[index], newParent.children[newIndex]] = [
      newParent.children[newIndex],
      newParent.children[index],
    ];
    pushHistory(newTree);
  };

  // === Render ===
  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="rounded-full gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"
            >
              <Code className="h-4 w-4" />{" "}
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
                className="h-8 px-4 bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar HTML
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Left Panel */}
        <ResizablePanel
          defaultWidth={leftPanelWidth}
          minWidth={200}
          maxWidth={600}
          onWidthChange={setLeftPanelWidth}
          side="left"
          className="bg-white/70 backdrop-blur-sm"
        >
          <LeftPanel
            primarySelectedNode={primarySelectedNode}
            selectedIds={selectedIds}
            tree={tree}
            setTree={setTree}
            pushHistory={pushHistory}
            selectedNodes={selectedNodes}
            gridSize={gridSize}
          />
        </ResizablePanel>

        {/* Canvas */}
        <CanvasPanel
          tree={tree}
          selectedIds={selectedIds}
          previewMode={previewMode}
          zoom={zoom}
          showGrid={showGrid}
          gridSize={gridSize}
          showGuides={showGuides}
          guides={guides}
          selectionBox={selectionBox}
          draggedBlockIndex={draggedBlockIndex}
          canvasRef={canvasRef}
          handleCanvasMouseDown={handleCanvasMouseDown}
          handleCanvasDragOver={handleCanvasDragOver}
          handleCanvasDrop={handleCanvasDrop}
          renderNode={renderNode}
        />

        {/* Right Panel */}
        <ResizablePanel
          defaultWidth={rightPanelWidth}
          minWidth={250}
          maxWidth={600}
          onWidthChange={setRightPanelWidth}
          side="right"
          className="bg-white/70 backdrop-blur-sm"
        >
          <RightPanel
            tree={tree}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            pushHistory={pushHistory}
            removeNode={removeNode}
            moveNodeInLayer={moveNodeInLayer}
            rawHtml={rawHtml}
            setRawHtml={setRawHtml}
            handleImport={handleImport}
            saveProject={saveProject}
            projects={projects}
            loadProject={loadProject}
            handleBlockDragStart={handleBlockDragStart}
          />
        </ResizablePanel>
      </div>
    </div>
  );
}
