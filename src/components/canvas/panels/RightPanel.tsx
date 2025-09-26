// RightPanel.tsx
import React, { useMemo } from "react";
import { VNode, Project } from "../types";
import { BLOCKS } from "../blocks/BlockDefinitions";
import { flattenTree } from "../utils/treeUtils";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Layers,
  Save,
  FolderOpen,
  ChevronUp,
  ChevronDown,
  Trash2,
  Lock,
  Upload,
} from "lucide-react";
import { Textarea } from "@/components/ui/TextArea";

interface RightPanelProps {
  tree: VNode;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  pushHistory: (next: VNode) => void;
  removeNode: (root: VNode, id: string) => VNode;
  moveNodeInLayer: (nodeId: string, direction: "up" | "down") => void;
  rawHtml: string;
  setRawHtml: React.Dispatch<React.SetStateAction<string>>;
  handleImport: () => void;
  saveProject: () => void;
  projects: Project[];
  loadProject: (project: Project) => void;
  handleBlockDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    blockIndex: number,
  ) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  tree,
  selectedIds,
  setSelectedIds,
  pushHistory,
  removeNode,
  moveNodeInLayer,
  rawHtml,
  setRawHtml,
  handleImport,
  saveProject,
  projects,
  loadProject,
  handleBlockDragStart,
}) => {
  const layers = useMemo(() => flattenTree(tree), [tree]);
  const blocksByCategory = useMemo(() => {
    const groups: Record<string, typeof BLOCKS> = {};
    BLOCKS.forEach((block) => {
      if (!groups[block.category]) groups[block.category] = [];
      groups[block.category].push(block);
    });
    return groups;
  }, []);

  // const handleBlockDragStart = (e: React.DragEvent, blockIndex: number) => {
  //   // You may lift this to parent if needed
  // };

  return (
    <Card className="shadow-lg border-0 bg-transparent flex-1 min-h-0">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
          <Layers className="h-5 w-5 text-indigo-600" />
          Elementos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-0">
        <Tabs defaultValue="blocks" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0 mx-6">
            <TabsTrigger value="blocks">Bloques</TabsTrigger>
            <TabsTrigger value="layers">Capas</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
          </TabsList>
          <TabsContent value="blocks" className="flex-1 mt-4 min-h-0 px-6">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-4">
                {Object.entries(blocksByCategory).map(([category, blocks]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 px-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {blocks.map((block) => {
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="layers" className="flex-1 mt-4 min-h-0 px-6">
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
                        onClick={() => setSelectedIds(new Set([layer.id]))}
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
                          onClick={() => moveNodeInLayer(layer.id, "up")}
                          disabled={index <= 1}
                          className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Mover arriba"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNodeInLayer(layer.id, "down")}
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
          <TabsContent value="projects" className="flex-1 mt-4 min-h-0 px-6">
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
                      <p className="text-sm">No hay proyectos guardados</p>
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
                          {new Date(project.timestamp).toLocaleDateString(
                            "es-ES",
                          )}
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
        <Card className="border-0 bg-transparent mt-4">
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
      </CardContent>
    </Card>
  );
};
