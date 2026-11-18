# Spec Delta

## Purpose

Gerenciar XP, títulos de nível, desbloqueio de fases, conclusão de lições e persistência local do progresso do aluno no navegador.

## ADDED Requirements

### Requirement: Ganho de XP por atividades
O sistema MUST conceder XP por atividades de estudo e prática (por exemplo acertos, conclusão de fase ou lição) e MUST exibir o total de XP e o nível atual do aluno.

#### Scenario: XP após acerto
- **WHEN** o aluno acerta uma questão elegível a XP
- **THEN** o total de XP aumenta e a barra de progresso reflete o novo valor

#### Scenario: Subida de nível
- **WHEN** o XP acumulado cruza o limiar do nível atual
- **THEN** o sistema exibe o novo nível ao aluno

### Requirement: Recompensa única por conquista
Para conquistas marcadas como únicas (ex.: primeira conclusão de uma lição ou kanji específico), o sistema MUST conceder o XP associado no máximo uma vez.

#### Scenario: Segunda conclusão não duplica XP único
- **WHEN** o aluno completa novamente uma conquista já recompensada
- **THEN** o XP daquela conquista não é concedido de novo

### Requirement: Persistência local do progresso
O sistema MUST persistir no armazenamento local do navegador pelo menos: XP e conquistas únicas, progresso da trilha por fase, lições concluídas e preferência de velocidade de áudio.

#### Scenario: Progresso sobrevive ao reload
- **WHEN** o aluno recarrega a página após estudar
- **THEN** XP, fases concluídas e lições marcadas permanecem como antes do reload

### Requirement: Compatibilidade com dados existentes
Se já existirem dados nas chaves locais usadas pelo app atual (`nh`, `nhxp`, `nhspd`), o sistema MUST lê-los sem apagar o progresso do aluno, ou MUST migrá-los automaticamente para o novo formato sem perda.

#### Scenario: Aluno com progresso antigo
- **GIVEN** o navegador já contém progresso salvo pelo monólito atual
- **WHEN** o aluno abre a versão refatorada
- **THEN** o progresso anterior continua disponível
