import { H, R, Kt, KG, KKG, PH, LS, PQ, GQ } from '../../data/index.js'
import { knownLexemes } from '../../data/known-lexemes.js'
import {
  N5_PARTICLES,
  N5_SENTENCE_BUILDS,
  N5_WA_WORDS,
  N5_WA_PHRASES,
  N5_WA_BUILDS,
} from '../../data/n5/particles.js'
import { getKanjiList } from '../../data/kanji/index.js'
import { setKanjiLevel, currentKanji } from '../kanji-store.js'
import { say } from '../audio.js'
import { trailListView } from '../curriculum.js'
import { ruby } from '../furigana.js'
import { mountStrokeAnimation } from './stroke-anim.js'
import {
  addXp,
  clearResume,
  getResume,
  notifyXp,
  renderXpBar,
  saveResume,
  setTrailBest,
  xpOnce,
} from '../progress.js'
import { state, hooks, render, sh, uq } from '../state.js'
import { Q, exView, mkG, mkGs, mkPs, mkR, mkS, mkV } from './exercises.js'
import { kMode, kOpen } from './kanji.js'
import { kwOpen } from './writing.js'

const KR = {}
H.forEach((c, i) => (KR[c] = R[i]))
Kt.forEach((c, i) => (KR[c] = R[i]))
Object.assign(KR, {
  ガ: 'ga',
  ギ: 'gi',
  グ: 'gu',
  ゲ: 'ge',
  ゴ: 'go',
  ザ: 'za',
  ジ: 'ji',
  ズ: 'zu',
  ゼ: 'ze',
  ゾ: 'zo',
  ダ: 'da',
  デ: 'de',
  ド: 'do',
  バ: 'ba',
  ビ: 'bi',
  ブ: 'bu',
  ベ: 'be',
  ボ: 'bo',
  パ: 'pa',
  ピ: 'pi',
  プ: 'pu',
  ペ: 'pe',
  ポ: 'po',
})

/** Resolve kana pack for a trail phase (`kg` = hiragana, `kk` = katakana). */
export function kanaPackOf(P) {
  if (!P) return null
  if (P.kg != null) return { pack: KG, i: P.kg, label: 'Hiragana', key: 'kg' }
  if (P.kk != null) return { pack: KKG, i: P.kk, label: 'Katakana', key: 'kk' }
  return null
}

/** Questions for a kana-row phase (cumulative review of rows learned so far). */
export function kanaQ(g, pack = KG) {
  const from = g >= 10 ? g : 0
  const cum = pack.slice(from, g + 1).flatMap((x) => [...x.k])
  const parseW = (row) =>
    String(row.w || '')
      .split(';')
      .map((s) => s.split('|'))
      .filter((r) => r[0] && r[2])
  const W = pack.slice(from, g + 1).flatMap(parseW)
  const Wcur = parseW(pack[g])
  const meaningPool = uq([...W, ...Wcur].map((x) => x[2]))
  const wr = (k, pool) => sh(pool.filter((x) => x !== k)).slice(0, 3)
  const qa = (k) =>
    Q(
      k,
      KR[k],
      wr(
        KR[k],
        cum.map((c) => KR[c]),
      ),
      k + ' = ' + KR[k],
      k,
    )
  const qb = (k) => Q(KR[k], k, wr(k, cum), KR[k] + ' = ' + k)
  const qc = (k) => Q('🔊 Qual caractere você ouviu?', k, wr(k, cum), KR[k] + ' = ' + k, k)
  /** Palavra → significado (as mesmas da tela “Palavras”). */
  const qw = (w) =>
    Q(
      w[0],
      w[2],
      wr(w[2], meaningPool),
      w[0] + ' (' + w[1] + ') = ' + w[2],
      w[0],
    )
  /** Significado → palavra. */
  const qwRev = (w) =>
    Q(
      w[2],
      w[0],
      wr(
        w[0],
        W.map((x) => x[0]),
      ),
      w[0] + ' (' + w[1] + ') = ' + w[2],
      w[0],
    )
  /** Ouvir a palavra. */
  const qwListen = (w) =>
    Q(
      '🔊 Qual palavra você ouviu?',
      w[0],
      wr(
        w[0],
        W.map((x) => x[0]),
      ),
      w[0] + ' (' + w[1] + ') = ' + w[2],
      w[0],
    )
  const chars = [...pack[g].k]
  const wordQs = [
    ...Wcur.map(qw),
    ...Wcur.map(qwRev),
    ...sh(Wcur).slice(0, Math.min(3, Wcur.length)).map(qwListen),
  ]
  // Sempre aleatório: caracteres + palavras misturados a cada tentativa
  return sh([
    ...chars.map(qa),
    ...sh(cum).slice(0, Math.min(3, cum.length)).map(qb),
    ...sh(cum).slice(0, Math.min(3, cum.length)).map(qc),
    ...wordQs,
  ])
}

