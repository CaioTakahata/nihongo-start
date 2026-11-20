import { addXp, notifyXp } from './progress.js'

/** Shared mutable UI state (single source of truth for all practice modules). */
export const state = {
  L: 'pt',
  tab: 'trail',
  levelId: 'n5',
  /** Side drawer open (Kanji Study–style). */
  drawerOpen: false,
  /** Which trail accordion sections are expanded (ids). */
  trailOpenSecs: {
    hira: true,
    kata: false,
    joshi: false,
    goi: false,
    bunpou: false,
    choukai: false,
    dokkai: false,
    kanji: false,
    sim: false,
  },

  // quiz
  qset: 'hira',
  score: 0,
  total: 0,
  q: null,

  // course
  cl: null,

  // exercises / trail session
  ex: null,
  learnI: null,
  /** Montar frase (peças): { items, i, picked, pool, ok } */
  sb: null,

  // kanji
  kanjiLevel: 'n5',
  kanaStrokeMode: false,
  kmode: 'list',
  ki: 0,
  kfl: false,
  kp: false,
  kt: false,
  kcat: -1,
  kscore: { ok: 0, n: 0 },
  kw: null, // kana writing session
  kres: null,
  kdone: [],
  kpts: [],
  kdoneFor: -1,
  kmsg: '',
  pcur: null,
  cov: 0,
}

/**
 * Late-bound callbacks to avoid circular imports between modules.
 * render: set by ui.js; kShow: set by kanji.js; trSave: set by trail.js.
 */
export const hooks = {
  render: () => {},
  kShow: () => {},
  trSave: () => {},
}

export const render = () => hooks.render()

export const $ = (s) => document.querySelector(s)

/** Award XP and show toast / refresh bar. */
export const xp = (n) => notifyXp(addXp(n))

export const sh = (a) =>
  a
    .map((x) => [Math.random(), x])
    .sort((p, r) => p[0] - r[0])
    .map((x) => x[1])

export const uq = (a) => [...new Set(a)]
