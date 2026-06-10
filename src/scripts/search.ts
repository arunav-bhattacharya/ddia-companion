/* Custom search UI over the Pagefind JS API. The index only exists after a
   production build (`npm run build`), so in `astro dev` we degrade to a
   friendly notice. Run `npm run search:dev` to build an index into public/. */

type PagefindResult = {
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string; chapter?: string };
  }>;
};

type Pagefind = {
  init: () => Promise<void>;
  debouncedSearch: (q: string) => Promise<{ results: PagefindResult[] } | null>;
};

let pagefind: Pagefind | null = null;
let loaded = false;

async function loadPagefind(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    // A variable specifier (plus @vite-ignore) stops Rollup from trying to
    // resolve this at build time — the module only exists in the built site.
    const moduleUrl = '/pagefind/pagefind.js';
    pagefind = await import(/* @vite-ignore */ moduleUrl);
    await pagefind!.init();
  } catch {
    pagefind = null;
  }
}

export function initSearch(): void {
  const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null;
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const results = document.getElementById('search-results');
  const openBtn = document.getElementById('search-open');
  const closeBtn = document.getElementById('search-close');
  if (!dialog || !input || !results) return;

  function open() {
    dialog!.showModal();
    input!.select();
    void loadPagefind();
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', () => dialog.close());

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
    }
  });

  // Click on backdrop closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  let token = 0;
  input.addEventListener('input', async () => {
    const query = input.value.trim();
    const mine = ++token;
    if (!query) {
      results.innerHTML = '';
      return;
    }
    await loadPagefind();
    if (!pagefind) {
      results.innerHTML =
        '<p class="empty">The search index is generated at build time. Run <code>npm run search:dev</code> to enable search during development.</p>';
      return;
    }
    const res = await pagefind.debouncedSearch(query);
    if (res === null || mine !== token) return; // superseded by newer keystroke
    const top = res.results.slice(0, 8);
    if (top.length === 0) {
      results.innerHTML = `<p class="empty">No matches for “${escapeHtml(query)}”.</p>`;
      return;
    }
    const items = await Promise.all(top.map((r) => r.data()));
    if (mine !== token) return;
    results.innerHTML = items
      .map(
        (d) => `
        <a class="hit" href="${d.url}">
          ${d.meta.chapter ? `<span class="where">${escapeHtml(d.meta.chapter)}</span>` : ''}
          <div class="title">${escapeHtml(d.meta.title ?? 'Untitled')}</div>
          <div class="excerpt">${d.excerpt}</div>
        </a>`
      )
      .join('');
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
