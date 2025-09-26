import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/TextArea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Search, Copy, Trash2, Lock, Unlock, Palette } from "lucide-react";

import { VNode } from "../types";
import { uid } from "../utils/domUtils";
import { updateNode, removeNode, appendChild } from "../utils/treeUtils";

interface LeftPanelProps {
  primarySelectedNode: VNode | null;
  selectedIds: Set<string>;
  tree: VNode;
  setTree: React.Dispatch<React.SetStateAction<VNode>>;
  pushHistory: (next: VNode) => void;
  selectedNodes: VNode[];
  gridSize: number;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  primarySelectedNode,
  selectedIds,
  tree,
  setTree,
  pushHistory,
  selectedNodes,
  gridSize,
}) => {
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

  return (
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
              {/* Selection info */}
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
                    <span>X: {Math.round(primarySelectedNode.x)}px</span>
                    <span>Y: {Math.round(primarySelectedNode.y)}px</span>
                    <span>W: {primarySelectedNode.width || "auto"}px</span>
                    <span>H: {primarySelectedNode.height || "auto"}px</span>
                  </div>
                </div>
              </div>

              {/* Position and size controls */}
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

              {/* Attributes */}
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
                      onChange={(e) => updateAttribute("id", e.target.value)}
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

              {/* Tailwind classes */}
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
                  <div className="text-xs text-gray-600">Clases comunes:</div>
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
                            updateClasses([...currentClasses, cls].join(" "));
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

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      let newTree = tree;
                      selectedIds.forEach((id) => {
                        const node = selectedNodes.find((n) => n.id === id);
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
                    // Reset selection
                    const resetSelection = new Set<string>();
                    setTree(newTree);
                    // Delay to avoid race condition
                    setTimeout(() => {
                      // Re-select if any remain (unlikely after delete)
                    }, 0);
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
  );
};
