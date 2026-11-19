/** Ruby / furigana helpers for beginner-friendly UI labels. */

export function ruby(kanji, reading) {
  return `<ruby>${kanji}<rp>(</rp><rt>${reading}</rt><rp>)</rp></ruby>`
}

/** Common N5 area labels with furigana above the kanji. */
export const FURI = {
  goi: `${ruby('語彙', 'ごい')} Vocabulário`,
  bunpou: `${ruby('文法', 'ぶんぽう')} Gramática`,
  choukai: `${ruby('聴解', 'ちょうかい')} Audição`,
  dokkai: `${ruby('読解', 'どっかい')} Leitura`,
  kanji: `${ruby('漢字', 'かんじ')} Kanji`,
  areas: `${ruby('語彙', 'ごい')}・${ruby('文法', 'ぶんぽう')}・${ruby('聴解', 'ちょうかい')}・${ruby('読解', 'どっかい')}・${ruby('漢字', 'かんじ')}`,
}
