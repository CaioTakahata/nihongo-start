# Proposal

## Why

Na trilha N5, choukai/dokkai (e parte de gramática/partículas) puxam frases do banco inteiro, então o aluno vê palavras e estruturas que ainda não estudou. Isso quebra a confiança e impede uma progressão real de “aprendi → pratiquei → testei → leio”. Precisamos de uma trilha entrelaçada (goi + bunpou + choukai + dokkai + kanji) em que cada exercício só use léxico e gramática já apresentados.

## What Changes

- Reorganizar a trilha N5 em **unidades progressivas** que misturam vocabulário, gramática, audição, leitura e kanji no mesmo arco (ex.: aprender たべます + palavras do tema → prática → teste → kanji relacionados como 日 / 水 → leitura/audição só com o que já viu).
- Introduzir **gating por léxico conhecido**: choukai, dokkai, quizzes de frase e montagens só podem usar palavras/estruturas já desbloqueadas pela progressão da trilha.
- Manter learn-first por fase: estudar o pacote novo → exercício → desbloqueio do próximo bloco.
- Manter a trilha em **acordeão por áreas** (orientação), sem transformar em path estilo Duolingo; a ordem pedagógica passa a ser a ordem linear das fases, coerente com o que a pessoa já sabe.
- Ativar desbloqueio sequencial real da trilha (fase seguinte só após aprovação), alinhado à progressão cumulativa.
- **BREAKING** (conteúdo): ordem e composição das fases em `phases-n5.js` mudam; progresso antigo por índice de fase pode desalinhá-se e precisará de migração ou reset documentado.

## Capabilities

### New Capabilities

- `n5-trail-progression`: Progressão N5 na trilha — unidades entrelaçadas de goi, bunpou, choukai, dokkai e kanji, com desbloqueio sequencial e learn-first até o aluno cobrir o léxico e as leituras N5.
- `known-lexeme-gating`: Garantia de que exercícios (incluindo audição e leitura) só usam palavras e estruturas já introduzidas na trilha até aquele ponto.

### Modified Capabilities

- (nenhuma — ainda não há specs principais sob `openspec/specs/`)

## Impact

- `src/data/phases-n5.js` — ordem e fatias das fases; unidades entrelaçadas.
- `src/modules/curriculum.js` — seções accordion / mapeamento de fases (orientação, sem mudar o modelo accordion).
- `src/modules/practice/trail.js` / `exercises.js` — montagem de quiz com filtro por léxico conhecido; `trQ` / `mkS` / `mkR`.
- `src/data/n5/choukai.js`, `dokkai.js`, `particles.js`, `grammar.js`, `lessons-n5.js`, `goi-lists.js` — tags de pré-requisito ou bancos indexados por unidade.
- `src/modules/progress.js` / `state.js` — registro do que já foi introduzido; desbloqueio sequencial (`UNLOCK_ALL_PHASES`).
- Progresso salvo no `localStorage` pode precisar de migração ou aviso de reset.
