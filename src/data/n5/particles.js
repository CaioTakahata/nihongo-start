/**
 * 助詞 + primeiras frases — depois de hiragana/katakana.
 * Começa só com palavras já vistas (kana + apresentação).
 */

/** Cartões das partículas essenciais. */
export const N5_PARTICLES = [
  {
    jp: 'は',
    reading: 'wa',
    pt: 'tópico da frase',
    tip: 'Marca o assunto. Lê-se “wa”, não “ha”.',
    ex: 'わたしは がくせいです。',
    exPt: 'Eu sou estudante.',
  },
  {
    jp: 'が',
    reading: 'ga',
    pt: 'sujeito / foco',
    tip: 'Destaca o sujeito ou o que se gosta (すき).',
    ex: 'ねこが います。',
    exPt: 'Tem um gato (existe).',
  },
  {
    jp: 'を',
    reading: 'o',
    pt: 'objeto direto',
    tip: 'O que você faz (come, bebe, lê…).',
    ex: 'みずを のみます。',
    exPt: 'Bebo água.',
  },
  {
    jp: 'に',
    reading: 'ni',
    pt: 'destino / hora / existência',
    tip: 'Para onde vai, quando, ou onde algo existe.',
    ex: 'がっこうに いきます。',
    exPt: 'Vou à escola.',
  },
  {
    jp: 'で',
    reading: 'de',
    pt: 'local da ação / meio',
    tip: 'Onde a ação acontece, ou com o que (ônibus, caneta).',
    ex: 'いえで たべます。',
    exPt: 'Como em casa.',
  },
  {
    jp: 'の',
    reading: 'no',
    pt: 'posse / ligação',
    tip: 'Liga substantivos: meu livro, perto da estação.',
    ex: 'わたしの ほんです。',
    exPt: 'É o meu livro.',
  },
  {
    jp: 'と',
    reading: 'to',
    pt: 'e / com',
    tip: 'Lista (“A e B”) ou companhia (“com amigo”).',
    ex: 'ともだちと いきます。',
    exPt: 'Vou com um amigo.',
  },
  {
    jp: 'も',
    reading: 'mo',
    pt: 'também',
    tip: 'Substitui は/を quando é “também”.',
    ex: 'わたしも がくせいです。',
    exPt: 'Eu também sou estudante.',
  },
  {
    jp: 'か',
    reading: 'ka',
    pt: 'pergunta',
    tip: 'No fim da frase: vira pergunta (como “?”).',
    ex: 'がくせいですか。',
    exPt: 'Você é estudante?',
  },
]

/**
 * Palavras “seguras” logo após kana + apresentação.
 * Só estas entram nas primeiras montagens com は.
 */
export const N5_WA_WORDS = [
  { jp: 'わたし', r: 'watashi', pt: 'eu' },
  { jp: 'あなた', r: 'anata', pt: 'você' },
  { jp: 'がくせい', r: 'gakusei', pt: 'estudante' },
  { jp: 'せんせい', r: 'sensei', pt: 'professor(a)' },
  { jp: 'ブラジルじん', r: 'burajirujin', pt: 'brasileiro(a)' },
  { jp: 'にほんじん', r: 'nihonjin', pt: 'japonês / japonesa' },
  { jp: 'です', r: 'desu', pt: 'é / sou / está (educado)' },
  { jp: 'は', r: 'wa', pt: 'tópico (partícula)' },
  { jp: 'か', r: 'ka', pt: 'pergunta (partícula)' },
  { jp: 'はい', r: 'hai', pt: 'sim' },
  { jp: 'いいえ', r: 'iie', pt: 'não' },
]

/** Frases modelo para memorizar (só com as palavras acima). */
export const N5_WA_PHRASES = [
  { full: 'わたしは がくせいです。', pt: 'Eu sou estudante.', parts: ['わたし', 'は', 'がくせい', 'です'] },
  { full: 'わたしは せんせいです。', pt: 'Eu sou professor(a).', parts: ['わたし', 'は', 'せんせい', 'です'] },
  { full: 'あなたは がくせいです。', pt: 'Você é estudante.', parts: ['あなた', 'は', 'がくせい', 'です'] },
  { full: 'わたしは ブラジルじんです。', pt: 'Eu sou brasileiro(a).', parts: ['わたし', 'は', 'ブラジルじん', 'です'] },
  { full: 'わたしは にほんじんです。', pt: 'Eu sou japonês / japonesa.', parts: ['わたし', 'は', 'にほんじん', 'です'] },
  { full: 'あなたは がくせいですか。', pt: 'Você é estudante?', parts: ['あなた', 'は', 'がくせい', 'です', 'か'] },
  { full: 'はい、がくせいです。', pt: 'Sim, sou estudante.', parts: ['はい', 'がくせい', 'です'] },
  { full: 'いいえ、せんせいです。', pt: 'Não, sou professor(a).', parts: ['いいえ', 'せんせい', 'です'] },
]

/**
 * Montagens interativas só com palavras conhecidas (pós-は).
 */
