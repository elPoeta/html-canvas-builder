/* eslint-disable @typescript-eslint/no-explicit-any */

import { DynamicHandlerMap } from "@/lib/types/htmlBuilder.types";
import DOMPurify, { Config } from "dompurify";
import { useEffect, useMemo, useRef, useCallback } from "react";

export const DEFAULT_OPTIONS: Config = {
  ALLOWED_TAGS: [
    "main",
    "div",
    "section",
    "article",
    "span",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "a",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "button",
    "br",
    "img",
    "blockquote",
    "code",
    "pre",
    "canvas",
    "svg",
    "g",
    "path",
    "rect",
    "circle",
    "ellipse",
    "line",
    "polyline",
    "polygon",
    "text",
    "tspan",
    "tref",
    "textPath",
    "defs",
    "clipPath",
    "mask",
    "pattern",
    "image",
    "switch",
    "foreignObject",
    "marker",
    "symbol",
    "use",
    "linearGradient",
    "radialGradient",
    "stop",
    "animate",
    "animateTransform",
    "animateMotion",
    "set",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  FORBID_TAGS: ["script", "html", "head", "meta", "body", "link", "style"],
  ALLOWED_ATTR: [
    "class",
    "id",
    "href",
    "src",
    "alt",
    "title",
    "target",
    "rel",
    "width",
    "height",
    "canvas",
    "viewBox",
    "xmlns",
    "xmlns:xlink",
    "x",
    "y",
    "x1",
    "y1",
    "x2",
    "y2",
    "cx",
    "cy",
    "r",
    "rx",
    "ry",
    "d",
    "points",
    "fill",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-dasharray",
    "stroke-dashoffset",
    "opacity",
    "fill-opacity",
    "stroke-opacity",
    "transform",
    "clip-path",
    "mask",
    "marker-start",
    "marker-mid",
    "marker-end",
    "text-anchor",
    "dominant-baseline",
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
    "dx",
    "dy",
    "rotate",
    "textLength",
    "lengthAdjust",
    "gradientUnits",
    "gradientTransform",
    "spreadMethod",
    "offset",
    "stop-color",
    "stop-opacity",
    "patternUnits",
    "patternTransform",
    "preserveAspectRatio",
    "markerUnits",
    "markerWidth",
    "markerHeight",
    "orient",
    "refX",
    "refY",
  ],
  ALLOW_DATA_ATTR: true,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  // Security enhancements
  FORCE_BODY: false,
  ADD_TAGS: [],
  ADD_ATTR: [],
  FORBID_ATTR: ["style"],
};

const DEFAULT_ALLOWED_EVENTS = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "focus",
  "blur",
  "submit",
  "focusin",
  "focusout",
] as const;

interface EventHandler {
  (event: Event, element: HTMLElement, context?: any): void;
}

interface EventHandlerMap {
  [eventType: string]: EventHandler;
}

interface UseSanitizedHTMLOptions extends Partial<Config> {
  allowStyles?: boolean;
  stylePrefix?: string;
  enableEvents?: boolean;
  eventHandlers?: EventHandlerMap;
  dynamicHandlers?: DynamicHandlerMap;
  eventContext?: any;
  allowedEvents?: string[];
}

interface UseSanitizedHTMLReturn {
  sanitizedHTML: string;
  isProcessing: boolean;
  error: Error | null;
  attachEvents: (container: HTMLElement) => void;
  cleanup: () => void;
}

function extractStyleContent(html: string): string[] {
  const styleRegex =
    /<style(?:\s[^>]*)?>([^<]*(?:(?!<\/?style(?:\s[^>]*)?>)<[^<]*)*)<\/style>/gi;
  const styles: string[] = [];
  let match;

  while ((match = styleRegex.exec(html)) !== null) {
    const cssContent = match[1]?.trim();
    if (cssContent) {
      styles.push(cssContent);
    }
  }

  return styles;
}

function processEventHandlers(html: string, allowedEvents: string[] = []) {
  const eventData: Array<{
    selector: string;
    eventType: string;
    handlerCode: string;
    elementId: string;
  }> = [];

  let processedHtml = html;
  let elementCounter = 0;

  allowedEvents.forEach((eventType) => {
    const eventAttr = `on${eventType}`;
    const attrPattern = new RegExp(`\\s${eventAttr}\\s*=\\s*`, "gi");

    let match;
    let searchFrom = 0;

    while (
      (match = attrPattern.exec(processedHtml.slice(searchFrom))) !== null
    ) {
      const startPos = searchFrom + match.index + match[0].length;
      const quoteChar = processedHtml[startPos]; // Either ' or "

      if (quoteChar !== '"' && quoteChar !== "'") {
        searchFrom = startPos + 1;
        continue;
      }

      let endPos = startPos + 1;
      let escaped = false;

      while (endPos < processedHtml.length) {
        const char = processedHtml[endPos];

        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === quoteChar) {
          break;
        }

        endPos++;
      }

      if (endPos >= processedHtml.length) {
        searchFrom = startPos + 1;
        continue;
      }

      const elementId = `sanitized-event-${elementCounter++}`;
      const handlerCode = processedHtml
        .slice(startPos + 1, endPos)
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .trim();

      eventData.push({
        selector: `[data-event-id="${elementId}"]`,
        eventType,
        handlerCode,
        elementId,
      });

      const replacement = ` data-event-id="${elementId}" data-event-type="${eventType}"`;

      processedHtml =
        processedHtml.slice(0, searchFrom + match.index) +
        replacement +
        processedHtml.slice(endPos + 1);

      searchFrom = searchFrom + match.index + replacement.length;

      attrPattern.lastIndex = 0;
    }
  });

  return { processedHtml, eventData };
}

