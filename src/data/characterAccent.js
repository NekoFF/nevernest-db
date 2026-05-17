/** Subtle element accents for detail pages (light theme). */

export const elementAccent = {
  incantation: {
    key: 'incantation',
    label: 'Incantation',
    chip: 'bg-rose-50 text-rose-700 ring-rose-100',
    softBg: 'from-rose-50/90 via-white to-white',
    glow: 'shadow-[0_0_0_1px_rgba(255,59,111,0.22)]',
    line: 'bg-gradient-to-r from-rose-200/80 to-transparent',
  },
  cosmos: {
    key: 'cosmos',
    label: 'Cosmos',
    chip: 'bg-slate-50 text-slate-700 ring-slate-200',
    softBg: 'from-slate-50/90 via-white to-white',
    glow: 'shadow-[0_0_0_1px_rgba(148,163,184,0.24)]',
    line: 'bg-gradient-to-r from-slate-200/80 to-transparent',
  },
  chaos: {
    key: 'chaos',
    label: 'Chaos',
    chip: 'bg-violet-50 text-violet-800 ring-violet-100',
    softBg: 'from-violet-50/90 via-white to-white',
    glow: 'shadow-[0_0_0_1px_rgba(168,85,247,0.28)]',
    line: 'bg-gradient-to-r from-violet-200/80 to-transparent',
  },
  psyche: {
    key: 'psyche',
    label: 'Psyche',
    chip: 'bg-sky-50 text-sky-800 ring-sky-100',
    softBg: 'from-sky-50/90 via-white to-white',
    glow: 'shadow-[0_0_0_1px_rgba(56,189,248,0.25)]',
    line: 'bg-gradient-to-r from-sky-200/80 to-transparent',
  },
  anima: {
    key: 'anima',
    label: 'Anima',
    chip: 'bg-teal-50 text-teal-800 ring-teal-100',
    softBg: 'from-teal-50/90 via-white to-white',
    glow: 'shadow-[0_0_0_1px_rgba(20,184,166,0.25)]',
    line: 'bg-gradient-to-r from-teal-200/80 to-transparent',
  },
  lakshana: {
    key: 'lakshana',
    label: 'Lakshana',
    chip: 'bg-amber-50 text-amber-900 ring-amber-100',
    softBg: 'from-amber-50/90 via-white to-white',
    glow: 'shadow-[0_0_0_1px_rgba(246,199,68,0.3)]',
    line: 'bg-gradient-to-r from-amber-200/80 to-transparent',
  },
}

export function getElementAccent(element) {
  return elementAccent[element] || elementAccent.anima
}
