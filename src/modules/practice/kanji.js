import { T, LI } from '../../data/index.js'
import { say } from '../audio.js'
import { currentKanji, kanjiLevelCounts, setKanjiLevel, KANJI_LEVEL_IDS } from '../kanji-store.js'
import { state, hooks, render, $ } from '../state.js'
import { practiceView, testView, kNew, ensureOverlay, kClose } from './writing.js'
import { mountStrokeAnimation } from './stroke-anim.js'

export function kC(i) {
  state.kcat = i
  render()
}

export function setKLevel(id) {
  setKanjiLevel(id)
  render()
}

function levelTabs() {
  const counts = kanjiLevelCounts()
  return KANJI_LEVEL_IDS.map((id) => {
    const on = state.kanjiLevel === id
    const n = counts[id] || 0
    return `<button type="button" data-klevel="${id}" style="${on ? 'background:var(--ac);color:#fff' : ''}">${id.toUpperCase()} (${n})</button>`
  }).join(' ')
}

export function kanjiList() {
  const t = T[state.L]
  const list = currentKanji()
  const li = LI[state.L]
  let h = `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${levelTabs()}</div>`
  h += `<p class="sub">${list.length} kanji · ${state.kanjiLevel.toUpperCase()}. Toque para card, traços animados e prática de escrita.</p>`
  h += `<div class="kgrid">`
  h += list
    .map(
      (k, i) =>
        `<button class="k" style="text-align:left" onclick="kOpen(${i})"><b>${k[0]}</b><strong>${k[li]}</strong><small>${t.on}: ${k[4]}</small><small>${t.kun}: ${k[5]}</small></button>`,
    )
    .join('')
  h += `</div>`
  return h
}

export function cardView() {
  const { ki, kfl, L } = state
  const list = currentKanji()
  const k = list[ki]
  if (!k) return '<p class="sub">Kanji não encontrado.</p>'
  const t = T[L]
  return `<div style="text-align:center"><div class="fc${kfl ? ' fl' : ''}" onclick="kFlip()"><div class="fcf"><div class="big" style="font-size:7rem">${
    k[0]
  }</div><small style="color:var(--mu)">↻</small></div><div class="fcb"><b style="font-size:1.3rem">${
    k[LI[L]]
  }</b><small style="color:var(--mu)">${t.on}: ${k[4]} · ${t.kun}: ${
    k[5]
  }</small><div id="ksv"></div></div></div><p><button onclick="kGo(-1)">←</button> ${ki + 1}/${
    list.length
  } <button onclick="kGo(1)">→</button> <button onclick="kRand()">🔀</button> <button onclick="kSay()">🔊</button> <button onclick="kPlay()">▶ Traços</button></p></div>`
}

export function kSay() {
  const k = currentKanji()[state.ki]
  if (k) say(k[0])
}

export function kFlip() {
  state.kfl = !state.kfl
  const fc = $('.fc')
  if (fc) fc.classList.toggle('fl', state.kfl)
  if (state.kfl) setTimeout(kPlay, 350)
}

export async function kPlay() {
  if (!state.kfl) {
    kFlip()
    return
  }
  const e = $('#ksv')
  const k = currentKanji()[state.ki]
  if (e && k) await mountStrokeAnimation(e, k[0], { size: 200 })
}

export function kShow() {
  const o = ensureOverlay()
  const { kt } = state
  const on = 'background:var(--ac);color:#fff'
  const bar = `<div style="display:flex;gap:6px;margin-bottom:8px"><button onclick="kMode(0)" style="${
    kt ? '' : on
  }">🎴 Estudar</button><button onclick="kMode(1)" style="${
    kt ? on : ''
  }">📝 Teste de escrita</button><button onclick="kClose()" style="margin-left:auto">✕</button></div>`
  o.innerHTML =
    `<div style="background:var(--bg);color:var(--tx);border-radius:16px;padding:12px;max-width:380px;margin:0 auto">${bar}` +
    (kt ? `<div id="pw">${testView()}</div>` : cardView() + `<div id="pw">${practiceView()}</div>`) +
    '</div>'
  if (!kt && state.kfl) setTimeout(kPlay, 50)
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
  const n = currentKanji().length || 1
  state.ki = (state.ki + n + d) % n
  state.kfl = false
  kShow()
}

export function kRand() {
  const n = currentKanji().length || 1
  state.ki = Math.floor(Math.random() * n)
  state.kfl = false
  kShow()
}

export { kClose, say }