export function trQ(i) {
  const P = PH[i]
  const kana = kanaPackOf(P)
  if (kana) return kanaQ(kana.i, kana.pack)
  // Kanji lessons live at the end of the N5 pack (see lessons-n5.js).
  const KANJI0 = 36
  const KANJI1 = 39
  const known = knownLexemes(i)
  const G = {
    v: () => mkV(P.v[0], P.v[1], 0, 12),
    l: () => mkV(P.v[0], P.v[1], 1, 12),
    s: () => mkS(12, known),
    r: () => mkR(12, known),
    p: () => mkPs(P.p || [0, 14], known),
    g: () => mkGs(P.g),
    k: () => mkV(P.k?.[0] ?? KANJI0, P.k?.[1] ?? KANJI1, 0, 12),
  }
  const bag = {}
  return [...P.m]
    .map((c) => {
      if (!bag[c] || !bag[c].length) bag[c] = G[c]()
      return bag[c].shift()
    })
    .filter(Boolean)
}

/** Start exercises for phase i (skips the learn screen). */
export function trGo(i, fromQ = 0) {
  state.learnI = null
  const l = trQ(i)
  const start = Math.max(0, Math.min(fromQ, l.length - 1))
  state.ex = { mi: -1, tr: i, l, i: start, s: 0, w: [], a: false, c: -1 }
  state.tab = 'trail'
  saveResume({ tab: 'trail', phase: i, qIndex: start, kind: 'trail' })
  render()
  const f = state.ex.l[state.ex.i]
  if (f && f.s) say(f.s)
}

/** Kanji trail phases: learn strokes/readings before the quiz. */
export function isKanjiPhase(P) {
  if (!P) return false
  if (/^Kanji/i.test(P.t)) return true
  if (P.v && P.v[0] >= 36 && P.v[1] <= 39) return true
  return false
}

/** Any phase with study material opens learn before the quiz. */
export function needsLearn(P) {
  if (!P) return false
  if (kanaPackOf(P) || isKanjiPhase(P)) return true
  if (P.v || P.p || P.g) return true
  return false
}

/** Vocab rows for a phase: [{ jp, reading, pt }]. */
export function vocabLearnRows(P, limit = 48) {
  if (!P?.v) return { rows: [], total: 0 }
  const rows = []
  const seen = new Set()
  for (let li = P.v[0]; li < P.v[1]; li++) {
    const lesson = LS[li]
    if (!lesson?.v) continue
    for (const part of lesson.v.split(';')) {
      const [jp, reading, pt] = part.split('|')
      if (!jp || seen.has(jp)) continue
      seen.add(jp)
      rows.push({ jp, reading: reading || '', pt: pt || '' })
    }
  }
  const total = rows.length
  return { rows: rows.slice(0, limit), total }
}

/** Rows from lesson pack for a kanji phase: [{ c, reading, pt }]. */
export function kanjiLearnRows(P) {
  if (!P?.v) return []
  const rows = []
  const seen = new Set()
  for (let li = P.v[0]; li < P.v[1]; li++) {
    const lesson = LS[li]
    if (!lesson?.v) continue
    for (const part of lesson.v.split(';')) {
      const [jp, reading, pt] = part.split('|')
      if (!jp) continue
      const c = [...jp].find((ch) => /[\u4e00-\u9faf]/.test(ch)) || jp[0]
      if (seen.has(c)) continue
      seen.add(c)
      rows.push({ c, jp, reading: reading || '', pt: pt || '' })
    }
  }
  return rows
}

