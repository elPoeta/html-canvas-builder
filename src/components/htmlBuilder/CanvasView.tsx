// components/canvas/CanvasView.tsx
import React, { useMemo, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MousePointer2, Eye } from "lucide-react";
import { VNode } from "@/lib/types/htmlBuilder.types";
import {
  CanvasContextMenu,
  CanvasContextMenuHandle,
} from "./CanvasContextMenu";
import { vnodeToEditableHtml } from "@/lib/htmlBuilder/domUtils";
import { DEFAULT_OPTIONS, useSanitizedHTML } from "../hooks/use-sanitizedHTML";
import { findVNodeById } from "@/lib/htmlBuilder/edit-utils";

interface CanvasViewProps {
  tree: VNode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  zoom: number;
  previewMode: boolean;
  dashBox: boolean;
  onTextUpdate: (id: string, text: string) => void;
  onMoveNode: (nodeId: string, direction: "up" | "down") => void;
  onAddChild: (parentId: string, blockIndex: number) => void;
  onAddBefore: (targetId: string, blockIndex: number) => void;
  onAddAfter: (targetId: string, blockIndex: number) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  layers: { id: string }[];
}

export const CanvasView = ({
  tree,
  selectedId,
  onSelect,
  zoom,
  previewMode,
  dashBox,
  onTextUpdate,
  onMoveNode,
  onAddChild,
  onAddBefore,
  onAddAfter,
  onDuplicate,
  onDelete,
  layers,
}: CanvasViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<CanvasContextMenuHandle>(null);

  // Generate raw HTML string
  const rawHtml = useMemo(() => {
    return vnodeToEditableHtml(tree, !previewMode);
  }, [tree, previewMode]);

  // Sanitize using your powerful hook
  const { sanitizedHTML, attachEvents, cleanup } = useSanitizedHTML(rawHtml, {
    allowStyles: true, // If your blocks use <style>
    enableEvents: true,
    allowedEvents: ["click", "input", "contextmenu"],
    // dompurifyOptions: {
    ADD_ATTR: ["contenteditable", "data-node"], // ← Allow these!
    // Keep your existing config, but ensure these aren't forbidden
    FORBID_ATTR: DEFAULT_OPTIONS.FORBID_ATTR?.filter(
      (attr) => attr !== "contenteditable" && attr !== "data-node",
    ),
    // } as UseSanitizedHTMLOption,
    // Optional: custom event handlers
    eventHandlers: {},
  });

  // Handle click outside (deselect)
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!previewMode && e.target === e.currentTarget) {
        onSelect(null);
      }
    },
    [onSelect, previewMode],
  );

  // Attach event listeners after render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    attachEvents(container);

    return () => {
      cleanup();
    };
  }, [attachEvents, cleanup]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || previewMode) return;

    const handleClick = (e: MouseEvent) => {
      // Find the closest ancestor with data-node
      const nodeEl = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-node]",
      );
      if (nodeEl) {
        e.stopPropagation();
        const id = nodeEl.getAttribute("data-node");
        if (id) {
          onSelect(id);
          return;
        }
      }
      onSelect(null); // click outside
    };

    const handleInput = (e: Event) => {
      const nodeEl = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-node]",
      );
      if (nodeEl) {
        const id = nodeEl.getAttribute("data-node");
        if (id) {
          onTextUpdate(id, nodeEl.textContent || "");
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const nodeEl = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-node]",
      );
      if (nodeEl) {
        e.preventDefault();
        const id = nodeEl.getAttribute("data-node");
        if (id) {
          const vnode = findVNodeById(tree, id);
          vnode && contextMenuRef.current?.show(vnode, e.clientX, e.clientY);
        }
      }
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("input", handleInput);
    container.addEventListener("contextmenu", handleContextMenu);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("input", handleInput);
      container.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [onSelect, onTextUpdate, previewMode, tree]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove previous selection
    container
      .querySelectorAll("[data-node].ce-selected")
      .forEach((el) => el.classList.remove("ce-selected"));

    if (dashBox) {
      container.querySelectorAll("[data-node]").forEach((el) => {
        (el as HTMLElement).style.borderWidth = "1px";
        (el as HTMLElement).style.borderStyle = "dashed";
        (el as HTMLElement).style.borderColor =
          "var(--border-muted-foreground)";
      });
    } else {
      container.querySelectorAll("[data-node]").forEach((el) => {
        (el as HTMLElement).style.removeProperty("border-width");
        (el as HTMLElement).style.removeProperty("border-style");
        (el as HTMLElement).style.removeProperty("border-color");
      });
    }

    // Add selection
    if (selectedId) {
      const el = container.querySelector(`[data-node="${selectedId}"]`);
      if (el) {
        el.classList.add("ce-selected");
      }
    }
  }, [selectedId, dashBox]);

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 overflow-auto">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm flex-1 flex flex-col">
        <CardHeader className="pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <MousePointer2 className="h-5 w-5 text-indigo-600" />
              {previewMode ? "Preview Mode" : "Editable Canvas"}
            </CardTitle>
            {!previewMode && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                <span>Zoom: {Math.round(zoom * 100)}%</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative overflow-hidden min-h-0">
          <div
            ref={containerRef}
            onClick={handleContainerClick}
            className="relative w-full h-full overflow-auto bg-gradient-to-br from-gray-50 to-white"
            style={{
              cursor: previewMode ? "default" : "pointer",
            }}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                minHeight: previewMode ? "auto" : "1000px",
                minWidth: "100%",
              }}
              className="origin-top-left"
              dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
          </div>

          <CanvasContextMenu
            ref={contextMenuRef}
            selectedId={selectedId}
            tree={tree}
            layers={layers}
            onMoveNode={onMoveNode}
            onAddChild={onAddChild}
            onAddBefore={onAddBefore}
            onAddAfter={onAddAfter}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};
