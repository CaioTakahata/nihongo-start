import { T, K, CATS, LI } from '../../data/index.js'
import { say } from '../audio.js'
import { levelTabsHtml } from '../curriculum.js'
import { state, hooks, render, $ } from '../state.js'
import { strokeSVG, practiceView, testView, kNew, ensureOverlay, kClose } from './writing.js'

export function kC(i) {
  state.kcat = i
  render()
}

export function kanjiList() {
  const t = T[state.L]
  const { kcat } = state
  let h = `<div style='display:flex;gap:6px;margin-bottom:10px'>${levelTabsHtml(
    state.levelId,
  )}</div><p class='sub'>Toque em um kanji para abrir o card: gire, veja a ordem dos traços e pratique o desenho.</p><div style='display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px'>`
  h +=
    ['Todos', ...CATS.map((c) => c[0])]
      .map(
        (n, i) =>
          `<button onclick='kC(${i - 1})' style='${kcat === i - 1 ? 'background:var(--ac);color:#fff' : ''}'>${n}</button>`,
      )
      .join('') + `</div>`
  CATS.forEach((c, ci) => {
    if (kcat >= 0 && kcat !== ci) return
    const it = K.map((k, i) => [k, i]).filter((x) => x[0].cat === ci)
    if (!it.length) return
    h +=
      `<h3 style='margin:18px 0 8px'>${c[0]} (${it.length})</h3><div class='kgrid'>` +
      it
        .map(
          ([k, i]) =>
            `<button class='k' style='text-align:left' onclick='kOpen(${i})'><b>${k[0]}</b><strong>${k[LI[state.L]]}</strong><small>${t.on}: ${k[4]}</small><small>${t.kun}: ${k[5]}</small></button>`,
        )
        .join('') +
      '</div>'
  })
  return h
}

export function cardView() {
  const { ki, kfl, L } = state
  const k = K[ki]
  const t = T[L]
  return `<div style='text-align:center'><div class='fc${kfl ? ' fl' : ''}' onclick='kFlip()'><div class='fcf'><div class='big' style='font-size:7rem'>${
    k[0]
  }</div><small style='color:var(--mu)'>↻</small></div><div class='fcb'><b style='font-size:1.3rem'>${
    k[LI[L]]
  }</b><small style='color:var(--mu)'>${t.on}: ${k[4]} · ${t.kun}: ${
    k[5]
  }</small><div id='ksv'></div></div></div><p><button onclick='kGo(-1)'>←</button> ${ki + 1}/${
    K.length
  } <button onclick='kGo(1)'>→</button> <button onclick='kRand()'>🔀</button> <button onclick='kSay()'>🔊</button> <button onclick='kPlay()'>▶ Traços</button></p></div>`
}

export function kSay() {
  say(K[state.ki][0])
}

export function kFlip() {
  state.kfl = !state.kfl
  const fc = $('.fc')
  if (fc) fc.classList.toggle('fl', state.kfl)
  if (state.kfl) setTimeout(kPlay, 350)
}

export function kPlay() {
  if (!state.kfl) {
    kFlip()
    return
  }
  const e = $('#ksv')
  if (e) e.innerHTML = strokeSVG(K[state.ki][0])
}

export function kShow() {
  const o = ensureOverlay()
  const { kt } = state
  const on = 'background:var(--ac);color:#fff'
  const bar = `<div style='display:flex;gap:6px;margin-bottom:8px'><button onclick='kMode(0)' style='${
    kt ? '' : on
  }'>🎴 Estudar</button><button onclick='kMode(1)' style='${
    kt ? on : ''
  }'>📝 Teste de escrita</button><button onclick='kClose()' style='margin-left:auto'>✕</button></div>`
  o.innerHTML =
    `<div style='background:var(--bg);color:var(--tx);border-radius:16px;padding:12px;max-width:380px;margin:0 auto'>${bar}` +
    (kt ? `<div id='pw'>${testView()}</div>` : cardView() + `<div id='pw'>${practiceView()}</div>`) +
    '</div>'
}
hooks.kShow = kShow

export function kOpen(i) {
  state.ki = i
  state.kfl = false
  state.kdoneFor = -1
  state.kt = false
  kShow()
}

export function kMode(m) {
  state.kt = !!m
  state.kres = null
  state.kdone = []
  state.kpts = []
  state.kdoneFor = -1
  if (state.kt) kNew()
  kShow()
}

export function kGo(d) {
  state.ki = (state.ki + K.length + d) % K.length
  state.kfl = false
  kShow()
}

export function kRand() {
  state.ki = Math.floor(Math.random() * K.length)
  state.kfl = false
  kShow()
}

export { kClose, say }
