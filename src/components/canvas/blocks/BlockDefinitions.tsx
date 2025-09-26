import React from "react";
import { Type, SquarePlus, Layers, Image } from "lucide-react";
import { VNode } from "../types";
import { uid } from "../utils/domUtils";

export type Block = {
  label: string;
  make: () => VNode;
  icon: React.ReactNode;
  category: string;
};

export const BLOCKS: Block[] = [
  {
    label: "Título H1",
    category: "Texto",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "h1",
      attrs: { class: "text-4xl font-bold text-gray-800" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Nuevo título",
          x: 0,
          y: 0,
        },
      ],
      x: 0,
      y: 0,
      width: 300,
      height: 60,
    }),
  },
  {
    label: "Párrafo",
    category: "Texto",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "p",
      attrs: { class: "text-gray-600 leading-relaxed" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Texto de ejemplo...",
          x: 0,
          y: 0,
        },
      ],
      x: 0,
      y: 0,
      width: 400,
      height: 80,
    }),
  },
  {
    label: "Botón Primario",
    category: "Botones",
    icon: <SquarePlus className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-300",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Botón",
          x: 0,
          y: 0,
        },
      ],
      x: 0,
      y: 0,
      width: 120,
      height: 50,
    }),
  },
  {
    label: "Tarjeta",
    category: "Layout",
    icon: <Layers className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: {
        class: "p-8 rounded-3xl bg-white shadow-xl border border-gray-100",
      },
      children: [],
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    }),
  },
  {
    label: "Imagen",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "img",
      attrs: {
        class: "rounded-2xl object-cover",
        src: "https://via.placeholder.com/300x200/6366f1/ffffff?text=Imagen",
        alt: "Imagen",
      },
      children: [],
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    }),
  },
];
