import {
  TailwindCatalog,
  TailwindCategory,
  TailwindClass,
} from "../types/htmlBuilder.types";

const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const colorNames = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

function generateColorMap(names: string[], shades: number[]) {
  const colorMap: Record<string, number[]> = {};
  names.forEach((name) => {
    colorMap[name] = [...shades];
  });
  return colorMap;
}
const colors = generateColorMap(colorNames, colorShades);
//   {
//   slate: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   zinc: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   neutral: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   stone: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   red: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   orange: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   amber: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   yellow: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   lime: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   green: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   emerald: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   teal: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   cyan: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   sky: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   blue: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   indigo: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   violet: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   purple: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   fuchsia: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   pink: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
//   rose: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
// };

const colorPrefixes = [
  "text",
  "bg",
  "border",
  "ring",
  "outline",
  "divide",
  "placeholder",
];

const spacingScale = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24,
  28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
];
const sizingScale = [
  "auto",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
  "full",
  "screen",
  "min",
  "max",
  "fit",
];

const fontSizes = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];
const fontWeights = [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
];

const positions = ["static", "fixed", "absolute", "relative", "sticky"];
const displays = [
  "block",
  "inline-block",
  "inline",
  "flex",
  "inline-flex",
  "table",
  "inline-table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row-group",
  "table-row",
  "flow-root",
  "grid",
  "inline-grid",
  "contents",
  "list-item",
  "hidden",
];

const HOVER_PREFIXES = [
  "bg",
  "text",
  "border",
  "shadow",
  "scale",
  "opacity",
] as const;
const HOVER_SHADOWS = ["sm", "md", "lg", "xl", "2xl"] as const;
const HOVER_SCALES = [90, 95, 100, 105, 110, 125] as const;
const HOVER_OPACITIES = [0, 20, 40, 60, 80, 100] as const;
const hoverShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const hoverColors = [
  "gray",
  "blue",
  "indigo",
  "green",
  "red",
  "yellow",
  "purple",
] as const;

const cursors = [
  "auto",
  "default",
  "pointer",
  "wait",
  "text",
  "move",
  "help",
  "not-allowed",
] as const;

const userSelects = ["none", "text", "all", "auto"] as const;

function createEntry(
  name: string,
  category: TailwindCategory,
  description: string,
): TailwindClass {
  return { name, category, description };
}

export const TAILWIND_CLASSES = {
  colors: [] as TailwindClass[],
  layout: [] as TailwindClass[],
  flexbox: [] as TailwindClass[],
  grid: [] as TailwindClass[],
  spacing: [] as TailwindClass[],
  sizing: [] as TailwindClass[],
  typography: [] as TailwindClass[],
  borders: [] as TailwindClass[],
  effects: [] as TailwindClass[],
  transitions: [] as TailwindClass[],
  interactivity: [] as TailwindClass[],
  hover: [] as TailwindClass[],
  positioning: [] as TailwindClass[],
  overflow: [] as TailwindClass[],
  transforms: [] as TailwindClass[],
} as TailwindCatalog;

// --- COLORS ---
colorPrefixes.forEach((prefix) => {
  Object.entries(colors).forEach(([colorName, shades]) => {
    shades.forEach((shade) => {
      let name = `${prefix}-${colorName}-${shade}`;
      // Special cases
      if (prefix === "divide") name = `divide-${colorName}-${shade}`;
      if (prefix === "placeholder") name = `placeholder-${colorName}-${shade}`;

      TAILWIND_CLASSES.colors.push(
        createEntry(
          name,
          "colors",
          `${prefix.replace(/([A-Z])/g, " $1").trim()} color: ${colorName} ${shade}`,
        ),
      );
    });
  });
});

// --- LAYOUT ---
TAILWIND_CLASSES.layout.push(
  createEntry(
    "container",
    "layout",
    "Centered container with responsive max-width",
  ),
  createEntry(
    "sr-only",
    "layout",
    "Hide element visually but keep it accessible to screen readers",
  ),
);

// --- DISPLAYS (layout/flexbox/grid) ---
displays.forEach((display) => {
  const name = display.replace("inline-", "inline:");
  TAILWIND_CLASSES.layout.push(
    createEntry(name, "layout", `Display: ${display}`),
  );

  if (display.includes("flex")) {
    TAILWIND_CLASSES.flexbox.push(
      createEntry(display, "flexbox", `Display: ${display}`),
    );
  }
  if (display.includes("grid")) {
    TAILWIND_CLASSES.grid.push(
      createEntry(display, "grid", `Display: ${display}`),
    );
  }
});

// --- FLEXBOX ---
const flexDirections = ["row", "row-reverse", "col", "col-reverse"];
const justifyContent = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
];
const alignItems = ["start", "end", "center", "baseline", "stretch"];
const flexWraps = ["wrap", "wrap-reverse", "nowrap"];
const flexGrows = [0, 1];
const flexShrinks = [0, 1];

