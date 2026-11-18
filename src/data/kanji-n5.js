export const K = [
  Object.assign(["日","dia, sol","day, sun","día, sol","ニチ","ひ"], { cat: 1 }),
  Object.assign(["月","lua, mês","moon, month","luna, mes","ゲツ","つき"], { cat: 1 }),
  Object.assign(["火","fogo","fire","fuego","カ","ひ"], { cat: 2 }),
  Object.assign(["水","água","water","agua","スイ","みず"], { cat: 2 }),
  Object.assign(["木","árvore","tree","árbol","モク","き"], { cat: 2 }),
  Object.assign(["金","ouro, dinheiro","gold, money","oro, dinero","キン","かね"], { cat: 2 }),
  Object.assign(["土","terra","earth","tierra","ド","つち"], { cat: 2 }),
  Object.assign(["人","pessoa","person","persona","ジン","ひと"], { cat: 3 }),
  Object.assign(["大","grande","big","grande","ダイ","おお"], { cat: 7 }),
  Object.assign(["小","pequeno","small","pequeño","ショウ","ちい"], { cat: 7 }),
  Object.assign(["山","montanha","mountain","montaña","サン","やま"], { cat: 2 }),
  Object.assign(["川","rio","river","río","セン","かわ"], { cat: 2 }),
  Object.assign(["口","boca","mouth","boca","コウ","くち"], { cat: 4 }),
  Object.assign(["目","olho","eye","ojo","モク","め"], { cat: 4 }),
  Object.assign(["手","mão","hand","mano","シュ","て"], { cat: 4 }),
  Object.assign(["一","um","one","uno","イチ","ひと"], { cat: 0 }),
  Object.assign(["二","dois","two","dos","ニ","ふた"], { cat: 0 }),
  Object.assign(["三","três","three","tres","サン","みっ"], { cat: 0 }),
  Object.assign(["学","estudar","study","estudiar","ガク","まな"], { cat: 5 }),
  Object.assign(["生","vida, nascer","life, be born","vida, nacer","セイ","い・う"], { cat: 3 }),
  Object.assign(["四","quatro","four","cuatro","シ","よん"], { cat: 0 }),
  Object.assign(["五","cinco","five","cinco","ゴ","いつ"], { cat: 0 }),
  Object.assign(["六","seis","six","seis","ロク","むっ"], { cat: 0 }),
  Object.assign(["七","sete","seven","siete","シチ","なな"], { cat: 0 }),
  Object.assign(["八","oito","eight","ocho","ハチ","やっ"], { cat: 0 }),
  Object.assign(["九","nove","nine","nueve","キュウ","ここの"], { cat: 0 }),
  Object.assign(["十","dez","ten","diez","ジュウ","とお"], { cat: 0 }),
  Object.assign(["百","cem","hundred","cien","ヒャク","—"], { cat: 0 }),
  Object.assign(["千","mil","thousand","mil","セン","ち"], { cat: 0 }),
  Object.assign(["万","dez mil","ten thousand","diez mil","マン","—"], { cat: 0 }),
  Object.assign(["円","iene","yen","yen","エン","まる"], { cat: 0 }),
  Object.assign(["年","ano","year","año","ネン","とし"], { cat: 1 }),
  Object.assign(["時","hora","time, hour","hora","ジ","とき"], { cat: 1 }),
  Object.assign(["分","minuto, dividir","minute, divide","minuto, dividir","フン","わ(ける)"], { cat: 1 }),
  Object.assign(["半","metade","half","mitad","ハン","なか(ば)"], { cat: 1 }),
  Object.assign(["今","agora","now","ahora","コン","いま"], { cat: 1 }),
  Object.assign(["毎","todo","every","cada","マイ","—"], { cat: 1 }),
  Object.assign(["週","semana","week","semana","シュウ","—"], { cat: 1 }),
  Object.assign(["前","antes, frente","before, front","antes, frente","ゼン","まえ"], { cat: 1 }),
  Object.assign(["後","depois, atrás","after, behind","después, detrás","ゴ","あと"], { cat: 1 }),
  Object.assign(["午","meio-dia","noon","mediodía","ゴ","—"], { cat: 1 }),
  Object.assign(["間","intervalo","interval","intervalo","カン","あいだ"], { cat: 1 }),
  Object.assign(["田","arrozal","rice field","arrozal","デン","た"], { cat: 2 }),
  Object.assign(["雨","chuva","rain","lluvia","ウ","あめ"], { cat: 2 }),
  Object.assign(["天","céu","sky","cielo","テン","あま"], { cat: 2 }),
  Object.assign(["気","espírito, ar","spirit, air","espíritu, aire","キ","—"], { cat: 2 }),
  Object.assign(["男","homem","man","hombre","ダン","おとこ"], { cat: 3 }),
  Object.assign(["女","mulher","woman","mujer","ジョ","おんな"], { cat: 3 }),
  Object.assign(["子","criança","child","niño","シ","こ"], { cat: 3 }),
  Object.assign(["父","pai","father","padre","フ","ちち"], { cat: 3 }),
  Object.assign(["母","mãe","mother","madre","ボ","はは"], { cat: 3 }),
  Object.assign(["友","amigo","friend","amigo","ユウ","とも"], { cat: 3 }),
  Object.assign(["先","antes, ponta","previous, tip","antes, punta","セン","さき"], { cat: 3 }),
  Object.assign(["校","escola","school","escuela","コウ","—"], { cat: 5 }),
  Object.assign(["語","idioma","language","idioma","ゴ","かた(る)"], { cat: 5 }),
  Object.assign(["本","livro, origem","book, origin","libro, origen","ホン","もと"], { cat: 5 }),
  Object.assign(["名","nome","name","nombre","メイ","な"], { cat: 5 }),
  Object.assign(["電","eletricidade","electricity","electricidad","デン","—"], { cat: 9 }),
  Object.assign(["車","carro","car","coche","シャ","くるま"], { cat: 9 }),
  Object.assign(["何","o quê","what","qué","カ","なに"], { cat: 9 }),
  Object.assign(["白","branco","white","blanco","ハク","しろ"], { cat: 7 }),
  Object.assign(["見","ver","see","ver","ケン","み(る)"], { cat: 6 }),
  Object.assign(["聞","ouvir","hear","oír","ブン","き(く)"], { cat: 6 }),
  Object.assign(["読","ler","read","leer","ドク","よ(む)"], { cat: 6 }),
  Object.assign(["書","escrever","write","escribir","ショ","か(く)"], { cat: 6 }),
  Object.assign(["食","comer","eat","comer","ショク","た(べる)"], { cat: 6 }),
  Object.assign(["飲","beber","drink","beber","イン","の(む)"], { cat: 6 }),
  Object.assign(["行","ir","go","ir","コウ","い(く)"], { cat: 6 }),
  Object.assign(["来","vir","come","venir","ライ","く(る)"], { cat: 6 }),
  Object.assign(["出","sair","exit","salir","シュツ","で(る)"], { cat: 6 }),
  Object.assign(["入","entrar","enter","entrar","ニュウ","い(る)"], { cat: 6 }),
  Object.assign(["休","descansar","rest","descansar","キュウ","やす(む)"], { cat: 6 }),
  Object.assign(["買","comprar","buy","comprar","バイ","か(う)"], { cat: 6 }),
  Object.assign(["話","conversa, falar","talk","hablar","ワ","はな(す)"], { cat: 6 }),
  Object.assign(["高","alto, caro","high, expensive","alto, caro","コウ","たか(い)"], { cat: 7 }),
  Object.assign(["安","barato, tranquilo","cheap, calm","barato, tranquilo","アン","やす(い)"], { cat: 7 }),
  Object.assign(["長","longo","long","largo","チョウ","なが(い)"], { cat: 7 }),
  Object.assign(["新","novo","new","nuevo","シン","あたら(しい)"], { cat: 7 }),
  Object.assign(["古","velho","old","viejo","コ","ふる(い)"], { cat: 7 }),
  Object.assign(["多","muito","many","mucho","タ","おお(い)"], { cat: 7 }),
  Object.assign(["少","pouco","few","poco","ショウ","すく(ない)"], { cat: 7 }),
  Object.assign(["上","em cima","above","arriba","ジョウ","うえ"], { cat: 8 }),
  Object.assign(["下","embaixo","below","abajo","カ","した"], { cat: 8 }),
  Object.assign(["中","meio, dentro","middle, inside","medio, dentro","チュウ","なか"], { cat: 8 }),
  Object.assign(["外","fora","outside","fuera","ガイ","そと"], { cat: 8 }),
  Object.assign(["左","esquerda","left","izquierda","サ","ひだり"], { cat: 8 }),
  Object.assign(["右","direita","right","derecha","ウ","みぎ"], { cat: 8 }),
  Object.assign(["東","leste","east","este","トウ","ひがし"], { cat: 8 }),
  Object.assign(["西","oeste","west","oeste","セイ","にし"], { cat: 8 }),
  Object.assign(["南","sul","south","sur","ナン","みなみ"], { cat: 8 }),
  Object.assign(["北","norte","north","norte","ホク","きた"], { cat: 8 }),
  Object.assign(["国","país","country","país","コク","くに"], { cat: 8 })
];

export const CATS = [
  [
    "Números",
    "一二三四五六七八九十百千万円"
  ],
  [
    "Tempo",
    "日年月時分半今毎週前後午間"
  ],
  [
    "Natureza",
    "火水木金土山川田雨天気"
  ],
  [
    "Pessoas",
    "人男女子父母友先生"
  ],
  [
    "Corpo",
    "目口手"
  ],
  [
    "Escola e idioma",
    "学校語本名"
  ],
  [
    "Ações",
    "見聞読書食飲行来出入休買話"
  ],
  [
    "Descrição",
    "大小高安長新古多少白"
  ],
  [
    "Direções e lugares",
    "上下中外左右東西南北国"
  ],
  [
    "Outros",
    "電車何"
  ]
];

export const LI = {
  "pt": 1,
  "en": 2,
  "es": 3
};
