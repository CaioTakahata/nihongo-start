import { getKanjiList, KANJI_LEVEL_IDS, KANJI_BY_LEVEL } from '../data/kanji/index.js'
import { LI } from '../data/kanji-n5.js'
import { state } from './state.js'

export { LI, KANJI_LEVEL_IDS }

/** Active kanji list for the selected JLPT level in the Kanji tab. */
export function currentKanji() {
  const id = state.kanjiLevel || 'n5'
  return getKanjiList(id)
}

export function kanjiLevelCounts() {
  const o = {}
  for (const id of KANJI_LEVEL_IDS) o[id] = (KANJI_BY_LEVEL[id] || []).length
  return o
}

export function setKanjiLevel(id) {
  if (!KANJI_LEVEL_IDS.includes(id)) return
  state.kanjiLevel = id
  state.ki = 0
  state.kcat = -1
}
