/**
 * Normalize user-facing text for forgiving search.
 *
 * Search remains case-insensitive and treats accented and unaccented spellings
 * as equivalent, so queries such as `Grunwald` match `Grünwald`.
 */
export const normalizeSearchText = (
  value: string | number | null | undefined
): string =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
