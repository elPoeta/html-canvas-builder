/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Genera un identificador único corto (no criptográfico).
 * Útil para IDs internos en el árbol de nodos.
 * @returns string - ID único de 8 caracteres alfanuméricos
 */
export const uid = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * Escapa caracteres especiales en una cadena para uso seguro en HTML.
 * @param str - Cadena a escapar
 * @returns string - Cadena con caracteres HTML escapados
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const escapeAttrValue = (value: string): string => {
  return String(value).replace(/"/g, "&quot;");
};

/**
 * Agrupa un array de objetos por una propiedad dada.
 * @example
 * groupBy([{ category: 'A' }, { category: 'B' }], 'category')
 * // => { A: [{...}], B: [{...}] }
 */
export const groupBy = <T, K extends keyof any>(
  array: T[],
  keyGetter: (item: T) => K,
): Record<K, T[]> => {
  return array.reduce(
    (acc, item) => {
      const key = keyGetter(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
};
