import { getChapter, patchChapter } from './progress-store';

type GradingEntry = { id: string; answerIndex: number };

class ChapterQuiz extends HTMLElement {
  private slug = '';
  private grading: GradingEntry[] = [];
  private answered = new Map<string, boolean>(); // question id -> correct?

  connectedCallback() {
    this.slug = this.dataset.chapter ?? '';
    try {
      this.grading = JSON.parse(
        this.querySelector('script[type="application/json"]')?.textContent ?? '[]'
      );
    } catch {
      this.grading = [];
    }

    this.querySelectorAll<HTMLElement>('.question').forEach((q) => {
      q.querySelectorAll<HTMLButtonElement>('.option').forEach((opt) => {
        opt.addEventListener('click', () => this.answer(q, opt));
      });
    });

    this.querySelector('[data-action="retry"]')?.addEventListener('click', () => this.reset());
    this.renderStatus();
  }

  private answer(q: HTMLElement, picked: HTMLButtonElement) {
    const qid = q.dataset.questionId!;
    if (this.answered.has(qid)) return;

    const entry = this.grading.find((g) => g.id === qid);
    if (!entry) return;

    const pickedIndex = Number(picked.dataset.optionIndex);
    const correct = pickedIndex === entry.answerIndex;
    this.answered.set(qid, correct);

    q.querySelectorAll<HTMLButtonElement>('.option').forEach((opt) => {
      opt.disabled = true;
      const idx = Number(opt.dataset.optionIndex);
      if (idx === entry.answerIndex) opt.classList.add('correct');
      else if (idx === pickedIndex) opt.classList.add('incorrect');
    });

    const explanation = q.querySelector<HTMLElement>('.explanation');
    if (explanation) {
      explanation.hidden = false;
      explanation.classList.add(correct ? 'right' : 'wrong');
      const verdict = explanation.querySelector('.verdict-line');
      if (verdict) verdict.textContent = correct ? 'Correct.' : 'Not quite.';
    }

    this.renderStatus();
    if (this.answered.size === this.grading.length) this.finish();
  }

  private finish() {
    const score = [...this.answered.values()].filter(Boolean).length;
    const total = this.grading.length;

    const prev = getChapter(this.slug).quiz;
    const best = Math.max(prev?.best ?? 0, score);
    patchChapter(this.slug, {
      quiz: { best, total, attempts: (prev?.attempts ?? 0) + 1 },
    });

    const summary = this.querySelector<HTMLElement>('.summary');
    if (!summary) return;
    summary.hidden = false;
    summary.querySelector('.score')!.textContent = `You scored ${score} / ${total}`;
    summary.querySelector('.best')!.textContent =
      best === total
        ? 'Perfect score — that one’s in the bag.'
        : `Best so far: ${best} / ${total}`;
    summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private reset() {
    this.answered.clear();
    this.querySelectorAll<HTMLButtonElement>('.option').forEach((opt) => {
      opt.disabled = false;
      opt.classList.remove('correct', 'incorrect');
    });
    this.querySelectorAll<HTMLElement>('.explanation').forEach((e) => {
      e.hidden = true;
      e.classList.remove('right', 'wrong');
    });
    const summary = this.querySelector<HTMLElement>('.summary');
    if (summary) summary.hidden = true;
    this.renderStatus();
    this.querySelector('.question')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private renderStatus() {
    const status = this.querySelector('.status');
    if (!status) return;
    const total = this.grading.length;
    const done = this.answered.size;
    const best = getChapter(this.slug).quiz?.best;
    const bestNote = best !== undefined ? ` · best score ${best}/${total}` : '';
    status.textContent = `${done} of ${total} answered${bestNote}`;
  }
}

if (!customElements.get('chapter-quiz')) {
  customElements.define('chapter-quiz', ChapterQuiz);
}
