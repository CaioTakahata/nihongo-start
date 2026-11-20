# Design

## Context

Ver proposal.md (Why). Hoje a trilha tem ~93 fases lineares em `phases-n5.js`, agrupadas em acordeão por `curriculum.js`. `trQ` monta questões pela string `m` (`v/l/p/g/s/r/k`), mas `mkS`/`mkR` embaralham `LQ`/`RQ` inteiros — sem filtro de vocabulário. O único padrão “só palavras conhecidas” está em `N5_WA_*` (partículas iniciais). `UNLOCK_ALL_PHASES = true` deixa tudo aberto.

## Goals / Non-Goals

**Goals:**
- Modelo de **unidades** na trilha que entrelaçam goi → prática → teste → kanji relacionado → choukai/dokkai cumulativos.
- Camada de **léxico introduzido** usada na seleção de itens de exercício.
- Desbloqueio sequencial ligado no produto; flag de unlock-all só para dev.
- Acordeão de orientação preservado.

**Non-Goals:**
- Reescrever a UI como path Duolingo.
- Motor SRS completo / spaced repetition fora da trilha.
- Cobrir 100% do JLPT N5 oficial palavra-a-palavra se o banco do app for um subconjunto documentado — a meta é cobertura do currículo do app.
- Traduzir ou regenerar PDFs de goi; reutilizar `goi-lists` / `LS` existentes.

## Decisions

### 1. Unidades pedagógicas como metadado sobre fases (não novo runtime)
Cada bloco consecutivo de fases ganha um `unitId` (ex.: `u-food-1`) e lista `introduces: string[]` (formas canônicas em hiragana/katakana/kanji conforme o banco). Fases individuais continuam sendo a unidade de learn/quiz/aprovação.

**Alternativa:** uma fase gigante por unidade — rejeitada (quebra learn-first granular e o acordeão).

### 2. Léxico conhecido = união cumulativa até a fase atual
`knownLexemes(phaseIndex)` = kana base + tudo em `introduces` das fases `0..phaseIndex` (e tokens da tela learn da fase atual). Normalização: strip espaços, です/ます como tokens, partículas como tokens.

**Alternativa:** só fases com `tr[i] >= 70%` — rejeitada para a sessão atual (o aluno estudou agora e precisa praticar já); usar “introduzido na learn” + fases anteriores concluídas ou iniciadas na ordem.

### 3. Taggear choukai/dokkai com `requires: string[]`
Cada item em `N5_CHOUKAI` / `N5_DOKKAI` declara pré-requisitos lexicais. `mkS`/`mkR` (na trilha) filtram `item.requires ⊆ known`. Itens antigos sem tag recebem tags na mesma mudança; itens impossíveis cedo saem do pool inicial.

**Alternativa:** tokenizar o japonês automaticamente — rejeitada na v1 (frágil com espaços/okurigana); tags manuais + helper de validação em build/script.

### 4. Reordenar `phases-n5.js` em arcos curtos
Padrão por arco (exemplo):
1. Learn goi/bunpou do tema  
2. Quiz misturado (`m` com `v`/`g`/`p`)  
3. Kanji do tema (se houver)  
4. Choukai curto filtrado  
5. Dokkai curto filtrado  

Kana e joshi iniciais permanecem no começo; pacotes finais “só goi 40–59” e “só choukai 1–2” são dissolvidos nos arcos ou viram revisões cumulativas no fim.

`phaseSection()` continua classificando por título/tipo para o acordeão; títulos podem incluir marcadores estáveis (`語彙`, `聴解`, etc.) para não quebrar o agrupamento.

### 5. Desbloqueio
`UNLOCK_ALL_PHASES` default `false` em produção; `true` apenas via flag de query/localStorage de dev já usada (ou constante explícita `DEV`). Critério de aprovação permanece 70%.

### 6. Progresso antigo
Bump de versão de schema em `localStorage` (ex.: `trailSchema: 2`). Se schema < 2, resetar scores de fase da trilha e mostrar um aviso único em PT — índices de fase mudam (**BREAKING**).

## Risks / Trade-offs

- [Poucos itens elegíveis cedo] → Mitigação: escrever mini-itens choukai/dokkai por unidade; fallback de repetição (spec); nunca misturar pool global.
- [Tags `requires` incompletas] → Mitigação: script de lint que lista itens sem tag ou com tokens fora do goi.
- [Acordeão “parece bagunçado” com fases misturadas] → Mitigação: manter seções; descrição da seção deixa claro que a ordem de estudo é a numeração da trilha.
- [Reset de progresso frustra] → Mitigação: aviso + bumpar schema uma vez; não tentar remapear índices automaticamente.

## Migration Plan

1. Ship conteúdo taggeado + filtro + nova ordem de fases com `trailSchema: 2`.
2. No load: se schema antigo, limpar `tr[]` scores e gravar schema 2; manter XP se desejável.
3. Rollback: reverter deploy; schema 2 com fases novas é one-way — documentar no changelog.

## Open Questions

- Quantas unidades mínimas na v1 (piloto nos primeiros temas pós-joshi vs. reescrever as 93 fases de uma vez)? Assumir: reestruturar a trilha completa em uma mudança, com arcos curtos reutilizando bancos existentes, priorizando qualidade do gating sobre quantidade de itens novos de choukai/dokkai.
