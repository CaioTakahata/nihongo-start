import { T, LI, KG, KKG, ST, SC, H, R } from '../../data/index.js'
import { currentKanji } from '../kanji-store.js'
import { say } from '../audio.js'
import { xpOnce, notifyXp } from '../progress.js'
import { state, hooks, $, sh } from '../state.js'
import { mountStrokeAnimation } from './stroke-anim.js'

/* ---------- geometry helpers ---------- */

export const ptsOf = (d) => {
  const n = d.match(/[\d.]+/g).map(Number)
  const r = []
  for (let i = 0; i < n.length; i += 2) r.push([n[i], n[i + 1]])
  return r
}
export const pathOf = (a) => a.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ')
export const Dst = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1])

export const dirOK = (a) => {
  const s = a[0]
  const e = a[a.length - 1]
  const dx = e[0] - s[0]
  const dy = e[1] - s[1]
  if (Math.hypot(dx, dy) < 10) return true
  if (dx < -12 && Math.abs(dy) < Math.abs(dx) * 0.6) return false
  if (dy < -15 && Math.abs(dx) < Math.abs(dy) * 0.6) return false
  return true
}

/* ---------- ink / precision / coverage (final legacy versions) ---------- */

const inkC = {}
export function ink(c) {
  if (inkC[c]) return inkC[c]
  const cv = document.createElement('canvas')
  cv.width = cv.height = 200
  const x = cv.getContext('2d')
  x.font = '160px "Hiragino Sans","Noto Sans JP","Yu Gothic","Meiryo",sans-serif'
  x.textAlign = 'center'
  x.fillText(c, 100, 156)
  const d = x.getImageData(0, 0, 200, 200).data
  const r = []
  for (let j = 0; j < 200; j += 4) for (let i = 0; i < 200; i += 4) if (d[(j * 200 + i) * 4 + 3] > 128) r.push([i / 2, j / 2])
  return (inkC[c] = r)
}

export const rs = (a) => {
  const o = []
  for (let i = 0; i < a.length; i++) {
    if (i) {
      const n = Math.ceil(Dst(a[i - 1], a[i]) / 2)
      for (let k = 1; k < n; k++)
        o.push([a[i - 1][0] + ((a[i][0] - a[i - 1][0]) * k) / n, a[i - 1][1] + ((a[i][1] - a[i - 1][1]) * k) / n])
    }
    o.push(a[i])
  }
  return o
}