/** Open phase i: always show learn screen when there is study material. */
export function trStart(i) {
  const P = PH[i]
  if (needsLearn(P)) {
    state.learnI = i
    state.ex = null
    state.tab = 'trail'
    saveResume({ tab: 'trail', phase: i, learnI: i, kind: 'learn' })
    render()
    scrollTo(0, 0)
    return
  }
  trGo(i)
}

/** Resume saved trail position. */
export function trContinue() {
  const r = getResume()
  if (!r || r.kind === 'exercises') return
  if (r.kind === 'learn' && r.phase != null) {
    trStart(r.phase)
    return
  }
  if (r.phase != null) trGo(r.phase, r.qIndex || 0)
}

export function trSave() {
  const { ex } = state
  const i = ex.tr
  const pct = Math.round((100 * ex.s) / ex.l.length)
  ex.saved = true
  setTrailBest(i, pct)
  // Always grant score-based XP; first pass of a phase gets a big bonus.
  notifyXp(addXp(Math.max(5, Math.round(pct / 5))))
  if (pct >= 70) notifyXp(xpOnce('ph' + i, 60))
  if (pct === 100) notifyXp(xpOnce('phPerfect' + i, 40))
  clearResume()
  renderXpBar()
}
hooks.trSave = trSave

export function trWrite() {
  const { ex } = state
  const i = ex && ex.tr != null ? ex.tr : -1
  const kana = i >= 0 ? kanaPackOf(PH[i]) : null
  if (kana) {
    kwOpen(kana.i, 't', kana.key)
    return
  }
  setKanjiLevel('n5')
  const kn = getKanjiList('n5')
  kOpen(Math.floor(Math.random() * kn.length))
  kMode(1)
}

export function learnClose() {
  state.learnI = null
  state.sb = null
  render()
}

export function learnAll() {
  const { learnI } = state
  const P = PH[learnI]
  const kana = kanaPackOf(P)
  if (kana) {
    ;[...kana.pack[kana.i].k].forEach((k, i) => setTimeout(() => say(k, 0.5), i * 1300))
    return
  }
  if (isKanjiPhase(P)) {
    kanjiLearnRows(P).forEach((row, i) => setTimeout(() => say(row.c, 0.55), i * 1100))
    return
  }
  const { rows } = vocabLearnRows(P, 24)
  rows.forEach((row, i) => setTimeout(() => say(row.jp, 0.55), i * 1200))
}

/** Open writing practice for a kanji character from the learn screen. */
export function learnKanjiWrite(ch) {
  setKanjiLevel('n5')
  const list = currentKanji()
  let idx = list.findIndex((k) => k[0] === ch)
  if (idx < 0) idx = 0
  kOpen(idx)
  kMode(0)
}

export async function learnKanjiStroke(ch, hostId) {
  const host = document.getElementById(hostId)
  if (!host) return
  host.innerHTML = ''
  await mountStrokeAnimation(host, ch, { size: 160 })
}

