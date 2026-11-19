import { LEVELS } from '../data/levels.js'
import { LS } from '../data/lessons-n5.js'
import { PH } from '../data/phases-n5.js'
import {
  getDoneLessons,
  getResume,
  getTrailBest,
  isPhaseDone,
  isPhaseOpen,
  markLessonDone,
  nextTrailPhase,
  xpOnce,
  notifyXp,
  saveResume,
  addXp,
} from './progress.js'

const lessonsByLevel = {
  n5: LS,
}

const phasesByLevel = {
  n5: PH,
}

export function listLevels() {
  return LEVELS
}

export function getActiveLevelId() {
  return LEVELS.find((l) => l.status === 'active')?.id || 'n5'
}

export function isLevelOpen(id) {
  return LEVELS.find((l) => l.id === id)?.status === 'active'
}

export function getLessons(levelId = getActiveLevelId()) {
  return lessonsByLevel[levelId] || []
}

export function getPhases(levelId = getActiveLevelId()) {
  return phasesByLevel[levelId] || []
}

export function lessonListView(levelId, lang, onOpen) {
  const lessons = getLessons(levelId)
  if (!isLevelOpen(levelId)) {
    return `<div class="panel" style="text-align:left"><b>Nível ${levelId.toUpperCase()}</b><p class="sub">Conteúdo em breve.</p></div>`
  }
  const dn = getDoneLessons()
  const note = lang !== 'pt' ? '(Lessons are in Portuguese for now)' : ''
  return `<div class="panel" style="text-align:left"><b>Curso ${levelId.toUpperCase()} do zero</b><p class="sub">${dn.length}/${lessons.length} ✓ ${note}</p>${lessons
    .map(
      (l, i) =>
        `<button style="display:block;width:100%;text-align:left;margin:6px 0" data-lesson="${i}">${dn.includes(i) ? '✅' : i + 1 + '.'} ${l.t}</button>`,
    )
    .join('')}</div>`
}

export function lessonDetailView(levelId, cl, say) {
  const lessons = getLessons(levelId)
  const l = lessons[cl]
  if (!l) return ''
  const rows = l.v
    .split(';')
    .map((x) => x.split('|'))
    .map(
      (r) =>
        `<tr><td><button type="button" data-say="${encodeURIComponent(r[0])}">${r[0]} 🔊</button></td><td>${r[1]}</td><td>${r[2]}</td></tr>`,
    )
    .join('')
  return `<div class="panel" style="text-align:left"><button type="button" data-back-lessons>←</button><h2 style="margin:10px 0">${cl + 1}. ${l.t}</h2>${l.b}<h3>Vocabulário</h3><div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%">${rows}</table></div><p><button type="button" data-finish-lesson="${cl}" style="background:var(--ac);color:#fff">Concluir lição ✓</button></p></div>`
}

export function finishLesson(i) {
  markLessonDone(i)
  notifyXp(addXp(20))
  const r = xpOnce('l' + i, 80)
  notifyXp(r)
  const lessons = getLessons()
  const next = i + 1 < lessons.length ? i + 1 : null
  saveResume({ tab: 'course', cl: next, kind: 'course' })
  return next
}

export function trailListView(levelId) {
  const phases = getPhases(levelId)
  if (!isLevelOpen(levelId)) {
    return `<div class="panel" style="text-align:left"><b>Trilha ${levelId.toUpperCase()}</b><p class="sub">Em breve.</p></div>`
  }
  const resume = getResume()
  const nxt = nextTrailPhase(phases.length)
  let cont = ''
  if (resume && (resume.kind === 'trail' || resume.kind === 'learn') && resume.phase != null) {
    const p = phases[resume.phase]
    const qLabel =
      resume.kind === 'learn'
        ? 'tela de aprendizado'
        : `questão ${(resume.qIndex || 0) + 1}`
    cont = `<div style="margin:0 0 12px;padding:10px;border:1px solid var(--bd);border-radius:12px;background:var(--bg)"><b>Continuar de onde parou</b><p class="sub" style="margin:4px 0 8px">Fase ${(resume.phase || 0) + 1}${p ? `: ${p.t}` : ''} · ${qLabel}</p><button type="button" onclick="trContinue()" style="background:var(--ac);color:#fff">▶ Continuar</button></div>`
  } else if (nxt != null) {
    cont = `<p style="margin:0 0 10px"><button type="button" data-phase="${nxt}" style="background:var(--ac);color:#fff">▶ Continuar fase ${nxt + 1}</button></p>`
  }
  const doneN = phases.filter((_, i) => isPhaseDone(i)).length
  return `<div class="panel" style="text-align:left"><b>Trilha ${levelId.toUpperCase()}</b><p class="sub">${doneN}/${phases.length} fases ★ · cobre o N5 da prova (kana, gramática, ~500+ palavras, kanji e simulados). Todas as fases estão liberadas por enquanto (em edição). Progresso e melhor nota ainda são salvos neste navegador.</p>${cont}${phases
    .map((p, i) => {
      const done = isPhaseDone(i)
      const open = isPhaseOpen(i)
      const best = getTrailBest(i)
      const bestTxt = best != null ? ` · melhor: ${best}%` : ''
      return `<button ${open ? '' : 'disabled'} data-phase="${i}" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin:6px 0;${open ? '' : 'opacity:.5'}"><span style="font-size:1.6rem;min-width:36px;text-align:center">${done ? '⭐' : open ? p.e : '🔒'}</span><span><b>${i + 1}. ${p.t}</b><br><small style="color:var(--mu)">${p.d}${bestTxt}</small></span></button>`
    })
    .join('')}</div>`
}

export function levelTabsHtml(selected = 'n5') {
  return LEVELS.map((lv) => {
    const on = lv.id === selected
    const label = lv.label?.pt || lv.id.toUpperCase()
    if (lv.status === 'soon') {
      return `<button disabled title="Em breve">${label} (em breve)</button>`
    }
    return `<button type="button" data-level="${lv.id}" style="${on ? 'background:var(--ac);color:#fff' : ''}">${label}</button>`
  }).join(' ')
}
