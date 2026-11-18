# Spec Delta

## Purpose

Cobrir estudo e prática de hiragana, katakana e kanji com grades, flashcards, escrita, quiz e síntese de voz em japonês.

## ADDED Requirements

### Requirement: Grades de kana com áudio
O sistema MUST exibir grades de hiragana e katakana com leitura romanizada e MUST reproduzir o som do caractere em japonês quando o aluno o seleciona, se a síntese de voz do navegador estiver disponível.

#### Scenario: Ouvir hiragana
- **WHEN** o aluno toca um caractere na grade de hiragana
- **THEN** o sistema solicita a síntese de voz ja-JP para aquele caractere

#### Scenario: Alternar para katakana
- **WHEN** o aluno abre a aba Katakana
- **THEN** a grade mostra os caracteres katakana correspondentes com romanização

### Requirement: Estudo de kanji com leituras
O sistema MUST listar kanji com significado no idioma da interface e leituras on’yomi e kun’yomi, e MUST permitir abrir um card detalhado por kanji.

#### Scenario: Abrir card de kanji
- **WHEN** o aluno toca um kanji na lista
- **THEN** o sistema mostra o caractere, o significado no idioma atual e as leituras on/kun

### Requirement: Prática de escrita
O sistema MUST permitir que o aluno desenhe caracteres (kana ou kanji) na tela e MUST informar se o traçado atende aos critérios de verificação disponíveis para aquele caractere.

#### Scenario: Escrita guiada com feedback
- **WHEN** o aluno completa um traço válido no modo de prática guiada
- **THEN** o sistema confirma o progresso e indica o próximo traço ou a conclusão

#### Scenario: Escrita incorreta
- **WHEN** o aluno desenha um traço que não atende aos critérios
- **THEN** o sistema rejeita o traço e pede nova tentativa sem avançar indevidamente

### Requirement: Quiz de múltipla escolha
O sistema MUST oferecer quiz com pergunta e opções para kana e kanji, atualizando a pontuação da sessão a cada resposta.

#### Scenario: Resposta correta no quiz
- **WHEN** o aluno escolhe a opção correta
- **THEN** a pontuação aumenta e as opções ficam desabilitadas com indicação visual do acerto

#### Scenario: Resposta incorreta no quiz
- **WHEN** o aluno escolhe uma opção incorreta
- **THEN** a pontuação de acertos não sobe, a opção correta é destacada e as opções ficam desabilitadas

### Requirement: Velocidade de áudio configurável
O sistema MUST permitir ao aluno escolher a velocidade de fala e MUST persistir essa preferência no mesmo navegador.

#### Scenario: Mudar velocidade
- **WHEN** o aluno seleciona uma velocidade mais lenta
- **THEN** as próximas falas usam essa velocidade e a escolha permanece após recarregar a página
