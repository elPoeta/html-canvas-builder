/* eslint-disable @typescript-eslint/no-explicit-any */

const createToastContainer = () => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  return container;
};

export const showToast = (
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  duration: number = 4000,
) => {
  const container = createToastContainer();
  const toast = document.createElement("div");
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const typeConfig = {
    info: {
      bg: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
      icon: "💬",
      shadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
    },
    success: {
      bg: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      icon: "✅",
      shadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
    },
    warning: {
      bg: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      icon: "⚠️",
      shadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
    },
    error: {
      bg: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      icon: "❌",
      shadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
    },
  };

  const config = typeConfig[type];

  toast.id = toastId;
  toast.style.cssText = `
    background: ${config.bg};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: ${config.shadow};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
    cursor: pointer;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 100%;
    word-wrap: break-word;
  `;

  toast.innerHTML = `
    <span style="font-size: 16px; flex-shrink: 0;">${config.icon}</span>
    <span style="flex: 1;">${message}</span>
    <span style="
      font-size: 12px;
      opacity: 0.8;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      transition: background-color 0.2s;
      flex-shrink: 0;
    " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'"
       onmouseout="this.style.backgroundColor='transparent'">✕</span>
  `;

  toast.addEventListener("click", () => {
    removeToast(toast);
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  });

  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, duration);

  (toast as any).__timeoutId = timeoutId;

  return toast;
};

const removeToast = (toast: HTMLElement) => {
  if (!toast || !toast.parentNode) return;

  // Clear timeout if exists
  if ((toast as any).__timeoutId) {
    clearTimeout((toast as any).__timeoutId);
  }

  toast.style.transform = "translateX(100%)";
  toast.style.opacity = "0";

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }

    const container = document.getElementById("toast-container");
    if (container && container.children.length === 0) {
      container.remove();
    }
  }, 300);
};