export function learnKanjiView(learnI) {
  const P = PH[learnI]
  const rows = kanjiLearnRows(P)
  const title = P.t.replace(/^Kanji:\s*/i, '')
  const cards = rows
    .map((row, i) => {
      const host = `klearn-stroke-${i}`
      const reading = row.reading
        ? row.reading
            .split('・')
            .map((r) => r.trim())
            .filter(Boolean)
            .join(' · ')
        : ''
      const furi = reading.split(/[・·]/)[0]?.trim() || ''
      const charHtml = furi ? ruby(row.c, furi) : row.c
      return `<div class="klearn-card">
        <div class="klearn-char">${charHtml}</div>
        <div class="klearn-meta"><b>${row.pt || '—'}</b><small>${reading || ''}</small></div>
        <div class="klearn-actions">
          <button type="button" data-say="${encodeURIComponent(row.c)}">🔊</button>
          <button type="button" data-klearn-stroke="${encodeURIComponent(row.c)}" data-klearn-host="${host}">▶ Traços</button>
          <button type="button" data-klearn-write="${encodeURIComponent(row.c)}">✍ Escrever</button>
        </div>
        <div id="${host}" class="klearn-stroke"></div>
      </div>`
    })
    .join('')

  return `<div class="duo-lesson">
    <div class="duo-lesson-top">
      <button type="button" class="duo-x" onclick="learnClose()" aria-label="Voltar">✕</button>
      <div class="duo-bar"><i style="width:35%"></i></div>
    </div>
    <h2 style="margin:0;text-align:center">${ruby('漢字', 'かんじ')}: ${title}</h2>
    <p class="sub" style="text-align:center">Aprenda traços, leitura e significado. Depois vem o exercício.</p>
    <p style="text-align:center"><button type="button" onclick="learnAll()">🐢 Ouvir todos</button></p>
    <div class="klearn-grid">${cards || '<p class="sub">Nenhum kanji neste pacote.</p>'}</div>
    <div class="duo-footer"><button type="button" class="duo-cta" onclick="trGo(${learnI})">COMEÇAR EXERCÍCIO</button></div>
  </div>`
}

export function isJoshiPhase(P) {
  if (!P) return false
  return /助詞|Partícula|Frases:|Frases úteis|Montar frases/i.test(P.t)
}

const PARTICLE_CHARS = new Set(['は', 'が', 'を', 'に', 'で', 'と', 'も', 'か', 'の', 'へ', 'や', 'ね', 'よ'])

/**
 * Destaca só partículas gramaticais (no fim do bloco), não sílabas dentro da palavra.
 * Ex.: がっこうに → só に; わたしは → só は (não o が de がっこう).
 */
export function highlightParticles(text) {
  if (!text) return ''
  return String(text)
    .split(/(\s+|。|、|！|？|\.|!|\?)/)
    .map((token) => {
      if (!token || /^(\s+|。|、|！|？|\.|!|\?)$/.test(token)) return token
      if (PARTICLE_CHARS.has(token)) return `<span class="particle">${token}</span>`

      const chars = [...token]
      let cut = chars.length
      // Só tira partículas no FINAL do bloco (ex.: がっこうに, ですか, ねこが)
      while (cut > 1 && PARTICLE_CHARS.has(chars[cut - 1])) cut--
      if (cut === chars.length) return token

      const stem = chars.slice(0, cut).join('')
      const parts = chars
        .slice(cut)
        .map((ch) => `<span class="particle">${ch}</span>`)
        .join('')
      return stem + parts
    })
    .join('')
}

function isParticleToken(tok) {
  return PARTICLE_CHARS.has(tok) || (tok.length <= 2 && /^[はがをにでともかのへやねよ]+$/.test(tok))
}

function particleFocusOf(P) {
  if (/は e です|Montar frases com は|Frases úteis com は/i.test(P.t)) return 'は'
  if (/か \(perguntas\)/i.test(P.t)) return 'か'
  if (/が e は/i.test(P.t)) return 'が'
  if (/を・に・で/i.test(P.t)) return 'を'
  if (/の・と・も/i.test(P.t)) return 'の'
  return null
}

function shuffleCopy(arr) {
  return sh([...arr])
}

function buildsForLearnPhase() {
  const P = state.learnI != null ? PH[state.learnI] : null
  if (!P) return N5_WA_BUILDS
  const focus = particleFocusOf(P)
  if (focus === 'は' || /Montar frases com は|Frases úteis com は|は e です/i.test(P.t)) {
    return N5_WA_BUILDS
  }
  const filtered = N5_SENTENCE_BUILDS.filter((s) => !focus || String(s.focus).includes(focus))
  return filtered.length ? filtered : N5_SENTENCE_BUILDS
}

function sbInit(items) {
  const list = items?.length ? items : buildsForLearnPhase()
  state.sb = {
    items: list,
    i: 0,
    picked: [],
    pool: shuffleCopy(list[0].parts),
    ok: null,
  }
}

