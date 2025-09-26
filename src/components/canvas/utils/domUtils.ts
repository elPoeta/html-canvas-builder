import { VNode } from "../types";

const uid = () => Math.random().toString(36).slice(2, 10);

export { uid };

export function domToVNode(
  node: Node,
  x: number = 0,
  y: number = 0,
): VNode | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || "").trim();
    if (!text) return null;
    return {
      id: uid(),
      tag: "span",
      attrs: {},
      children: [],
      text,
      x,
      y,
      width: 100,
      height: 20,
    };
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const attrs: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    attrs[a.name] = a.value;
  }
  const children: VNode[] = [];
  for (const child of Array.from(el.childNodes)) {
    const v = domToVNode(child, x, y);
    if (v) children.push(v);
  }
  return {
    id: uid(),
    tag: el.tagName.toLowerCase(),
    attrs,
    children,
    x,
    y,
    width: 200,
    height: 100,
  };
}

export function htmlToVNodeTree(html: string): VNode {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const wrapper = document.createElement("div");
  Array.from(doc.body.childNodes).forEach((n) =>
    wrapper.appendChild(n.cloneNode(true)),
  );
  const v = domToVNode(wrapper, 0, 0);
  if (!v) throw new Error("No se pudo parsear el HTML");
  v.tag = "div";
  v.attrs = { ...v.attrs, class: (v.attrs.class || "") + " relative" };
  v.width = 1200;
  v.height = 800;
  return v;
}
