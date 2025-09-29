import React, { useState, useRef, useEffect } from "react";
export interface ResizablePanelProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  side?: "left" | "right";
}

export const ResizablePanel = ({
  children,
  className = "",
  minWidth = 250,
  maxWidth = 600,
  defaultWidth = 300,
  onWidthChange,
  side = "left",
}: ResizablePanelProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX.current;
      const multiplier = side === "right" ? -1 : 1;
      const newWidth = Math.min(
        maxWidth,
        Math.max(minWidth, startWidth.current + deltaX * multiplier),
      );
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, minWidth, maxWidth, onWidthChange, side]);

  if (side === "right") {
    return (
      <div className={`relative flex ${className}`} style={{ width }}>
        <div
          className="w-1 bg-gray-200 hover:bg-indigo-400 cursor-ew-resize transition-colors flex-shrink-0"
          onMouseDown={handleMouseDown}
        />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    );
  }

  return (
    <div className={`relative flex ${className}`} style={{ width }}>
      <div className="flex-1 min-w-0">{children}</div>
      <div
        className="w-1 bg-gray-200 hover:bg-indigo-400 cursor-ew-resize transition-colors flex-shrink-0"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