export function sbStart(items) {
  sbInit(items)
  render()
}

export function sbPick(i) {
  const sb = state.sb
  if (!sb || sb.done || sb.ok) return
  const tok = sb.pool[i]
  if (tok == null) return
  sb.pool.splice(i, 1)
  sb.picked.push(tok)
  if (sb.picked.length === sb.items[sb.i].parts.length) sbCheck()
  else render()
}

export function sbUndo() {
  const sb = state.sb
  if (!sb || sb.done || sb.ok || !sb.picked.length) return
  sb.pool.push(sb.picked.pop())
  render()
}

export function sbCheck() {
  const sb = state.sb
  if (!sb || sb.done) return
  const want = sb.items[sb.i].parts
  sb.ok = sb.picked.length === want.length && sb.picked.every((t, i) => t === want[i])
  if (sb.ok) say(sb.items[sb.i].full)
  render()
}

export function sbNext() {
  const sb = state.sb
  if (!sb || sb.done) return
  if (sb.i + 1 >= sb.items.length) {
    state.sb = { done: true }
    render()
    return
  }
  sb.i++
  sb.picked = []
  sb.pool = shuffleCopy(sb.items[sb.i].parts)
  sb.ok = null
  render()
}

export function sbReset() {
  const sb = state.sb
  if (!sb || sb.done) return
  sb.picked = []
  sb.pool = shuffleCopy(sb.items[sb.i].parts)
  sb.ok = null
  render()
}

function sentenceBuilderHtml() {
  const sb = state.sb
  if (sb?.done) {
    return `<p class="sb-ok">Você montou todas as frases desta etapa!</p>
      <p style="text-align:center;margin:12px 0">
        <button type="button" class="duo-cta" style="width:auto;padding:12px 20px" onclick="sbStart()">🧩 Montar de novo</button>
      </p>`
  }
  if (!sb) {
    return `<p style="text-align:center;margin:12px 0">
      <button type="button" class="duo-cta" style="width:auto;padding:12px 20px" onclick="sbStart()">🧩 Montar frases</button>
    </p>`
  }
  const cur = sb.items[sb.i]
  const picked = sb.picked.map((t) => `<span class="sent-chip${isParticleToken(t) ? ' is-particle' : ''}">${t}</span>`).join('')
  const pool = sb.pool
    .map(
      (t, i) =>
        `<button type="button" class="sent-chip${isParticleToken(t) ? ' is-particle' : ''}" data-sb-pick="${i}">${t}</button>`,
    )
    .join('')
  let result = ''
  if (sb.ok === true) {
    result = `<p class="sb-ok">Correto! ${highlightParticles(cur.full)} — ${cur.pt}</p>
      <p style="text-align:center"><button type="button" onclick="sbNext()">${sb.i + 1 >= sb.items.length ? 'Concluir montagem' : 'Próxima frase →'}</button></p>`
  } else if (sb.ok === false) {
    result = `<p class="sb-no">Quase. Ordem certa: ${highlightParticles(cur.full)}</p>
      <p style="text-align:center"><button type="button" onclick="sbReset()">Tentar de novo</button></p>`
  }
  return `<div class="sb-box">
    <div class="sent-goal">${sb.i + 1}/${sb.items.length} · ${cur.goal}</div>
    <div class="sb-slot">${picked || '<span class="sub">Toque nas peças abaixo</span>'}</div>
    <div class="sb-pool">${pool}</div>
    <p style="text-align:center;margin:8px 0 0"><button type="button" onclick="sbUndo()">↩ Desfazer</button> <button type="button" onclick="sbReset()">Limpar</button></p>
    ${result}
  </div>`
}

