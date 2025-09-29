import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Search, Copy, Trash2, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { VNode } from "@/lib/types/htmlBuilder.types";
//import { TailwindClassPicker } from "./TailwindClassPicker";

interface PropertiesPanelProps {
  selectedNode: VNode | null;
  onUpdateAttribute: (attr: string, value: string) => void;
  onUpdateClasses: (classes: string) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

export const PropertiesPanel = ({
  selectedNode,
  onUpdateAttribute,
  onUpdateClasses,
  onDuplicate,
  onDelete,
}: PropertiesPanelProps) => {
  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-center p-4">
        <div>
          <Search className="h-8 w-8 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-500">Selecciona un elemento</p>
          <p className="text-xs text-gray-400 mt-1">para ver sus propiedades</p>
        </div>
      </div>
    );
  }

  const selectedClasses = selectedNode.attrs.class || "";

  // Clases comunes sugeridas
  const COMMON_CLASSES = [
    "p-4",
    "p-6",
    "p-8",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "bg-white",
    "bg-gray-50",
    "shadow-lg",
    "shadow-xl",
    "border",
    "border-gray-100",
    "flex",
    "grid",
    "gap-4",
    "items-center",
    "justify-center",
    "text-center",
    "font-bold",
    "font-medium",
    "text-gray-600",
    "text-gray-800",
    "text-indigo-600",
    "hover:shadow-xl",
    "transition-all",
    "duration-300",
  ];

  const addClass = (cls: string) => {
    const currentClasses = selectedClasses.split(/\s+/).filter(Boolean);
    if (!currentClasses.includes(cls)) {
      onUpdateClasses([...currentClasses, cls].join(" "));
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-transparent flex-1 flex flex-col min-h-0">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
          <Palette className="h-5 w-5 text-indigo-600" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4">
            {/* Información básica */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                    {`<${selectedNode.tag}>`}
                  </span>
                  <span className="text-gray-500">
                    #{selectedNode.id.slice(-6)}
                  </span>
                </div>
              </div>
            </div>

            {/* Atributos principales */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 text-sm">
                Attributes
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">ID</label>
                  <Input
                    value={selectedNode.attrs.id || ""}
                    onChange={(e) => onUpdateAttribute("id", e.target.value)}
                    placeholder="mi-elemento"
                    className="text-xs h-8"
                  />
                </div>
                {selectedNode.tag === "a" && (
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Href
                    </label>
                    <Input
                      value={selectedNode.attrs.href || ""}
                      onChange={(e) =>
                        onUpdateAttribute("href", e.target.value)
                      }
                      placeholder="https://example.com"
                      className="text-xs h-8"
                    />
                  </div>
                )}
                {selectedNode.tag === "img" && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Src
                      </label>
                      <Input
                        value={selectedNode.attrs.src || ""}
                        onChange={(e) =>
                          onUpdateAttribute("src", e.target.value)
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
                        value={selectedNode.attrs.alt || ""}
                        onChange={(e) =>
                          onUpdateAttribute("alt", e.target.value)
                        }
                        placeholder="Image Description"
                        className="text-xs h-8"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/*<TailwindClassPicker />*/}
            {/* Clases Tailwind */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 text-sm">
                Tailwind Classes
              </h4>
              <Textarea
                value={selectedClasses}
                onChange={(e) => onUpdateClasses(e.target.value)}
                placeholder="p-4 rounded-xl bg-white shadow-lg"
                className="font-mono text-xs min-h-[80px] resize-none"
              />
              {/*<div className="space-y-2">
                <div className="text-xs text-gray-600">Common Classes:</div>
                <div className="flex flex-wrap gap-1">
                  {COMMON_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => addClass(cls)}
                      className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>*/}
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(selectedNode?.id)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-1" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(selectedNode?.id)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
