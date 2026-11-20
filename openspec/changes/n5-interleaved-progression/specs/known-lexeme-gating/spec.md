# Spec Delta

## Purpose

Garantir que exercícios da trilha — inclusive audição e leitura — só usem palavras e estruturas já introduzidas até a fase atual, evitando frases com vocabulário desconhecido.

## ADDED Requirements

### Requirement: Conjunto de léxico introduzido
O sistema MUST manter, para cada ponto da trilha, o conjunto de léxico (e estruturas gramaticais marcadas) já apresentado nas fases anteriores e na fase atual em estudo.

#### Scenario: Após estudar um pacote
- **WHEN** o aluno completa a tela de estudo de uma fase que introduz palavras novas
- **THEN** essas palavras passam a contar como introduzidas para exercícios dessa fase e das seguintes

### Requirement: Choukai só com léxico conhecido
Itens de audição na trilha MUST ser selecionados apenas entre aqueles cujos tokens lexicais estão no conjunto introduzido até a fase atual.

#### Scenario: Sem frase prematura na audição
- **WHEN** o aluno faz um exercício de choukai numa fase intermediária
- **THEN** nenhuma opção de item de audição contém palavra ainda não introduzida na trilha até aquela fase

### Requirement: Dokkai só com léxico conhecido
Itens de leitura na trilha MUST ser selecionados apenas entre aqueles cujos tokens lexicais estão no conjunto introduzido até a fase atual.

#### Scenario: Texto de leitura compreensível
- **WHEN** o aluno faz um exercício de dokkai numa fase intermediária
- **THEN** o texto e as alternativas usam apenas palavras já introduzidas até aquela fase

### Requirement: Quizzes de frase e montagem restritos
Quizzes de partícula/frase e atividades de montar frase na trilha MUST usar apenas léxico e partículas já introduzidos.

#### Scenario: Montagem pós-は
- **WHEN** o aluno monta frases na etapa inicial de は
- **THEN** as peças disponíveis são só palavras da lista segura dessa etapa (já vistas no kana/apresentação)

#### Scenario: Quiz de partícula intermediário
- **WHEN** um quiz de partícula é gerado numa fase intermediária
- **THEN** o enunciado e as opções não introduzem vocabulário fora do conjunto conhecido até aquela fase

### Requirement: Fallback quando o banco filtrado é curto
Se, após o filtro por léxico conhecido, houver poucos itens elegíveis, o sistema MUST completar a sessão só com itens elegíveis (repetindo se necessário) e MUST NOT puxar itens do banco geral não filtrado.

#### Scenario: Pool pequeno de dokkai
- **WHEN** só existem três textos de dokkai elegíveis para a fase
- **THEN** a sessão usa apenas esses itens (com reutilização se a fase pedir mais questões) e não inclui textos com palavras desconhecidas