/** Tela de estudo: partículas + montar frases (depois do kana). */
export function learnParticlesView(learnI) {
  const P = PH[learnI]
  const focus = particleFocusOf(P)
  const isWaTrack = focus === 'は' || /Montar frases com は|Frases úteis com は/i.test(P.t)

  const particleList = isWaTrack
    ? N5_PARTICLES.filter((p) => p.jp === 'は' || ( /か/.test(P.t) && p.jp === 'か'))
    : focus
      ? N5_PARTICLES.filter((p) => focus === 'を' ? /[をにで]/.test(p.jp) : focus === 'の' ? /[のとも]/.test(p.jp) : p.jp === focus || (focus === 'が' && p.jp === 'は'))
      : N5_PARTICLES

  const cards = particleList
    .map(
      (p) => `<div class="part-card">
      <div class="part-jp"><b class="particle">${p.jp}</b><small>${p.reading}</small></div>
      <div class="part-meta"><strong>${p.pt}</strong><span>${p.tip}</span></div>
      <button type="button" class="part-ex" data-say="${encodeURIComponent(p.ex)}">${highlightParticles(p.ex)} 🔊</button>
      <small class="part-ex-pt">${p.exPt}</small>
    </div>`,
    )
    .join('')

  const wordBank = isWaTrack
    ? `<h3 style="margin:16px 0 8px;text-align:center">Palavras desta etapa</h3>
      <p class="sub" style="text-align:center">Só estas — nada de palavra nova escondida.</p>
      <div class="vlearn-grid">${N5_WA_WORDS.map(
        (w) => `<div class="vlearn-card">
          <button type="button" class="vlearn-say" data-say="${encodeURIComponent(w.jp)}"><b>${isParticleToken(w.jp) ? `<span class="particle">${w.jp}</span>` : w.jp}</b> 🔊</button>
          <span class="vlearn-pt">${w.pt}</span>
          <small class="vlearn-romaji">${w.r}</small>
        </div>`,
      ).join('')}</div>`
    : ''

  const phraseList = isWaTrack
    ? `<h3 style="margin:18px 0 8px;text-align:center">Frases para praticar</h3>
      <div class="sent-list">${N5_WA_PHRASES.map(
        (s) => `<div class="sent-build">
          <button type="button" class="sent-full" data-say="${encodeURIComponent(s.full)}">${highlightParticles(s.full)} 🔊</button>
          <small>${s.pt}</small>
        </div>`,
      ).join('')}</div>`
    : ''

  const buildsSrc = isWaTrack
    ? N5_WA_BUILDS
    : N5_SENTENCE_BUILDS.filter((s) => !focus || String(s.focus).includes(focus))
  const showBuilder = /Montar frases/i.test(P.t) || /は e です/i.test(P.t)

  // Auto-start builder on fases de montagem (não reinicia se já concluiu)
  if (/Montar frases/i.test(P.t) && !state.sb) sbInit(buildsSrc)

  const builds = !showBuilder
    ? buildsSrc
        .map(
          (s) => `<div class="sent-build">
      <div class="sent-goal">${s.goal} · foco <b class="particle">${s.focus}</b></div>
      <div class="sent-parts">${s.parts
        .map((x) => `<span class="sent-chip${isParticleToken(x) ? ' is-particle' : ''}">${x}</span>`)
        .join('<span class="sent-plus">+</span>')}</div>
      <button type="button" class="sent-full" data-say="${encodeURIComponent(s.full)}">${highlightParticles(s.full)} 🔊</button>
      <small>${s.pt}</small>
    </div>`,
        )
        .join('')
    : ''

  return `<div class="duo-lesson">
    <div class="duo-lesson-top">
      <button type="button" class="duo-x" onclick="learnClose()" aria-label="Voltar">✕</button>
      <div class="duo-bar"><i style="width:28%"></i></div>
    </div>
    <h2 style="margin:0;text-align:center">${P.e || ''} ${P.t}</h2>
    <p class="sub" style="text-align:center">${
      isWaTrack
        ? 'Depois do kana: use só palavras que você já viu. Monte frases com <span class="particle">は</span>.'
        : 'Estude a partícula e monte frases. Depois vem o exercício.'
    }</p>
    ${cards ? `<h3 style="margin:14px 0 8px;text-align:center">${ruby('助詞', 'じょし')}</h3><div class="part-grid">${cards}</div>` : ''}
    ${wordBank}
    ${phraseList}
    ${showBuilder ? `<h3 style="margin:18px 0 8px;text-align:center">Montar a frase</h3>${sentenceBuilderHtml()}` : ''}
    ${builds ? `<h3 style="margin:18px 0 8px;text-align:center">Exemplos</h3><div class="sent-list">${builds}</div>` : ''}
    <div class="duo-footer"><button type="button" class="duo-cta" onclick="trGo(${learnI})">COMEÇAR EXERCÍCIO</button></div>
  </div>`
}