const near = (p, Ls, r) => Ls.some((q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 <= r * r)

export function strokePrec(a, c) {
  const I = ink(c)
  const s = rs(a)
  return s.length ? s.filter((p) => near(p, I, 7)).length / s.length : 0
}

export function coverage(c, pts = state.kpts) {
  const I = ink(c)
  const S = pts.flatMap(rs)
  return I.length && S.length ? I.filter((p) => near(p, S, 9)).length / I.length : 0
}

/* ---------- overlay ---------- */

export function ensureOverlay() {
  let o = $('#ov')
  if (!o) {
    o = document.createElement('div')
    o.id = 'ov'
    o.style.cssText =
      'position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.6);overflow:auto;padding:calc(12px + env(safe-area-inset-top,0px)) 12px calc(12px + env(safe-area-inset-bottom,0px))'
    o.onclick = (e) => {
      if (e.target === o) kClose()
    }
    document.body.appendChild(o)
  }
  return o
}

export function kClose() {
  const o = $('#ov')
  if (o) o.remove()
}

/* ---------- stroke order animation ---------- */

/** Legacy sync placeholder; prefer mountStrokeAnimation (KanjiVG) via kPlay / showKanaStroke. */
export function strokeSVG(c) {
  return `<div id="ksv-fallback"><p class="sub">Carregando traços de ${c}…</p></div>`
}

export async function showCharStroke(hostOrSelector, ch) {
  const host = typeof hostOrSelector === 'string' ? $(hostOrSelector) : hostOrSelector
  if (!host) return false
  return mountStrokeAnimation(host, ch, { size: 220 })
}

/* ---------- kanji practice (trace) / test ---------- */

const SVG_EV =
  "onpointerdown='pD(event)' onpointermove='pM(event)' onpointerup='pU(event)' onpointerleave='pU(event)'"
const SVG_STYLE =
  'touch-action:none;max-width:100%;background:var(--card);border:1px solid var(--bd);border-radius:12px;cursor:crosshair'

export function practiceView() {
  const { ki } = state
  const list = currentKanji()
  const c = list[ki]?.[0]
  if (!c) return ''
  const p = ST[c]
  if (state.kdoneFor !== ki) {
    state.kdone = []
    state.kdoneFor = ki
    state.kmsg = ''
  }
  let s = `<div style='text-align:center'><p class='sub'>${
    state.kmsg || 'Desenhe o kanji com o mouse ou o dedo, seguindo a ordem dos traços.'
  }</p><svg id='psv' viewBox='0 0 100 100' width='260' height='260' style='${SVG_STYLE}' ${SVG_EV}><path d='M50 0V100M0 50H100' stroke='var(--bd)' stroke-dasharray='3 3'/><text x='50' y='78' font-size='80' text-anchor='middle' fill='var(--tx)' opacity='.1'>${c}</text>`
  state.kdone.forEach(
    (d) =>
      (s += `<path d='${d}' fill='none' stroke='var(--ok)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>`),
  )
  if (p && state.kdone.length < p.length) {
    const m = ptsOf(p[state.kdone.length])[0]
    s += `<circle cx='${m[0]}' cy='${m[1]}' r='4' fill='var(--ac)' opacity='.85'/>`
  }
  return (
    s +
    `<path id='pcur' d='' fill='none' stroke='var(--tx)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg><p><button onclick='pUndo()'>↩</button> <button onclick='pClear()'>🗑</button></p></div>`
  )
}

export function testView() {
  const { ki, kres, kscore, L } = state
  const k = currentKanji()[ki]
  if (!k) return ''
  const c = k[0]
  const p = ST[c]
  const t = T[L]
  const strokes = k.strokes || SC[c] || '?'
  let s = `<div style='text-align:center'><p class='sub'>Pontos: ${kscore.ok}/${kscore.n}</p><p style='margin:6px 0'>Escreva o kanji, sem olhar:<br><b style='font-size:1.3rem'>${
    k[LI[L]]
  }</b><br><small style='color:var(--mu)'>${t.on}: ${k[4]} · ${t.kun}: ${k[5]}</small><br><small style='color:var(--mu)'>${
    strokes
  } traços</small></p><svg id='psv' viewBox='0 0 100 100' width='260' height='260' style='${SVG_STYLE}' ${SVG_EV}><path d='M50 0V100M0 50H100' stroke='var(--bd)' stroke-dasharray='3 3'/>`
  if (kres) {
    s += `<text x='50' y='78' font-size='80' text-anchor='middle' fill='var(--tx)' opacity='.15'>${c}</text>`
    if (p)
      p.forEach(
        (d) =>
          (s += `<path d='${d}' fill='none' stroke='var(--ac)' stroke-width='2' stroke-dasharray='4 3' stroke-linecap='round'/>`),
      )
  }
  state.kdone.forEach(
    (d, i) =>
      (s += `<path d='${d}' fill='none' stroke='${
        kres ? (kres.good[i] ? 'var(--ok)' : 'var(--no)') : 'var(--tx)'
      }' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>`),
  )
  s += `<path id='pcur' d='' fill='none' stroke='var(--tx)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>`
  if (!kres)
    s += `<p><button onclick='tUndo()'>↩</button> <button onclick='tClear()'>🗑</button> <button onclick='tCheck()' style='background:var(--ac);color:#fff'>Conferir</button></p>`
  else {
    s += `<p class='sub'>${kres.msg}</p>`
    if (!kres.perfect) s += `<div id='stroke-model' style='margin:8px auto'></div>`
    s += `<p><button onclick='tNext()'>Próximo →</button></p>`
  }
  return s + '</div>'
}

export function prac() {
  const w = $('#pw')
  if (w) w.innerHTML = state.kt ? testView() : practiceView()
}

function evPt(e) {
  const r = $('#psv').getBoundingClientRect()
  return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100]
}

