import { T, R } from '../../data/index.js'
import { say } from '../audio.js'
import { state } from '../state.js'

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

/** Grid of kana (hiragana or katakana array); tap to hear. Click is handled by event delegation in ui.js. */
export function kanaGrid(arr) {
  let h = `<p class="note" style="margin:0 0 10px">${T[state.L].tap}</p><div class="grid">`
  ROWS.forEach(([a, b]) => {
    const sl = arr.slice(a, b)
    let cells = sl.map((c, i) => [c, R[a + i]])
    if (a === 35) cells = [cells[0], null, cells[1], null, cells[2]]
    if (a === 43) cells = [cells[0], cells[1], cells[2], null, null].slice(0, 5)
    cells.forEach((x) => {
      h += x
        ? `<button class="cell" data-say="${encodeURIComponent(x[0])}"><b>${x[0]}</b><span>${x[1]}</span></button>`
        : '<div class="cell empty"></div>'
    })
  })
  return h + '</div>'
}

export { say }
