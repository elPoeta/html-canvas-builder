import { VNode } from "../types/htmlBuilder.types";
import { escapeHtml, uid } from "./utils";

export const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
/**
 * Convierte un nodo del DOM en un VNode recursivamente.
 * Ignora nodos de tipo comentario o procesamiento.
 * Los nodos de texto vacíos se omiten.
 */
function domToVNode(node: Node): VNode | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || "").trim();
    if (!text) return null;
    return {
      id: uid(),
      tag: "span",
      attrs: {},
      children: [],
      text,
    };
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as Element;
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) {
    attrs[attr.name] = attr.value;
  }

  const children: VNode[] = [];
  for (const child of Array.from(el.childNodes)) {
    const vnode = domToVNode(child);
    if (vnode) children.push(vnode);
  }

  return {
    id: uid(),
    tag: el.tagName.toLowerCase(),
    attrs,
    children,
  };
}

/**
 * Convierte una cadena HTML en un árbol de VNode raíz.
 * Envuelve el contenido en un <div> con clases base para el canvas.
 */
export function htmlToVNodeTree(html: string): VNode {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Crear un contenedor temporal
  const wrapper = document.createElement("div");
  Array.from(doc.body.childNodes).forEach((n) => {
    wrapper.appendChild(n.cloneNode(true));
  });

  const v = domToVNode(wrapper);
  if (!v) {
    throw new Error("No se pudo parsear el HTML proporcionado");
  }

  // Asegurar que el nodo raíz sea un div con estilos base
  v.tag = "div";
  v.attrs = {
    ...v.attrs,
    class: `${v.attrs.class || ""} relative min-h-[800px]`.trim(),
  };

  return v;
}

// // Lista de tags que son "void" en HTML (no deben tener cierre)
// const VOID_TAGS = new Set([
//   "area",
//   "base",
//   "br",
//   "col",
//   "embed",
//   "hr",
//   "img",
//   "input",
//   "link",
//   "meta",
//   "param",
//   "source",
//   "track",
//   "wbr",
// ]);

// /**
//  * Convierte un VNode en una cadena HTML.
//  *
//  * @param v - Nodo virtual a serializar
//  * @param explicitClosing - Si es `true`, todos los elementos usan cierre explícito (`<img></img>`).
//  *                          Si es `false` (por defecto), respeta el estándar HTML (`<img />` para void elements).
//  */
// export function vnodeToHtml(v: VNode, explicitClosing = false): string {
//   const attrsStr = Object.entries(v.attrs || {})
//     .map(([key, value]) => `${key}="${value.replace(/"/g, "&quot;")}"`)
//     .join(" ");

//   const openTag = attrsStr ? `<${v.tag} ${attrsStr}>` : `<${v.tag}>`;
//   const closeTag = `</${v.tag}>`;

//   // Si tiene hijos, siempre usamos apertura + cierre
//   if (v.children?.length > 0) {
//     const innerHtml = v.children
//       .map((child) => vnodeToHtml(child, explicitClosing))
//       .join("");
//     return `${openTag}${innerHtml}${closeTag}`;
//   }

//   // Si tiene texto, también usamos apertura + cierre
//   if (v.text != null) {
//     return `${openTag}${escapeHtml(v.text)}${closeTag}`;
//   }

//   // Elemento sin hijos ni texto
//   if (explicitClosing) {
//     // Modo explícito: siempre usa cierre
//     return `${openTag}${closeTag}`;
//   } else {
//     // Modo estándar: usa autocierre para void elements
//     if (VOID_TAGS.has(v.tag)) {
//       return `<${v.tag}${attrsStr ? " " + attrsStr : ""} />`;
//     } else {
//       return `${openTag}${closeTag}`;
//     }
//   }
// }

export function vnodeToHtml(v: VNode, explicitClosing = false): string {
  const attrsStr = Object.entries(v.attrs || {})
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");

  const tagStart = `<${v.tag}${attrsStr ? ` ${attrsStr}` : ""}>`;
  const tagEnd = `</${v.tag}>`;

  // If node has children
  if (v.children?.length > 0) {
    const innerHtml = v.children
      .map((child) => vnodeToHtml(child, explicitClosing))
      .join("");
    return `${tagStart}${innerHtml}${tagEnd}`;
  }

  // If node has text
  if (v.text != null) {
    return `${tagStart}${escapeHtml(v.text)}${tagEnd}`;
  }

  // If explicit closing is required
  if (explicitClosing) {
    return `${tagStart}${tagEnd}`;
  }

  // Handle void elements correctly
  if (VOID_TAGS.has(v.tag)) {
    return `<${v.tag}${attrsStr ? ` ${attrsStr}` : ""} />`;
  }

  // Fallback (non-void, no content)
  return `${tagStart}${tagEnd}`;
}
