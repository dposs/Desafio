# Desafio Luizalabs [![License: GPL v3+](https://img.shields.io/badge/License-GPL%20v3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Requisitos Técnicos

- Node.js v12.18.4
- NPM v6.14.6
- MySQL v8.0.16 (MySQL Community Server - GPL)
- Gulp v4.0.2 (Opcional)

## Instalação

**1. Bibliotecas**

Importar as bibliotecas através do comando `npm install`.

**2. Configuração**

Configurar as propriedades de acesso ao Banco de Dados, contidas no arquivo `./config/default.js`:

- database.mysql.challenge.host
- database.mysql.challenge.port
- database.mysql.challenge.username
- database.mysql.challenge.port

**3. Banco de Dados**

Realizar a importação do Banco de Dados, que pode ser executada de duas formas diferentes:
- Executando o comando `gulp install` (necessário possuir `mysql` e `gulp` disponíveis na linha de comando).
- Importando manualmente, através do arquivo `./database/instal.sql`.

**4. Ambiente (Opcional)**

O ambiente de execução pode ser definido através da variável de ambiente `NODE_ENV` do sistema operacional.  
Porém, para este desafio, não é obrigatório visto que **não** possuímos configurações específicas por ambiente (QA, Production, etc..).

## Execução

Iniciar a API através do comando `npm start`.

## Autenticação

A autenticação é realizada através de Json Web Token (JWT) (https://jwt.io).  
RFC: https://tools.ietf.org/html/rfc7519

O endpoint `/challenge/login` deve ser utilizado para autenticação. No seu retorno constará o Token JWT, que deve ser utilizado para autorizar o acesso do Consumidor à todos os endpoints protegidos, através do seguinte header:

- ```Authorization: Bearer TOKEN_JWT```

> Antes de efetuar o Login, o Consumidor deve ser cadastrado através do endpoint `/challenge/customer`.

## Documentação API

https://documenter.getpostman.com/view/2913353/TVRhc9hC

> A documentação acima também pode ser utilizada para download e importação das requisições na ferramenta Postman.

## Testes Automatizados

**Integração**

Os testes de integração podem ser executados através do comando:

- ```npm run test```

A cobertura de código pode ser verificada através do comando:

- ```npm run test-coverage```

**Preview** (Test + Coverage)

[![Integration Test](https://i.ibb.co/n1SvpLG/integration-test-preview.png)](https://ibb.co/n1SvpLG)

## Possíveis Melhorias

- [ ] Desenvolvimento de sistema de cache para autenticação de Consumidores (Performance).
- [ ] Worker Threads / Cluster (verificar casos de uso) (Performance).