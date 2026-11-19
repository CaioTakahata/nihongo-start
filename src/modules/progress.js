const KEYS = { lessons: 'nh', xp: 'nhxp', speed: 'nhspd' }

const TITLES = ['初心者 Iniciante', '見習い Aprendiz', '学生 Estudante', '勉強家 Dedicado', '達人 Veterano', 'N5 Mestre']

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null || raw === '') return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode */
  }
}

/** @type {{ xp: number, once: string[], tr: Record<string, number>, resume: object|null }} */
let state = { xp: 0, once: [], tr: {}, resume: null }

export function loadProgress() {
  const saved = readJson(KEYS.xp, {})
  state = {
    xp: Number(saved.xp) || 0,
    once: Array.isArray(saved.once) ? saved.once : [],
    tr: saved.tr && typeof saved.tr === 'object' ? { ...saved.tr } : {},
    resume: saved.resume && typeof saved.resume === 'object' ? { ...saved.resume } : null,
  }
  return state
}

export function getProgress() {
  return state
}

function persistXp() {
  writeJson(KEYS.xp, state)
}

export function getDoneLessons() {
  const dn = readJson(KEYS.lessons, [])
  return Array.isArray(dn) ? dn : []
}

export function setDoneLessons(ids) {
  writeJson(KEYS.lessons, ids)
}

export function markLessonDone(i) {
  const dn = getDoneLessons()
  if (!dn.includes(i)) dn.push(i)
  setDoneLessons(dn)
  return dn
}

export function getSpeed() {
  const v = Number(localStorage.getItem(KEYS.speed))
  return Number.isFinite(v) && v > 0 ? v : 1
}

export function setSpeed(v) {
  localStorage.setItem(KEYS.speed, String(v))
}

export function levelFromXp(xp) {
  let x = xp
  let l = 1
  let n = 100
  while (x >= n) {
    x -= n
    l++
    n = 100 + 50 * (l - 1)
  }
  return [l, x, n]
}

export function titleForLevel(l) {
  return TITLES[Math.min(5, Math.floor((l - 1) / 2))]
}

export function addXp(n) {
  const before = levelFromXp(state.xp)[0]
  state.xp += n
  persistXp()
  const after = levelFromXp(state.xp)[0]
  return { gained: n, leveledUp: after > before, level: after, xp: state.xp }
}

export function xpOnce(key, n) {
  if (state.once.includes(key)) return null
  state.once.push(key)
  return addXp(n)
}

export function getTrailBest(i) {
  return state.tr[i] ?? null
}

export function setTrailBest(i, pct) {
  state.tr[i] = Math.max(state.tr[i] || 0, pct)
  persistXp()
  return state.tr[i]
}

/** Temporary: while the trail is edited often, keep every phase open so people are not locked out after resets. Set false to restore 70% unlock. */
export const UNLOCK_ALL_PHASES = true

export function isPhaseOpen(i) {
  if (UNLOCK_ALL_PHASES) return true
  if (i === 0) return true
  return (state.tr[i - 1] || 0) >= 70
}

export function isPhaseDone(i) {
  return (state.tr[i] || 0) >= 70
}

/** Where the learner left off (trail phase, question index, course lesson, tab). */
export function getResume() {
  return state.resume
}

export function saveResume( partial ) {
  state.resume = {
    ...(state.resume || {}),
    ...partial,
    updated: Date.now(),
  }
  persistXp()
  return state.resume
}

export function clearResume() {
  state.resume = null
  persistXp()
}

/** First incomplete open phase, or null if all done. */
export function nextTrailPhase(total) {
  for (let i = 0; i < total; i++) {
    if (isPhaseOpen(i) && !isPhaseDone(i)) return i
  }
  return null
}

/** Ensure XP bar exists above nav and reflects current state. */
export function renderXpBar() {
  let b = document.querySelector('#xpb')
  if (!b) {
    b = document.createElement('div')
    b.id = 'xpb'
    b.style.cssText =
      'background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:8px 12px;margin-bottom:12px'
    const view = document.querySelector('#view')
    if (view) view.before(b)
    else document.querySelector('main')?.prepend(b)
  }
  const [l, r, n] = levelFromXp(state.xp)
  b.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:.9rem"><b>Nível ${l} · ${titleForLevel(l)}</b><span style="color:var(--mu)">${state.xp} XP</span></div><div style="height:8px;background:var(--bd);border-radius:6px;margin-top:6px;overflow:hidden"><div style="height:100%;width:${(r / n) * 100}%;background:var(--ac);transition:width .4s"></div></div><div style="font-size:.75rem;color:var(--mu);margin-top:2px">${r}/${n} para o próximo nível</div>`
}

export function toast(t) {
  const e = document.createElement('div')
  e.textContent = t
  e.style.cssText =
    'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(24px + env(safe-area-inset-bottom,0px));background:var(--ac);color:#fff;padding:8px 16px;border-radius:20px;z-index:99;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,.3)'
  document.body.appendChild(e)
  setTimeout(() => e.remove(), 1700)
}

export function notifyXp(result) {
  if (!result) return
  toast(result.leveledUp ? `🎉 Nível ${result.level}! +${result.gained} XP` : `+${result.gained} XP`)
  renderXpBar()
}
