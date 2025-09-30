import {
  Type,
  SquarePlus,
  Square,
  Layers,
  Grip,
  Grid3X3,
  Image,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Video,
  FileText,
  Mail,
  Phone,
  Calendar,
  Star,
  CheckSquare,
  Circle,
  Volume2,
  Columns,
  Layout,
  Box,
  Tag,
  Hash,
  Bold,
  Italic,
  Underline,
  MoreHorizontal,
  ChevronDown,
  Search,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  SeparatorHorizontal,
} from "lucide-react";
import { uid } from "./utils";
import { Block } from "../types/htmlBuilder.types";

export const BLOCKS: Block[] = [
  // ===== TEXT =====
  {
    label: "Heading H1",
    category: "Text",
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
          text: "New heading",
        },
      ],
    }),
  },
  {
    label: "Heading H2",
    category: "Text",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "h2",
      attrs: { class: "text-3xl font-bold text-gray-800" },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Subheading" },
      ],
    }),
  },
  {
    label: "Heading H3",
    category: "Text",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "h3",
      attrs: { class: "text-2xl font-semibold text-gray-800" },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Header" },
      ],
    }),
  },
  {
    label: "Heading H4",
    category: "Text",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "h4",
      attrs: { class: "text-xl font-semibold text-gray-700" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Small subheading",
        },
      ],
    }),
  },
  {
    label: "Paragraph",
    category: "Text",
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
          text: "Example text you can edit...",
        },
      ],
    }),
  },
  {
    label: "Small Text",
    category: "Text",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "small",
      attrs: { class: "text-sm text-gray-500" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Small text",
        },
      ],
    }),
  },
  {
    label: "Bold Text",
    category: "Text",
    icon: <Bold className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "strong",
      attrs: { class: "font-bold text-gray-800" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Bold text",
        },
      ],
    }),
  },
  {
    label: "Italic Text",
    category: "Text",
    icon: <Italic className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "em",
      attrs: { class: "italic text-gray-700" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Italic text",
        },
      ],
    }),
  },
  {
    label: "Underlined Text",
    category: "Text",
    icon: <Underline className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "u",
      attrs: { class: "underline text-gray-700" },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Underlined text",
        },
      ],
    }),
  },
  {
    label: "Blockquote",
    category: "Text",
    icon: <Quote className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "blockquote",
      attrs: {
        class:
          "border-l-4 border-indigo-500 pl-4 italic text-gray-600 bg-gray-50 p-4 rounded-r-lg",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "This is an important quote...",
        },
      ],
    }),
  },
  {
    label: "Inline Code",
    category: "Text",
    icon: <Code className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "code",
      attrs: {
        class: "bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "code" },
      ],
    }),
  },
  {
    label: "Code Block",
    category: "Text",
    icon: <Code className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "pre",
      attrs: {
        class:
          "bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: `function example() {
  return 'Hello world';
}`,
        },
      ],
    }),
  },
  // ===== LISTS =====
  {
    label: "Unordered List",
    category: "Lists",
    icon: <List className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "ul",
      attrs: { class: "list-disc pl-6 space-y-2 text-gray-600" },
      children: [
        {
          id: uid(),
          tag: "li",
          attrs: {},
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "First item",
            },
          ],
        },
        {
          id: uid(),
          tag: "li",
          attrs: {},
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Second item",
            },
          ],
        },
        {
          id: uid(),
          tag: "li",
          attrs: {},
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Third item",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Ordered List",
    category: "Lists",
    icon: <ListOrdered className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "ol",
      attrs: { class: "list-decimal pl-6 space-y-2 text-gray-600" },
      children: [
        {
          id: uid(),
          tag: "li",
          attrs: {},
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Step one",
            },
          ],
        },
        {
          id: uid(),
          tag: "li",
          attrs: {},
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Step two",
            },
          ],
        },
        {
          id: uid(),
          tag: "li",
          attrs: {},
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Step three",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Definition List",
    category: "Lists",
    icon: <List className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "dl",
      attrs: { class: "space-y-4" },
      children: [
        {
          id: uid(),
          tag: "dt",
          attrs: { class: "font-semibold text-gray-800" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Term",
            },
          ],
        },
        {
          id: uid(),
          tag: "dd",
          attrs: { class: "ml-4 text-gray-600" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Definition of the term",
            },
          ],
        },
      ],
    }),
  },
  // ===== BUTTONS =====
  {
    label: "Primary Button",
    category: "Buttons",
    icon: <SquarePlus className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-300",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Button" },
      ],
    }),
  },
  {
    label: "Secondary Button",
    category: "Buttons",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-all duration-200",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Secondary" },
      ],
    }),
  },
  {
    label: "Danger Button",
    category: "Buttons",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Delete" },
      ],
    }),
  },
  {
    label: "Success Button",
    category: "Buttons",
    icon: <CheckSquare className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors duration-200",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Save" },
      ],
    }),
  },
  {
    label: "Ghost Button",
    category: "Buttons",
    icon: <Circle className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 rounded-xl bg-transparent text-indigo-600 font-medium hover:bg-indigo-50 transition-colors duration-200",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Ghost" },
      ],
    }),
  },
  // ===== LAYOUT =====
  {
    label: "Card",
    category: "Layout",
    icon: <Layers className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: {
        class: "p-8 rounded-3xl bg-white shadow-xl border border-gray-100",
      },
      children: [],
    }),
  },
  {
    label: "Container",
    category: "Layout",
    icon: <Box className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "max-w-4xl mx-auto px-4 py-6" },
      children: [],
    }),
  },
  {
    label: "Section",
    category: "Layout",
    icon: <Layout className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "section",
      attrs: { class: "py-12" },
      children: [],
    }),
  },
  {
    label: "Article",
    category: "Layout",
    icon: <FileText className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "article",
      attrs: { class: "prose prose-gray max-w-none py-6" },
      children: [],
    }),
  },
  {
    label: "Header",
    category: "Layout",
    icon: <Layout className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "header",
      attrs: { class: "bg-white shadow-sm border-b py-6" },
      children: [],
    }),
  },
  {
    label: "Footer",
    category: "Layout",
    icon: <Layout className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "footer",
      attrs: { class: "bg-gray-50 py-8 mt-auto" },
      children: [],
    }),
  },
  {
    label: "Nav",
    category: "Layout",
    icon: <MoreHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "nav",
      attrs: { class: "flex space-x-6 p-6" },
      children: [],
    }),
  },
  {
    label: "Main",
    category: "Layout",
    icon: <Layout className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "main",
      attrs: { class: "flex-1 py-6" },
      children: [],
    }),
  },
  {
    label: "Aside",
    category: "Layout",
    icon: <Columns className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "aside",
      attrs: { class: "w-64 bg-gray-50 p-4" },
      children: [],
    }),
  },
  {
    label: "Flex Container",
    category: "Layout",
    icon: <Grip className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "flex gap-4 items-center p-6" },
      children: [],
    }),
  },
  {
    label: "Flex Column",
    category: "Layout",
    icon: <Grip className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "flex flex-col gap-4 p-6" },
      children: [],
    }),
  },
  {
    label: "2x2 Grid",
    category: "Layout",
    icon: <Grid3X3 className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "grid grid-cols-2 gap-4 p-6" },
      children: [],
    }),
  },
  {
    label: "3x3 Grid",
    category: "Layout",
    icon: <Grid3X3 className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "grid grid-cols-3 gap-4 p-6" },
      children: [],
    }),
  },
  {
    label: "4x4 Grid",
    category: "Layout",
    icon: <Grid3X3 className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "grid grid-cols-4 gap-4 p-6" },
      children: [],
    }),
  },
  {
    label: "Responsive Grid",
    category: "Layout",
    icon: <Grid3X3 className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: {
        class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6",
      },
      children: [],
    }),
  },
  {
    label: "Divider",
    category: "Layout",
    icon: <SeparatorHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "hr",
      attrs: { class: "border-gray-200 my-8" },
      children: [],
    }),
  },
  {
    label: "Spacer",
    category: "Layout",
    icon: <Box className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "h-16" },
      children: [],
    }),
  },
  // ===== FORMS =====
  {
    label: "Text Input",
    category: "Forms",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "text",
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        placeholder: "Enter text...",
      },
      children: [],
    }),
  },
  {
    label: "Email Input",
    category: "Forms",
    icon: <Mail className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "email",
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        placeholder: "example@email.com",
      },
      children: [],
    }),
  },
  {
    label: "Password Input",
    category: "Forms",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "password",
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        placeholder: "Password...",
      },
      children: [],
    }),
  },
  {
    label: "Number Input",
    category: "Forms",
    icon: <Hash className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "number",
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        placeholder: "0",
      },
      children: [],
    }),
  },
  {
    label: "Phone Input",
    category: "Forms",
    icon: <Phone className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "tel",
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        placeholder: "+1 (555) 123-4567",
      },
      children: [],
    }),
  },
  {
    label: "Date Input",
    category: "Forms",
    icon: <Calendar className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "date",
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
      },
      children: [],
    }),
  },
  {
    label: "Search Input",
    category: "Forms",
    icon: <Search className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "input",
      attrs: {
        type: "search",
        class:
          "w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        placeholder: "Search...",
      },
      children: [],
    }),
  },
  {
    label: "Textarea",
    category: "Forms",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "textarea",
      attrs: {
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y",
        rows: "4",
        placeholder: "Write your message...",
      },
      children: [],
    }),
  },
  {
    label: "Select",
    category: "Forms",
    icon: <ChevronDown className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "select",
      attrs: {
        class:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
      },
      children: [
        {
          id: uid(),
          tag: "option",
          attrs: { value: "" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Select an option",
            },
          ],
        },
        {
          id: uid(),
          tag: "option",
          attrs: { value: "1" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Option 1",
            },
          ],
        },
        {
          id: uid(),
          tag: "option",
          attrs: { value: "2" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Option 2",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Checkbox",
    category: "Forms",
    icon: <CheckSquare className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "label",
      attrs: { class: "flex items-center space-x-3 cursor-pointer" },
      children: [
        {
          id: uid(),
          tag: "input",
          attrs: {
            type: "checkbox",
            class:
              "w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500",
          },
          children: [],
        },
        {
          id: uid(),
          tag: "span",
          attrs: { class: "text-gray-700" },
          children: [],
          text: "I accept the terms",
        },
      ],
    }),
  },
  {
    label: "Radio Button",
    category: "Forms",
    icon: <Circle className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "label",
      attrs: { class: "flex items-center space-x-3 cursor-pointer" },
      children: [
        {
          id: uid(),
          tag: "input",
          attrs: {
            type: "radio",
            name: "radio-group",
            class:
              "w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500",
          },
          children: [],
        },
        {
          id: uid(),
          tag: "span",
          attrs: { class: "text-gray-700" },
          children: [],
          text: "Option",
        },
      ],
    }),
  },
  {
    label: "Fieldset",
    category: "Forms",
    icon: <Box className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "fieldset",
      attrs: { class: "border border-gray-300 rounded-lg p-4" },
      children: [
        {
          id: uid(),
          tag: "legend",
          attrs: { class: "px-2 font-medium text-gray-800" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Field group",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Label",
    category: "Forms",
    icon: <Tag className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "label",
      attrs: { class: "block text-sm font-medium text-gray-700 mb-2" },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Label" },
      ],
    }),
  },
  // ===== MEDIA =====
  {
    label: "Image",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "img",
      attrs: {
        class: "w-64 h-40 rounded-2xl object-cover bg-gray-200",
        src: "https://via.placeholder.com/300x200/6366f1/ffffff?text=Image",
        alt: "Example image",
      },
      children: [],
    }),
  },
  {
    label: "Responsive Image",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "img",
      attrs: {
        class: "w-full h-auto rounded-lg object-cover",
        src: "https://via.placeholder.com/800x600/6366f1/ffffff?text=Responsive+Image",
        alt: "Responsive image",
      },
      children: [],
    }),
  },
  {
    label: "Circular Image",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "img",
      attrs: {
        class:
          "w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg",
        src: "https://via.placeholder.com/150x150/6366f1/ffffff?text=Avatar",
        alt: "Avatar",
      },
      children: [],
    }),
  },
  {
    label: "Video",
    category: "Media",
    icon: <Video className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "video",
      attrs: {
        class: "w-full rounded-lg shadow-lg",
        controls: "true",
        poster: "https://via.placeholder.com/640x360/6366f1/ffffff?text=Video",
      },
      children: [
        {
          id: uid(),
          tag: "source",
          attrs: {
            src: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "video/mp4",
          },
          children: [],
        },
      ],
    }),
  },
  {
    label: "Audio",
    category: "Media",
    icon: <Volume2 className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "audio",
      attrs: {
        class: "w-full",
        controls: "true",
      },
      children: [
        {
          id: uid(),
          tag: "source",
          attrs: {
            src: "https://www.w3schools.com/html/horse.ogg",
            type: "audio/ogg",
          },
          children: [],
        },
      ],
    }),
  },
  {
    label: "Picture",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "picture",
      attrs: { class: "block" },
      children: [
        {
          id: uid(),
          tag: "source",
          attrs: {
            srcset:
              "https://via.placeholder.com/800x600/6366f1/ffffff?text=Desktop",
            media: "(min-width: 768px)",
          },
          children: [],
        },
        {
          id: uid(),
          tag: "img",
          attrs: {
            src: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Mobile",
            alt: "Adaptive image",
            class: "w-full h-auto rounded-lg",
          },
          children: [],
        },
      ],
    }),
  },
  {
    label: "Figure",
    category: "Media",
    icon: <Image className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "figure",
      attrs: { class: "text-center" },
      children: [
        {
          id: uid(),
          tag: "img",
          attrs: {
            src: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Figure",
            alt: "Figure description",
            class: "w-full h-auto rounded-lg mb-2",
          },
          children: [],
        },
        {
          id: uid(),
          tag: "figcaption",
          attrs: { class: "text-sm text-gray-600 italic" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Image description",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "SVG Icon",
    category: "Media",
    icon: <Star className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "svg",
      attrs: {
        class: "w-8 h-8",
        fill: "currentColor",
        viewBox: "0 0 24 24",
      },
      children: [
        {
          id: uid(),
          tag: "path",
          attrs: {
            d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
          },
          children: [],
        },
      ],
    }),
  },
  // ===== INTERACTIVE =====
  {
    label: "Link",
    category: "Interactive",
    icon: <Link className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "a",
      attrs: {
        class: "text-indigo-600 hover:text-indigo-800 underline font-medium",
        href: "#",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Link" },
      ],
    }),
  },
  {
    label: "Link Button",
    category: "Interactive",
    icon: <Link className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "a",
      attrs: {
        class:
          "inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200 no-underline",
        href: "#",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Link Button",
        },
      ],
    }),
  },
  {
    label: "External Link",
    category: "Interactive",
    icon: <Globe className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "a",
      attrs: {
        class:
          "text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-1",
        href: "https://example.com",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "External link",
        },
      ],
    }),
  },
  {
    label: "Accordion",
    category: "Interactive",
    icon: <ChevronDown className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "details",
      attrs: { class: "border border-gray-200 rounded-lg p-4" },
      children: [
        {
          id: uid(),
          tag: "summary",
          attrs: {
            class:
              "font-medium text-gray-800 cursor-pointer hover:text-indigo-600",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Click to expand",
            },
          ],
        },
        {
          id: uid(),
          tag: "div",
          attrs: { class: "mt-4 text-gray-600" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Hidden content shown when expanded.",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Modal Trigger",
    category: "Interactive",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
        "data-modal-target": "modal-example",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Open Modal",
        },
      ],
    }),
  },
  {
    label: "Tab Button",
    category: "Interactive",
    icon: <MoreHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "button",
      attrs: {
        class:
          "px-4 py-2 border-b-2 border-transparent hover:border-indigo-500 text-gray-600 hover:text-indigo-600 transition-colors",
        role: "tab",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Tab" },
      ],
    }),
  },
  {
    label: "Dropdown Button",
    category: "Interactive",
    icon: <ChevronDown className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "relative inline-block" },
      children: [
        {
          id: uid(),
          tag: "button",
          attrs: {
            class:
              "flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Dropdown",
            },
          ],
        },
      ],
    }),
  },
  // ===== TABLES =====
  {
    label: "Basic Table",
    category: "Tables",
    icon: <Grid3X3 className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "table",
      attrs: {
        class:
          "w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden",
      },
      children: [
        {
          id: uid(),
          tag: "thead",
          attrs: { class: "bg-gray-50" },
          children: [
            {
              id: uid(),
              tag: "tr",
              attrs: {},
              children: [
                {
                  id: uid(),
                  tag: "th",
                  attrs: {
                    class:
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  },
                  children: [
                    {
                      id: uid(),
                      tag: "span",
                      attrs: {},
                      children: [],
                      text: "Name",
                    },
                  ],
                },
                {
                  id: uid(),
                  tag: "th",
                  attrs: {
                    class:
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  },
                  children: [
                    {
                      id: uid(),
                      tag: "span",
                      attrs: {},
                      children: [],
                      text: "Email",
                    },
                  ],
                },
                {
                  id: uid(),
                  tag: "th",
                  attrs: {
                    class:
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  },
                  children: [
                    {
                      id: uid(),
                      tag: "span",
                      attrs: {},
                      children: [],
                      text: "Status",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: uid(),
          tag: "tbody",
          attrs: { class: "bg-white divide-y divide-gray-200" },
          children: [
            {
              id: uid(),
              tag: "tr",
              attrs: { class: "hover:bg-gray-50" },
              children: [
                {
                  id: uid(),
                  tag: "td",
                  attrs: {
                    class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                  },
                  children: [
                    {
                      id: uid(),
                      tag: "span",
                      attrs: {},
                      children: [],
                      text: "John Doe",
                    },
                  ],
                },
                {
                  id: uid(),
                  tag: "td",
                  attrs: {
                    class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                  },
                  children: [
                    {
                      id: uid(),
                      tag: "span",
                      attrs: {},
                      children: [],
                      text: "john@example.com",
                    },
                  ],
                },
                {
                  id: uid(),
                  tag: "td",
                  attrs: {
                    class: "px-6 py-4 whitespace-nowrap text-sm text-green-600",
                  },
                  children: [
                    {
                      id: uid(),
                      tag: "span",
                      attrs: {},
                      children: [],
                      text: "Active",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Table Row",
    category: "Tables",
    icon: <MoreHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "tr",
      attrs: { class: "hover:bg-gray-50" },
      children: [
        {
          id: uid(),
          tag: "td",
          attrs: { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Cell 1",
            },
          ],
        },
        {
          id: uid(),
          tag: "td",
          attrs: { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Cell 2",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Table Header",
    category: "Tables",
    icon: <Type className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "th",
      attrs: {
        class:
          "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Header" },
      ],
    }),
  },
  {
    label: "Table Cell",
    category: "Tables",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "td",
      attrs: { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" },
      children: [
        { id: uid(), tag: "span", attrs: {}, children: [], text: "Cell" },
      ],
    }),
  },
  // ===== NAVIGATION =====
  {
    label: "Breadcrumbs",
    category: "Navigation",
    icon: <ChevronDown className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "nav",
      attrs: { class: "flex items-center space-x-2 text-sm text-gray-500" },
      children: [
        {
          id: uid(),
          tag: "a",
          attrs: { href: "#", class: "hover:text-gray-700" },
          children: [
            { id: uid(), tag: "span", attrs: {}, children: [], text: "Home" },
          ],
        },
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "/",
        },
        {
          id: uid(),
          tag: "a",
          attrs: { href: "#", class: "hover:text-gray-700" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Products",
            },
          ],
        },
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "/",
        },
        {
          id: uid(),
          tag: "span",
          attrs: { class: "text-gray-700 font-medium" },
          children: [],
          text: "Current",
        },
      ],
    }),
  },
  {
    label: "Pagination",
    category: "Navigation",
    icon: <MoreHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "nav",
      attrs: { class: "flex items-center justify-center space-x-2" },
      children: [
        {
          id: uid(),
          tag: "button",
          attrs: {
            class:
              "px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Previous",
            },
          ],
        },
        {
          id: uid(),
          tag: "button",
          attrs: {
            class: "px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg",
          },
          children: [
            { id: uid(), tag: "span", attrs: {}, children: [], text: "1" },
          ],
        },
        {
          id: uid(),
          tag: "button",
          attrs: {
            class: "px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg",
          },
          children: [
            { id: uid(), tag: "span", attrs: {}, children: [], text: "2" },
          ],
        },
        {
          id: uid(),
          tag: "button",
          attrs: {
            class: "px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Next",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Menu Item",
    category: "Navigation",
    icon: <MoreHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "a",
      attrs: {
        href: "#",
        class:
          "block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors",
      },
      children: [
        {
          id: uid(),
          tag: "span",
          attrs: {},
          children: [],
          text: "Menu item",
        },
      ],
    }),
  },
  {
    label: "Sidebar Menu",
    category: "Navigation",
    icon: <Columns className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "nav",
      attrs: { class: "space-y-2" },
      children: [
        {
          id: uid(),
          tag: "a",
          attrs: {
            href: "#",
            class:
              "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Dashboard",
            },
          ],
        },
        {
          id: uid(),
          tag: "a",
          attrs: {
            href: "#",
            class:
              "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Users",
            },
          ],
        },
      ],
    }),
  },
  // ===== UTILITIES =====
  {
    label: "Badge",
    category: "Utilities",
    icon: <Tag className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "span",
      attrs: {
        class:
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800",
      },
      children: [],
      text: "Badge",
    }),
  },
  {
    label: "Success Alert",
    category: "Utilities",
    icon: <CheckSquare className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "p-4 bg-green-50 border border-green-200 rounded-lg" },
      children: [
        {
          id: uid(),
          tag: "div",
          attrs: { class: "flex items-center" },
          children: [
            {
              id: uid(),
              tag: "div",
              attrs: { class: "text-sm text-green-800" },
              children: [
                {
                  id: uid(),
                  tag: "span",
                  attrs: {},
                  children: [],
                  text: "Success! Operation completed successfully.",
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Error Alert",
    category: "Utilities",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "p-4 bg-red-50 border border-red-200 rounded-lg" },
      children: [
        {
          id: uid(),
          tag: "div",
          attrs: { class: "flex items-center" },
          children: [
            {
              id: uid(),
              tag: "div",
              attrs: { class: "text-sm text-red-800" },
              children: [
                {
                  id: uid(),
                  tag: "span",
                  attrs: {},
                  children: [],
                  text: "Error: Something went wrong. Please try again.",
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Warning Alert",
    category: "Utilities",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg" },
      children: [
        {
          id: uid(),
          tag: "div",
          attrs: { class: "flex items-center" },
          children: [
            {
              id: uid(),
              tag: "div",
              attrs: { class: "text-sm text-yellow-800" },
              children: [
                {
                  id: uid(),
                  tag: "span",
                  attrs: {},
                  children: [],
                  text: "Warning: Please review the information before proceeding.",
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Info Alert",
    category: "Utilities",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "p-4 bg-blue-50 border border-blue-200 rounded-lg" },
      children: [
        {
          id: uid(),
          tag: "div",
          attrs: { class: "flex items-center" },
          children: [
            {
              id: uid(),
              tag: "div",
              attrs: { class: "text-sm text-blue-800" },
              children: [
                {
                  id: uid(),
                  tag: "span",
                  attrs: {},
                  children: [],
                  text: "Info: Here is some useful information.",
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Progress Bar",
    category: "Utilities",
    icon: <MoreHorizontal className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "w-full bg-gray-200 rounded-full h-2.5" },
      children: [
        {
          id: uid(),
          tag: "div",
          attrs: {
            class: "bg-indigo-600 h-2.5 rounded-full",
            style: "width: 45%",
          },
          children: [],
        },
      ],
    }),
  },
  {
    label: "Loading Spinner",
    category: "Utilities",
    icon: <Circle className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "flex justify-center items-center" },
      children: [
        {
          id: uid(),
          tag: "div",
          attrs: {
            class:
              "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
          },
          children: [],
        },
      ],
    }),
  },
  {
    label: "Tooltip",
    category: "Utilities",
    icon: <Square className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "relative inline-block group" },
      children: [
        {
          id: uid(),
          tag: "button",
          attrs: {
            class: "px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Hover me",
            },
          ],
        },
        {
          id: uid(),
          tag: "div",
          attrs: {
            class:
              "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Tooltip text",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Card Header",
    category: "Utilities",
    icon: <Layers className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: {
        class: "px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg",
      },
      children: [
        {
          id: uid(),
          tag: "h3",
          attrs: { class: "text-lg font-medium text-gray-900" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Card title",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Card Body",
    category: "Utilities",
    icon: <Layers className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "px-6 py-4" },
      children: [
        {
          id: uid(),
          tag: "p",
          attrs: { class: "text-gray-600" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Card content...",
            },
          ],
        },
      ],
    }),
  },
  {
    label: "Card Footer",
    category: "Utilities",
    icon: <Layers className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: {
        class:
          "px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3",
      },
      children: [
        {
          id: uid(),
          tag: "button",
          attrs: { class: "px-4 py-2 text-gray-700 hover:text-gray-900" },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Cancel",
            },
          ],
        },
        {
          id: uid(),
          tag: "button",
          attrs: {
            class:
              "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
          },
          children: [
            {
              id: uid(),
              tag: "span",
              attrs: {},
              children: [],
              text: "Save",
            },
          ],
        },
      ],
    }),
  },
  // ===== META =====
  {
    label: "Meta Description",
    category: "Meta",
    icon: <FileText className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "meta",
      attrs: {
        name: "description",
        content: "Page description for SEO",
      },
      children: [],
    }),
  },
  {
    label: "Meta Keywords",
    category: "Meta",
    icon: <Hash className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "meta",
      attrs: {
        name: "keywords",
        content: "keyword1, keyword2, keyword3",
      },
      children: [],
    }),
  },
  {
    label: "Meta Viewport",
    category: "Meta",
    icon: <Smartphone className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "meta",
      attrs: {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      children: [],
    }),
  },
  {
    label: "CSS Link",
    category: "Meta",
    icon: <Link className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "link",
      attrs: {
        rel: "stylesheet",
        href: "styles.css",
      },
      children: [],
    }),
  },
  {
    label: "Script",
    category: "Meta",
    icon: <Code className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "script",
      attrs: {
        src: "script.js",
      },
      children: [],
    }),
  },
  // ===== RESPONSIVE =====
  {
    label: "Mobile Container",
    category: "Responsive",
    icon: <Smartphone className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "block md:hidden p-4" },
      children: [],
    }),
  },
  {
    label: "Desktop Container",
    category: "Responsive",
    icon: <Monitor className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "hidden md:block p-4" },
      children: [],
    }),
  },
  {
    label: "Tablet Container",
    category: "Responsive",
    icon: <Tablet className="h-4 w-4" />,
    make: () => ({
      id: uid(),
      tag: "div",
      attrs: { class: "hidden md:block lg:hidden p-4" },
      children: [],
    }),
  },
];
