/**
 * Animate stroke order using KanjiVG SVGs (kanji + hiragana + katakana).
 * Source: https://github.com/KanjiVG/kanjivg (CC BY-SA 3.0)
 */

const cache = new Map()

export function kvgCode(ch) {
  return ch.codePointAt(0).toString(16).padStart(5, '0')
}

export function kvgUrl(ch) {
  return `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${kvgCode(ch)}.svg`
}

async function fetchSvg(ch) {
  const key = kvgCode(ch)
  if (cache.has(key)) return cache.get(key)
  const res = await fetch(kvgUrl(ch))
  if (!res.ok) throw new Error('KanjiVG ' + res.status)
  const text = await res.text()
  cache.set(key, text)
  return text
}

function extractStrokePaths(svgText) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  const all = [...doc.querySelectorAll('path')]
  const numbered = all
    .filter((p) => {
      const id = p.getAttribute('id') || ''
      return /(?:^|:)[0-9a-f]+-s\d+$/i.test(id) || /-s\d+$/i.test(id)
    })
    .sort((a, b) => {
      const na = +(a.getAttribute('id').match(/-s(\d+)$/i) || [])[1] || 0
      const nb = +(b.getAttribute('id').match(/-s(\d+)$/i) || [])[1] || 0
      return na - nb
    })
  const use = numbered.length
    ? numbered
    : all.filter((p) => {
        const id = p.getAttribute('id') || ''
        return p.getAttribute('d') && !id.includes('StrokeNumbers') && !id.includes('kvg:StrokeNumbers')
      })
  return use.map((p) => p.getAttribute('d')).filter(Boolean)
}

/**
 * Render an animated stroke-order SVG into a host element.
 * @returns {Promise<boolean>} true if animation mounted
 */
export async function mountStrokeAnimation(host, ch, opts = {}) {
  if (!host || !ch) return false
  const size = opts.size || 200
  host.innerHTML = `<p class="sub">Carregando ordem dos traços…</p>`
  try {
    const svgText = await fetchSvg(ch)
    const ds = extractStrokePaths(svgText)
    if (!ds.length) {
      host.innerHTML = `<p class="sub">Sem dados de traço para ${ch}.</p>`
      return false
    }
    let s = `<svg viewBox="0 0 109 109" width="${size}" height="${size}" style="background:var(--bg);border:1px solid var(--bd);border-radius:12px">`
    s += `<path d="M54.5 0V109M0 54.5H109" stroke="var(--bd)" stroke-dasharray="3 3"/>`
    s += `<text x="54.5" y="88" font-size="72" text-anchor="middle" fill="var(--tx)" opacity=".08">${ch}</text>`
    ds.forEach((d, i) => {
      s += `<path d="${d}" fill="none" stroke="var(--tx)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;animation:dr .55s ${i * 0.7}s forwards"/>`
      s += `<text x="8" y="${14 + i * 10}" font-size="9" fill="var(--ac)" style="opacity:0;animation:fi .2s ${i * 0.7}s forwards">${i + 1}</text>`
    })
    s += `</svg><p class="sub" style="margin-top:6px">${ds.length} traços · KanjiVG</p>`
    host.innerHTML = s
    return true
  } catch (e) {
    host.innerHTML = `<p class="sub">Não foi possível carregar a animação de ${ch}. <a href="https://jisho.org/search/${encodeURIComponent(ch)}%20%23kanji" target="_blank" rel="noopener" style="color:var(--ac)">Ver no Jisho ↗</a></p>`
    return false
  }
}

/** Synchronous placeholder used while async load runs. */
export function strokeLoadingHtml(ch) {
  return `<div data-stroke-host="${ch}"><p class="sub">Carregando ordem dos traços de ${ch}…</p></div>`
}
