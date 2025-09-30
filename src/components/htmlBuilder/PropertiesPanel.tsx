import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Check, X, Copy, Trash2, Palette } from "lucide-react";
import { VNode } from "@/lib/types/htmlBuilder.types";
import {
  TAILWIND_CLASSES,
  flattenClasses,
  fuzzySearch,
  getClassCategory,
} from "@/lib/htmlBuilder/tailwind-utils";
import { cn } from "@/lib/utils";
import { useDebounce } from "../hooks/use-debounce";
import { Textarea } from "../ui/TextArea";

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
  const [activeCategory, setActiveCategory] = useState("all");
  const [manualClasses, setManualClasses] = useState("");
  const debouncedUpdate = useDebounce(onUpdateClasses, 400);

  const currentClasses = useMemo(() => {
    return (selectedNode?.attrs.class || "").split(/\s+/).filter(Boolean);
  }, [selectedNode?.attrs.class]);

  const allClasses = useMemo(() => flattenClasses(TAILWIND_CLASSES), []);
  const categories = useMemo(
    () => ["all", ...Object.keys(TAILWIND_CLASSES)],
    [],
  );

  // Sync with node when selection changes
  useEffect(() => {
    setManualClasses(currentClasses.join(" "));
  }, [currentClasses]);

  // useEffect(() => {
  //   return () => {
  //     debouncedUpdate.cancel();
  //   };
  // }, [debouncedUpdate]);

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

  const toggleClass = (newClass: string) => {
    const category = getClassCategory(newClass);

    const cleanedClasses = currentClasses.filter((cls) => {
      if (!category) return true;
      const clsCategory = getClassCategory(cls);

      return clsCategory !== category || cls === newClass;
    });

    const hasNewClass = currentClasses.includes(newClass);
    let finalClasses: string[];

    if (hasNewClass) {
      finalClasses = cleanedClasses.filter((c) => c !== newClass);
    } else {
      finalClasses = [...cleanedClasses, newClass];
    }

    const normalized = cn(finalClasses);
    onUpdateClasses(normalized);
  };

  const clearSelection = () => {
    onUpdateClasses("");
  };

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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Basic Info */}
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

          {/* Attributes */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm">Attributes</h4>
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
                    onChange={(e) => onUpdateAttribute("href", e.target.value)}
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
                      onChange={(e) => onUpdateAttribute("src", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Alt
                    </label>
                    <Input
                      value={selectedNode.attrs.alt || ""}
                      onChange={(e) => onUpdateAttribute("alt", e.target.value)}
                      placeholder="Image Description"
                      className="text-xs h-8"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Selected Classes Display */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">
                Selected Classes ({currentClasses.length})
              </h3>
              <button
                onClick={clearSelection}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="bg-white p-3 rounded-lg min-h-[50px]">
              {currentClasses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentClasses.map((cls) => (
                    <span
                      key={cls}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-mono"
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
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Manual:</p>
              <Textarea
                value={manualClasses}
                onChange={(e) => {
                  const value = e.target.value;
                  setManualClasses(value);
                  debouncedUpdate(value);
                }}
                placeholder="p-4 rounded-xl bg-white..."
                className="font-mono text-xs min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes... (e.g., 'flex', 'bg-blue')"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded ${
                    activeCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Class Grid */}
          <div>
            <div className="mb-3 text-sm text-gray-600">
              {filteredClasses.length} classes found
            </div>
            {filteredClasses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredClasses.map((cls) => {
                  const isSelected = currentClasses.includes(cls.name);
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                No classes found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(selectedNode.id)}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(selectedNode.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};