export function pD(e) {
  e.preventDefault()
  state.pcur = [evPt(e)]
  try {
    $('#psv').setPointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
  $('#pcur').setAttribute('d', pathOf(state.pcur))
}

export function pM(e) {
  if (!state.pcur) return
  state.pcur.push(evPt(e))
  $('#pcur').setAttribute('d', pathOf(state.pcur))
}

export function pU() {
  if (!state.pcur) return
  const a = state.pcur
  state.pcur = null
  if (a.length < 3) {
    prac()
    return
  }
  const c = currentKanji()[state.ki]?.[0]
  if (!c) return
  const p = ST[c]
  const d = pathOf(a)
  if (state.kt) {
    if (!state.kres) {
      state.kdone.push(d)
      state.kpts.push(a)
    }
    prac()
    return
  }
  if (p) {
    const n = state.kdone.length
    if (n >= p.length) {
      prac()
      return
    }
    const ref = ptsOf(p[n])
    if (Dst(a[0], ref[0]) > 30 || Dst(a[a.length - 1], ref[ref.length - 1]) > 30) {
      state.kmsg = 'Esse não é o traço ' + (n + 1) + '. Veja o modelo abaixo e comece no ponto vermelho.'
      prac()
      mountPracticeErrorModel(c)
      return
    }
    state.kdone.push(d)
    state.kmsg =
      state.kdone.length === p.length ? 'Parabéns! 🎉 Kanji completo.' : 'Certo! Agora o traço ' + (n + 2) + '.'
  } else {
    const n = SC[c] || 99
    if (state.kdone.length >= n) {
      state.kmsg = 'Você já fez os ' + n + ' traços.'
      prac()
      return
    }
    if (strokePrec(a, c) < 0.6) {
      state.kmsg = 'Esse traço não segue o kanji. Veja o modelo animado abaixo.'
      prac()
      mountPracticeErrorModel(c)
      return
    }
    if (!dirOK(a)) {
      state.kmsg = 'Direção estranha: da esquerda para a direita e de cima para baixo. Veja o modelo.'
      prac()
      mountPracticeErrorModel(c)
      return
    }
    state.kdone.push(d)
    state.kmsg = 'Traço ' + state.kdone.length + ' de ' + n + ' (a ordem não é verificada neste kanji).'
  }
  prac()
  const need = SC[c] || currentKanji()[state.ki]?.strokes || 0
  if (need && state.kdone.length && state.kdone.length === need) notifyXp(xpOnce('kg' + c, 15))
}

function mountPracticeErrorModel(c) {
  setTimeout(() => {
    let host = $('#stroke-model-practice')
    if (!host) {
      const wrap = $('#pw')
      if (!wrap) return
      host = document.createElement('div')
      host.id = 'stroke-model-practice'
      host.style.margin = '8px auto'
      wrap.appendChild(host)
    }
    mountStrokeAnimation(host, c, { size: 200 })
  }, 30)
}

export function pUndo() {
  state.kdone.pop()
  state.kmsg = ''
  prac()
}

export function pClear() {
  state.kdone = []
  state.kmsg = ''
  prac()
}

export function tUndo() {
  state.kdone.pop()
  state.kpts.pop()
  prac()
}

export function tClear() {
  state.kdone = []
  state.kpts = []
  prac()
}

export function kNew() {
  const n = currentKanji().length || 1
  state.ki = Math.floor(Math.random() * n)
  state.kdone = []
  state.kpts = []
  state.kres = null
  state.kdoneFor = state.ki
}

export function tNext() {
  kNew()
  hooks.kShow()
}

export function tSelf(v) {
  state.kscore.n++
  if (v) state.kscore.ok++
  kNew()
  hooks.kShow()
}

export function tCheck() {
  const row = currentKanji()[state.ki]
  const c = row?.[0]
  if (!c) return
  const p = ST[c]
  if (!state.kdone.length) return
  let good
  let perfect
  let msg
  if (p) {
    good = state.kpts.map(
      (a, i) =>
        i < p.length && ((r) => Dst(a[0], r[0]) < 30 && Dst(a[a.length - 1], r[r.length - 1]) < 30)(ptsOf(p[i])),
    )
    const okc = good.filter(Boolean).length
    perfect = state.kdone.length === p.length && okc === p.length
    msg = perfect
      ? 'Perfeito! 🎉 Todos os traços na ordem certa.'
      : `Traços certos: ${okc}/${p.length} (você fez ${state.kdone.length}). Em tracejado, o modelo.`
  } else {
    const n = SC[c] || row.strokes || 0
    good = state.kpts.map((a) => dirOK(a) && strokePrec(a, c) >= 0.7)
    state.cov = coverage(c)
    const okc = good.filter(Boolean).length
    const cov = state.cov
    perfect = state.kdone.length === n && okc === n && cov >= 0.55
    msg = perfect
      ? `Certo! ✅ Traços no lugar e na direção certos (cobertura ${Math.round(cov * 100)}%). A ordem exata não é verificada neste kanji.`
      : `Traços certos: ${okc}/${state.kdone.length}. Esse kanji tem ${n} traços e você fez ${state.kdone.length}. Cobertura do kanji: ${Math.round(cov * 100)}%. Em vermelho: traços fora do lugar ou na direção errada.`
  }
  state.kscore.n++
  if (perfect) state.kscore.ok++
  state.kres = { good, msg, perfect }
  prac()
  if (perfect) notifyXp(xpOnce('kt' + c, 25))
  else {
    // Show official stroke order when the learner misses (like study mode).
    setTimeout(() => {
      const host = $('#stroke-model')
      if (host) mountStrokeAnimation(host, c, { size: 200 })
    }, 30)
  }
}

/* ---------- kana writing (kw*) ---------- */

export function kwOpen(g, m, packKey = 'kg') {
  const pack = packKey === 'kk' ? KKG : KG
  const group = pack[g]
  if (!group) return
  let l = [...group.k]
  if (m === 't') l = sh(l)
  state.kw = {
    g,
    m,
    packKey,
    l,
    i: 0,
    sc: 0,
    done: [],
    pts: [],
    res: null,
    msg: '',
    ok: false,
    fin: false,
    cur: null,
    showModel: false,
  }
  if (m === 't') say(l[0])
  kwShow()
}

function kwCov(c) {
  const { kw } = state
  const I = ink(c)
  const S = kw.pts.flatMap(rs)
  return I.length && S.length ? I.filter((p) => near(p, S, 9)).length / I.length : 0
}

function kwPt(e) {
  const r = $('#kwsv').getBoundingClientRect()
  return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100]
}

