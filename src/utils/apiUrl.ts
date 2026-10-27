const intakeBaseUrl = (import.meta.env.VITE_INTAKE_API_URL || '')
  .trim()
  .replace(/\/+$/, '');

/**
 * Resolve a public contribution endpoint.
 *
 * Local development can continue to use same-origin `/api` routes. The
 * GitHub Pages build supplies the separate Cloudflare Worker origin through
 * `VITE_INTAKE_API_URL`.
 */
export const intakeApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${intakeBaseUrl}${normalizedPath}`;
};
