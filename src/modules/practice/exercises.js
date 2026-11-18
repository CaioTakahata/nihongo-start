import { LS, PQ, GQ, LQ, RQ } from '../../data/index.js'
import { say } from '../audio.js'
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

export function exStart(i) {
  const m = MODES[i]
  const n = 10
  let l
  if (m === 'v') l = mkV(0, 21, 0, n)
  else if (m === 'l') l = mkV(0, 21, 1, n)
  else if (m === 'k') l = mkV(21, 24, 0, n)
  else if (m === 'p') l = mkP(n)
  else if (m === 'g') l = mkG(n)
  else l = sh([...mkV(0, 21, 0, 5), ...mkV(0, 21, 1, 4), ...mkV(21, 24, 0, 4), ...mkP(4), ...mkG(3)])
  state.ex = { mi: i, l, i: 0, s: 0, w: [], a: false, c: -1 }
  render()
  if (l[0].s) say(l[0].s)
}

export function exAns(j) {
  const ex = state.ex
  if (!ex || ex.a) return
  const q = ex.l[ex.i]
  ex.a = true
  ex.c = j
  if (q.o[j] === q.a) {
    ex.s++
    xp(5)
  } else ex.w.push(q)
  render()
}

export function exNext() {
  const ex = state.ex
  if (!ex) return
  ex.i++
  ex.a = false
  ex.c = -1
  const finished = ex.i >= ex.l.length
  if (finished && ex.s >= ex.l.length * 0.7) xp(20)
  render()
  if (finished && ex.tr != null && !ex.saved) {
    hooks.trSave()
    render()
  }
  const q = ex.l[ex.i]
  if (q && q.s) say(q.s)
}

export function exQuit() {
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
  if (!ex)
    return (
      `<div class='panel' style='${st}'><b>Exercícios N5</b><p class='sub'>Escolha um tipo de prática. Cada sessão tem 10 questões (o simulado misto tem 20). Os erros aparecem no fim com explicação.</p>` +
      [
        '📖 Vocabulário: japonês → português',
        '🔊 Ouvir e escolher',
        '漢 Kanji: significado',
        'は Partículas',
        '📝 Gramática',
        '🎯 Simulado misto (20)',
      ]
        .map(
          (x, i) =>
            `<button style='display:block;width:100%;text-align:left;margin:6px 0' onclick='exStart(${i})'>${x}</button>`,
        )
        .join('') +
      '</div>'
    )
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
