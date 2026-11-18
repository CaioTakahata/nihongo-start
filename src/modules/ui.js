import { T, CL, H, Kt } from '../data/index.js'
import { say, mountSpeedControl } from './audio.js'
import { lessonListView, lessonDetailView, finishLesson, isLevelOpen } from './curriculum.js'
import { loadProgress, renderXpBar } from './progress.js'
import { state, hooks, $ } from './state.js'
import { exView, exStart, exAns, exNext, exQuit, exSay } from './practice/exercises.js'
import { kanaGrid } from './practice/kana-grid.js'
import { kanjiList, kC, kOpen, kClose, kMode, kFlip, kGo, kRand, kPlay, kSay } from './practice/kanji.js'
import { quizView, newQ, setQset } from './practice/quiz.js'
import { trailView, trStart, trGo, trWrite, learnAll, learnClose } from './practice/trail.js'
import {
  pD,
  pM,
  pU,
  pUndo,
  pClear,
  tUndo,
  tClear,
  tNext,
  tSelf,
  tCheck,
  kwOpen,
  kwD,
  kwM,
  kwU,
  kwCheck,
  kwNext,
  kwUndo,
  kwClear,
} from './practice/writing.js'

const TABS = ['trail', 'course', 'hira', 'kata', 'kanji', 'quiz', 'ex', 'tips']

export function setTab(k) {
  state.tab = k
  render()
}

export function courseView() {
  if (!isLevelOpen(state.levelId)) return lessonListView(state.levelId, state.L)
  if (state.cl === null) return lessonListView(state.levelId, state.L)
  return lessonDetailView(state.levelId, state.cl, say)
}

export function render() {
  const t = T[state.L]
  const { tab } = state
  $('#sub').textContent = t.sub
  $('#note').textContent = t.note
  $('#nav').innerHTML = TABS.map(
    (k) =>
      `<button class="${k === tab ? 'on' : ''}" data-tab="${k}">${
        t[k] || (k === 'ex' ? 'Exercícios' : k === 'trail' ? '🗺 Trilha' : CL[state.L])
      }</button>`,
  ).join('')
  let v = ''
  if (tab === 'trail') v = trailView()
  else if (tab === 'course') v = courseView()
  else if (tab === 'ex') v = exView()
  else if (tab === 'hira') v = kanaGrid(H)
  else if (tab === 'kata') v = kanaGrid(Kt)
  else if (tab === 'kanji') v = kanjiList()
  else if (tab === 'tips') v = '<div class="panel"><ul class="tips">' + t.tl.map((x) => `<li>${x}</li>`).join('') + '</ul></div>'
  else v = quizView()
  $('#view').innerHTML = v
  if (tab === 'quiz') newQ()
}

/**
 * Inline `onclick="..."` / `onpointer*="..."` handlers in generated HTML resolve on window.
 * Data-attribute buttons (nav, kana grid, curriculum views) use event delegation (see wireDelegation).
 */
function exposeWindowHandlers() {
  Object.assign(window, {
    say,
    render,
    setTab,
    // quiz
    setQset,
    newQ,
    // exercises
    exStart,
    exAns,
    exNext,
    exQuit,
    exSay,
    // trail
    trStart,
    trGo,
    trWrite,
    learnAll,
    learnClose,
    // kanji
    kC,
    kOpen,
    kClose,
    kMode,
    kFlip,
    kGo,
    kRand,
    kPlay,
    kSay,
    // writing: kanji
    pD,
    pM,
    pU,
    pUndo,
    pClear,
    tUndo,
    tClear,
    tNext,
    tSelf,
    tCheck,
    // writing: kana
    kwOpen,
    kwD,
    kwM,
    kwU,
    kwCheck,
    kwNext,
    kwUndo,
    kwClear,
  })
}

function wireDelegation() {
  document.addEventListener('click', (e) => {
    const el = e.target instanceof Element ? e.target : null
    if (!el) return
    let b
    if ((b = el.closest('[data-tab]'))) return setTab(b.dataset.tab)
    if ((b = el.closest('[data-say]'))) return say(decodeURIComponent(b.dataset.say))
    if ((b = el.closest('[data-lesson]'))) {
      state.cl = +b.dataset.lesson
      render()
      scrollTo(0, 0)
      return
    }
    if (el.closest('[data-back-lessons]')) {
      state.cl = null
      render()
      return
    }
    if ((b = el.closest('[data-finish-lesson]'))) {
      state.cl = finishLesson(+b.dataset.finishLesson)
      render()
      scrollTo(0, 0)
      return
    }
    if ((b = el.closest('[data-phase]'))) {
      if (!b.disabled) trStart(+b.dataset.phase)
      return
    }
    if ((b = el.closest('[data-level]'))) {
      state.levelId = b.dataset.level
      state.kcat = -1
      render()
    }
  })
}

export function boot() {
  hooks.render = render
  loadProgress()
  mountSpeedControl()
  renderXpBar()
  exposeWindowHandlers()
  wireDelegation()
  const lang = $('#lang')
  lang.value = state.L
  document.documentElement.lang = state.L
  lang.onchange = (e) => {
    state.L = e.target.value
    document.documentElement.lang = state.L
    render()
  }
  render()
}
