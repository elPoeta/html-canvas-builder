import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Code,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Eye,
  Save,
  Download,
} from "lucide-react";

interface ToolbarProps {
  currentProject: string;
  onProjectChange: (name: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  previewMode: boolean;
  dashBox: boolean;
  onTogglePreview: () => void;
  onToggleDashBox: () => void;
  onSave: () => void;
  onExport: () => void;
}

export const Toolbar = ({
  currentProject,
  onProjectChange,
  undo,
  redo,
  canUndo,
  canRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  previewMode,
  dashBox,
  onTogglePreview,
  onToggleDashBox,
  onSave,
  onExport,
}: ToolbarProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Project Name */}
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="rounded-full gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"
          >
            <Code className="h-4 w-4" />
            <span className="font-semibold">HTML Builder Pro</span>
          </Badge>
          <Input
            value={currentProject}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-48 h-8 text-sm border-gray-200 focus:border-indigo-400"
            placeholder="Project name"
          />
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* History */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="h-8 px-3"
            >
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="h-8 px-3"
            >
              <Redo2 className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="h-8 px-2"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-3 text-sm font-medium text-gray-600 tabular-nums min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="h-8 px-2"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Box Mode */}
          <Button
            variant={dashBox ? "default" : "outline"}
            size="sm"
            onClick={onToggleDashBox}
            className="h-8 px-4"
          >
            <Eye className="h-4 w-4 mr-2" />
            {!dashBox ? "Show Boxes" : "Hide Boxes"}
          </Button>

          {/* Preview */}
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={onTogglePreview}
            className="h-8 px-4"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>

          {/* Save and Export */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="h-8 px-4"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={onExport}
              className="h-8 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
