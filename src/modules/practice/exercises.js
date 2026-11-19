import { LS, PQ, GQ, LQ, RQ } from '../../data/index.js'
import { say } from '../audio.js'
import { saveResume, clearResume, getResume } from '../progress.js'
import { state, hooks, render, sh, uq, xp } from '../state.js'

const MODES = 'vlkpgm'
const PARTICLES = ['は', 'の', 'を', 'に', 'で', 'と', 'も', 'が', 'から']

export const Q = (q, a, w, e, s) => ({ q, a, o: sh([a, ...w]), e, s })

const rowsOf = (a, b) =>
  LS.slice(a, b)
    .flatMap((l) => l.v.split(';').map((x) => x.split('|')))
    .filter((r) => r.length > 2 && r[0])

export function mkV(a, b, lis, n) {
  const pool = rowsOf(a, b)
  return sh(pool)
    .slice(0, n)
    .map((r) => {
      const ot = pool.filter((x) => x[2] !== r[2] && x[0] !== r[0])
      if (lis)
        return Q(
          '🔊 Ouça e escolha',
          r[0],
          uq(sh(ot).map((x) => x[0])).slice(0, 3),
          r[0] + ' (' + r[1] + ') = ' + r[2],
          r[0],
        )
      return Q(r[0], r[2], uq(sh(ot).map((x) => x[2])).slice(0, 3), r[0] + ' (' + r[1] + ')')
    })
}

const particleQ = (s) => {
  const [q, a, e] = s.split('|')
  return Q(q, a, sh(PARTICLES.filter((x) => x !== a)).slice(0, 3), e)
}
const grammarQ = (s) => {
  const [q, a, w, e] = s.split('|')
  return Q(q, a, w.split(','), e)
}

export const mkP = (n) => sh(PQ).slice(0, n).map(particleQ)
export const mkG = (n) => sh(GQ).slice(0, n).map(grammarQ)
export const mkPs = (r) => sh(PQ.slice(r[0], r[1])).map(particleQ)
export const mkGs = (r) => sh(GQ.slice(r[0], r[1])).map(grammarQ)

export const mkS = (n) =>
  sh(LQ)
    .slice(0, n)
    .map((s) => {
      const [j, a, w] = s.split('|')
      return Q('🔊 O que você ouviu?', a, w.split(','), j + ' = ' + a, j)
    })

export const mkR = (n) =>
  sh(RQ)
    .slice(0, n)
    .map((r) =>
      Q(
        `<span style="display:block;font-size:1.05rem;text-align:left;line-height:1.7;margin-bottom:8px">${r[0]}</span><b style="font-size:1rem">${r[1]}</b>`,
        r[2],
        r[3].split(','),
        'Resposta: ' + r[2],
      ),
    )

/** Lições: 0–35 base, 36–38 kanji, 39 plano, 40+ pacotes N5 (verbos/adj/substantivos). */
const VOCAB_END = 36
const KANJI_START = 36
const KANJI_END = 39
const PACK_START = 40
const PACK_END = 59

function buildExList(i) {
  const m = MODES[i]
  const n = 15
  if (m === 'v')
    return sh([...mkV(0, VOCAB_END, 0, 10), ...mkV(PACK_START, PACK_END, 0, 10)]).slice(0, n)
  if (m === 'l')
    return sh([...mkV(0, VOCAB_END, 1, 8), ...mkV(PACK_START, PACK_END, 1, 8)]).slice(0, n)
  if (m === 'k') return mkV(KANJI_START, KANJI_END, 0, n)
  if (m === 'p') return mkP(n)
  if (m === 'g') return mkG(n)
  return sh([
    ...mkV(0, VOCAB_END, 0, 6),
    ...mkV(PACK_START, PACK_END, 0, 4),
    ...mkV(0, VOCAB_END, 1, 4),
    ...mkV(KANJI_START, KANJI_END, 0, 4),
    ...mkP(6),
    ...mkG(6),
  ])
}

const EX_LABELS = [
  '語彙 Vocabulário',
  '聴解 Ouvir',
  '漢字 Kanji',
  'は Partículas',
  '文法 Gramática',
  'Simulado misto',
]

export function exStart(i, fromQ = 0) {
  const l = buildExList(i)
  const start = Math.max(0, Math.min(fromQ, l.length - 1))
  state.ex = { mi: i, l, i: start, s: 0, w: [], a: false, c: -1 }
  saveResume({ tab: 'ex', exMi: i, qIndex: start, kind: 'exercises' })
  render()
  if (l[start]?.s) say(l[start].s)
}

/** Resume N5 exercise session saved in this browser. */
export function exContinue() {
  const r = getResume()
  if (!r || r.kind !== 'exercises' || r.exMi == null) return
  exStart(r.exMi, r.qIndex || 0)
}

