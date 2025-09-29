import {
  TAILWIND_CLASSES,
  flattenClasses,
  fuzzySearch,
} from "@/lib/htmlBuilder/tailwind-utils";
import { Check, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
console.log(TAILWIND_CLASSES);
export const TailwindClassPicker = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Tailwind Class Picker</h1>
            <p className="text-indigo-100">
              Search and select Tailwind CSS classes with fuzzy search
            </p>
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
          <div className="p-6">
            <div className="mb-4 text-sm text-gray-600">
              {filteredClasses.length} classes found
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredClasses.map((cls) => {
                const isSelected = selectedClasses.includes(cls.name);
                return (
                  <button
                    key={cls.name}
                    onClick={() => toggleClass(cls.name)}
                    className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono text-sm font-semibold text-gray-900">
                            {cls.name}
                          </code>
                          {isSelected && (
                            <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {cls.description}
                        </p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {cls.category}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {filteredClasses.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No classes found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
