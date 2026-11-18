# Spec Delta

## Purpose

Define a trilha e o curso de estudo de japonês organizados por nível JLPT, começando em N5 com estrutura preparada para estender até N1.

## ADDED Requirements

### Requirement: Níveis JLPT disponíveis
O sistema MUST expor o nível N5 como conteúdo estudável e MUST reservar os níveis N4, N3, N2 e N1 como níveis futuros identificáveis na interface (mesmo que ainda sem conteúdo completo).

#### Scenario: Aluno vê o nível N5 ativo
- **WHEN** o aluno abre a área de currículo ou kanji por nível
- **THEN** o nível N5 aparece disponível para estudo

#### Scenario: Níveis superiores ainda não liberados
- **WHEN** o aluno visualiza níveis além de N5
- **THEN** o sistema indica que o conteúdo está em breve ou indisponível, sem permitir estudo completo desses níveis

### Requirement: Trilha sequencial por fases
O sistema MUST oferecer uma trilha de fases ordenadas para o nível ativo, em que a primeira fase começa liberada e as seguintes só liberam após o aluno atingir o limiar de aprovação da fase anterior.

#### Scenario: Primeira fase liberada
- **WHEN** um aluno novo abre a trilha N5
- **THEN** a fase 1 está disponível e as demais fases bloqueadas aparecem como bloqueadas

#### Scenario: Desbloqueio após aprovação
- **WHEN** o aluno conclui uma fase com pontuação de pelo menos 70%
- **THEN** a fase seguinte fica liberada

#### Scenario: Reprovação mantém bloqueio
- **WHEN** o aluno conclui uma fase com menos de 70%
- **THEN** a fase seguinte permanece bloqueada e o aluno pode refazer a fase atual

### Requirement: Curso com lições marcáveis
O sistema MUST oferecer um curso com lições listáveis que o aluno possa abrir, estudar e marcar como concluídas, preservando o conjunto de lições concluídas entre sessões no mesmo navegador.

#### Scenario: Concluir lição
- **WHEN** o aluno marca uma lição como concluída
- **THEN** a lição aparece como concluída na lista e o progresso permanece após recarregar a página

### Requirement: Fases misturam habilidades
Cada fase da trilha (exceto fases introdutórias de kana, quando aplicável) MUST combinar pelo menos duas habilidades entre vocabulário, audição, leitura, gramática, partículas ou kanji.

#### Scenario: Fase mista apresenta vários tipos
- **WHEN** o aluno inicia uma fase que não é só introdutória de kana
- **THEN** a sessão inclui mais de um tipo de questão
