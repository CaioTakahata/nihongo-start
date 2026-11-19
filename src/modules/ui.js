import { T, CL, H, Kt } from '../data/index.js'
import { say, mountSpeedControl } from './audio.js'
import { lessonListView, lessonDetailView, finishLesson, isLevelOpen } from './curriculum.js'
import { loadProgress, renderXpBar } from './progress.js'
import { state, hooks, $ } from './state.js'
import { exView, exStart, exContinue, exAns, exNext, exQuit, exSay } from './practice/exercises.js'
import { kanaGrid } from './practice/kana-grid.js'
import { kanjiList, kC, kOpen, kClose, kMode, kFlip, kGo, kRand, kPlay, kSay, setKLevel } from './practice/kanji.js'
import { toggleKanaStrokeMode, showKanaStroke } from './practice/kana-grid.js'
import { quizView, newQ, setQset } from './practice/quiz.js'
import { trailView, trStart, trGo, trContinue, trWrite, learnAll, learnClose } from './practice/trail.js'
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

const TABS = [
  { id: 'trail', ico: '🗺', label: (t) => t.trail || 'Trilha' },
  { id: 'course', ico: '📘', label: (t) => t.course || CL[state.L] || 'Curso' },
  { id: 'hira', ico: 'あ', label: (t) => t.hira || 'Hiragana' },
  { id: 'kata', ico: 'ア', label: (t) => t.kata || 'Katakana' },
  { id: 'kanji', ico: '漢', label: (t) => t.kanji || 'Kanji' },
  { id: 'quiz', ico: '✅', label: (t) => t.quiz || 'Quiz' },
  { id: 'ex', ico: '📝', label: () => 'Exercícios' },
  { id: 'tips', ico: '💡', label: (t) => t.tips || 'Dicas' },
]

const TAB_TITLES = {
  trail: 'Trilha N5',
  course: 'Curso',
  hira: 'Hiragana',
  kata: 'Katakana',
  kanji: 'Kanji',
  quiz: 'Quiz',
  ex: 'Exercícios N5',
  tips: 'Dicas',
}

export function setTab(k) {
  state.tab = k
  closeDrawer()
  render()
}

export function openDrawer() {
  state.drawerOpen = true
  syncDrawer()
}

export function closeDrawer() {
  state.drawerOpen = false
  syncDrawer()
}

export function toggleDrawer() {
  state.drawerOpen = !state.drawerOpen
  syncDrawer()
}

function syncDrawer() {
  const drawer = $('#drawer')
  const backdrop = $('#drawer-backdrop')
  if (!drawer || !backdrop) return
  const on = !!state.drawerOpen
  drawer.hidden = false
  backdrop.hidden = !on
  drawer.classList.toggle('open', on)
  drawer.setAttribute('aria-hidden', on ? 'false' : 'true')
  document.body.style.overflow = on ? 'hidden' : ''
}

function renderDrawer(t) {
  const nav = $('#drawer-nav')
  if (!nav) return
  nav.innerHTML = TABS.map(
    (tab) =>
      `<button type="button" class="${tab.id === state.tab ? 'on' : ''}" data-tab="${tab.id}"><span class="ico">${tab.ico}</span><span>${tab.label(t)}</span></button>`,
  ).join('')
}

export function courseView() {
  if (!isLevelOpen(state.levelId)) return lessonListView(state.levelId, state.L)
  if (state.cl === null) return lessonListView(state.levelId, state.L)
  return lessonDetailView(state.levelId, state.cl, say)
}

export function toggleTrailSec(id, forceOpen = false) {
  state.trailOpenSecs[id] = forceOpen ? true : !state.trailOpenSecs[id]
  render()
  if (state.trailOpenSecs[id]) {
    setTimeout(() => {
      document.querySelector(`.trail-sec[data-sec="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }
}

export function render() {
  const t = T[state.L]
  const { tab } = state
  const title = $('#app-title')
  if (title) title.textContent = TAB_TITLES[tab] || 'Nihongo Start'
  $('#sub').textContent = t.sub
  $('#note').textContent = t.note
  renderDrawer(t)
  // Keep legacy #nav empty/hidden (drawer replaces top tabs)
  const nav = $('#nav')
  if (nav) nav.innerHTML = ''
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
  syncDrawer()
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
    openDrawer,
    closeDrawer,
    toggleDrawer,
    toggleTrailSec,
    // quiz
    setQset,
    newQ,
    // exercises
    exStart,
    exContinue,
    exAns,
    exNext,
    exQuit,
    exSay,
    // trail
    trStart,
    trGo,
    trContinue,
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
    setKLevel,
    showKanaStroke,
    toggleKanaStrokeMode,
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
    if (el.closest('#menu-btn')) return toggleDrawer()
    if (el.closest('#drawer-backdrop')) return closeDrawer()
    if ((b = el.closest('[data-tab]'))) return setTab(b.dataset.tab)
    if ((b = el.closest('[data-trail-jump]'))) return toggleTrailSec(b.dataset.trailJump, true)
    if ((b = el.closest('[data-trail-sec]'))) return toggleTrailSec(b.dataset.trailSec)
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
      return
    }
    if ((b = el.closest('[data-klevel]'))) {
      setKLevel(b.dataset.klevel)
      return
    }
    if (el.closest('[data-kana-stroke-toggle]')) {
      toggleKanaStrokeMode()
      return
    }
    if ((b = el.closest('[data-kana-stroke]'))) {
      showKanaStroke(decodeURIComponent(b.dataset.kanaStroke))
    }
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.drawerOpen) closeDrawer()
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
  if (lang) {
    lang.value = state.L
    document.documentElement.lang = state.L
    lang.onchange = (e) => {
      state.L = e.target.value
      document.documentElement.lang = state.L
      render()
    }
  }
  // Prefer dark feel closer to Kanji Study when system is dark; leave auto otherwise.
  render()
}
