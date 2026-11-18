# Proposal

## Why

O Nihongo Start hoje é um único HTML monolítico (~460 linhas) com lógica duplicada, difícil de evoluir além do N5, e sem Git/GitHub — o que impede versionar, publicar e testar atualizações de forma contínua. Para virar um aplicativo de ensino do japonês de N5 a N1, é preciso estruturar o código, formalizar o currículo e conectar o fluxo de entrega no GitHub.

## What Changes

- Reorganizar o app monolítico em módulos claros (dados, UI, prática, progresso) sem perder as funcionalidades atuais de N5.
- Introduzir uma estrutura de currículo JLPT preparada para crescer de N5 até N1 (níveis, fases, conteúdo por nível).
- Preservar e estabilizar modos de prática: kana, kanji, quiz, trilha, exercícios, escrita e áudio.
- Formalizar progresso do aluno (XP, conclusão de fases, persistência local) com regras testáveis.
- Instalar/configurar Git no ambiente, criar repositório remoto no GitHub e publicar o app (GitHub Pages ou equivalente) para atualizar e testar a cada push.
- Adicionar CI mínima (validação/smoke) para confiar nas atualizações.
- Fora de escopo nesta mudança: app nativo (Android/iOS), backend/conta de usuário, conteúdo completo N4–N1 (apenas a fundação e placeholders/estrutura), redesign visual completo.

## Capabilities

### New Capabilities
- `jlpt-curriculum`: trilha e curso estruturados por nível JLPT (começando em N5, com extensão até N1).
- `script-practice`: estudo e prática de hiragana, katakana e kanji (grade, flashcards, escrita, quiz, TTS).
- `learner-progress`: XP, desbloqueio de fases, conclusão de lições e persistência local.
- `app-delivery`: entrega web versionada via Git/GitHub (incluindo publicação para teste contínuo).

### Modified Capabilities
- (nenhuma — projeto ainda sem specs principais)

## Impact

- Arquivo atual: `Nihongo Start – Hiragana, Katakana, Kanji.html` (monólito CSS/HTML/JS).
- Ambiente local: Git ainda não está disponível no PATH; será necessário instalar e inicializar o repositório.
- Novos artefatos esperados: estrutura de pastas do app, README, workflow GitHub Actions, config de Pages.
- Dependências: nenhuma obrigatória no runtime atual (vanilla); build tooling só se a refatoração exigir (ex.: Vite) — decisão no design.
- Dados do aluno em `localStorage` (`nh`, `nhxp`, `nhspd`) devem continuar compatíveis ou migrar de forma segura.
