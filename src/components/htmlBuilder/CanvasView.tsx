/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
  Settings,
  ChevronUp,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  MousePointer2,
  Eye,
} from "lucide-react";
import { BLOCKS } from "@/lib/htmlBuilder/blocks";
import { groupBy, uid } from "@/lib/htmlBuilder/utils";
import { VOID_TAGS } from "@/lib/htmlBuilder/domUtils";
import clsx from "clsx";
import { Block, VNode } from "@/lib/types/htmlBuilder.types";

// Type definitions
type LayerItem = {
  id: string;
  tag: string;
  depth: number;
  text?: string;
};

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
  layers: LayerItem[];
}

// Helper to flatten the tree (used only for position calculations in canvas)
// const flatten = (n: VNode, depth = 0): LayerItem[] => {
//   const nodeInfo: LayerItem = {
//     id: n.id,
//     tag: n.tag,
//     depth,
//     text: n.text
//       ? n.text.slice(0, 15) + (n.text.length > 15 ? "..." : "")
//       : undefined,
//   };
//   return [nodeInfo, ...n.children.flatMap((c) => flatten(c, depth + 1))];
// };

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
  const blocksByCategory = useMemo(() => {
    return groupBy(BLOCKS, (block: Block) => block.category);
  }, []);

  const getLayerIndex = (layerId: string) => {
    return layers.findIndex((layer) => layer.id === layerId);
  };

  // Add this helper function at the top of the component, before getLayerIndex
  const convertAttributesToReact = (attrs: Record<string, any>) => {
    const converted: Record<string, any> = {};

    // Special cases that don't follow the standard kebab-to-camel conversion
    const specialCases: Record<string, string> = {
      class: "className",
      for: "htmlFor",
      tabindex: "tabIndex",
      readonly: "readOnly",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable",
      crossorigin: "crossOrigin",
      datetime: "dateTime",
      formaction: "formAction",
      formenctype: "formEncType",
      formmethod: "formMethod",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      novalidate: "noValidate",
      acceptcharset: "acceptCharset",
    };

    // Function to convert kebab-case to camelCase
    const kebabToCamel = (str: string) => {
      return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    };

    for (const [key, value] of Object.entries(attrs)) {
      // Check special cases first
      if (specialCases[key]) {
        converted[specialCases[key]] = value;
      }
      // Convert kebab-case to camelCase
      else if (key.includes("-")) {
        converted[kebabToCamel(key)] = value;
      }
      // Keep as is
      else {
        converted[key] = value;
      }
    }

    return converted;
  };

  // Extract common node props
  const getCommonNodeProps = (v: VNode) => ({
    key: v.id,
    "data-node": v.id,
    className: v.attrs.class || undefined,
    onClick: (e: React.MouseEvent) => {
      if (previewMode) return;
      e.stopPropagation();
      onSelect(v.id);
    },
  });

  // Render selection overlay
  const renderSelectionOverlay = (isSelected: boolean) => (
    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="pointer-events-none absolute inset-0 border-2 border-indigo-500 rounded-xl bg-indigo-50/10"
        />
      )}
    </AnimatePresence>
  );

  // Render wrapper for interactive elements
  const renderInteractiveWrapper = (
    v: VNode,
    isSelected: boolean,
    element: React.ReactNode,
  ) => {
    if (previewMode) return element;

    // Don't wrap SVG child elements (path, circle, rect, etc.) or table elements with divs
    const svgChildTags = [
      "path",
      "circle",
      "rect",
      "line",
      "polygon",
      "polyline",
      "ellipse",
      "g",
      "text",
      "tspan",
      "defs",
      "use",
      "symbol",
    ];
    const tableElements = [
      "tr",
      "td",
      "th",
      "thead",
      "tbody",
      "tfoot",
      "col",
      "colgroup",
    ];

    if (svgChildTags.includes(v.tag) || tableElements.includes(v.tag)) {
      // For SVG children and table elements, return the element with selection/menu attached differently
      return element;
    }

    return (
      <div
        className={clsx("relative group", {
          "border border-0.5 border-dashed border-muted-foreground":
            !isSelected && dashBox,
        })}
        data-node={v.id}
      >
        {element}
        {renderSelectionOverlay(isSelected)}
        {isSelected && renderContextMenu(v)}
      </div>
    );
  };

  // Render text node
  const renderTextNode = (v: VNode, commonProps: any) => {
    return React.createElement(
      v.tag,
      {
        ...commonProps,
        contentEditable: !previewMode,
        suppressContentEditableWarning: true,
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
          if (previewMode) return;
          const text = e.currentTarget.textContent || "";
          onTextUpdate(v.id, text);
        },
        className:
          `${v.attrs.class || ""} ${!previewMode ? "outline-none" : ""}`.replace(
            /\s+/g,
            " ",
          ),
      },
      v.text,
    );
  };

  // Render image node
  const renderImageNode = (v: VNode, commonProps: any, isSelected: boolean) => {
    const imgProps = {
      ...commonProps,
      src: v.attrs.src || "",
      alt: v.attrs.alt || "Image",
      className: v.attrs.class || undefined,
    };
    const imgElement = React.createElement("img", imgProps);
    return renderInteractiveWrapper(v, isSelected, imgElement);
  };

  // Render media node (video/audio)
  const renderMediaNode = (
    v: VNode,
    commonProps: any,
    isSelected: boolean,
    type: "video" | "audio",
  ) => {
    const mediaProps = {
      ...commonProps,
      controls: v.attrs.controls !== "false",
      autoPlay: v.attrs.autoplay === "true",
      loop: v.attrs.loop === "true",
      muted: v.attrs.muted === "true",
      className: v.attrs.class || undefined,
    };

    const children = v.children.map((c) => (
      <React.Fragment key={c.id}>{renderNode(c)}</React.Fragment>
    ));

    const mediaElement = React.createElement(type, mediaProps, children);
    return renderInteractiveWrapper(v, isSelected, mediaElement);
  };

  // Render standard element node
  // const renderElementNode = (
  //   v: VNode,
  //   commonProps: any,
  //   isSelected: boolean,
  //   children: React.ReactNode[],
  // ) => {
  //   const element = VOID_TAGS.has(v.tag)
  //     ? React.createElement(v.tag, commonProps)
  //     : React.createElement(v.tag, commonProps, children);

  //   return renderInteractiveWrapper(v, isSelected, element);
  // };

  const renderElementNode = (
    v: VNode,
    commonProps: any,
    isSelected: boolean,
    children: React.ReactNode[],
  ) => {
    // Convert attributes to React format and merge with commonProps
    const convertedAttrs = convertAttributesToReact(v.attrs);
    const allProps = { ...convertedAttrs, ...commonProps };

    const element = VOID_TAGS.has(v.tag)
      ? React.createElement(v.tag, allProps)
      : React.createElement(v.tag, allProps, children);

    return renderInteractiveWrapper(v, isSelected, element);
  };

  // Main render function
  const renderNode = (v: VNode): React.ReactNode => {
    const isSelected = selectedId === v.id;
    const commonProps = getCommonNodeProps(v);

    const children = v.children.map((c) => (
      <React.Fragment key={c.id}>{renderNode(c)}</React.Fragment>
    ));

    // Text node
    if (v.text != null) {
      return renderTextNode(v, commonProps);
    }

    // Image node
    if (v.tag === "img") {
      return renderImageNode(v, commonProps, isSelected);
    }

    // Video node
    if (v.tag === "video") {
      return renderMediaNode(v, commonProps, isSelected, "video");
    }

    // Audio node
    if (v.tag === "audio") {
      return renderMediaNode(v, commonProps, isSelected, "audio");
    }

    // Standard element
    return renderElementNode(v, commonProps, isSelected, children);
  };

  const renderContextMenu = (v: VNode) => {
    const layerIndex = getLayerIndex(v.id);
    const canMoveUp = layerIndex > 0;
    const canMoveDown = layerIndex < layers.length - 1;
    const canDelete = v.id !== tree.id;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-8 -left-2 h-6 px-3 flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white text-xs shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors z-10"
            title="Configure element"
          >
            <Settings className="h-3 w-3" />
            <span className="font-medium">config</span>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => onMoveNode(v.id, "up")}
            disabled={!canMoveUp}
          >
            <ChevronUp className="mr-2 h-4 w-4" />
            Move Up
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onMoveNode(v.id, "down")}
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
                      const globalIndex = BLOCKS.findIndex((b) => b === block);
                      return (
                        <DropdownMenuItem
                          key={uid()}
                          onClick={() => onAddChild(v.id, globalIndex)}
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
                      const globalIndex = BLOCKS.findIndex((b) => b === block);
                      return (
                        <DropdownMenuItem
                          key={globalIndex}
                          onClick={() => onAddBefore(v.id, globalIndex)}
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
                      const globalIndex = BLOCKS.findIndex((b) => b === block);
                      return (
                        <DropdownMenuItem
                          key={globalIndex}
                          onClick={() => onAddAfter(v.id, globalIndex)}
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
          <DropdownMenuItem onClick={() => onDuplicate(v.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate Element
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(v.id)}
            disabled={!canDelete}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Element
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div
      id="canvas-view-panel"
      className="flex-1 flex flex-col min-h-0 p-4 overflow-auto"
    >
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
            onClick={() => !previewMode && onSelect(null)}
            className="relative w-full h-full overflow-auto bg-gradient-to-br from-gray-50 to-white"
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                minHeight: previewMode ? "auto" : "1000px",
                minWidth: "100%",
              }}
              className="origin-top-left"
            >
              {renderNode(tree)}
              {/*{vnodeToHtml(tree, true)}*/}
              {/*<div
                className="content"
                dangerouslySetInnerHTML={{ __html: vnodeToHtml(tree, true) }}
              ></div>*/}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
