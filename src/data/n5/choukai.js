/** 聴解 choukai — itens com `requires` (léxico mínimo para liberar na trilha). */
export const N5_CHOUKAI = [
  // —— Mini (pós-は / apresentação) ——
  {
    s: 'わたしは がくせいです。|Eu sou estudante.|Sou professor.,Sou brasileiro.,Não estudo.',
    requires: ['わたし', 'は', 'がくせい', 'です'],
  },
  {
    s: 'あなたは せんせいですか。|Você é professor(a)?|É estudante?,É meu amigo?,Vai amanhã?',
    requires: ['あなた', 'は', 'せんせい', 'です', 'か'],
  },
  {
    s: 'はい、わたしは にほんじんです。|Sim, sou japonês.|Não sou.,Sou brasileiro.,É ontem.',
    requires: ['はい', 'わたし', 'は', 'にほんじん', 'です'],
  },
  {
    s: 'いいえ、わたしは ブラジルじんです。|Não, sou brasileiro.|Sou japonês.,Sou professor.,Como todo dia.',
    requires: ['いいえ', 'わたし', 'は', 'ブラジルじん', 'です'],
  },
  {
    s: 'わたしは ごはんを たべます。|Eu como arroz/refeição.|Bebo água.,Vou à escola.,Sou estudante.',
    requires: ['わたし', 'は', 'ごはん', 'を', 'たべます'],
  },
  {
    s: 'みずを のみます。|Bebo água.|Como.,Vou.,Sou professor.',
    requires: ['みず', 'を', 'のみます'],
  },
  {
    s: 'がっこうに いきます。|Vou à escola.|Fico em casa.,Bebo água.,Sou professor.',
    requires: ['がっこう', 'に', 'いきます'],
  },
  {
    s: 'ごはんは おいしいです。|A comida está gostosa.|É água.,Não gosto.,É na escola.',
    requires: ['ごはん', 'は', 'おいしい', 'です'],
  },
  // —— Banco geral (liberado conforme introduces) ——
  {
    s: 'わたしは まいにち でんしゃで がっこうに いきます。|Todo dia vou à escola de trem.|Vou de ônibus.,Fico em casa.,Não estudo.',
    requires: ['わたし', 'は', 'まいにち', 'でんしゃ', 'で', 'がっこう', 'に', 'いきます'],
  },
  {
    s: 'きのう ともだちと えいがを みました。|Ontem vi um filme com um amigo.|Vou ver amanhã.,Li um livro.,Comi sozinho.',
    requires: ['きのう', 'ともだち', 'と', 'を', 'みます'],
  },
  {
    s: 'この りんごは おいしいです。|Esta maçã é gostosa.|É cara.,É pequena.,Não gosto.',
    requires: ['この', 'りんご', 'は', 'おいしい', 'です'],
  },
  {
    s: 'びょういんは えきの ちかくに あります。|O hospital fica perto da estação.|É longe.,Não existe.,É uma escola.',
    requires: ['びょういん', 'は', 'えき', 'の', 'ちかく', 'に', 'あります'],
  },
  {
    s: 'あした はれですから、こうえんに いきましょう。|Amanhã está sol, vamos ao parque.|Vamos ficar em casa.,Está chovendo.,É noite.',
    requires: ['あした', 'はれ', 'こうえん', 'に', 'いきます'],
  },
  {
    s: 'すみません、メニューを ください。|Com licença, o cardápio por favor.|A conta.,Água.,É gostoso.',
    requires: ['すみません', 'メニュー', 'を', 'ください'],
  },
  {
    s: 'もう しゅくだいを しましたか。|Você já fez a lição?|Ainda não.,Não tenho.,É difícil.',
    requires: ['もう', 'しゅくだい', 'を', 'します', 'か'],
  },
  {
    s: 'まだ ひるごはんを たべていません。|Ainda não almocei.|Já comi.,Não tenho fome.,É jantar.',
    requires: ['まだ', 'ひるごはん', 'を', 'たべます'],
  },
  {
    s: 'にほんごが すこし わかります。|Entendo um pouco de japonês.|Não entendo nada.,Sou professor.,Moro no Japão.',
    requires: ['が', 'わかります'],
  },
  {
    s: 'ドアを しめてください。|Por favor, feche a porta.|Abra a janela.,Sente-se.,Espere.',
    requires: ['ドア', 'を', 'ください'],
  },
  {
    s: 'きょうは いそがしいです。|Hoje estou ocupado.|Estou livre.,Está frio.,É domingo.',
    requires: ['きょう', 'は', 'いそがしい', 'です'],
  },
  {
    s: 'バスで いきましょうか。|Vamos de ônibus?|Vamos a pé.,Não vou.,É trem.',
    requires: ['バス', 'で', 'いきます', 'か'],
  },
  {
    s: 'かねが あまり ありません。|Não tenho muito dinheiro.|Sou rico.,Comprei tudo.,É barato.',
    requires: ['おかね', 'が', 'あまり', 'あります'],
  },
  {
    s: 'おてあらは あそこです。|O banheiro fica ali.|Aqui.,Não tem.,É a cozinha.',
    requires: ['おてあらい', 'は', 'あそこ', 'です'],
  },
  {
    s: 'せんせいに しつもんを します。|Vou perguntar ao professor.|Não entendo.,É teste.,Durmo.',
    requires: ['せんせい', 'に', 'しつもん', 'を', 'します'],
  },
  {
    s: 'かぞくは よにんです。|Minha família tem 4 pessoas.|Somos 2.,Não tenho.,É grande.',
    requires: ['かぞく', 'は', 'よにん', 'です'],
  },
  {
    s: 'くつを ぬいでください。|Por favor, tire os sapatos.|Vista o casaco.,Entre.,Espere fora.',
    requires: ['くつ', 'を', 'ください'],
  },
]