export function exAns(j) {
  const ex = state.ex
  if (!ex || ex.a) return
  const q = ex.l[ex.i]
  ex.a = true
  ex.c = j
  if (q.o[j] === q.a) {
    ex.s++
    xp(ex.tr != null ? 8 : 6)
  } else ex.w.push(q)
  if (ex.tr != null) saveResume({ tab: 'trail', phase: ex.tr, qIndex: ex.i, kind: 'trail' })
  else saveResume({ tab: 'ex', exMi: ex.mi, qIndex: ex.i, kind: 'exercises' })
  render()
}

export function exNext() {
  const ex = state.ex
  if (!ex) return
  ex.i++
  ex.a = false
  ex.c = -1
  const finished = ex.i >= ex.l.length
  if (finished && ex.s >= ex.l.length * 0.7) xp(ex.tr != null ? 35 : 30)
  if (finished && ex.s === ex.l.length) xp(25)
  render()
  if (finished && ex.tr != null && !ex.saved) {
    hooks.trSave()
    clearResume()
    render()
  } else if (!finished) {
    if (ex.tr != null) saveResume({ tab: 'trail', phase: ex.tr, qIndex: ex.i, kind: 'trail' })
    else saveResume({ tab: 'ex', exMi: ex.mi, qIndex: ex.i, kind: 'exercises' })
  } else if (finished) clearResume()
  const q = ex.l[ex.i]
  if (q && q.s) say(q.s)
}

export function exQuit() {
  const ex = state.ex
  if (ex && ex.tr != null && ex.i > 0 && ex.i < ex.l.length) {
    saveResume({ tab: 'trail', phase: ex.tr, qIndex: ex.i, kind: 'trail', score: ex.s })
  }
  state.ex = null
  render()
}

/** Replay audio of current question (rate 1 = normal, 0.5 = slow). */
export function exSay(rate) {
  const ex = state.ex
  if (ex && ex.l[ex.i] && ex.l[ex.i].s) say(ex.l[ex.i].s, rate)
}

export function exView() {
  const ex = state.ex
  const st = 'text-align:left'
  if (!ex) {
    const resume = getResume()
    let cont = ''
    if (resume && resume.kind === 'exercises' && resume.exMi != null) {
      const label = EX_LABELS[resume.exMi] || 'exercício'
      cont = `<div style="margin:0 0 12px;padding:10px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)"><b>Continuar de onde parou</b><p class="sub" style="margin:4px 0 8px">${label} · questão ${(resume.qIndex || 0) + 1}</p><button type="button" onclick="exContinue()" style="background:var(--ac);color:#fff">▶ Continuar</button></div>`
    }
    return (
      `<div class='panel' style='${st}'><b>Exercícios N5</b><p class='sub'>Escolha um tipo de prática. Cada sessão tem 15 questões (o simulado misto tem 30). Progresso e XP ficam salvos neste navegador. +XP a cada acerto.</p>${cont}` +
      [
        '語彙 Vocabulário N5 (15)',
        '聴解 Ouvir e escolher (15)',
        '漢字 Kanji: significado (15)',
        'は Partículas (15)',
        '文法 Gramática N5 (15)',
        '🎯 Simulado misto (30)',
      ]
        .map(
          (x, i) =>
            `<button style='display:block;width:100%;text-align:left;margin:6px 0' onclick='exStart(${i})'>${x}</button>`,
        )
        .join('') +
      '</div>'
    )
  }
  if (ex.i >= ex.l.length)
    return (
      `<div class='panel' style='${st}'><h2 style='margin:0 0 8px'>Resultado: ${ex.s}/${ex.l.length}</h2>${
        ex.w.length ? '<b>Para revisar:</b>' : '<p>Perfeito! 🎉</p>'
      }` +
      ex.w.map((q) => `<p>${q.q} → <b>${q.a}</b><br><small>${q.e}</small></p>`).join('') +
      `<button onclick='exStart(${ex.mi})'>Refazer</button> <button onclick='exQuit()'>Menu</button></div>`
    )
  const q = ex.l[ex.i]
  return (
    `<div class='panel'><div class='sub'>${ex.i + 1}/${ex.l.length} · ${ex.s} ✓ <button onclick='exQuit()' style='float:right;padding:2px 8px'>✕</button></div><div class='big' style='font-size:${
      q.q.length > 6 ? '1.7rem' : '4rem'
    }'>${q.q}</div>${
      q.s ? "<button onclick='exSay(1)'>🔊 Normal</button> <button onclick='exSay(0.5)'>🐢 Lento</button>" : ''
    }<div class='opts'>` +
    q.o
      .map(
        (o, j) =>
          `<button class='${ex.a ? (o === q.a ? 'ok' : j === ex.c ? 'no' : '') : ''}' ${
            ex.a ? 'disabled' : ''
          } onclick='exAns(${j})'>${o}</button>`,
      )
      .join('') +
    `</div>${
      ex.a
        ? `<p><small>${q.e}</small></p><button onclick='exNext()'>${ex.i + 1 < ex.l.length ? 'Próxima' : 'Ver resultado'}</button>`
        : ''
    }</div>`
  )
}