flexDirections.forEach((dir) =>
  TAILWIND_CLASSES.flexbox.push(
    createEntry(`flex-${dir}`, "flexbox", `Flex direction: ${dir}`),
  ),
);
justifyContent.forEach((j) =>
  TAILWIND_CLASSES.flexbox.push(
    createEntry(`justify-${j}`, "flexbox", `Justify content: ${j}`),
  ),
);
alignItems.forEach((a) =>
  TAILWIND_CLASSES.flexbox.push(
    createEntry(`items-${a}`, "flexbox", `Align items: ${a}`),
  ),
);
flexWraps.forEach((w) =>
  TAILWIND_CLASSES.flexbox.push(
    createEntry(`flex-${w}`, "flexbox", `Flex wrap: ${w}`),
  ),
);
flexGrows.forEach((g) =>
  TAILWIND_CLASSES.flexbox.push(
    createEntry(`flex-grow-${g}`, "flexbox", `Flex grow: ${g}`),
  ),
);
flexShrinks.forEach((s) =>
  TAILWIND_CLASSES.flexbox.push(
    createEntry(`flex-shrink-${s}`, "flexbox", `Flex shrink: ${s}`),
  ),
);

// --- GRID ---
const gridCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "none"];
gridCols.forEach((col) =>
  TAILWIND_CLASSES.grid.push(
    createEntry(`grid-cols-${col}`, "grid", `Grid columns: ${col}`),
  ),
);

// --- SPACING (padding/margin) ---
[
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
].forEach((prop) => {
  spacingScale.forEach((val) => {
    const valStr = val.toString().replace(".", "\\.");
    TAILWIND_CLASSES.spacing.push(
      createEntry(
        `${prop}-${valStr}`,
        "spacing",
        `${prop.toUpperCase()}: ${val}rem`,
      ),
    );
  });
});

// --- SIZING ---
["w", "h", "min-w", "min-h", "max-w", "max-h"].forEach((prop) => {
  sizingScale.forEach((val) => {
    const valStr = val.toString().replace(".", "\\.");
    TAILWIND_CLASSES.sizing.push(
      createEntry(`${prop}-${valStr}`, "sizing", `${prop}: ${val}`),
    );
  });
});

// --- TYPOGRAPHY ---
fontSizes.forEach((size) =>
  TAILWIND_CLASSES.typography.push(
    createEntry(`text-${size}`, "typography", `Font size: ${size}`),
  ),
);
fontWeights.forEach((weight) =>
  TAILWIND_CLASSES.typography.push(
    createEntry(`font-${weight}`, "typography", `Font weight: ${weight}`),
  ),
);
TAILWIND_CLASSES.typography.push(
  createEntry("italic", "typography", "Italic text"),
  createEntry("not-italic", "typography", "Remove italic"),
  createEntry("uppercase", "typography", "Uppercase text"),
  createEntry("lowercase", "typography", "Lowercase text"),
  createEntry("capitalize", "typography", "Capitalize text"),
  createEntry("normal-case", "typography", "Normal case"),
  createEntry("underline", "typography", "Underline text"),
  createEntry("line-through", "typography", "Line-through text"),
  createEntry("no-underline", "typography", "Remove underline"),
);

// --- BORDERS ---
[
  "rounded",
  "rounded-t",
  "rounded-r",
  "rounded-b",
  "rounded-l",
  "rounded-tl",
  "rounded-tr",
  "rounded-br",
  "rounded-bl",
].forEach((prop) => {
  ["none", "sm", "", "md", "lg", "xl", "2xl", "3xl", "full"].forEach((size) => {
    const name = size ? `${prop}-${size}` : prop;
    TAILWIND_CLASSES.borders.push(
      createEntry(name, "borders", `Border radius: ${size || "default"}`),
    );
  });
});
TAILWIND_CLASSES.borders.push(createEntry("border", "borders", "Add border"));
["solid", "dashed", "dotted", "double", "hidden", "none"].forEach((style) => {
  TAILWIND_CLASSES.borders.push(
    createEntry(`border-${style}`, "borders", `Border style: ${style}`),
  );
});

// --- EFFECTS ---
TAILWIND_CLASSES.effects.push(
  createEntry("shadow-sm", "effects", "Small shadow"),
  createEntry("shadow", "effects", "Default shadow"),
  createEntry("shadow-md", "effects", "Medium shadow"),
  createEntry("shadow-lg", "effects", "Large shadow"),
  createEntry("shadow-xl", "effects", "Extra-large shadow"),
  createEntry("shadow-2xl", "effects", "2x extra-large shadow"),
  createEntry("shadow-inner", "effects", "Inset shadow"),
  createEntry("shadow-none", "effects", "No shadow"),
  createEntry("opacity-0", "effects", "Opacity: 0%"),
  createEntry("opacity-100", "effects", "Opacity: 100%"),
);
// Add more opacity steps if needed

