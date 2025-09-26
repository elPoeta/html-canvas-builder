import { VNode } from "../types";

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function vnodeToHtml(v: VNode): string {
  const attrsStr = Object.entries(v.attrs || {})
    .filter(([k]) => !k.startsWith("data-"))
    .map(([k, val]) => `${k}="${val.replace(/"/g, "&quot;")}"`)
    .join(" ");
  const open = attrsStr ? `<${v.tag} ${attrsStr}>` : `<${v.tag}>`;
  if (v.children?.length) {
    return `${open}${v.children.map(vnodeToHtml).join("")}</${v.tag}>`;
  }
  if (v.text != null) return `${open}${escapeHtml(v.text)}</${v.tag}>`;
  return `${open}</${v.tag}>`;
}
