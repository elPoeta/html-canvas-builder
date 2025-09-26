import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface FullscreenOverlayProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenOverlay({
  children,
  isOpen,
  onClose,
}: FullscreenOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[250] bg-white backdrop-blur-sm">
      <div ref={overlayRef} className="relative h-full w-full">
        {children}
      </div>
    </div>,
    document.body,
  );
}
