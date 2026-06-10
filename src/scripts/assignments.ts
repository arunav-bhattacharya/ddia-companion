import { getChapter, patchChapter } from './progress-store';

class ScenarioList extends HTMLElement {
  connectedCallback() {
    const slug = this.dataset.chapter ?? '';
    const revealed = new Set(getChapter(slug).assignments?.revealed ?? []);

    this.querySelectorAll<HTMLElement>('.assignment').forEach((a) => {
      const id = a.dataset.assignmentId!;
      const btn = a.querySelector<HTMLButtonElement>('[data-action="reveal"]');
      const model = a.querySelector<HTMLElement>('.model');
      if (!btn || !model) return;

      const show = () => {
        model.hidden = false;
        btn.hidden = true;
      };

      if (revealed.has(id)) show();

      btn.addEventListener('click', () => {
        show();
        const now = new Set(getChapter(slug).assignments?.revealed ?? []);
        now.add(id);
        patchChapter(slug, { assignments: { revealed: [...now] } });
      });
    });
  }
}

if (!customElements.get('scenario-list')) {
  customElements.define('scenario-list', ScenarioList);
}
