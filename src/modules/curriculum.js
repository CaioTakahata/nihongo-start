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
import { state } from './state.js'
import { FURI } from './furigana.js'

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

/** Group trail phases into accordion sections (Kanji Study–style sets). */
function phaseSection(p) {
  if (p.kg != null || /^Hiragana/i.test(p.t)) return 'hira'
  if (p.kk != null || /^Katakana/i.test(p.t)) return 'kata'
  if (/^Kanji|漢字/i.test(p.t)) return 'kanji'
  if (/聴解|Choukai|Audição/i.test(p.t)) return 'choukai'
  if (/読解|Dokkai|Leitura:/i.test(p.t)) return 'dokkai'
  if (/助詞|Partícula|Frases:|Frases úteis|Montar frases/i.test(p.t)) return 'joshi'
  if (/語彙|Verbos N5|Adjetivos N5|Substantivos|Vocabulário|Família|Números grandes|Corpo|Roupas|Comida|Casa|Escola|Transporte|Direções|Trabalho|Tempo e clima|Compras|Sentimentos|Natureza|Expressões/i.test(p.t))
    return 'goi'
  if (/文法|Bunpou|Forma|Negativo|Comparações|Adjetivos e|Existência|Calendário|Cumprimentos|Demonstrativos|Verbos na|Verbos:/i.test(p.t))
    return 'bunpou'
  if (/Simulado|Revisão|JLPT/i.test(p.t)) return 'sim'
  return 'bunpou'
}

const TRAIL_SECS = [
  { id: 'hira', e: 'あ', t: 'Hiragana', d: 'Linhas + dakuten', color: '#5b9fd4' },
  { id: 'kata', e: 'ア', t: 'Katakana', d: 'Linhas + palavras estrangeiras', color: '#5ecf98' },
  { id: 'joshi', e: 'は', t: FURI.joshi, d: 'は ・ が ・ か ・ montar frases', color: '#f0a060' },
  { id: 'goi', e: '語', t: FURI.goi, d: 'Estudar palavras → exercício', color: '#e0a04a' },
  { id: 'bunpou', e: '文', t: FURI.bunpou, d: 'Estudar regras → exercício', color: '#c97bdb' },
  { id: 'choukai', e: '聴', t: FURI.choukai, d: 'Revisar → ouvir', color: '#4db8c4' },
  { id: 'dokkai', e: '読', t: FURI.dokkai, d: 'Revisar → ler', color: '#e07a6a' },
  { id: 'kanji', e: '漢', t: FURI.kanji, d: 'Traços → leituras → exercícios', color: '#d45b6a' },
  { id: 'sim', e: '🏆', t: 'Simulados', d: 'Revisão → prova', color: '#d4a84b' },
]

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
  const openSecs = state.trailOpenSecs || {}
  const buckets = Object.fromEntries(TRAIL_SECS.map((s) => [s.id, []]))
  phases.forEach((p, i) => {
    const id = phaseSection(p)
    ;(buckets[id] || buckets.bunpou).push({ p, i })
  })

  const home = `<div class="home-grid">${TRAIL_SECS.map((s) => {
    const items = buckets[s.id] || []
    const done = items.filter(({ i }) => isPhaseDone(i)).length
    return `<button type="button" class="home-tile" data-trail-jump="${s.id}" style="--sec:${s.color}"><span class="big-ico">${s.e}</span><b>${s.t}</b><span>${done}/${items.length} ★ · ${s.d}</span></button>`
  }).join('')}</div>`

  const secs = TRAIL_SECS.map((s) => {
    const items = buckets[s.id] || []
    if (!items.length) return ''
    const done = items.filter(({ i }) => isPhaseDone(i)).length
    const isOpen = !!openSecs[s.id]
    const body = items
      .map(({ p, i }) => {
        const donePh = isPhaseDone(i)
        const open = isPhaseOpen(i)
        const best = getTrailBest(i)
        const bestTxt = best != null ? ` · melhor: ${best}%` : ''
        return `<button ${open ? '' : 'disabled'} class="trail-item" data-phase="${i}" style="${open ? '' : 'opacity:.5'}"><span class="num">${i + 1}</span><span style="font-size:1.35rem;min-width:32px;text-align:center">${donePh ? '⭐' : open ? p.e : '🔒'}</span><span><b>${p.t.replace(/^Hiragana:\s*|^Katakana:\s*/, '')}</b><br><small style="color:var(--mu)">${p.d}${bestTxt}</small></span></button>`
      })
      .join('')
    return `<div class="trail-sec${isOpen ? ' open' : ''}" data-sec="${s.id}" style="--sec:${s.color}"><button type="button" class="trail-sec-hd" data-trail-sec="${s.id}"><span style="font-size:1.4rem;color:var(--sec)">${s.e}</span><span><b>${s.t}</b><br><small style="color:var(--mu)">${done}/${items.length} concluídas · ${s.d}</small></span><span class="chev">▸</span></button><div class="trail-sec-bd">${body}</div></div>`
  }).join('')

  return `<div class="panel" style="text-align:left"><b>Trilha ${levelId.toUpperCase()}</b><p class="sub">${doneN}/${phases.length} fases ★ · caminho principal do N5 (${FURI.areas}). Em cada fase: estudar o conteúdo e depois fazer o exercício.</p>${cont}${home}${secs}</div>`
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
