import { H, R, KG, PH } from '../../data/index.js'
import { getKanjiList } from '../../data/kanji/index.js'
import { setKanjiLevel } from '../kanji-store.js'
import { say } from '../audio.js'
import { trailListView } from '../curriculum.js'
import {
  addXp,
  clearResume,
  getResume,
  notifyXp,
  renderXpBar,
  saveResume,
  setTrailBest,
  xpOnce,
} from '../progress.js'
import { state, hooks, render, sh } from '../state.js'
import { Q, exView, mkG, mkGs, mkPs, mkR, mkS, mkV } from './exercises.js'
import { kMode, kOpen } from './kanji.js'
import { kwOpen } from './writing.js'

const KR = {}
H.forEach((c, i) => (KR[c] = R[i]))

/** Questions for a hiragana-row phase (cumulative review of rows learned so far). */
export function kanaQ(g) {
  const cum = KG.slice(0, g + 1).flatMap((x) => [...x.k])
  const W = KG.slice(0, g + 1).flatMap((x) => x.w.split(';').map((s) => s.split('|')))
  const wr = (k, pool) => sh(pool.filter((x) => x !== k)).slice(0, 3)
  const qa = (k) =>
    Q(
      k,
      KR[k],
      wr(
        KR[k],
        cum.map((c) => KR[c]),
      ),
      k + ' = ' + KR[k],
      k,
    )
  const qb = (k) => Q(KR[k], k, wr(k, cum), KR[k] + ' = ' + k)
  const qc = (k) => Q('🔊 Qual caractere você ouviu?', k, wr(k, cum), KR[k] + ' = ' + k, k)
  const qw = (w) =>
    Q(
      w[0],
      w[2],
      sh(W.filter((x) => x[2] !== w[2]))
        .slice(0, 3)
        .map((x) => x[2]),
      w[0] + ' (' + w[1] + ')',
      w[0],
    )
  return [
    ...[...KG[g].k].map(qa),
    ...sh(cum).slice(0, 3).map(qb),
    ...sh(cum).slice(0, 3).map(qc),
    ...sh(W).slice(0, 2).map(qw),
  ]
}

export function trQ(i) {
  const P = PH[i]
  if (P.kg != null) return kanaQ(P.kg)
  // Kanji lessons live at the end of the N5 pack (see lessons-n5.js).
  const KANJI0 = 36
  const KANJI1 = 39
  const G = {
    v: () => mkV(P.v[0], P.v[1], 0, 12),
    l: () => mkV(P.v[0], P.v[1], 1, 12),
    s: () => mkS(12),
    r: () => mkR(12),
    p: () => mkPs(P.p),
    g: () => mkGs(P.g),
    k: () => mkV(P.k?.[0] ?? KANJI0, P.k?.[1] ?? KANJI1, 0, 12),
  }
  const bag = {}
  return [...P.m]
    .map((c) => {
      if (!bag[c] || !bag[c].length) bag[c] = G[c]()
      return bag[c].shift()
    })
    .filter(Boolean)
}

/** Start exercises for phase i (skips the learn screen). */
export function trGo(i, fromQ = 0) {
  state.learnI = null
  const l = trQ(i)
  const start = Math.max(0, Math.min(fromQ, l.length - 1))
  state.ex = { mi: -1, tr: i, l, i: start, s: 0, w: [], a: false, c: -1 }
  state.tab = 'trail'
  saveResume({ tab: 'trail', phase: i, qIndex: start, kind: 'trail' })
  render()
  const f = state.ex.l[state.ex.i]
  if (f && f.s) say(f.s)
}

/** Open phase i: kana phases show the learn screen first. */
export function trStart(i) {
  if (PH[i].kg != null) {
    state.learnI = i
    state.ex = null
    state.tab = 'trail'
    saveResume({ tab: 'trail', phase: i, learnI: i, kind: 'learn' })
    render()
    scrollTo(0, 0)
    return
  }
  trGo(i)
}

/** Resume saved trail position. */
export function trContinue() {
  const r = getResume()
  if (!r || r.kind === 'exercises') return
  if (r.kind === 'learn' && r.phase != null) {
    trStart(r.phase)
    return
  }
  if (r.phase != null) trGo(r.phase, r.qIndex || 0)
}

