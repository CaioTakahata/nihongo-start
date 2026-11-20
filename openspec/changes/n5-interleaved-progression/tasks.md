# Tasks

## 1. Modelo de léxico e schema de progresso

- [x] 1.1 Definir helper `knownLexemes(phaseIndex)` (união de `introduces` + base kana/joshi) e documentar formato dos tokens; verificar com asserts manuais em 2–3 índices de fase
- [x] 1.2 Adicionar bump `trailSchema: 2` no load de progresso com reset de scores de fase e aviso único em PT; verificar que schema antigo limpa `tr[]` e grava schema 2
- [x] 1.3 Desligar `UNLOCK_ALL_PHASES` no default de produção e manter override só para dev; verificar que fase N+1 fica bloqueada sem 70% na N

## 2. Taggear bancos choukai/dokkai/frases

- [x] 2.1 Acrescentar `requires: string[]` em cada item de `N5_CHOUKAI` e `N5_DOKKAI`; verificar que nenhum item fica sem tag
- [x] 2.2 Revisar `N5_SENTENCE_QUIZ` / montagens pós-は para alinhar enunciados ao léxico por etapa; verificar que a etapa は só usa `N5_WA_*`
- [x] 2.3 (Opcional mas recomendado) Script de lint que lista itens cujo `requires` não está no goi do curso; rodar uma vez e corrigir outliers

## 3. Filtro na montagem de exercícios da trilha

- [x] 3.1 Alterar `mkS`/`mkR` (caminho da trilha) para filtrar por `requires ⊆ knownLexemes`; verificar que fase intermediária não recebe item com palavra futura
- [x] 3.2 Implementar fallback de repetição quando o pool filtrado é curto (sem cair no banco global); verificar com pool artificial de 2–3 itens
- [x] 3.3 Aplicar o mesmo gating a quizzes de partícula/frase usados via `p`/`m` na trilha; verificar enunciados de uma fase intermediária

## 4. Reestruturar fases em unidades entrelaçadas

- [x] 4.1 Mapear arcos (goi/bunpou → quiz → kanji → choukai → dokkai) reutilizando fatias de `LS`/`GQ`/`PQ` e kanji existentes; entregar rascunho da nova lista em `phases-n5.js`
- [x] 4.2 Preencher `unitId` + `introduces` em cada fase nova; verificar que `knownLexemes` cresce monotonicamente ao longo da trilha
- [x] 4.3 Ajustar `phaseSection()` / títulos para o acordeão continuar agrupando hira/kata/joshi/goi/bunpou/choukai/dokkai/kanji/sim; verificar home com seções e numeração linear coerente
- [x] 4.4 Garantir learn-first nas fases que introduzem conteúdo; verificar que `trStart` abre learn antes do quiz

## 5. Conteúdo mínimo de audição/leitura por arco

- [x] 5.1 Escrever ou adaptar mini-itens choukai/dokkai para os primeiros arcos pós-joshi (só léxico da unidade + anterior); verificar elegibilidade com o filtro
- [x] 5.2 Nos arcos finais, fases de revisão mista cobrindo goi + bunpou + choukai + dokkai + kanji N5 do app; verificar que o fim da trilha exerce os cinco skills

## 6. Integração

- [x] 6.1 Percorrer manualmente: kana → joshi/は → primeira unidade com たべます (ou equivalente) → kanji relacionado → choukai/dokkai sem palavra estranha; registrar ok/falha
- [x] 6.2 Rodar `npm run build` e confirmar build limpo após as mudanças

## Workflow follow-up

- Archive the change after review (`openspec archive` / fluxo do projeto).
- Sync specs para `openspec/specs/` no archive.
