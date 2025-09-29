import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu";
import {
  Settings,
  ChevronUp,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
} from "lucide-react";
import { BLOCKS } from "@/lib/htmlBuilder/blocks";
import { groupBy } from "@/lib/htmlBuilder/utils";
import { VNode } from "@/lib/types/htmlBuilder.types";

interface CanvasContextMenuProps {
  selectedId: string | null;
  tree: VNode;
  onMoveNode: (nodeId: string, direction: "up" | "down") => void;
  onAddChild: (parentId: string, blockIndex: number) => void;
  onAddBefore: (targetId: string, blockIndex: number) => void;
  onAddAfter: (targetId: string, blockIndex: number) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  layers: { id: string }[];
}

export type CanvasContextMenuHandle = {
  show: (vnode: VNode, rect: DOMRect) => void;
};

export const CanvasContextMenu = forwardRef<
  CanvasContextMenuHandle,
  CanvasContextMenuProps
>(
  (
    {
      tree,
      layers,
      onMoveNode,
      onAddChild,
      onAddBefore,
      onAddAfter,
      onDuplicate,
      onDelete,
    },
    ref,
  ) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [vnode, setVnode] = useState<VNode | null>(null);
    const [open, setOpen] = useState(false);

    const getLayerIndex = (id: string) => layers.findIndex((l) => l.id === id);
    const blocksByCategory = groupBy(BLOCKS, (block) => block.category);

    useImperativeHandle(ref, () => ({
      show(v: VNode, rect: DOMRect) {
        setPosition({ x: rect.left, y: rect.top - 32 });
        setVnode(v);
        setOpen(true);
      },
    }));

    useEffect(() => {
      if (!open) setVnode(null);
    }, [open]);

    if (!vnode || !open) return null;

    const layerIndex = getLayerIndex(vnode.id);
    const canMoveUp = layerIndex > 0;
    const canMoveDown = layerIndex < layers.length - 1;
    const canDelete = vnode.id !== tree.id;

    return createPortal(
      <div
        className="fixed z-50"
        style={{ left: position.x, top: position.y }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div className="h-6 px-3 flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white text-xs shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
              <Settings className="h-3 w-3" />
              <span className="font-medium">config</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => onMoveNode(vnode.id, "up")}
              disabled={!canMoveUp}
            >
              <ChevronUp className="mr-2 h-4 w-4" />
              Move Up
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onMoveNode(vnode.id, "down")}
              disabled={!canMoveDown}
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Move Down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus className="mr-2 h-4 w-4" />
                Add Child
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {Object.entries(blocksByCategory).map(([category, blocks]) => (
                  <DropdownMenuSub key={category}>
                    <DropdownMenuSubTrigger>{category}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {blocks.map((block) => {
                        const globalIndex = BLOCKS.findIndex(
                          (b) => b === block,
                        );
                        return (
                          <DropdownMenuItem
                            key={globalIndex}
                            onClick={() => onAddChild(vnode.id, globalIndex)}
                          >
                            <span className="mr-2">{block.icon}</span>
                            {block.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Insert Before */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ChevronUp className="mr-2 h-4 w-4" />
                Insert Before
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {Object.entries(blocksByCategory).map(([category, blocks]) => (
                  <DropdownMenuSub key={category}>
                    <DropdownMenuSubTrigger>{category}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {blocks.map((block) => {
                        const globalIndex = BLOCKS.findIndex(
                          (b) => b === block,
                        );
                        return (
                          <DropdownMenuItem
                            key={globalIndex}
                            onClick={() => onAddBefore(vnode.id, globalIndex)}
                          >
                            <span className="mr-2">{block.icon}</span>
                            {block.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Insert After */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ChevronDown className="mr-2 h-4 w-4" />
                Insert After
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {Object.entries(blocksByCategory).map(([category, blocks]) => (
                  <DropdownMenuSub key={category}>
                    <DropdownMenuSubTrigger>{category}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {blocks.map((block) => {
                        const globalIndex = BLOCKS.findIndex(
                          (b) => b === block,
                        );
                        return (
                          <DropdownMenuItem
                            key={globalIndex}
                            onClick={() => onAddAfter(vnode.id, globalIndex)}
                          >
                            <span className="mr-2">{block.icon}</span>
                            {block.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDuplicate(vnode.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Element
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(vnode.id)}
              disabled={!canDelete}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Element
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>,
      document.body,
    );
  },
);

CanvasContextMenu.displayName = "CanvasContextMenu";
