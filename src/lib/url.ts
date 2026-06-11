/* Prefix site-internal URLs with the configured base path (GitHub Pages
   serves the site under /<repo>/; Vercel/Netlify and dev use '/'). */

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
