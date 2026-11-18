import { getSpeed, setSpeed } from './progress.js'

let rate = getSpeed()

export function getAudioRate() {
  return rate
}

export function setAudioRate(v) {
  rate = Number(v) || 1
  setSpeed(rate)
}

export function say(t, r) {
  try {
    const u = new SpeechSynthesisUtterance(t)
    u.lang = 'ja-JP'
    u.rate = r || rate
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  } catch {
    /* TTS unavailable */
  }
}

/** Mount speed select next to #lang. */
export function mountSpeedControl() {
  if (document.querySelector('#spd')) return
  const sp = document.createElement('select')
  sp.id = 'spd'
  sp.setAttribute('aria-label', 'Velocidade do áudio')
  sp.innerHTML =
    "<option value='1'>🔊 Normal</option><option value='0.7'>🐢 Lento</option><option value='0.5'>🐌 Muito lento</option>"
  sp.value = String(rate)
  sp.onchange = () => {
    setAudioRate(+sp.value)
    say('こんにちは')
  }
  const lg = document.querySelector('#lang')
  if (!lg) return
  const w = document.createElement('div')
  w.style.cssText = 'display:flex;gap:6px'
  lg.before(w)
  w.append(sp, lg)
}
