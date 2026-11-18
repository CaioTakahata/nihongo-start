# Tasks

## 1. Ambiente e scaffold

- [x] 1.1 Instalar Git for Windows (e garantir `git --version` no PATH) e Node.js LTS (`node -v` / `npm -v`); verificar os dois comandos no PowerShell
- [x] 1.2 Criar scaffold Vite (vanilla JS) na raiz do projeto com `index.html`, `src/main.js`, `src/styles/app.css` e pastas `src/data` e `src/modules`; verificar que `npm install` e `npm run dev` sobem sem erro
- [x] 1.3 Adicionar `.gitignore` adequado (node_modules, dist, .env) e um `README.md` com como rodar localmente; verificar que o README descreve `npm install` / `npm run dev` / `npm run build`
- [x] 1.4 Mover o monólito atual para `legacy/Nihongo Start – Hiragana, Katakana, Kanji.html` (ou equivalente) após o scaffold existir; verificar que o arquivo legado ainda abre no navegador

## 2. Dados e currículo JLPT

- [x] 2.1 Extrair kana, kanji N5, strokes e i18n de UI (`T`) para `src/data/*`; verificar imports no app sem ReferenceError
- [x] 2.2 Criar `src/data/levels.js` com N5 ativo e N4–N1 como `soon`; verificar que a UI de níveis mostra N5 disponível e os demais como em breve
- [x] 2.3 Extrair lições do curso N5 para `src/data/lessons-n5.js` e fases da trilha para `src/data/phases-n5.js`; verificar que o número de lições/fases bate com o legado
- [x] 2.4 Implementar `src/modules/curriculum.js` para listar/abrir lições e fases por `levelId`; verificar listagem N5 e bloqueio de níveis `soon`

## 3. Progresso do aluno

- [x] 3.1 Implementar `src/modules/progress.js` lendo/escrevendo `nh`, `nhxp` e `nhspd` com a mesma semântica do legado; verificar round-trip no DevTools Application → Local Storage
- [x] 3.2 Migrar XP, títulos, `xpOnce`, barra de nível e persistência da trilha para o módulo de progresso; verificar ganho de XP e que conquista única não duplica
- [x] 3.3 Com dados pré-populados do legado no localStorage, abrir o app novo e verificar que lições, XP e melhor % da trilha permanecem

## 4. Prática (kana, kanji, quiz, escrita)

- [x] 4.1 Migrar grades de hiragana/katakana + TTS e seletor de velocidade; verificar toque→áudio e persistência de `nhspd`
- [x] 4.2 Migrar lista/cards de kanji (on/kun, categorias, overlay); verificar abrir card e navegar entre kanji
- [x] 4.3 Consolidar uma única implementação de prática/teste de escrita (versão final do legado com cobertura) em `practice/writing.js`; verificar feedback de traço certo/errado em kana e kanji com modelo
- [x] 4.4 Migrar quiz e exercícios N5 (vocabulário, audição, partículas, gramática, simulado); verificar pontuação e tela de revisão de erros
- [x] 4.5 Migrar trilha (learn → exercícios → resultado 70% → desbloqueio); verificar bloqueio/desbloqueio de fases e salvamento do melhor percentual

## 5. Entrega GitHub

- [x] 5.1 Inicializar repositório Git, fazer commit inicial do scaffold/app e verificar `git status` limpo após o commit
- [x] 5.2 Criar repositório no GitHub, configurar `remote origin` e push do branch `main`; verificar que o código aparece no GitHub
- [ ] 5.3 Adicionar workflow GitHub Actions de build + deploy para GitHub Pages a partir de `dist/`; verificar que o workflow conclui com sucesso e a URL pública carrega o app
- [ ] 5.4 Documentar no README o fluxo “alterar → commit → push → testar na URL”; verificar que um push de mudança trivial (ex.: texto do subtítulo) reflete na Pages após o deploy

## 6. Integração e smoke

- [ ] 6.1 Rodar checklist manual na URL publicada: Trilha, Curso, Hiragana, Katakana, Kanji, Quiz, Exercícios, Tips, troca de idioma da shell; verificar ausência de erros bloqueantes no console
- [ ] 6.2 Confirmar `npm run build` local e o job de CI em verde no último commit de `main`

## Workflow follow-up

- Arquivar a change OpenSpec após a implementação e o review estarem ok.
- Próximas changes: conteúdo N4+, PWA/offline, app nativo se desejado.