function validateFunctionParams(params: string[]): string[] {
  const validParams: string[] = [];
  const invalidParams: string[] = [];

  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

  params.forEach((param, index) => {
    if (
      typeof param === "string" &&
      identifierRegex.test(param) &&
      !validParams.includes(param)
    ) {
      validParams.push(param);
    } else {
      invalidParams.push(param);
      console.warn(
        `⚠️ Invalid or duplicate parameter skipped: "${param}" at index ${index}`,
      );
    }
  });

  if (invalidParams.length > 0) {
    console.warn("🚫 Skipped invalid parameters:", invalidParams);
  }

  return validParams;
}

function executeSandboxed(
  code: string,
  context: Record<string, any> = {},
  event: Event,
  element: HTMLElement,
) {
  try {
    if (!code || typeof code !== "string") {
      throw new Error("Invalid or empty code provided");
    }

    const baseParamNames = [
      "event",
      "element",
      "console",
      "Math",
      "Date",
      "JSON",
      "Array",
      "Object",
      "String",
      "Number",
      "Boolean",
    ] as const;

    const userContextKeys: string[] = [];
    if (context && typeof context === "object" && !Array.isArray(context)) {
      for (const [key] of Object.entries(context)) {
        if (typeof key === "string" && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
          userContextKeys.push(key);
        }
      }
    }

    const allParamNames = [...baseParamNames, ...userContextKeys];
    const validatedParams = validateFunctionParams(allParamNames);

    const paramValueMap: Record<string, any> = {
      event,
      element,
      console: {
        log: console.log,
        warn: console.warn,
        error: console.error,
      },
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      ...context,
    };

    const validatedValues = validatedParams.map(
      (param) => paramValueMap[param],
    );

    const wrappedCode = `
      "use strict";
      try {
        ${code}
      } catch (executionError) {
        console.error("Handler execution error:", executionError);
        throw executionError;
      }
    `;

    const sandboxedFunction = new Function(...validatedParams, wrappedCode);
    return sandboxedFunction(...validatedValues);
  } catch (error: any) {
    console.error("Sandbox execution failed:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: code,
    });
    throw error;
  }
}