/** Study notes + vocab/grammar cards before the quiz (goi, bunpou, etc.). */
export function learnContentView(learnI) {
  const P = PH[learnI]
  const { rows, total } = vocabLearnRows(P, 48)
  const lessons = P.v
    ? LS.slice(P.v[0], P.v[1]).filter((l) => l && (l.b || l.t))
    : []
  const notes = lessons
    .slice(0, 4)
    .map((l) => {
      const body = l.b ? `<div class="learn-note-body">${l.b}</div>` : ''
      return `<div class="learn-note"><b>${l.t}</b>${body}</div>`
    })
    .join('')

  const moreNote =
    total > rows.length
      ? `<p class="sub">Mostrando ${rows.length} de ${total} itens — o exercício usa o pacote completo.</p>`
      : ''

  const vocabCards = rows
    .map((row) => {
      return `<div class="vlearn-card">
        <button type="button" class="vlearn-say" data-say="${encodeURIComponent(row.jp)}"><b>${row.jp}</b> 🔊</button>
        <span class="vlearn-pt">${row.pt || '—'}</span>
        ${row.reading ? `<small class="vlearn-romaji">${row.reading}</small>` : ''}
      </div>`
    })
    .join('')

  let grammarBlock = ''
  if (P.p) {
    const items = PQ.slice(P.p[0], P.p[1])
    grammarBlock += `<h3 style="margin:16px 0 6px">${ruby('助詞', 'じょし')} Partículas</h3><div class="glearn-list">`
    grammarBlock += items
      .map((s) => {
        const [q, a, e] = s.split('|')
        return `<div class="glearn-card"><div class="glearn-q">${q.replace('＿', `<b class="glearn-blank">${a}</b>`)}</div><small>${e || ''}</small></div>`
      })
      .join('')
    grammarBlock += '</div>'
  }
  if (P.g) {
    const items = GQ.slice(P.g[0], P.g[1])
    grammarBlock += `<h3 style="margin:16px 0 6px">${ruby('文法', 'ぶんぽう')} Pontos</h3><div class="glearn-list">`
    grammarBlock += items
      .map((s) => {
        const [q, a, , e] = s.split('|')
        return `<div class="glearn-card"><div class="glearn-q">${q}</div><b>${a}</b>${e ? `<small>${e}</small>` : ''}</div>`
      })
      .join('')
    grammarBlock += '</div>'
  }

  const hasVocab = rows.length > 0
  const empty =
    !notes && !hasVocab && !grammarBlock
      ? '<p class="sub">Revise mentalmente o que já estudou e siga para o exercício.</p>'
      : ''

  return `<div class="duo-lesson">
    <div class="duo-lesson-top">
      <button type="button" class="duo-x" onclick="learnClose()" aria-label="Voltar">✕</button>
      <div class="duo-bar"><i style="width:30%"></i></div>
    </div>
    <h2 style="margin:0;text-align:center">${P.e || ''} ${P.t}</h2>
    <p class="sub" style="text-align:center">Estude primeiro. Depois faça o exercício.</p>
    ${notes}
    ${hasVocab ? `<h3 style="margin:12px 0 6px;text-align:center">${ruby('語彙', 'ごい')}</h3>
    <p style="text-align:center"><button type="button" onclick="learnAll()">🐢 Ouvir</button></p>
    ${moreNote}
    <div class="vlearn-grid">${vocabCards}</div>` : ''}
    ${grammarBlock}
    ${empty}
    <div class="duo-footer"><button type="button" class="duo-cta" onclick="trGo(${learnI})">COMEÇAR EXERCÍCIO</button></div>
  </div>`
}

