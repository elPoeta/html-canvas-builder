import {
  ColumnFormat,
  DeviceTypes,
} from "@/providers/webEditor/webEditor-provider";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function csvToJson(csv: string): any[] {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonArray: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCsvLine(line);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonObject: { [key: string]: any } = {};

    headers.forEach((header, index) => {
      jsonObject[header] = values[index];
    });

    jsonArray.push(jsonObject);
  }

  return jsonArray;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(currentField.trim());
      currentField = "";
      continue;
    }

    currentField += char;
  }

  result.push(currentField.trim());
  return result;
}

export const bytesToBase64 = (bytes: Uint8Array) => {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
};

export const getJsonEncoded = (jsonString: string) => {
  return bytesToBase64(new TextEncoder().encode(jsonString));
};

export const base64ToBytes = (base64: string): Uint8Array => {
  const binString = atob(base64);
  return new Uint8Array(Array.from(binString, (char) => char.charCodeAt(0)));
};

export const decodeJsonEncoded = (
  base64String: string,
): Record<string, unknown> | null => {
  try {
    const decodedBytes = base64ToBytes(base64String);
    const jsonString = new TextDecoder().decode(decodedBytes);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const range = ({
  start,
  stop,
  step,
}: {
  start: number;
  stop: number;
  step: number;
}) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const validEmail = (email: string) => {
  const regex =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return email.match(regex);
};

export const getFormatBySqlType = (format: string) =>
  ({
    date: "date",
    varchar: "text",
    text: "textarea",
    bigint: "number",
    int: "number",
    float: "number",
    boolean: "checkbox",
  })[format.toLowerCase()] as ColumnFormat;

export const getDependencyTemplate = ({
  groupId,
  artifactId,
  version,
}: {
  groupId: string;
  artifactId: string;
  version: string;
}) => {
  return `
     <dependency>
       <groupId>${groupId}</groupId>
       <artifactId>${artifactId}</artifactId>
       <version>${version}</version>
    </dependency>

   `;
};

export const getFormattedParamType = (paramType: string) => {
  if (paramType.trim().endsWith("[][]")) {
    return {
      type: paramType.replace("[][]", "").trim(),
      dimension: "2D Array",
    };
  } else if (paramType.trim().endsWith("[]")) {
    return {
      type: paramType.replace("[]", "").trim(),
      dimension: "Array",
    };
  }
  return { type: paramType, dimension: "Primitive" };
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export const encrypt = async (text: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.generateKey(
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  const encodedText = new TextEncoder().encode(text);
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    key,
    encodedText,
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);

  return {
    iv: arrayBufferToBase64(iv.buffer),
    encryptedData: arrayBufferToBase64(encryptedData),
    key: arrayBufferToBase64(exportedKey),
  };
};

export const getDeviceByMatchMedia = (): DeviceTypes => {
  if (window.matchMedia("(max-width: 420px)").matches) {
    return "Mobile";
  }
  if (window.matchMedia("(max-width: 850px)").matches) {
    return "Tablet";
  }
  return "Desktop";
};

export const isMobile = (): boolean => {
  return window.matchMedia("(max-width: 768px)").matches;
};

export const checkDeviceType = (): string => {
  return isMobile() ? "Mobile" : "Desktop";
};

export const isGmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split("@")[1];

  return domain === "gmail.com";
};

export const convertCssStringToReactStyle = (cssString: string) => {
  const styleObject: Record<string, string> = {};

  cssString.split(";").forEach((rule) => {
    if (rule.trim()) {
      const [property, value] = rule.split(":");
      const formattedProperty = property
        .trim()
        .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styleObject[formattedProperty] = value.trim();
    }
  });

  return styleObject as React.CSSProperties;
};

export const convertReactStyleToCssString = (
  reactStyle: React.CSSProperties,
): string => {
  let cssString = "";
  for (const [property, value] of Object.entries(reactStyle)) {
    if (value !== undefined) {
      const formattedProperty = property.replace(
        /([a-z])([A-Z])/g,
        (_, lower, upper) => `${lower}-${upper.toLowerCase()}`,
      );
      cssString += `${formattedProperty}: ${value};\n`;
    }
  }
  return cssString.trim();
};

export const extractCssRulesFromSelector = (
  cssString: string,
  selector: string,
) => {
  const regex = new RegExp(`^${selector}\\s*{([^}]+)}$`, "s");

  const match = cssString.trim().match(regex);

  if (match) {
    const rules = match[1].trim();
    return rules;
  }

  return null;
};

export const getInputType = (id: number) => {
  switch (id) {
    case 12:
    case 18:
      return "number";
    case 13:
      return "color";
    case 14:
      return "date";
    case 15:
      return "time";
    case 16:
      return "dateTime";
    case 17:
      return "password";
    default:
      return "text";
  }
};

export const calculateRows = ({
  arrayLength,
  numCols,
}: {
  arrayLength: number;
  numCols: number;
}): number => {
  return numCols > 0 ? Math.floor(arrayLength / numCols) : 1;
};

export const svgToDataUri = (svgContent: string): string => {
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSvg}`;
};

export const hslToHex = (hslColor: string): string => {
  if (!hslColor.trim()) return "#0ea5e9";
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) {
    return "#0ea5e9";
  }
  const h = parseInt(match[1]);
  let s = parseInt(match[2]);
  let l = parseInt(match[3]);

  s /= 100;
  l /= 100;
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = C;
    g = X;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = X;
    g = C;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = C;
    b = X;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = X;
    b = C;
  } else if (h >= 240 && h < 300) {
    r = X;
    g = 0;
    b = C;
  } else if (h >= 300 && h < 360) {
    r = C;
    g = 0;
    b = X;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
