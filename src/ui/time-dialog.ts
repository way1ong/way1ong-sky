// "Date and eclipses": go to a day, or to the next eclipse of the Moon or of the Sun.
import { LIMITS } from '../core/clock.ts';
import { h } from './dom.ts';
import type { Dict } from './i18n.ts';

export interface TimeActions {
  /** Noon of the chosen day, local time. */
  goTo(date: Date): void;
  nextLunar(): void;
  nextSolar(): void;
}

/** "2026-11-24" of a moment, in the local calendar — the form a date field takes. */
function dayOf(date: Date): string {
  const two = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
}

export function createTimeDialog(): { el: HTMLDialogElement; open(d: Dict, shown: Date, actions: TimeActions): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'time-title' });
  return {
    el,
    open(d, shown, actions) {
      const field = h('input', { id: 'day', type: 'date', value: dayOf(shown), min: dayOf(new Date(LIMITS.from)), max: dayOf(new Date(LIMITS.to)) });
      const go = h('button', { class: 'btn', type: 'submit' }, d.time.dialog.go);
      const form = h('form', { class: 'field' }, h('label', { for: 'day' }, d.time.dialog.date), field, go);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const [y, m, day] = field.value.split('-').map(Number);
        if (!y || !m || !day) return;
        el.close();
        actions.goTo(new Date(y, m - 1, day, 12));
      });
      const eclipse = (label: string, action: () => void) => {
        const button = h('button', { class: 'chip chip--wide', type: 'button' }, label);
        button.addEventListener('click', () => {
          el.close();
          action();
        });
        return button;
      };
      const close = h('button', { class: 'chip', type: 'button' }, d.actions.close);
      close.addEventListener('click', () => el.close());
      el.replaceChildren(
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'time-title' }, d.time.dialog.title),
          form,
          h('h2', {}, d.time.dialog.eclipses),
          eclipse(d.time.dialog.lunar, actions.nextLunar),
          eclipse(d.time.dialog.solar, actions.nextSolar),
          h('div', { class: 'dialog__actions' }, close),
        ),
      );
      if (!el.open) el.showModal();
      field.focus();
    },
  };
}
