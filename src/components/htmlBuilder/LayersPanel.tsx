/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Layers,
  Upload,
  ChevronUp,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropDownMenu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/ContextMenu";
import { Block, VNode } from "@/lib/types/htmlBuilder.types";
import { BLOCKS } from "@/lib/htmlBuilder/blocks";

// Type definitions
type LayerItem = {
  id: string;
  tag: string;
  depth: number;
  text?: string;
};

interface LayersPanelProps {
  tree: VNode;
  layers: LayerItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string, blockIndex: number) => void;
  onAddBefore: (targetId: string, blockIndex: number) => void;
  onAddAfter: (targetId: string, blockIndex: number) => void;
  onMove: (nodeId: string, direction: "up" | "down") => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  rawHtml: string;
  onRawHtmlChange: (html: string) => void;
  onImportHtml: () => void;
  blocksByCategory: Record<string, Block[]>;
}

// Renders the submenu for adding blocks (used by both dropdown and context menus)
const renderBlocksSubmenu = (
  blocksByCategory: Record<string, Block[]>,
  onAction: (blockIndex: number) => void,
  MenuComponent: any,
  MenuItemComponent: any,
  MenuSubComponent: any,
  MenuSubTriggerComponent: any,
  MenuSubContentComponent: any,
) => {
  return Object.entries(blocksByCategory).map(([category, blocks]) => (
    <MenuSubComponent key={category}>
      <MenuSubTriggerComponent>{category}</MenuSubTriggerComponent>
      <MenuSubContentComponent>
        {blocks.map((block) => {
          const globalIndex = BLOCKS.findIndex((b) => b === block);
          return (
            <MenuItemComponent
              key={globalIndex}
              onClick={() => onAction(globalIndex)}
            >
              <span className="mr-2">{block.icon}</span>
              {block.label}
            </MenuItemComponent>
          );
        })}
      </MenuSubContentComponent>
    </MenuSubComponent>
  ));
};

