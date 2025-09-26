// CanvasPanel.tsx
import React from "react";
import { VNode, SelectionBox } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MousePointer2 } from "lucide-react";
import { BLOCKS } from "../blocks/BlockDefinitions";

interface CanvasPanelProps {
  tree: VNode;
  selectedIds: Set<string>;
  previewMode: boolean;
  zoom: number;
  showGrid: boolean;
  gridSize: number;
  showGuides: boolean;
  guides: { x: number[]; y: number[] };
  selectionBox: SelectionBox | null;
  draggedBlockIndex: number | null;
  canvasRef: React.RefObject<HTMLDivElement>;
  handleCanvasMouseDown: (e: React.MouseEvent) => void;
  handleCanvasDragOver: (e: React.DragEvent) => void;
  handleCanvasDrop: (e: React.DragEvent) => void;
  renderNode: (node: VNode) => React.ReactNode;
}

export const CanvasPanel: React.FC<CanvasPanelProps> = ({
  tree,
  selectedIds,
  previewMode,
  zoom,
  showGrid,
  gridSize,
  showGuides,
  guides,
  selectionBox,
  draggedBlockIndex,
  canvasRef,
  handleCanvasMouseDown,
  handleCanvasDragOver,
  handleCanvasDrop,
  renderNode,
}) => {
  return (
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
                  width: Math.abs(selectionBox.endX - selectionBox.startX),
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
  );
};
