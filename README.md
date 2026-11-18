# Nihongo Start

App web para aprender japonês (JLPT N5 → N1). Stack: Vite + JavaScript vanilla.

**Repositório:** https://github.com/CaioTakahata/nihongo-start  
**Site (GitHub Pages):** https://caiotakahata.github.io/nihongo-start/ (após o workflow de deploy estar ativo)

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Atualizar e testar no GitHub

1. Altere o código localmente e confira com `npm run dev`.
2. `git add` + `git commit` + `git push` no branch `main`.
3. O GitHub Actions faz build e publica no GitHub Pages.
4. Abra https://caiotakahata.github.io/nihongo-start/ (hard refresh se necessário).
5. Em **Settings → Pages**, a source deve ser **GitHub Actions**.

## Estrutura

- `src/data/` — kana, kanji, lições, fases, níveis JLPT
- `src/modules/` — progresso, currículo, prática, UI
- `legacy/` — HTML monolítico original (referência)

## Progresso do aluno

O app usa `localStorage` com as chaves `nh`, `nhxp` e `nhspd` (compatível com a versão legada).
