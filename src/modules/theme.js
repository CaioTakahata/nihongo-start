/** Multi-color themes for Nihongo Start. */

export const THEMES = [
  {
    id: 'dark',
    label: 'Escuro',
    vars: {
      '--bg': '#17161a',
      '--card': '#222126',
      '--tx': '#f1eee8',
      '--mu': '#a49f96',
      '--ac': '#ff6b5e',
      '--bd': '#37353c',
      '--ok': '#7bd88f',
      '--no': '#ff8a80',
    },
  },
  {
    id: 'light',
    label: 'Claro',
    vars: {
      '--bg': '#f7f4ef',
      '--card': '#ffffff',
      '--tx': '#1e1c1a',
      '--mu': '#6a6560',
      '--ac': '#c8372d',
      '--bd': '#e4ddd3',
      '--ok': '#2e7d32',
      '--no': '#c62828',
    },
  },
  {
    id: 'matcha',
    label: 'Matcha',
    vars: {
      '--bg': '#141a14',
      '--card': '#1e281e',
      '--tx': '#e8f0e6',
      '--mu': '#9aaf96',
      '--ac': '#7cb87a',
      '--bd': '#2f3d2f',
      '--ok': '#9ad49a',
      '--no': '#e09090',
    },
  },
  {
    id: 'ocean',
    label: 'Oceano',
    vars: {
      '--bg': '#0f171c',
      '--card': '#18242c',
      '--tx': '#e6eef3',
      '--mu': '#8fa4b0',
      '--ac': '#3db8d9',
      '--bd': '#2a3a44',
      '--ok': '#6dcea0',
      '--no': '#f08080',
    },
  },
  {
    id: 'ume',
    label: 'Ume',
    vars: {
      '--bg': '#1a1216',
      '--card': '#2a1c22',
      '--tx': '#f6e8ee',
      '--mu': '#b89aa6',
      '--ac': '#e86a9a',
      '--bd': '#3d2a33',
      '--ok': '#8fd4a8',
      '--no': '#ff9a9a',
    },
  },
  {
    id: 'ink',
    label: 'Sumi',
    vars: {
      '--bg': '#0e0e10',
      '--card': '#1a1a1e',
      '--tx': '#f0ece4',
      '--mu': '#9a958c',
      '--ac': '#d4a84b',
      '--bd': '#2c2c32',
      '--ok': '#8fbf7a',
      '--no': '#e07a70',
    },
  },
  {
    id: 'sunset',
    label: 'Pôr do sol',
    vars: {
      '--bg': '#1a1410',
      '--card': '#2a2018',
      '--tx': '#f5ebe0',
      '--mu': '#b0a090',
      '--ac': '#f08a4b',
      '--bd': '#3d3228',
      '--ok': '#90c878',
      '--no': '#e87878',
    },
  },
]

const KEY = 'nhtheme'

export function getThemeId() {
  try {
    return localStorage.getItem(KEY) || 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(id) {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0]
  const root = document.documentElement
  root.setAttribute('data-theme', theme.id)
  for (const [k, v] of Object.entries(theme.vars)) {
    root.style.setProperty(k, v)
  }
  try {
    localStorage.setItem(KEY, theme.id)
  } catch {
    /* ignore */
  }
  return theme.id
}

export function themePickerHtml() {
  const cur = getThemeId()
  return `<div class="theme-picker"><div class="theme-label">Tema</div><div class="theme-dots">${THEMES.map(
    (t) =>
      `<button type="button" class="theme-dot${t.id === cur ? ' on' : ''}" data-theme-pick="${t.id}" title="${t.label}" style="--swatch:${t.vars['--ac']};background:${t.vars['--card']};border-color:${t.vars['--bd']}" aria-label="${t.label}"></button>`,
  ).join('')}</div></div>`
}
