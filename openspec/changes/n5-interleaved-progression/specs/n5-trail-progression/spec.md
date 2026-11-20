# Spec Delta

## Purpose

Define a progressão N5 na trilha como unidades entrelaçadas de vocabulário, gramática, audição, leitura e kanji, com learn-first e desbloqueio sequencial até cobrir o léxico e as leituras do nível.

## ADDED Requirements

### Requirement: Unidades entrelaçadas na trilha
A trilha N5 MUST organizar o conteúdo em unidades progressivas em que cada unidade introduz um pacote limitado de goi e/ou bunpou e, na mesma unidade ou imediatamente a seguir, oferece prática e verificação que misturam esses skills com choukai e/ou dokkai e, quando couber, kanji relacionados — em vez de esgotar uma área inteira antes das outras.

#### Scenario: Unidade com verbo novo
- **WHEN** o aluno entra na unidade que introduz たべます (e palavras do tema alimentar)
- **THEN** a unidade inclui estudo do léxico/estrutura novos, exercício de prática, e pelo menos uma atividade de audição ou leitura que use apenas esse pacote mais o já desbloqueado

#### Scenario: Kanji entra após base lexical
- **WHEN** a unidade introduz kanji básicos relacionados (ex.: 日, 水)
- **THEN** esses kanji aparecem só depois que o aluno já viu as leituras/palavras associadas no goi da unidade ou em unidades anteriores

### Requirement: Learn-first por fase
Cada fase da trilha que apresenta conteúdo novo MUST exigir uma tela de estudo antes do exercício de verificação dessa fase.

#### Scenario: Primeiro acesso à fase
- **WHEN** o aluno inicia uma fase ainda não estudada que introduz conteúdo
- **THEN** o sistema mostra a tela de estudo primeiro e só então libera o exercício da fase

### Requirement: Desbloqueio sequencial
A trilha MUST manter as fases seguintes bloqueadas até o aluno atingir o critério de aprovação da fase atual (salvo modo explícito de desenvolvimento).

#### Scenario: Fase seguinte bloqueada
- **WHEN** o aluno ainda não aprovou a fase N
- **THEN** a fase N+1 permanece bloqueada na trilha

#### Scenario: Fase seguinte liberada
- **WHEN** o aluno atinge o critério de aprovação da fase N
- **THEN** a fase N+1 fica disponível

### Requirement: Orientação por acordeão preservada
A home da trilha MUST continuar agrupando fases em seções acordeão (hiragana, katakana, partículas, goi, bunpou, choukai, dokkai, kanji, simulados) para orientação, sem substituir a trilha por um caminho único estilo Duolingo.

#### Scenario: Seções na home
- **WHEN** o aluno abre a trilha
- **THEN** as fases aparecem agrupadas nas seções de orientação existentes, com numeração coerente com a ordem pedagógica linear

### Requirement: Cobertura cumulativa até o fim do N5
Ao concluir a trilha, o aluno MUST ter sido apresentado ao vocabulário N5 coberto pelo curso e às leituras dos kanji N5 do curso, com revisões cumulativas ao longo do caminho.

#### Scenario: Final da trilha
- **WHEN** o aluno completa a última unidade da trilha N5
- **THEN** o conteúdo apresentado até ali cobre o goi e os kanji N5 definidos no currículo do app, e as últimas fases incluem verificação mista (goi, bunpou, choukai, dokkai, kanji)