function sanitizeCSS(css: string, prefix = ""): string {
  let sanitized = css
    .replace(/javascript:/gi, "")
    .replace(/expression\s*\(/gi, "")
    .replace(/@import\s+/gi, "")
    .replace(/behavior\s*:/gi, "")
    .replace(/binding\s*:/gi, "")
    .replace(/url\s*\(\s*["']?\s*javascript:/gi, "");

  if (prefix) {
    sanitized = sanitized.replace(
      /([^{}]*){/g,
      (match, selector) => `${prefix} ${selector.trim()}{`,
    );
  }

  return sanitized;
}

export const useSanitizedHTML = (
  htmlString: string,
  options: UseSanitizedHTMLOptions = {},
): UseSanitizedHTMLReturn => {
  const {
    allowStyles = false,
    stylePrefix,
    enableEvents = false,
    eventHandlers = {},
    eventContext = {},
    dynamicHandlers = {},
    allowedEvents = [...DEFAULT_ALLOWED_EVENTS],
    ...dompurifyOptions
  } = options;

  const styleElementsRef = useRef<HTMLStyleElement[]>([]);
  const processedHtmlRef = useRef<string>("");
  const eventListenersRef = useRef<
    Array<{ element: HTMLElement; type: string; listener: EventListener }>
  >([]);

  const currentEventDataRef = useRef<
    Array<{
      selector: string;
      eventType: string;
      handlerCode: string;
      elementId: string;
    }>
  >([]);

  const config = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...dompurifyOptions,
      ...(allowStyles && {
        FORBID_TAGS: DEFAULT_OPTIONS.FORBID_TAGS?.filter(
          (tag) => tag !== "style",
        ),
      }),
    }),
    [dompurifyOptions, allowStyles],
  );

  const { sanitizedHTML, error } = useMemo(() => {
    try {
      if (!htmlString?.trim()) {
        return { sanitizedHTML: "", error: null };
      }

      let processedHtml = htmlString;
      let eventData: Array<{
        selector: string;
        eventType: string;
        handlerCode: string;
        elementId: string;
      }> = [];

      if (enableEvents && allowedEvents.length > 0) {
        const result = processEventHandlers(htmlString, allowedEvents);
        processedHtml = result.processedHtml;
        eventData = result.eventData;
        currentEventDataRef.current = eventData;
      }

      const sanitized = DOMPurify.sanitize(processedHtml, config);

      return {
        sanitizedHTML: sanitized,
        error: null,
      };
    } catch (err) {
      console.error("Error sanitizing HTML:", err);
      return {
        sanitizedHTML: "",
        error:
          err instanceof Error ? err : new Error("Unknown sanitization error"),
      };
    }
  }, [htmlString, config, enableEvents, allowedEvents]);

  const cleanupStyles = useCallback(() => {
    styleElementsRef.current.forEach((el) => {
      try {
        el.remove();
      } catch (err) {
        console.warn("Error removing style element:", err);
      }
    });
    styleElementsRef.current = [];
  }, []);

  const cleanupEvents = useCallback(() => {
    eventListenersRef.current.forEach(({ element, type, listener }) => {
      try {
        element.removeEventListener(type, listener);
      } catch (err) {
        console.warn("Error removing event listener:", err);
      }
    });
    eventListenersRef.current = [];
  }, []);

  const cleanup = useCallback(() => {
    cleanupStyles();
    cleanupEvents();
  }, [cleanupStyles, cleanupEvents]);

  const attachEvents = useCallback(
    (container: HTMLElement) => {
      if (!enableEvents) return;

      cleanupEvents();

      // Process inline event handlers (from currentEventDataRef)
      if (currentEventDataRef.current.length > 0) {
        currentEventDataRef.current.forEach(
          ({ selector, eventType, handlerCode }) => {
            const element = container.querySelector(selector) as HTMLElement;

            if (!element) return;

            const listener = (event: Event) => {
              try {
                const customHandler = eventHandlers[eventType];
                if (customHandler) {
                  customHandler(event, element, eventContext);
                } else if (handlerCode) {
                  executeSandboxed(handlerCode, eventContext, event, element);
                }
              } catch (error) {
                console.error(`Error executing ${eventType} handler:`, error);
              }
            };

            element.addEventListener(eventType, listener);
            eventListenersRef.current.push({
              element,
              type: eventType,
              listener,
            });
          },
        );
      }

      // Process dynamic handlers
      if (dynamicHandlers && Object.keys(dynamicHandlers).length > 0) {
        Object.entries(dynamicHandlers).forEach(([elementId, handlers]) => {
          const element = container.querySelector(
            `[id="${elementId}"]`,
          ) as HTMLElement;
          if (!element) {
            console.warn(
              `Element with id "${elementId}" not found for dynamic handler`,
            );
            return;
          }

          Object.entries(handlers).forEach(([eventType, handlerCode]) => {
            if (!allowedEvents.includes(eventType)) {
              console.warn(
                `Event type "${eventType}" not allowed for element "${elementId}"`,
              );
              return;
            }

            const listener = (event: Event) => {
              try {
                executeSandboxed(handlerCode, eventContext, event, element);
              } catch (error) {
                console.error(
                  `Error executing dynamic ${eventType} handler for #${elementId}:`,
                  error,
                );
              }
            };

            element.addEventListener(eventType, listener);
            eventListenersRef.current.push({
              element,
              type: eventType,
              listener,
            });
          });
        });
      }
    },
    [
      enableEvents,
      eventHandlers,
      dynamicHandlers,
      eventContext,
      cleanupEvents,
      allowedEvents,
    ],
  );

  useEffect(() => {
    if (
      !allowStyles ||
      !htmlString ||
      processedHtmlRef.current === htmlString
    ) {
      return;
    }

    cleanupStyles();

    try {
      const styles = extractStyleContent(htmlString);

      if (styles.length > 0) {
        styles.forEach((cssText) => {
          const sanitizedCSS = sanitizeCSS(cssText, stylePrefix);

          if (sanitizedCSS.trim()) {
            const styleEl = document.createElement("style");
            styleEl.textContent = sanitizedCSS;
            styleEl.setAttribute("data-sanitized-html", "true");

            document.head.appendChild(styleEl);
            styleElementsRef.current.push(styleEl);
          }
        });
      }
    } catch (err) {
      console.error("Error processing styles:", err);
    }

    processedHtmlRef.current = htmlString;

    return cleanupStyles;
  }, [htmlString, allowStyles, stylePrefix, cleanupStyles]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    sanitizedHTML: sanitizedHTML as string,
    isProcessing: false,
    error,
    attachEvents,
    cleanup,
  };
};