const KR = {}
H.forEach((c, i) => (KR[c] = R[i]))

export function kwShow() {
  const KRm = KR
  const { kw } = state
  const o = ensureOverlay()
  const t = kw.m === 't'
  const box = 'background:var(--bg);color:var(--tx);border-radius:16px;padding:12px;max-width:380px;margin:0 auto'
  if (kw.fin) {
    o.innerHTML = `<div style='${box}'><h2>Resultado: ${kw.sc}/${kw.l.length}</h2><p><button onclick='kwOpen(${kw.g},"${kw.m}","${kw.packKey || 'kg'}")'>Refazer</button> <button onclick='kClose()'>Fechar</button></p></div>`
    return
  }
  const c = kw.l[kw.i]
  const N = SC[c]
  const last = kw.i + 1 >= kw.l.length
  let s = `<div style='${box}'><div style='display:flex;justify-content:space-between;align-items:center'><b>${
    t ? '📝 Teste de escrita' : '✍ Aprender a escrever'
  }</b><button onclick='kClose()'>✕</button></div><p class='sub' style='text-align:center'>${kw.i + 1}/${
    kw.l.length
  }</p><div style='text-align:center'><p style='margin:4px 0'>${
    t ? 'Escreva o caractere:' : 'Escreva seguindo o modelo:'
  }<br><b style='font-size:${t ? '2rem' : '1.2rem'}'>${KRm[c]}</b> · ${N} traço${
    N > 1 ? 's' : ''
  } <button onclick='say("${c}")'>🔊</button></p><svg id='kwsv' viewBox='0 0 100 100' width='260' height='260' style='${SVG_STYLE}' onpointerdown='kwD(event)' onpointermove='kwM(event)' onpointerup='kwU(event)' onpointerleave='kwU(event)'><path d='M50 0V100M0 50H100' stroke='var(--bd)' stroke-dasharray='3 3'/>`
  if (!t || kw.res)
    s += `<text x='50' y='78' font-size='80' text-anchor='middle' fill='var(--tx)' opacity='.18'>${c}</text>`
  kw.done.forEach(
    (d, i) =>
      (s += `<path d='${d}' fill='none' stroke='${
        kw.res ? (kw.res.good[i] ? 'var(--ok)' : 'var(--no)') : t ? 'var(--tx)' : 'var(--ok)'
      }' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>`),
  )
  s += `<path id='kwpc' d='' fill='none' stroke='var(--tx)' stroke-width='4' stroke-linecap='round'/></svg><p class='sub'>${
    kw.msg || (t ? 'Escreva de memória e toque em Conferir.' : 'Trace por cima do modelo, traço por traço.')
  }</p><p><button onclick='kwUndo()'>↩</button> <button onclick='kwClear()'>🗑</button>`
  if (t && !kw.res)
    s += ` <button onclick='kwCheck()' style='background:var(--ac);color:#fff'>Conferir</button>`
  if ((t && kw.res) || (!t && kw.ok))
    s += ` <button onclick='kwNext()' style='background:var(--ac);color:#fff'>${
      last ? 'Ver resultado' : 'Próximo →'
    }</button>`
  s += '</p>'
  if (kw.showModel || (kw.res && !kw.res.perfect)) {
    s += `<div id='stroke-model' style='margin:8px auto'></div>`
  } else if (!t) {
    s += `<p><button type='button' onclick='showKanaStroke(decodeURIComponent("${encodeURIComponent(
      c,
    )}"))' style='color:var(--ac)'>▶ Ver ordem dos traços</button></p>`
  }
  o.innerHTML = s + '</div></div>'
  if (kw.showModel || (kw.res && !kw.res.perfect)) {
    setTimeout(() => {
      const host = $('#stroke-model')
      if (host) mountStrokeAnimation(host, c, { size: 200 })
    }, 30)
  }
}

