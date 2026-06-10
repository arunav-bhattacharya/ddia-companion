import { getChapter, patchChapter } from './progress-store';

class FlashCards extends HTMLElement {
  private cards: HTMLButtonElement[] = [];
  private order: number[] = [];
  private pos = 0;
  private slug = '';

  connectedCallback() {
    this.slug = this.dataset.chapter ?? '';
    this.cards = [...this.querySelectorAll<HTMLButtonElement>('.card')];
    this.order = this.cards.map((_, i) => i);

    this.cards.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        this.syncVerdict();
      });
    });

    this.querySelector('[data-action="prev"]')?.addEventListener('click', () => this.step(-1));
    this.querySelector('[data-action="next"]')?.addEventListener('click', () => this.step(1));
    this.querySelector('[data-action="shuffle"]')?.addEventListener('click', () => this.shuffle());
    this.querySelector('[data-action="knew"]')?.addEventListener('click', () => this.mark(true));
    this.querySelector('[data-action="again"]')?.addEventListener('click', () => this.mark(false));

    this.render();
  }

  private current(): HTMLButtonElement {
    return this.cards[this.order[this.pos]];
  }

  private step(dir: number) {
    this.pos = (this.pos + dir + this.order.length) % this.order.length;
    this.render();
  }

  private shuffle() {
    for (let i = this.order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
    }
    this.pos = 0;
    this.render();
  }

  private mark(knew: boolean) {
    const id = this.current().dataset.cardId!;
    const known = new Set(getChapter(this.slug).flashcards?.known ?? []);
    if (knew) known.add(id);
    else known.delete(id);
    patchChapter(this.slug, { flashcards: { known: [...known] } });
    this.step(1);
  }

  private syncVerdict() {
    const verdict = this.querySelector<HTMLElement>('.verdict');
    if (verdict) verdict.hidden = !this.current().classList.contains('flipped');
  }

  private render() {
    this.cards.forEach((card) => {
      card.hidden = true;
      card.classList.remove('flipped');
    });
    this.current().hidden = false;
    this.syncVerdict();

    const counter = this.querySelector('.counter');
    if (counter) counter.textContent = `${this.pos + 1} / ${this.order.length}`;

    const knownCount = getChapter(this.slug).flashcards?.known.length ?? 0;
    const label = this.querySelector('.known-count');
    if (label) {
      label.textContent =
        knownCount > 0 ? `${knownCount} of ${this.order.length} marked “knew it”` : '';
    }
  }
}

if (!customElements.get('flash-cards')) {
  customElements.define('flash-cards', FlashCards);
}