export function learnView() {
  const { learnI } = state
  const P = PH[learnI]
  if (isKanjiPhase(P)) return learnKanjiView(learnI)
  if (isJoshiPhase(P)) return learnParticlesView(learnI)
  const kana = kanaPackOf(P)
  if (kana) {
    const G = kana.pack[kana.i]
    const W = G.w.split(';').map((s) => s.split('|'))
    const cols = Math.min(5, G.k.length)
    return (
      `<div class="duo-lesson"><div class="duo-lesson-top"><button type="button" class="duo-x" onclick="learnClose()">✕</button><div class="duo-bar"><i style="width:25%"></i></div></div><h2 style="margin:0;text-align:center">${kana.label}: ${G.t}</h2><p class="sub" style="text-align:center">Ouça, repita e treine a escrita. Depois vem o exercício.</p><div class="grid" style="grid-template-columns:repeat(${cols},1fr)">` +
      [...G.k]
        .map(
          (k) =>
            `<button class="cell" data-say="${encodeURIComponent(k)}"><b>${k}</b><span>${KR[k] || ''}</span></button>`,
        )
        .join('') +
      `</div><div class="grid" style="grid-template-columns:repeat(${cols},1fr);margin-bottom:8px">` +
      [...G.k]
        .map(
          (k) =>
            `<button class="cell" data-kana-stroke="${encodeURIComponent(k)}"><b>✍</b><span>${k}</span></button>`,
        )
        .join('') +
      `</div><p style="text-align:center"><button onclick="learnAll()">🐢 Ouvir</button> <button onclick="kwOpen(${kana.i},'p','${kana.key}')">✍ Escrever</button> <button onclick="kwOpen(${kana.i},'t','${kana.key}')">📝 Teste</button></p><h3 style="margin:10px 0 4px;text-align:center">Palavras</h3>` +
      W.map(
        (w) =>
          `<p style="margin:4px 0;text-align:center"><button data-say="${encodeURIComponent(w[0])}">${w[0]} 🔊</button> ${w[1]} — ${w[2]}</p>`,
      ).join('') +
      `<div class="duo-footer"><button type="button" class="duo-cta" onclick="trGo(${learnI})">COMEÇAR EXERCÍCIO</button></div></div>`
    )
  }
  return learnContentView(learnI)
}

export function trResult() {
  const { ex } = state
  const i = ex.tr
  const pct = Math.round((100 * ex.s) / ex.l.length)
  const ok = pct >= 70
  return (
    `<div class="duo-lesson">
      <div class="duo-lesson-top"><button type="button" class="duo-x" onclick="exQuit()">✕</button><div class="duo-bar"><i style="width:100%"></i></div></div>
      <div class="duo-prompt">
        <div style="font-size:3rem">${ok ? '⭐' : '💪'}</div>
        <h2 style="margin:0">${ok ? 'Lição concluída!' : 'Quase lá'}</h2>
        <p class="sub">${ex.s}/${ex.l.length} · ${pct}%${ok ? '' : ' · precisa 70% para ★'}</p>
      </div>
      <div style="text-align:left">${ex.w.length ? '<b>Para revisar</b>' : ''}` +
    ex.w
      .map((q) => `<p>${q.q.replace(/<[^>]+>/g, ' ')} → <b>${q.a}</b><br><small>${q.e}</small></p>`)
      .join('') +
    `</div>
      <div class="duo-footer">
        ${ok && i + 1 < PH.length ? `<button type="button" class="duo-cta" onclick="trStart(${i + 1})">PRÓXIMA LIÇÃO</button>` : `<button type="button" class="duo-cta" onclick="trStart(${i})">REFAZER</button>`}
        <p style="text-align:center;margin:10px 0 0"><button type="button" onclick="trWrite()">✍ Escrita</button> <button type="button" onclick="exQuit()">Trilha</button></p>
      </div>
    </div>`
  )
}

export function trailView() {
  const { ex, learnI } = state
  if (learnI != null && !ex) return learnView()
  if (ex && ex.tr != null) return ex.i >= ex.l.length ? trResult() : exView()
  return trailListView(state.levelId)
}
