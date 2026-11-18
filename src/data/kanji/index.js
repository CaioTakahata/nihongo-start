/** Kanji catalogs by JLPT level (generated). */
import { KANJI_N5 } from './n5.js'
import { KANJI_N4 } from './n4.js'
import { KANJI_N3 } from './n3.js'
import { KANJI_N2 } from './n2.js'
import { KANJI_N1 } from './n1.js'

export const KANJI_BY_LEVEL = {
  n5: KANJI_N5,
  n4: KANJI_N4,
  n3: KANJI_N3,
  n2: KANJI_N2,
  n1: KANJI_N1,
}

export const KANJI_LEVEL_IDS = ['n5', 'n4', 'n3', 'n2', 'n1']

/** Convert catalog row to legacy tuple shape used by the UI. */
export function toLegacyTuple(row) {
  const t = [row.c, row.pt, row.en, row.es, row.on, row.kun]
  t.cat = 0
  t.strokes = row.strokes
  t.level = row.level
  return t
}

export function getKanjiList(levelId = 'n5') {
  return (KANJI_BY_LEVEL[levelId] || []).map(toLegacyTuple)
}