export const N5_WA_BUILDS = N5_WA_PHRASES.map((p, i) => ({
  id: 'wa-' + i,
  goal: p.pt,
  parts: p.parts,
  full: p.full,
  pt: p.pt,
  focus: 'は',
}))

/**
 * Montagem geral (outras partículas) — ainda com palavras de início do curso.
 */
export const N5_SENTENCE_BUILDS = [
  ...N5_WA_BUILDS,
  {
    id: 'ka-q',
    goal: 'Perguntar com か',
    parts: ['あなた', 'は', 'せんせい', 'です', 'か'],
    full: 'あなたは せんせいですか。',
    pt: 'Você é professor(a)?',
    focus: 'か',
  },
  {
    id: 'mo-too',
    goal: 'Também com も',
    parts: ['わたし', 'も', 'がくせい', 'です'],
    full: 'わたしも がくせいです。',
    pt: 'Eu também sou estudante.',
    focus: 'も',
  },
  {
    id: 'no-pos',
    goal: 'Posse com の (palavra: ほん)',
    parts: ['これ', 'は', 'わたし', 'の', 'ほん', 'です'],
    full: 'これは わたしの ほんです。',
    pt: 'Isto é o meu livro.',
    focus: 'の',
  },
  {
    id: 'wo-verb',
    goal: 'Objeto com を (みず / のみます)',
    parts: ['わたし', 'は', 'みず', 'を', 'のみます'],
    full: 'わたしは みずを のみます。',
    pt: 'Eu bebo água.',
    focus: 'を',
  },
  {
    id: 'ni-go',
    goal: 'Destino com に',
    parts: ['わたし', 'は', 'がっこう', 'に', 'いきます'],
    full: 'わたしは がっこうに いきます。',
    pt: 'Eu vou à escola.',
    focus: 'に',
  },
  {
    id: 'de-place',
    goal: 'Local com で',
    parts: ['いえ', 'で', 'ごはん', 'を', 'たべます'],
    full: 'いえで ごはんを たべます。',
    pt: 'Como em casa.',
    focus: 'で',
  },
  {
    id: 'to-with',
    goal: 'Companhia com と',
    parts: ['ともだち', 'と', 'いきます'],
    full: 'ともだちと いきます。',
    pt: 'Vou com um amigo.',
    focus: 'と',
  },
  {
    id: 'ga-neko',
    goal: 'Sujeito com が (ねこ do kana)',
    parts: ['ねこ', 'が', 'います'],
    full: 'ねこが います。',
    pt: 'Tem um gato.',
    focus: 'が',
  },
]

const WA_REQ = ['わたし', 'あなた', 'がくせい', 'せんせい', 'です', 'は', 'か', 'はい', 'いいえ', 'にほんじん', 'ブラジルじん']
const EARLY_REQ = [...WA_REQ, 'みず', 'を', 'のみます', 'がっこう', 'に', 'いきます', 'いえ', 'で', 'ごはん', 'たべます', 'ほん', 'の', 'ともだち', 'と', 'ねこ', 'が', 'います', 'も', 'これ']

/** Quiz curto — com requires para gating na trilha. */
export const N5_SENTENCE_QUIZ = [
  { s: 'Complete: わたし＿ がくせいです。|は|が,を,に|は marca o tópico (lê-se wa)', requires: WA_REQ },
  { s: 'Complete: あなた＿ せんせいです。|は|が,を,も|mesmo padrão: tópico + は', requires: WA_REQ },
  { s: 'Complete: わたしは がくせい＿。|です|ます,だ,か|fecha a frase com です', requires: WA_REQ },
  { s: '“Eu sou estudante” é:|わたしは がくせいです。|わたしが がくせいです。,わたしを がくせいです。,わたしに がくせいです。|は + です', requires: WA_REQ },
  { s: '“Você é professor(a)?” é:|あなたは せんせいですか。|あなたは せんせいです。,あなたが せんせいですか。,あなたを せんせいですか。|pergunta: …ですか', requires: WA_REQ },
  { s: 'Complete: がくせいです＿。|か|は,が,を|か no fim = pergunta', requires: WA_REQ },
  { s: 'Complete: わたし＿ がくせいです。(também)|も|は,が,を|も = também', requires: [...WA_REQ, 'も'] },
  { s: 'Complete: みず＿ のみます。|を|は,が,で|を = objeto direto', requires: EARLY_REQ },
  { s: 'Complete: がっこう＿ いきます。|に|を,で,も|に = destino', requires: EARLY_REQ },
  { s: 'Complete: いえ＿ たべます。|で|に,を,は|で = local da ação', requires: EARLY_REQ },
  { s: 'Complete: わたし＿ ほんです。|の|は,が,を|の = posse', requires: EARLY_REQ },
  { s: 'Complete: ともだち＿ いきます。|と|に,で,を|と = com', requires: EARLY_REQ },
  { s: 'Complete: ねこ＿ います。|が|を,は,で|が marca o sujeito', requires: EARLY_REQ },
  { s: 'Qual frase está correta?|わたしは がくせいです。|わたしを がくせいです。,わたしが がくせいは です。,わたしに がくせいです。|padrão: Aは Bです', requires: WA_REQ },
]