export const LayersPanel = ({
  tree,
  layers,
  selectedId,
  onSelect,
  onAddChild,
  onAddBefore,
  onAddAfter,
  onMove,
  onDelete,
  onDuplicate,
  rawHtml,
  onRawHtmlChange,
  onImportHtml,
  blocksByCategory,
}: LayersPanelProps) => {
  const renderLayerActions = (
    layer: LayerItem,
    canMoveUp: boolean,
    canMoveDown: boolean,
    canDelete: boolean,
  ) => (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMove(layer.id, "up")}
        disabled={!canMoveUp}
        className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
        title="Move Up"
      >
        <ChevronUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMove(layer.id, "down")}
        disabled={!canMoveDown}
        className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
        title="Move Down"
      >
        <ChevronDown className="h-3 w-3" />
      </Button>

      {/* Dropdown menu for adding elements */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
            title="Add Element"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="right">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Plus className="mr-2 h-4 w-4" />
              Add Child
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderBlocksSubmenu(
                blocksByCategory,
                (blockIndex) => onAddChild(layer.id, blockIndex),
                DropdownMenu,
                DropdownMenuItem,
                DropdownMenuSub,
                DropdownMenuSubTrigger,
                DropdownMenuSubContent,
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ChevronUp className="mr-2 h-4 w-4" />
              Insert Before
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderBlocksSubmenu(
                blocksByCategory,
                (blockIndex) => onAddBefore(layer.id, blockIndex),
                DropdownMenu,
                DropdownMenuItem,
                DropdownMenuSub,
                DropdownMenuSubTrigger,
                DropdownMenuSubContent,
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ChevronDown className="mr-2 h-4 w-4" />
              Insert After
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderBlocksSubmenu(
                blocksByCategory,
                (blockIndex) => onAddAfter(layer.id, blockIndex),
                DropdownMenu,
                DropdownMenuItem,
                DropdownMenuSub,
                DropdownMenuSubTrigger,
                DropdownMenuSubContent,
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDuplicate(layer.id)}
        className="h-7 w-7 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
        title="Duplicate"
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(layer.id)}
        disabled={!canDelete}
        className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  const renderContextMenu = (
    layer: LayerItem,
    canMoveUp: boolean,
    canMoveDown: boolean,
    canDelete: boolean,
  ) => (
    <ContextMenuContent className="w-56">
      <ContextMenuItem
        onClick={() => onMove(layer.id, "up")}
        disabled={!canMoveUp}
      >
        <ChevronUp className="mr-2 h-4 w-4" />
        Move Up
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onMove(layer.id, "down")}
        disabled={!canMoveDown}
      >
        <ChevronDown className="mr-2 h-4 w-4" />
        Move Down
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <Plus className="mr-2 h-4 w-4" />
          Add Child
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          {renderBlocksSubmenu(
            blocksByCategory,
            (blockIndex) => onAddChild(layer.id, blockIndex),
            ContextMenu,
            ContextMenuItem,
            ContextMenuSub,
            ContextMenuSubTrigger,
            ContextMenuSubContent,
          )}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <ChevronUp className="mr-2 h-4 w-4" />
          Insert Before
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          {renderBlocksSubmenu(
            blocksByCategory,
            (blockIndex) => onAddBefore(layer.id, blockIndex),
            ContextMenu,
            ContextMenuItem,
            ContextMenuSub,
            ContextMenuSubTrigger,
            ContextMenuSubContent,
          )}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <ChevronDown className="mr-2 h-4 w-4" />
          Insert After
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          {renderBlocksSubmenu(
            blocksByCategory,
            (blockIndex) => onAddAfter(layer.id, blockIndex),
            ContextMenu,
            ContextMenuItem,
            ContextMenuSub,
            ContextMenuSubTrigger,
            ContextMenuSubContent,
          )}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onDuplicate(layer.id)}>
        <Copy className="mr-2 h-4 w-4" />
        Duplicate Element
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDelete(layer.id)}
        disabled={!canDelete}
        className="text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Element
      </ContextMenuItem>
    </ContextMenuContent>
  );

  return (
    <div className="h-full flex flex-col p-4">
      <Card className="shadow-lg border-0 bg-transparent flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
            <Layers className="h-5 w-5 text-indigo-600" />
            Layers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 px-0">
          <ScrollArea className="h-full" style={{ width: "100%" }}>
            <div className="space-y-1 min-w-0">
              {layers.map((layer, index) => {
                const canMoveUp = index > 0;
                const canMoveDown = index < layers.length - 1;
                const canDelete = layer.id !== tree.id;

                return (
                  <ContextMenu key={layer.id}>
                    <ContextMenuTrigger asChild>
                      <div
                        data-node-id={layer.id}
                        className={`group rounded-lg transition-all duration-200 min-w-0 ${
                          selectedId === layer.id
                            ? "bg-indigo-100 border border-indigo-300"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className="flex items-center gap-2 p-2 min-w-0"
                          style={{
                            paddingLeft: 8 + layer.depth * 12,
                          }}
                        >
                          <button
                            onClick={() => onSelect(layer.id)}
                            className="flex items-center gap-2 flex-1 text-left min-w-0 overflow-hidden"
                          >
                            <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border flex-shrink-0">
                              {layer.tag}
                            </span>
                            <span
                              className={`text-sm truncate min-w-0 ${
                                selectedId === layer.id
                                  ? "text-indigo-700 font-medium"
                                  : "text-gray-600"
                              }`}
                            >
                              {layer.text || `#${layer.id.slice(-4)}`}
                            </span>
                          </button>

                          {/* Hover actions */}
                          {renderLayerActions(
                            layer,
                            canMoveUp,
                            canMoveDown,
                            canDelete,
                          )}
                        </div>
                      </div>
                    </ContextMenuTrigger>

                    {/* Context menu (right-click) */}
                    {renderContextMenu(
                      layer,
                      canMoveUp,
                      canMoveDown,
                      canDelete,
                    )}
                  </ContextMenu>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* HTML Import Area */}
      <Card className="shadow-lg border-0 bg-transparent mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-gray-800">
            <Upload className="h-4 w-4 text-indigo-600" />
            Raw HTML
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={rawHtml}
            onChange={(e) => onRawHtmlChange(e.target.value)}
            className="font-mono text-xs min-h-[120px] border-gray-200 focus:border-indigo-400"
            placeholder="Paste your HTML here..."
          />
          <Button
            size="sm"
            onClick={onImportHtml}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import to Canvas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
