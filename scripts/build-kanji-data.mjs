/**
 * Build per-level kanji modules from OpenJLPT + existing PT/ES N5 glosses.
 * Run: node scripts/build-kanji-data.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, 'src', 'data', 'kanji')
fs.mkdirSync(outDir, { recursive: true })

const legacyPath = path.join(root, 'src', 'data', 'kanji-n5.js')
const legacy = fs.readFileSync(legacyPath, 'utf8')
const ptMap = {}
for (const m of legacy.matchAll(/\["([^"]+)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"\]/g)) {
  ptMap[m[1]] = { pt: m[2], en: m[3], es: m[4], on: m[5], kun: m[6] }
}

function cleanReading(arr) {
  return (arr || [])
    .map((s) => String(s).replace(/[-.]/g, ''))
    .filter(Boolean)
    .join('・') || '—'
}

function rowFromOpen(item, level) {
  const ch = item.character
  const meanings = (item.meanings || []).join(', ')
  const legacyG = ptMap[ch]
  const pt = legacyG?.pt || meanings
  const en = legacyG?.en || meanings
  const es = legacyG?.es || meanings
  const on = legacyG?.on || cleanReading(item.onyomi)
  const kun = legacyG?.kun || cleanReading(item.kunyomi)
  return {
    c: ch,
    pt,
    en,
    es,
    on,
    kun,
    strokes: item.strokes || 0,
    level: level.toLowerCase(),
  }
}

const levels = ['n5', 'n4', 'n3', 'n2', 'n1']
const counts = {}

for (const lv of levels) {
  const raw = JSON.parse(fs.readFileSync(path.join(root, 'scripts', `_${lv}.json`), 'utf8'))
  const rows = raw.map((item) => rowFromOpen(item, lv))
  // Keep any legacy-only N5 kanji missing from OpenJLPT
  if (lv === 'n5') {
    const have = new Set(rows.map((r) => r.c))
    for (const [ch, g] of Object.entries(ptMap)) {
      if (!have.has(ch)) {
        rows.push({ c: ch, pt: g.pt, en: g.en, es: g.es, on: g.on, kun: g.kun, strokes: 0, level: 'n5' })
      }
    }
  }
  counts[lv] = rows.length
  const body = `/** Auto-generated from OpenJLPT — do not edit by hand. */\nexport const KANJI_${lv.toUpperCase()} = ${JSON.stringify(rows)};\n`
  fs.writeFileSync(path.join(outDir, `${lv}.js`), body)
}

const index = `/** Kanji catalogs by JLPT level (generated). */
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
`
fs.writeFileSync(path.join(outDir, 'index.js'), index)
console.log('Wrote kanji levels:', counts)
