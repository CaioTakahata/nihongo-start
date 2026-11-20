/**
 * Lista itens choukai/dokkai cujo requires tem token fora do goi do curso + BASE.
 * Uso: node scripts/lint-requires.mjs
 */
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Carrega via dynamic import do bundle fonte (Vite não necessário — ESM puro)
const { N5_CHOUKAI } = await import(pathToFileURL(join(root, 'src/data/n5/choukai.js')).href)
const { N5_DOKKAI } = await import(pathToFileURL(join(root, 'src/data/n5/dokkai.js')).href)
const { BASE_LEXEMES } = await import(pathToFileURL(join(root, 'src/data/known-lexemes.js')).href)
const { LS } = await import(pathToFileURL(join(root, 'src/data/lessons-n5.js')).href)
const { PH } = await import(pathToFileURL(join(root, 'src/data/phases-n5.js')).href)

const goi = new Set(BASE_LEXEMES)
LS.forEach((l) => {
  if (!l?.v) return
  String(l.v)
    .split(';')
    .forEach((row) => {
      const jp = row.split('|')[0]?.trim()
      if (jp) goi.add(jp)
    })
})
PH.forEach((p) => (p.introduces || []).forEach((t) => goi.add(t)))

function report(name, items, getReq) {
  let missingTag = 0
  let outliers = 0
  for (const item of items) {
    const req = getReq(item)
    if (!req || !req.length) {
      missingTag++
      console.log(`[${name}] SEM requires:`, item)
      continue
    }
    const bad = req.filter((t) => !goi.has(t))
    if (bad.length) {
      outliers++
      console.log(`[${name}] requires fora do goi:`, bad.join(', '), '←', typeof item === 'string' ? item.slice(0, 40) : item.s || item.text?.slice(0, 40))
    }
  }
  console.log(`\n${name}: ${items.length} itens, ${missingTag} sem tag, ${outliers} com outlier\n`)
}

report('choukai', N5_CHOUKAI, (i) => i.requires)
report('dokkai', N5_DOKKAI, (i) => i.requires)
