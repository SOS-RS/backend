# 🌊 Backend para App de Ajuda em Enchentes 🌊

Este repositório contém o backend de um aplicativo projetado para ajudar na organização e distribuição de suprimentos,
bem como na coordenação de voluntários durante enchentes no Rio Grande do Sul. Ele fornece APIs essenciais para a
autenticação de usuários, gerenciamento de abrigos e suprimentos, e muito mais.

Se você quiser discutir ideias, problemas ou contribuições, sinta-se à vontade para se juntar ao nosso servidor do
Discord [aqui](https://discord.gg/vjZS6BQXvM).

## Workspace Dependencies
- [Node 18.18](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started/)
- Make
  - [Windows](https://gnuwin32.sourceforge.net/packages/make.htm)
  - Linux
  ```bash
  sudo apt update
  sudo apt install make
  ```

## 🛠 Tecnologias Utilizadas

- **🟢 Node.js**: Ambiente de execução para JavaScript.
- **🔗 Prisma**: ORM para Node.js e TypeScript, facilitando o gerenciamento do banco de dados.
- **🐳 Docker**: Solução para desenvolvimento e execução de aplicativos em contêineres.
- **🐦 Nest**: Framework de alto desempenho para aplicações web em Node.js.
- **📦 PostgreSQL**: Banco de dados relacional robusto e eficiente.

## 🗂 Dump do Banco de Dados

Para iniciar com dados de exemplo, utilize o dump do banco disponível em `prisma/migration/dev_dump.sql`. Este arquivo
pode ser executado após as migrations estarem aplicadas.

Se estiver usando Docker, você pode usar o comando `make dev-db-load-dump` para carregar automaticamente.

## 🐳 Configuração com Docker

Para desenvolvedores de frontend que não precisam executar localmente a API e o banco, siga estes passos:


1. Clone o arquivo `.env` de exemplo:
   ```bash
   cp .env.local .env
   ```

2. Use o seguinte comando para criar e iniciar o banco via Docker:
    ```bash
    docker-compose -f docker-compose.dev.yml up
    ```
Usando make:

 ```bash
   make setup-docker
```

## 🚀 Configuração Inicial Local
Se você estiver recebendo algum erro relacionado a PORT da DATABASE_URL, tem uma linha comentada no .env que pode ser
descomentada para resolver o problema.

## Configuração inicial para rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/projeto-enchentes-backend.git
   ```
2. Instale as dependências:

   ```bash
   make setup

   # ou sem make 

   npm install 
   npx prisma generate 
   npx prisma migrate dev 
   npm run start:dev

   ```
3. Inicie o servidor:

   ```bash
   make start
   
   # ou sem make 
   npm start 
   ```
   A API estará disponível em `http://localhost:4000`.

## 📡 API Endpoints

### 🧑‍💻 Usuários

- **📝 POST /users** - Registra um novo usuário.
- **🔧 PUT /users** - Atualiza um usuário existente.

### 🚪 Sessões

- **📝 POST /sessions** - Inicia uma nova sessão de usuário.
- **👀 GET /sessions/:sessionId** - Retorna detalhes de uma sessão.
- **🔧 PUT /sessions/:sessionId** - Atualiza uma sessão.

### 🏠 Abrigos

- **📝 POST /shelters** - Registra um novo abrigo.
- **🔧 PUT /shelters/:shelterId** - Atualiza um abrigo.
- **👀 GET /shelters** - Lista abrigos.

### 📦 Suprimentos

- **📝 POST /supply** - Registra um novo item de suprimento.
- **🔧 PUT /supplies/:supplyId** - Atualiza um suprimento.
- **👀 GET /supplies** - Lista suprimentos.

### 🏷️ Categorias de Suprimentos

- **📝 POST /supply-categories** - Registra uma nova categoria de suprimentos.
- **🔧 PUT /supply-categories/:categoryId** - Atualiza uma categoria.

Claro, aqui está a documentação para esses comandos:

---

### Comandos Make

#### Instalação e Configuração do Projeto

- **install:**
  - `make install`
  - Instala as dependências do projeto usando o npm.

- **prisma:**
  - `make prisma`
  - Gera os artefatos do Prisma executando `npx prisma generate` e aplica as migrações do banco de dados executando `npx run migrations:dev`.

- **setup:**
  - `make setup`
  - Configura o ambiente de desenvolvimento, desativando o `fileMode` do Git, criando um arquivo `.env` se ele não existir e executando os comandos `install` e `prisma`.

- **file-mode:**
  - `make file-mode`
  - Configura o Git para desativar o `fileMode`.

- **create.env.file:**
  - `make create.env.file`
  - Cria um arquivo `.env` a partir de `.env.local` se o arquivo `.env` ainda não existir.

#### Inicialização e Execução do Projeto

- **start:**
  - `make start`
  - Inicia o projeto em modo de desenvolvimento executando `npm run start:dev`, após configurar o ambiente com `setup`.

- **start-debug:**
  - `make start-debug`
  - Inicia o projeto em modo de depuração executando `npm run start:debug`, após configurar o ambiente com `setup`.

- **build:**
  - `make build`
  - Compila o projeto executando `npm run build`.

#### Testes e Verificação

- **test:**
  - `make test`
  - Executa os testes do projeto.

- **test-coverage:**
  - `make test-coverage`
  - Executa os testes com cobertura.

- **test-debug:**
  - `make test-debug`
  - Executa os testes em modo de depuração.

- **test-e2e:**
  - `make test-e2e`
  - Executa os testes end-to-end.

#### Docker e Ambiente de Desenvolvimento

- **dev-up:**
  - `make dev-up`
  - Inicia os serviços de desenvolvimento usando Docker Compose (`docker-compose.dev.yml`).

- **setup-docker:**
  - `make setup-docker`
  - Configura o ambiente de desenvolvimento com Docker, desativando o `fileMode` do Git, criando um arquivo `.env` se ele não existir e iniciando os serviços de desenvolvimento.

- **dev-down:**
  - `make dev-down`
  - Desliga os serviços de desenvolvimento iniciados com Docker Compose.

- **bash:**
  - `make bash`
  - Acessa o terminal do contêiner específico `sos-rs-api` para execução de comandos específicos.

- **dev-logs:**
  - `make dev-logs`
  - Exibe os logs dos serviços de desenvolvimento iniciados com Docker Compose.

- **dev-db-load-dump:**
  - `make dev-db-load-dump`
  - Carrega um dump no banco de dados de desenvolvimento.

#### Docker Builds e Tags

- **docker-build:**
  - `make docker-build`
  - Constrói a imagem Docker do projeto.

- **docker-tag:**
  - `make docker-tag`
  - Adiciona tags à imagem Docker para identificação.

#### Produção

- **prod-up:**
  - `make prod-up`
  - Inicia os serviços de produção usando Docker Compose.

- **prod-down:**
  - `make prod-down`
  - Desliga os serviços de produção e remove as imagens Docker.

---


## 🤝 Contribuição

Contribuições são muito bem-vindas! Se deseja ajudar, faça um fork do repositório, crie uma branch com suas
modificações, e envie um pull request.

Sua ajuda é crucial para apoiar a comunidade afetada pelas enchentes no Rio Grande do Sul!

