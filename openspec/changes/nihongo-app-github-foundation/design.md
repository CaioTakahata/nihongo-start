# Design

## Context

Ver motivação em `proposal.md`. Estado observado:

- Um único arquivo `Nihongo Start – Hiragana, Katakana, Kanji.html` com CSS, dados e JS inline.
- Funções redefinidas várias vezes no mesmo script (`kShow`, `pU`, `tCheck`, `kanjiTop`, etc.); a última definição prevalece — sinal de evolução incremental sem modularização.
- Funcionalidades N5 já ricas: trilha com fases, curso com lições, kana/kanji, exercícios, escrita com verificação, XP e TTS.
- Persistência em `localStorage`: `nh` (lições), `nhxp` (XP/trilha), `nhspd` (velocidade).
- No ambiente atual, `git` não está no PATH e não há `.git` no projeto.
- Specs desta mudança: `jlpt-curriculum`, `script-practice`, `learner-progress`, `app-delivery`.

## Goals / Non-Goals

**Goals:**

- Separar dados, UI e lógica para permitir crescer o currículo até N1 sem um monólito frágil.
- Manter comportamento N5 existente alinhado às specs (trilha 70%, XP único, áudio, escrita).
- Estabelecer Git + GitHub + Pages + CI mínima para publicar e testar a cada push.
- Definir modelo de dados de níveis JLPT com N5 preenchido e N4–N1 como extensões futuras.

**Non-Goals:**

- Framework pesado (React/Vue) nesta fase.
- App nativo ou PWA completa (service worker/offline) — pode vir depois.
- Backend, login ou sync na nuvem.
- Redesenho visual completo ou i18n total das lições (lições N5 continuam em PT por enquanto).
- Conteúdo pedagógico completo de N4–N1.

## Decisions

### 1. Stack: vanilla + Vite (estático)

- **Escolha:** Vite + JavaScript vanilla + CSS, saída estática para GitHub Pages.
- **Por quê:** modularização e hot reload locais sem reescrever a UI; deploy simples; caminho claro para crescer dados/conteúdo.
- **Alternativas:** (a) só HTML multi-arquivo sem bundler — mais simples, pior DX e imports; (b) React/Vue — overhead alto para o estágio atual.

### 2. Estrutura de pastas

```
/
  index.html
  src/
    main.js
    styles/app.css
    data/
      levels.js          # metadados N5–N1
      kana.js
      kanji-n5.js
      lessons-n5.js
      phases-n5.js
      strokes.js
    modules/
      audio.js
      progress.js
      curriculum.js
      practice/
        quiz.js
        writing.js
        kana-grid.js
        kanji.js
        exercises.js
      ui.js
  public/
  .github/workflows/ci-deploy.yml
  README.md
```

- Conteúdo N5 migra do monólito para `data/*`; UI/rotas de abas em `modules/ui.js`.
- O HTML atual vira fonte de migração e depois é substituído/arquivado (ex.: `legacy/`) para referência.

### 3. Modelo de currículo

```js
// levels: [{ id: 'n5', label, status: 'active'|'soon' }, ...]
// phase: { id, levelId, title, unlockThreshold: 0.7, generators... }
// lesson: { id, levelId, title, bodyHtml, vocab: [{jp, reading, meaning}] }
```

- Trilha e curso leem por `levelId`; N4–N1 existem em `levels.js` com `status: 'soon'` e arrays vazios até haver conteúdo.

### 4. Progresso e migração localStorage

- Camada `progress.js` encapsula leitura/escrita.
- Na primeira carga da versão nova: se existirem `nh` / `nhxp` / `nhspd`, importar para o modelo interno e manter as mesmas chaves (ou escrever nas novas **e** espelhar nas antigas por uma versão).
- Preferência: **manter as chaves atuais** nesta mudança para zero atrito; versionar schema só se o formato interno mudar de forma incompatível.

### 5. Git / GitHub / entrega

- Instalar Git for Windows (ou garantir `git` no PATH).
- `git init`, `.gitignore` (node_modules, dist local se aplicável), commit inicial, criar repo no GitHub (`gh` ou UI), `git remote add`, push.
- GitHub Pages via Actions: build Vite → publicar `dist/`.
- CI no mesmo workflow (ou separado): `npm ci` + `npm run build` (+ smoke opcional com checagem de `index.html` gerado).
- Branch principal: `main`.

### 6. Remoção de duplicatas na migração

- Ao extrair o JS, consolidar uma única implementação de escrita/quiz/kanji overlay (a última versão funcional do monólito: verificação com cobertura `strokePrec` / `coverage`).
- Teste manual checklist: trilha, curso, kana, kanji card/escrita, quiz, exercícios, XP, idiomas PT/EN/ES na UI shell.

## Risks / Trade-offs

- [Quebra de progresso local] → `progress.js` com import explícito das chaves atuais e teste manual com dados pré-populados.
- [Regressão por funções duplicadas mal escolhidas] → checklist de smoke + preservar `legacy/` até validar.
- [Git ausente no Windows do usuário] → tarefa explícita de instalação antes de remote/push.
- [Pages delay / cache] → documentar hard refresh; Actions mostra URL e status do deploy.
- [Vite adiciona Node como dependência de desenvolvimento] → aceitável; runtime do aluno continua estático sem Node.
- [Escopo N5→N1 parecer “pronto” demais] → UI mostra N4+ como “em breve”; specs e tasks não prometem conteúdo.

## Migration Plan

1. Instalar Git + Node (LTS) no ambiente.
2. Scaffold Vite e migrar CSS/dados/módulos a partir do HTML atual.
3. Validar localmente (`npm run dev` / `build`) com checklist N5.
4. Inicializar Git, push para GitHub, ativar workflow Pages.
5. Confirmar URL pública; arquivar monólito em `legacy/` quando a paridade estiver ok.
6. Rollback: republicar commit anterior ou restaurar o HTML legado na raiz se a Pages quebrar.

## Open Questions

- Nome final do repositório GitHub e se a conta já existe / `gh` autenticado (resolver na aplicação das tasks de delivery).
- Se o usuário prefere Pages em `username.github.io/repo` (project site) ou domínio customizado — default: project site.
