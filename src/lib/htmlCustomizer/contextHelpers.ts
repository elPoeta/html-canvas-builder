/* eslint-disable @typescript-eslint/no-explicit-any */

import { showToast } from "./toasterContext";

type UnknownFunction = (...args: unknown[]) => unknown;

export const DEFAULT_EVENT_CONTEXT = {
  utils: {
    log: (msg: string) => console.log("[Custom]", msg),
    notify: (msg: string) => alert(msg),
    showToast: (
      msg: string,
      type: "info" | "success" | "warning" | "error" = "info",
      duration: number = 4000,
    ) => {
      return showToast(msg, type, duration);
    },
    toast: {
      info: (msg: string, duration?: number) =>
        showToast(msg, "info", duration),
      success: (msg: string, duration?: number) =>
        showToast(msg, "success", duration),
      warning: (msg: string, duration?: number) =>
        showToast(msg, "warning", duration),
      error: (msg: string, duration?: number) =>
        showToast(msg, "error", duration),
    },
  },
  helpers: {
    formatDate: (date: Date = new Date()) => date.toLocaleDateString(),
    randomId: () => Math.random().toString(36).substring(2, 9),
    debounce: (func: UnknownFunction, wait: number) => {
      let timeout: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    },
  },
};