export function kwD(e) {
  const { kw } = state
  e.preventDefault()
  if (kw.res || (kw.m === 'p' && kw.ok)) return
  kw.cur = [kwPt(e)]
  try {
    $('#kwsv').setPointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
  $('#kwpc').setAttribute('d', pathOf(kw.cur))
}

export function kwM(e) {
  const { kw } = state
  if (!kw.cur) return
  kw.cur.push(kwPt(e))
  $('#kwpc').setAttribute('d', pathOf(kw.cur))
}

export function kwU() {
  const { kw } = state
  if (!kw.cur) return
  const a = kw.cur
  kw.cur = null
  if (a.length < 3) {
    kwShow()
    return
  }
  const c = kw.l[kw.i]
  const N = SC[c]
  const d = pathOf(a)
  if (kw.m === 't') {
    if (kw.done.length < N + 3) {
      kw.done.push(d)
      kw.pts.push(a)
    }
    kwShow()
    return
  }
  if (strokePrec(a, c) < 0.6) {
    kw.msg = 'Esse traço não segue o modelo. Veja a ordem abaixo e tente de novo.'
    kw.showModel = true
    kwShow()
    return
  }
  if (!dirOK(a)) {
    kw.msg = 'Direção estranha: da esquerda para a direita e de cima para baixo.'
    kw.showModel = true
    kwShow()
    return
  }
  kw.done.push(d)
  kw.pts.push(a)
  kw.showModel = false
  if (kw.done.length >= N) {
    if (kwCov(c) >= 0.5) {
      kw.ok = true
      kw.sc++
      kw.msg = '✅ Muito bem!'
      notifyXp(xpOnce('kwp' + c, 10))
    } else {
      kw.msg = 'Faltou cobrir parte do caractere. Veja o modelo e toque em 🗑.'
      kw.showModel = true
    }
  } else kw.msg = 'Traço ' + kw.done.length + ' de ' + N + '.'
  kwShow()
}

export function kwCheck() {
  const { kw } = state
  const c = kw.l[kw.i]
  const N = SC[c]
  if (!kw.done.length) return
  const good = kw.pts.map((a) => dirOK(a) && strokePrec(a, c) >= 0.7)
  const cv = kwCov(c)
  const okc = good.filter(Boolean).length
  const perfect = kw.done.length === N && okc === N && cv >= 0.55
  if (perfect) {
    kw.sc++
    notifyXp(xpOnce('kwt' + c, 12))
  }
  kw.res = { good, perfect }
  kw.showModel = !perfect
  kw.msg = perfect
    ? 'Certo! ✅ (cobertura ' + Math.round(cv * 100) + '%)'
    : `Traços certos: ${okc}/${kw.done.length}. O caractere tem ${N} traços. Cobertura: ${Math.round(cv * 100)}%. Em vermelho: errados — veja o modelo abaixo.`
  kwShow()
}

export function kwNext() {
  const { kw } = state
  kw.i++
  if (kw.i >= kw.l.length) kw.fin = true
  else {
    kw.done = []
    kw.pts = []
    kw.res = null
    kw.msg = ''
    kw.ok = false
    kw.showModel = false
    if (kw.m === 't') say(kw.l[kw.i])
  }
  kwShow()
}

export function kwUndo() {
  const { kw } = state
  if (kw.res || kw.ok) return
  kw.done.pop()
  kw.pts.pop()
  kw.msg = ''
  kwShow()
}

export function kwClear() {
  const { kw } = state
  if (kw.res) return
  kw.done = []
  kw.pts = []
  kw.ok = false
  kw.msg = ''
  kw.showModel = false
  kwShow()
}
