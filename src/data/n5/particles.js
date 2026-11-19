/**
 * 助詞 + primeiras frases — depois de hiragana/katakana.
 * Conteúdo próprio do app (não copia ebook).
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
 * Montagem de frases: peças na ordem → frase + tradução.
 * Usado na tela de aprendizado (antes do quiz).
 */
export const N5_SENTENCE_BUILDS = [
  {
    id: 'wa-desu',
    goal: 'Apresentar quem você é',
    parts: ['わたし', 'は', 'がくせい', 'です'],
    full: 'わたしは がくせいです。',
    pt: 'Eu sou estudante.',
    focus: 'は',
  },
  {
    id: 'ka-q',
    goal: 'Fazer uma pergunta com か',
    parts: ['あなた', 'は', 'せんせい', 'です', 'か'],
    full: 'あなたは せんせいですか。',
    pt: 'Você é professor(a)?',
    focus: 'か',
  },
  {
    id: 'wo-verb',
    goal: 'Objeto + verbo',
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
    goal: 'Local da ação com で',
    parts: ['うち', 'で', 'ごはん', 'を', 'たべます'],
    full: 'うちで ごはんを たべます。',
    pt: 'Como em casa.',
    focus: 'で',
  },
  {
    id: 'no-pos',
    goal: 'Posse com の',
    parts: ['これ', 'は', 'わたし', 'の', 'ほん', 'です'],
    full: 'これは わたしの ほんです。',
    pt: 'Isto é o meu livro.',
    focus: 'の',
  },
  {
    id: 'to-with',
    goal: 'Companhia com と',
    parts: ['ともだち', 'と', 'えいが', 'を', 'みます'],
    full: 'ともだちと えいがを みます。',
    pt: 'Vejo um filme com um amigo.',
    focus: 'と',
  },
  {
    id: 'mo-too',
    goal: 'Também com も',
    parts: ['わたし', 'も', 'にほんご', 'を', 'べんきょうします'],
    full: 'わたしも にほんごを べんきょうします。',
    pt: 'Eu também estudo japonês.',
    focus: 'も',
  },
  {
    id: 'ga-suki',
    goal: 'Gostar com が',
    parts: ['わたし', 'は', 'ねこ', 'が', 'すき', 'です'],
    full: 'わたしは ねこが すきです。',
    pt: 'Eu gosto de gatos.',
    focus: 'が',
  },
  {
    id: 'mix-1',
    goal: 'Frase completa do dia a dia',
    parts: ['あした', 'ともだち', 'と', 'こうえん', 'に', 'いきます'],
    full: 'あした ともだちと こうえんに いきます。',
    pt: 'Amanhã vou ao parque com um amigo.',
    focus: 'と・に',
  },
]

/** Quiz curto de montagem: escolha a ordem / a partícula certa. */
export const N5_SENTENCE_QUIZ = [
  'Complete: わたし＿ がくせいです。|は|が,を,に|は marca o tópico',
  'Complete: みず＿ のみます。|を|は,が,で|を = objeto direto',
  'Complete: がっこう＿ いきます。|に|を,で,も|に = destino',
  'Complete: いえ＿ たべます。|で|に,を,は|で = local da ação',
  'Complete: がくせいです＿。|か|は,が,を|か no fim = pergunta',
  'Complete: わたし＿ ほんです。|の|は,が,を|の = posse',
  'Complete: ともだち＿ いきます。|と|に,で,を|と = com',
  'Complete: わたし＿ がくせいです。(também)|も|は,が,を|も = também',
  'Complete: ねこ＿ すきです。|が|を,は,で|すき usa が',
  'Qual frase está correta?|わたしは みずを のみます。|わたしを みずは のみます。,わたしが みずで のみます。,わたしに みずも のみます。|は (tópico) + を (objeto)',
  'Qual é a pergunta?|がくせいですか。|がくせいです。,がくせいを。,がくせいの。|か transforma em pergunta',
  '“Eu vou à escola” é:|わたしは がっこうに いきます。|わたしは がっこうを いきます。,わたしは がっこうで いきます。,わたしは がっこうが いきます。|destino = に',
]
