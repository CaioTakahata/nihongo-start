import { T, H, R, Kt, K, LI } from '../../data/index.js'
import { say } from '../audio.js'
import { state, $, xp } from '../state.js'

/** Quiz panel markup (hira / kata / kanji). Call newQ() after inserting into the DOM. */
export function quizView() {
  const t = T[state.L]
  return (
    `<div class="panel"><div style="margin-bottom:8px">` +
    ['hira', 'kata', 'kanji']
      .map(
        (k) =>
          `<button class="${k === state.qset ? 'on' : ''}" style="${
            k === state.qset ? 'background:var(--ac);color:#fff' : ''
          }" onclick="setQset('${k}')">${t[k]}</button>`,
      )
      .join(' ') +
    `</div><div class="big" id="qc"></div><div class="opts" id="qo"></div><div>${t.score}: <b id="sc"></b> <button id="nx" onclick="newQ()" style="margin-left:10px">${t.next}</button></div></div>`
  )
}

export function setQset(k) {
  state.qset = k
  state.score = 0
  state.total = 0
  newQ()
}

export function newQ() {
  const L = state.L
  let pool
  if (state.qset === 'kanji') pool = K.map((k) => [k[0], k[LI[L]]])
  else {
    const a = state.qset === 'hira' ? H : Kt
    pool = a.map((c, i) => [c, R[i]])
  }
  const ans = pool[Math.floor(Math.random() * pool.length)]
  const o = [ans]
  while (o.length < 4) {
    const x = pool[Math.floor(Math.random() * pool.length)]
    if (!o.includes(x)) o.push(x)
  }
  o.sort(() => Math.random() - 0.5)
  state.q = ans
  const qc = $('#qc')
  if (!qc) return
  qc.textContent = ans[0]
  $('#qo').innerHTML = o.map((x, i) => `<button data-i="${i}">${x[1]}</button>`).join('')
  $('#sc').textContent = state.score + '/' + state.total
  const btns = document.querySelectorAll('#qo button')
  btns.forEach((b, i) => {
    b.onclick = () => {
      if (b.disabled) return
      state.total++
      const right = o[i] === ans
      if (right) {
        state.score++
        xp(5)
      }
      btns.forEach((bb, j) => {
        bb.disabled = true
        if (o[j] === ans) bb.classList.add('ok')
        else if (bb === b) bb.classList.add('no')
      })
      $('#sc').textContent = state.score + '/' + state.total
      say(ans[0])
    }
  })
}
