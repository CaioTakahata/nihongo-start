import { T, R } from '../../data/index.js'
import { say } from '../audio.js'
import { state, render } from '../state.js'
import { ensureOverlay, kClose } from './writing.js'
import { mountStrokeAnimation } from './stroke-anim.js'

const ROWS = [
  [0, 5],
  [5, 10],
  [10, 15],
  [15, 20],
  [20, 25],
  [25, 30],
  [30, 35],
  [35, 38],
  [38, 43],
  [43, 46],
]

export function toggleKanaStrokeMode() {
  state.kanaStrokeMode = !state.kanaStrokeMode
  render()
}

export async function showKanaStroke(ch) {
  const o = ensureOverlay()
  const enc = encodeURIComponent(ch)
  o.innerHTML = `<div style="background:var(--bg);color:var(--tx);border-radius:16px;padding:16px;max-width:380px;margin:40px auto;text-align:center"><button onclick="kClose()" style="float:right">✕</button><div style="clear:both"></div><h2 style="margin:0 0 8px;font-size:3rem">${ch}</h2><p class="sub">Ordem dos traços (KanjiVG)</p><div id="kana-stroke-host"></div><p><button onclick="say(decodeURIComponent('${enc}'))">🔊</button> <button onclick="showKanaStroke(decodeURIComponent('${enc}'))">▶ Replay</button></p></div>`
  await mountStrokeAnimation(document.querySelector('#kana-stroke-host'), ch, { size: 240 })
}

/** Grid of kana; tap to hear, or open stroke animation when stroke mode is on. */
export function kanaGrid(arr) {
  const mode = state.kanaStrokeMode
  let h = `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 10px">`
  h += `<p class="note" style="margin:0;flex:1">${mode ? 'Toque em um caractere para ver a ordem dos traços.' : T[state.L].tap}</p>`
  h += `<button type="button" data-kana-stroke-toggle style="${mode ? 'background:var(--ac);color:#fff' : ''}">✍ Ordem dos traços</button></div>`
  h += `<div class="grid">`
  ROWS.forEach(([a, b]) => {
    const sl = arr.slice(a, b)
    let cells = sl.map((c, i) => [c, R[a + i]])
    if (a === 35) cells = [cells[0], null, cells[1], null, cells[2]]
    if (a === 43) cells = [cells[0], cells[1], cells[2], null, null].slice(0, 5)
    cells.forEach((x) => {
      if (!x) {
        h += '<div class="cell empty"></div>'
        return
      }
      const enc = encodeURIComponent(x[0])
      if (mode) {
        h += `<button class="cell" data-kana-stroke="${enc}"><b>${x[0]}</b><span>${x[1]}</span></button>`
      } else {
        h += `<button class="cell" data-say="${enc}"><b>${x[0]}</b><span>${x[1]}</span></button>`
      }
    })
  })
  return h + '</div>'
}

export { say }
