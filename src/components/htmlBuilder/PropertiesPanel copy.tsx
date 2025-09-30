import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Search, Check, X, Copy, Trash2, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { VNode } from "@/lib/types/htmlBuilder.types";
import {
  TAILWIND_CLASSES,
  flattenClasses,
  fuzzySearch,
} from "@/lib/htmlBuilder/tailwind-utils";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const allClasses = useMemo(() => flattenClasses(TAILWIND_CLASSES), []);

  const filteredClasses = useMemo(() => {
    let classes = allClasses;

    if (activeCategory !== "all") {
      classes = classes.filter((cls) => cls.category === activeCategory);
    }

    if (searchQuery) {
      classes = fuzzySearch(classes, searchQuery);
    }

    return classes;
  }, [allClasses, searchQuery, activeCategory]);

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

  //const selectedClasses = selectedNode.attrs.class || "";

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

  // const addClass = (cls: string) => {
  //   const currentClasses = selectedClasses.split(/\s+/).filter(Boolean);
  //   if (!currentClasses.includes(cls)) {
  //     onUpdateClasses([...currentClasses, cls].join(" "));
  //   }
  // };

  const categories = ["all", ...Object.keys(TAILWIND_CLASSES)];

  const toggleClass = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className],
    );
  };

  const clearSelection = () => {
    setSelectedClasses([]);
  };

  return (
    <Card className="shadow-lg border-0 bg-transparent flex-1 flex flex-col min-h-0">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
          <Palette className="h-5 w-5 text-indigo-600" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2">
          <div className="space-y-4">
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
                    <label className="text-xs text-gray-600 mb-1 block">
                      ID
                    </label>
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

              {/* Selected Classes Display */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-700">
                    Selected Classes ({selectedClasses.length})
                  </h2>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[60px]">
                  {selectedClasses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedClasses.map((cls) => (
                        <span
                          key={cls}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-mono"
                        >
                          {cls}
                          <button
                            onClick={() => toggleClass(cls)}
                            className="hover:bg-indigo-200 rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No classes selected</p>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Output:</p>
                  <code className="block p-3 bg-gray-800 text-green-400 rounded-lg text-sm font-mono overflow-x-auto">
                    className="{selectedClasses.join(" ")}"
                  </code>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search classes... (e.g., 'flex', 'bg-blue', 'rounded')"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === category
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Classes Grid */}
              <div className="p-6 overflow-hidden">
                <div className="mb-4 text-sm text-gray-600">
                  {filteredClasses.length} classes found
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredClasses.map((cls) => {
                    const isSelected = selectedClasses.includes(cls.name);
                    return (
                      <button
                        key={cls.name}
                        onClick={() => toggleClass(cls.name)}
                        className={`text-left p-3 rounded-lg border transition-all hover:shadow-sm ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <code className="text-xs font-mono font-medium text-gray-900 truncate">
                                {cls.name}
                              </code>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                              {cls.description}
                            </p>
                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                              {cls.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {filteredClasses.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No classes found</p>
                  </div>
                )}
              </div>
              {/* Clases Tailwind */}
              {/*<div className="space-y-3">
              <h4 className="font-semibold text-gray-700 text-sm">
                Tailwind Classes
              </h4>
              <Textarea
                value={selectedClasses}
                onChange={(e) => onUpdateClasses(e.target.value)}
                placeholder="p-4 rounded-xl bg-white shadow-lg"
                className="font-mono text-xs min-h-[80px] resize-none"
              />
              <div className="space-y-2">
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
              </div>
            </div>*/}

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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
