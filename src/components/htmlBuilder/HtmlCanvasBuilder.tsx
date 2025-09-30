/* eslint-disable @typescript-eslint/no-explicit-any */

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
          <ul class="space-y-3 text-gray-600">
            <li class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
              Edición avanzada
            </li>
            <li class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-purple-500"></div>
              Menús contextuales
            </li>
            <li class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-cyan-500"></div>
              Vista previa en vivo
            </li>
          </ul>
        </div>
      </div>
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
        <div class="relative p-8 rounded-3xl bg-white shadow-xl border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Empezar ahora</h3>
          <p class="text-gray-600 mb-6">Usa el árbol de capas para agregar y organizar elementos</p>
          <button class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-300">
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  </div>
  <hr/>

</section>`;

import { useEffect, useMemo, useState } from "react";

import { useBuilderHistory } from "@/components/hooks/useBuilderHistory";
import { useSelectedNode } from "@/components/hooks/useSelectedNode";
import { useProjects } from "@/components/hooks/useProjects";
import { htmlToVNodeTree, vnodeToHtml } from "@/lib/htmlBuilder/domUtils";
import {
  appendChild,
  insertBefore,
  insertAfter,
  removeNode,
  duplicateNode,
  updateNode,
  findNode,
  moveNodeInTree as moveNodeInTreeUtil,
} from "@/lib/htmlBuilder/edit-utils";
import { BLOCKS } from "@/lib/htmlBuilder/blocks";
import { groupBy } from "@/lib/htmlBuilder/utils";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { CanvasView } from "./CanvasView";
import { ResizablePanel } from "./ResizablePanel";
import { VNode } from "@/lib/types/htmlBuilder.types";

export default function HtmlCanvasBuilder() {
  // Estados básicos
  const [rawHtml, setRawHtml] = useState(DEFAULT_HTML);
  const [zoom, setZoom] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [dashBox, setDashBox] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);
  // Hooks personalizados
  const initialTree = useMemo(() => htmlToVNodeTree(DEFAULT_HTML), []);
  const { tree, pushHistory, undo, redo, canUndo, canRedo } =
    useBuilderHistory(initialTree);
  const { selectedId, setSelectedId, clearSelection } = useSelectedNode();
  const {
    projects,
    currentProjectName,
    setCurrentProjectName,
    saveProject: saveProjectHook,
    // loadProject: loadProjectHook,
  } = useProjects();

  useEffect(() => {
    if (!selectedId) return;

    const scrollToElement = (
      selector: string,
      align: ScrollLogicalPosition = "nearest",
    ) => {
      const el = document.querySelector(selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.left >= 0 &&
          rect.right <= window.innerWidth;
        if (!isVisible) {
          el.scrollIntoView({
            behavior: "smooth",
            block: align,
            inline: "nearest",
          });
        }
      }
    };

    // Defer to next frame to ensure DOM is updated
    const timer = requestAnimationFrame(() => {
      scrollToElement(`[data-node-id="${selectedId}"]`, "center");
      scrollToElement(`[data-node="${selectedId}"]`, "center");
    });

    return () => cancelAnimationFrame(timer);
  }, [selectedId]);

  // Datos derivados
  const selectedNode = useMemo(() => {
    return selectedId ? findNode(tree, selectedId) : null;
  }, [tree, selectedId]);

  const layers = useMemo(() => {
    const flatten: any = (n: VNode, depth = 0) => {
      const nodeInfo = {
        id: n.id,
        tag: n.tag,
        depth,
        text: n.text
          ? n.text.slice(0, 15) + (n.text.length > 15 ? "..." : "")
          : undefined,
      };
      return [nodeInfo, ...n.children.flatMap((c) => flatten(c, depth + 1))];
    };
    return flatten(tree);
  }, [tree]);

  const blocksByCategory = useMemo(() => {
    return groupBy(BLOCKS, (block) => block.category);
  }, []);

  // Handlers de edición
  const addElementToTree = (parentId: string, blockIndex: number) => {
    const newElement = BLOCKS[blockIndex].make();
    pushHistory(appendChild(tree, parentId, newElement));
  };

  const addElementBefore = (targetId: string, blockIndex: number) => {
    const newElement = BLOCKS[blockIndex].make();
    pushHistory(insertBefore(tree, targetId, newElement));
  };

  const addElementAfter = (targetId: string, blockIndex: number) => {
    const newElement = BLOCKS[blockIndex].make();
    pushHistory(insertAfter(tree, targetId, newElement));
  };

  const moveNodeInTree = (nodeId: string, direction: "up" | "down") => {
    pushHistory(moveNodeInTreeUtil(tree, nodeId, direction));
  };

  const deleteNodeFromTree = (nodeId: string) => {
    if (nodeId === tree.id) return;
    pushHistory(removeNode(tree, nodeId));
    if (selectedId === nodeId) clearSelection();
  };

  const duplicateNodeFromTree = (nodeId: string) => {
    pushHistory(duplicateNode(tree, nodeId));
  };

  // Handlers de propiedades
  const updateAttribute = (attr: string, value: string) => {
    if (!selectedId) return;
    pushHistory(
      updateNode(tree, selectedId, (n) => {
        if (value.trim() === "") {
          delete n.attrs[attr];
        } else {
          n.attrs[attr] = value;
        }
      }),
    );
  };

  const updateClasses = (classes: string) => {
    if (!selectedId) return;
    pushHistory(
      updateNode(tree, selectedId, (n) => {
        n.attrs.class = classes;
      }),
    );
  };

  // Proyectos
  const saveProject = () => {
    saveProjectHook(currentProjectName, tree);
  };

  const loadProject = (project: { name: string; tree: VNode }) => {
    pushHistory(project.tree);
    setCurrentProjectName(project.name);
    setRawHtml(vnodeToHtml(project.tree));
    clearSelection();
  };

  // Import/Export
  const handleImport = () => {
    try {
      const v = htmlToVNodeTree(rawHtml);
      pushHistory(v);
      clearSelection();
    } catch (e) {
      alert("HTML inválido o no parseable");
      console.error(e);
    }
  };

  const handleExport = () => {
    const inner = vnodeToHtml(tree, true); // modo explícito para compatibilidad
    const doc = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProjectName}</title>
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
    a.download = `${currentProjectName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toolbar */}
      <Toolbar
        currentProject={currentProjectName}
        onProjectChange={setCurrentProjectName}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
        onZoomOut={() => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        dashBox={dashBox}
        onToggleDashBox={() => setDashBox(!dashBox)}
        onSave={saveProject}
        onExport={handleExport}
      />

      {/* Layout principal */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Panel izquierdo */}
        <ResizablePanel
          defaultWidth={leftPanelWidth}
          minWidth={200}
          maxWidth={700}
          onWidthChange={setLeftPanelWidth}
          className="bg-white/70 backdrop-blur-sm"
        >
          <LayersPanel
            tree={tree}
            layers={layers}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddChild={addElementToTree}
            onAddBefore={addElementBefore}
            onAddAfter={addElementAfter}
            onMove={moveNodeInTree}
            onDelete={deleteNodeFromTree}
            onDuplicate={duplicateNodeFromTree}
            // projects={projects}
            //onLoadProject={loadProject}
            rawHtml={rawHtml}
            onRawHtmlChange={setRawHtml}
            onImportHtml={handleImport}
            //onSaveProject={saveProject}
            blocksByCategory={blocksByCategory}
          />
        </ResizablePanel>

        {/* Canvas central */}
        <CanvasView
          tree={tree}
          selectedId={selectedId}
          onSelect={setSelectedId}
          zoom={zoom}
          previewMode={previewMode}
          dashBox={dashBox}
          onTextUpdate={(id, text) =>
            pushHistory(updateNode(tree, id, (n) => (n.text = text)))
          }
          onMoveNode={moveNodeInTree}
          onAddChild={addElementToTree}
          onAddBefore={addElementBefore}
          onAddAfter={addElementAfter}
          onDuplicate={duplicateNodeFromTree}
          onDelete={deleteNodeFromTree}
          layers={layers}
        />

        {/* Panel derecho */}
        <ResizablePanel
          defaultWidth={rightPanelWidth}
          minWidth={200}
          maxWidth={700}
          onWidthChange={setRightPanelWidth}
          className="bg-white/70 backdrop-blur-sm overflow-hidden"
          side="right"
        >
          <PropertiesPanel
            selectedNode={selectedNode}
            onUpdateAttribute={updateAttribute}
            onUpdateClasses={updateClasses}
            onDuplicate={duplicateNodeFromTree}
            onDelete={deleteNodeFromTree}
          />
        </ResizablePanel>
      </div>
    </div>
  );
}