export function trSave() {
  const { ex } = state
  const i = ex.tr
  const pct = Math.round((100 * ex.s) / ex.l.length)
  ex.saved = true
  setTrailBest(i, pct)
  // Always grant score-based XP; first pass of a phase gets a big bonus.
  notifyXp(addXp(Math.max(5, Math.round(pct / 5))))
  if (pct >= 70) notifyXp(xpOnce('ph' + i, 60))
  if (pct === 100) notifyXp(xpOnce('phPerfect' + i, 40))
  clearResume()
  renderXpBar()
}
hooks.trSave = trSave

export function trWrite() {
  const { ex } = state
  const i = ex && ex.tr != null ? ex.tr : -1
  if (i >= 0 && PH[i].kg != null) {
    kwOpen(PH[i].kg, 't')
    return
  }
  setKanjiLevel('n5')
  const kn = getKanjiList('n5')
  kOpen(Math.floor(Math.random() * kn.length))
  kMode(1)
}

export function learnClose() {
  state.learnI = null
  render()
}

export function learnAll() {
  ;[...KG[PH[state.learnI].kg].k].forEach((k, i) => setTimeout(() => say(k, 0.5), i * 1300))
}

export function learnView() {
  const { learnI } = state
  const G = KG[PH[learnI].kg]
  const W = G.w.split(';').map((s) => s.split('|'))
  return (
    `<div class='panel' style='text-align:left'><button onclick='learnClose()'>←</button><h2 style='margin:10px 0 4px'>Hiragana: ${G.t}</h2><p class='sub'>Você ainda não conhece estes caracteres. Toque para ouvir, repita em voz alta e treine escrevendo no papel. Depois vem o exercício.</p><div class='grid' style='grid-template-columns:repeat(${Math.min(
      5,
      G.k.length,
    )},1fr)'>` +
    [...G.k]
      .map(
        (k) =>
          `<button class='cell' data-say='${encodeURIComponent(k)}'><b>${k}</b><span>${KR[k]}</span></button>`,
      )
      .join('') +
    `</div><p class='sub'>Toque para ouvir. Use “Ordem dos traços” para animação KanjiVG.</p><div class='grid' style='grid-template-columns:repeat(${Math.min(
      5,
      G.k.length,
    )},1fr);margin-bottom:8px'>` +
    [...G.k]
      .map(
        (k) =>
          `<button class='cell' data-kana-stroke='${encodeURIComponent(k)}'><b>✍</b><span>${k}</span></button>`,
      )
      .join('') +
    `</div><p><button onclick='learnAll()'>🐢 Ouvir todos devagar</button> <button onclick='kwOpen(${PH[learnI].kg},"p")'>✍ Aprender a escrever</button> <button onclick='kwOpen(${PH[learnI].kg},"t")'>📝 Testar escrita</button></p><h3 style='margin:14px 0 4px'>Palavras com estes sons</h3>` +
    W.map(
      (w) =>
        `<p style='margin:4px 0'><button data-say='${encodeURIComponent(w[0])}'>${w[0]} 🔊</button> ${w[1]} — ${w[2]}</p>`,
    ).join('') +
    `<p><button onclick='trGo(${learnI})' style='background:var(--ac);color:#fff'>Começar exercícios →</button></p></div>`
  )
}

export function trResult() {
  const { ex } = state
  const i = ex.tr
  const pct = Math.round((100 * ex.s) / ex.l.length)
  const ok = pct >= 70
  const st = 'text-align:left'
  return (
    `<div class='panel' style='${st}'><h2 style='margin:0 0 6px'>${ok ? '⭐ Fase concluída!' : 'Quase lá'}</h2><p>${ex.s}/${
      ex.l.length
    } (${pct}%) · ${ok ? 'fase concluída ★' : 'continue praticando (70% marca a estrela)'}</p>${
      ex.w.length ? '<b>Para revisar:</b>' : ''
    }` +
    ex.w
      .map((q) => `<p>${q.q.replace(/<[^>]+>/g, ' ')} → <b>${q.a}</b><br><small>${q.e}</small></p>`)
      .join('') +
    `<p>${
      ok && i + 1 < PH.length
        ? `<button onclick='trStart(${i + 1})' style='background:var(--ac);color:#fff'>Próxima fase →</button> `
        : ''
    }<button onclick='trStart(${i})'>Refazer</button> <button onclick='trWrite()'>✍ Praticar escrita</button> <button onclick='exQuit()'>Trilha</button></p></div>`
  )
}

export function trailView() {
  const { ex, learnI } = state
  if (learnI != null && !ex) return learnView()
  if (ex && ex.tr != null) return ex.i >= ex.l.length ? trResult() : exView()
  return trailListView(state.levelId)
}
