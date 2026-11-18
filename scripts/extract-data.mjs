import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const html = fs.readFileSync(
  path.join(root, 'legacy/Nihongo Start – Hiragana, Katakana, Kanji.html'),
  'utf8',
);
const m = html.match(/<script>\n([\s\S]*)\n<\/script>/);
if (!m) throw new Error('no script');
let script = m[1];
script = script.replace(/\{const sp=document[\s\S]*?w\.append\(sp,lg\)\}/, '');
script = script.replace(/\nrender\(\);\s*$/, '');
script = script.replace(/\n\$\("#lang"\)[\s\S]*$/, '');

const el = () => ({
  textContent: '',
  innerHTML: '',
  style: {},
  classList: { toggle: () => {}, add: () => {} },
  setAttribute: () => {},
  getAttribute: () => null,
  setPointerCapture: () => {},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  before: () => {},
  appendChild: () => {},
  append: () => {},
  remove: () => {},
  onclick: null,
  onchange: null,
  onpointerdown: null,
  onpointermove: null,
  onpointerup: null,
  onpointerleave: null,
  disabled: false,
  value: '1',
});

const sandbox = { globalThis: null };
sandbox.globalThis = sandbox;
Object.assign(sandbox, {
  console,
  document: {
    querySelector: () => el(),
    getElementById: () => null,
    createElement: () => el(),
    body: { appendChild: () => {} },
    documentElement: { lang: 'pt' },
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  speechSynthesis: { cancel: () => {}, speak: () => {} },
  SpeechSynthesisUtterance: function Utterance() {},
  Math,
  JSON,
  Object,
  Array,
  String,
  Number,
  encodeURIComponent,
  setTimeout: () => 0,
  scrollTo: () => {},
});

vm.createContext(sandbox);
const tail = `;globalThis.__data__ = { T, CL, H, R, Kt, K, LI, CATS, LS, ST, SC, KG, PH, PQ, GQ, LQ, P1, P2, P3, P4, P5, RQ };`;
vm.runInContext(script + tail, sandbox);

const {
  T,
  CL,
  H,
  R,
  Kt,
  K,
  LI,
  CATS,
  LS,
  ST,
  SC,
  KG,
  PH,
  PQ,
  GQ,
  LQ,
  P1,
  P2,
  P3,
  P4,
  P5,
  RQ,
} = sandbox.__data__;

const outDir = path.join(root, 'src/data');
fs.mkdirSync(outDir, { recursive: true });

const ser = (v) => JSON.stringify(v, null, 2);

fs.writeFileSync(path.join(outDir, 'i18n.js'), `export const T = ${ser(T)};\n\nexport const CL = ${ser(CL)};\n`);
fs.writeFileSync(
  path.join(outDir, 'kana.js'),
  `export const H = ${ser(H)};\n\nexport const R = ${ser(R)};\n\nexport const Kt = ${ser(Kt)};\n\nexport const KG = ${ser(KG)};\n`,
);
const kLines = K.map((k) => `  Object.assign(${JSON.stringify(k.slice(0, 6))}, { cat: ${k.cat} })`);
fs.writeFileSync(
  path.join(outDir, 'kanji-n5.js'),
  `export const K = [\n${kLines.join(',\n')}\n];\n\nexport const CATS = ${ser(CATS)};\n\nexport const LI = ${ser(LI)};\n`,
);
fs.writeFileSync(
  path.join(outDir, 'strokes.js'),
  `export const ST = ${ser(ST)};\n\nexport const SC = ${ser(SC)};\n`,
);
fs.writeFileSync(path.join(outDir, 'lessons-n5.js'), `export const LS = ${ser(LS)};\n`);
fs.writeFileSync(
  path.join(outDir, 'quiz-banks.js'),
  `export const PQ = ${ser(PQ)};\n\nexport const GQ = ${ser(GQ)};\n\nexport const LQ = ${ser(LQ)};\n\nexport const P1 = ${JSON.stringify(P1)};\nexport const P2 = ${JSON.stringify(P2)};\nexport const P3 = ${JSON.stringify(P3)};\nexport const P4 = ${JSON.stringify(P4)};\nexport const P5 = ${JSON.stringify(P5)};\n\nexport const RQ = ${ser(RQ)};\n`,
);
fs.writeFileSync(path.join(outDir, 'phases-n5.js'), `export const PH = ${ser(PH)};\n`);

const LEVELS = [
  { id: 'n5', label: { pt: 'N5', en: 'N5', es: 'N5' }, status: 'active' },
  { id: 'n4', label: { pt: 'N4', en: 'N4', es: 'N4' }, status: 'soon' },
  { id: 'n3', label: { pt: 'N3', en: 'N3', es: 'N3' }, status: 'soon' },
  { id: 'n2', label: { pt: 'N2', en: 'N2', es: 'N2' }, status: 'soon' },
  { id: 'n1', label: { pt: 'N1', en: 'N1', es: 'N1' }, status: 'soon' },
];
fs.writeFileSync(path.join(outDir, 'levels.js'), `export const LEVELS = ${ser(LEVELS)};\n`);

const index = `export { T, CL } from './i18n.js';
export { H, R, Kt, KG } from './kana.js';
export { K, CATS, LI } from './kanji-n5.js';
export { ST, SC } from './strokes.js';
export { LS } from './lessons-n5.js';
export { PQ, GQ, LQ, P1, P2, P3, P4, P5, RQ } from './quiz-banks.js';
export { PH } from './phases-n5.js';
export { LEVELS } from './levels.js';
`;
fs.writeFileSync(path.join(outDir, 'index.js'), index);

console.log(
  JSON.stringify({
    K: K.length,
    LS: LS.length,
    PH: PH.length,
    ST: Object.keys(ST).length,
    SC: Object.keys(SC).length,
    files: fs.readdirSync(outDir),
  }),
);