# Spec Delta

## Purpose

Permitir versionar o Nihongo Start no GitHub e publicar uma versão web testável após cada atualização relevante no repositório.

## ADDED Requirements

### Requirement: Código versionado no Git
O projeto MUST estar sob controle de versão Git, com histórico de commits que cubra o código do aplicativo e a documentação mínima de uso.

#### Scenario: Repositório inicializado
- **WHEN** o ambiente de desenvolvimento do projeto está configurado
- **THEN** o diretório do projeto é um repositório Git com remoto GitHub configurado

### Requirement: Publicação web para teste
O sistema MUST ser publicável em uma URL HTTPS pública (por exemplo GitHub Pages) a partir do repositório, para que o autor possa abrir e testar a versão publicada.

#### Scenario: Abrir versão publicada
- **WHEN** uma atualização é publicada pelo fluxo configurado
- **THEN** a URL pública serve o aplicativo e as abas principais carregam sem erro bloqueante

### Requirement: Atualização contínua via push
Uma alteração enviada ao branch principal do repositório MUST disparar (ou documentar claramente o comando/fluxo que dispara) a atualização da versão publicada usada para testes.

#### Scenario: Push atualiza a entrega
- **WHEN** o autor envia commits ao branch principal com o fluxo de entrega ativo
- **THEN** a versão publicada passa a refletir essas alterações após o job de deploy concluir com sucesso

### Requirement: Verificação automática mínima
O repositório MUST incluir verificação automática mínima no GitHub Actions (lint, build ou smoke) que falhe quando a entrega básica do app estiver quebrada.

#### Scenario: CI falha em artefato inválido
- **WHEN** um push introduz um erro que impede build ou smoke check
- **THEN** o workflow do GitHub Actions reporta falha

#### Scenario: CI passa em estado saudável
- **WHEN** o branch principal está em estado saudável
- **THEN** o workflow de verificação conclui com sucesso
