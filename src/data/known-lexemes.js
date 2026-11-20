/**
 * Léxico conhecido na trilha N5.
 *
 * Tokens: strings japonesas canônicas (ex. 「たべます」, 「みず」, 「は」).
 * knownLexemes(i) = BASE ∪ introduces[0..i] ∪ goi das fatias v das fases 0..i
 */
import { PH } from './phases-n5.js'
import { LS } from './lessons-n5.js'
import { N5_WA_WORDS } from './n5/particles.js'

/** Base após kana: só apresentação は + partículas gramaticais. */
export const BASE_LEXEMES = [
  ...N5_WA_WORDS.map((w) => w.jp),
  'が',
  'を',
  'に',
  'で',
  'の',
  'と',
  'も',
  'へ',
  'ね',
  'よ',
  'ます',
  'ません',
  'ました',
  'ください',
]

const cache = new Map()

function addLessonVocab(set, a, b) {
  if (a == null || b == null) return
  LS.slice(a, b).forEach((l) => {
    if (!l?.v) return
    String(l.v)
      .split(';')
      .forEach((row) => {
        const jp = row.split('|')[0]?.trim()
        if (jp) set.add(jp)
      })
  })
}

/** @param {number} phaseIndex */
export function knownLexemes(phaseIndex) {
  const i = Math.max(0, Math.min(phaseIndex | 0, PH.length - 1))
  if (cache.has(i)) return cache.get(i)
  const set = new Set(BASE_LEXEMES)
  for (let p = 0; p <= i; p++) {
    const P = PH[p]
    if (!P) continue
    if (Array.isArray(P.introduces)) P.introduces.forEach((t) => t && set.add(String(t)))
    if (P.v) addLessonVocab(set, P.v[0], P.v[1])
  }
  cache.set(i, set)
  return set
}

export function clearKnownLexemesCache() {
  cache.clear()
}

/** @param {string[]|undefined} requires @param {Set<string>} known */
export function requiresSatisfied(requires, known) {
  if (!requires || !requires.length) return false
  return requires.every((t) => known.has(t))
}

/**
 * @template T
 * @param {T[]} eligible
 * @param {number} n
 * @param {(arr: T[]) => T[]} shuffle
 */
export function pickWithRepeat(eligible, n, shuffle) {
  if (!eligible.length || n <= 0) return []
  const out = []
  let pool = shuffle([...eligible])
  while (out.length < n) {
    if (!pool.length) pool = shuffle([...eligible])
    out.push(pool.shift())
  }
  return out
}