// --- TRANSITIONS ---
[
  "transition",
  "transition-all",
  "transition-colors",
  "transition-opacity",
  "transition-shadow",
  "transition-transform",
].forEach((t) => {
  TAILWIND_CLASSES.transitions.push(
    createEntry(
      t,
      "transitions",
      `Transition: ${t.replace("transition-", "") || "all"}`,
    ),
  );
});
[
  "duration-75",
  "duration-100",
  "duration-150",
  "duration-200",
  "duration-300",
  "duration-500",
  "duration-700",
  "duration-1000",
].forEach((d) => {
  TAILWIND_CLASSES.transitions.push(
    createEntry(
      d,
      "transitions",
      `Transition duration: ${d.replace("duration-", "")}ms`,
    ),
  );
});

// --- POSITIONING ---
positions.forEach((pos) => {
  TAILWIND_CLASSES.positioning.push(
    createEntry(pos, "positioning", `Position: ${pos}`),
  );
});

// --- OVERFLOW ---
["auto", "hidden", "visible", "scroll", "clip"].forEach((ov) => {
  ["overflow", "overflow-x", "overflow-y"].forEach((prop) => {
    TAILWIND_CLASSES.overflow.push(
      createEntry(`${prop}-${ov}`, "overflow", `${prop}: ${ov}`),
    );
  });
});

// --- TRANSFORMS ---
[
  "scale-0",
  "scale-50",
  "scale-75",
  "scale-90",
  "scale-95",
  "scale-100",
  "scale-105",
  "scale-110",
  "scale-125",
  "scale-150",
].forEach((s) => {
  TAILWIND_CLASSES.transforms.push(
    createEntry(s, "transforms", `Scale: ${s.replace("scale-", "")}%`),
  );
});
[
  "rotate-0",
  "rotate-1",
  "rotate-2",
  "rotate-3",
  "rotate-6",
  "rotate-12",
  "rotate-45",
  "rotate-90",
  "rotate-180",
].forEach((r) => {
  TAILWIND_CLASSES.transforms.push(
    createEntry(r, "transforms", `Rotate: ${r.replace("rotate-", "")}deg`),
  );
});

cursors.forEach((cursor) => {
  TAILWIND_CLASSES.interactivity.push(
    createEntry(`cursor-${cursor}`, "interactivity", `Cursor: ${cursor}`),
  );
});

userSelects.forEach((select) => {
  TAILWIND_CLASSES.interactivity.push(
    createEntry(`select-${select}`, "interactivity", `User select: ${select}`),
  );
});

const pointerEvents = ["none", "auto"] as const;
pointerEvents.forEach((event) => {
  TAILWIND_CLASSES.interactivity.push(
    createEntry(
      `pointer-events-${event}`,
      "interactivity",
      `Pointer events: ${event}`,
    ),
  );
});

hoverColors.forEach((color) => {
  hoverShades.forEach((shade) => {
    TAILWIND_CLASSES.hover.push(
      createEntry(
        `hover:bg-${color}-${shade}`,
        "hover",
        `Hover background: ${color} ${shade}`,
      ),
    );

    TAILWIND_CLASSES.hover.push(
      createEntry(
        `hover:text-${color}-${shade}`,
        "hover",
        `Hover text: ${color} ${shade}`,
      ),
    );

    TAILWIND_CLASSES.hover.push(
      createEntry(
        `hover:border-${color}-${shade}`,
        "hover",
        `Hover border: ${color} ${shade}`,
      ),
    );
  });
});

HOVER_SHADOWS.forEach((shadow) => {
  TAILWIND_CLASSES.hover.push(
    createEntry(
      `hover:shadow${shadow === "md" ? "" : `-${shadow}`}`,
      "hover",
      `Hover shadow: ${shadow}`,
    ),
  );
});

HOVER_SCALES.forEach((scale) => {
  TAILWIND_CLASSES.hover.push(
    createEntry(`hover:scale-${scale}`, "hover", `Hover scale: ${scale / 100}`),
  );
});

HOVER_OPACITIES.forEach((opacity) => {
  TAILWIND_CLASSES.hover.push(
    createEntry(
      `hover:opacity-${opacity}`,
      "hover",
      `Hover opacity: ${opacity}%`,
    ),
  );
});

export const flattenClasses = (classesObj: TailwindCatalog) => {
  return Object.values(classesObj).flat();
};

export const fuzzySearch = (items: TailwindClass[], query: string) => {
  if (!query) return items;

  const lowerQuery = query.toLowerCase();

  return items
    .map((item) => {
      const nameMatch = item.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(lowerQuery);

      let score = 0;
      if (item.name.toLowerCase().startsWith(lowerQuery)) score += 10;
      if (nameMatch) score += 5;
      if (categoryMatch) score += 2;
      if (descriptionMatch) score += 1;

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
};
