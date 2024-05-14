# 🌊 Backend para App de Ajuda em Enchentes 🌊

Este repositório contém o backend de um aplicativo projetado para ajudar na organização e distribuição de suprimentos,
bem como na coordenação de voluntários durante enchentes no Rio Grande do Sul. Ele fornece APIs essenciais para a
autenticação de usuários, gerenciamento de abrigos e suprimentos, e muito mais.

Se você quiser discutir ideias, problemas ou contribuições, sinta-se à vontade para se juntar ao nosso servidor do
Discord [aqui](https://discord.gg/vjZS6BQXvM).

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
   make install
   ```
3. Inicie o servidor:
   ```bash
   make start
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

## 🤝 Contribuição

Contribuições são muito bem-vindas! Se deseja ajudar, faça um fork do repositório, crie uma branch com suas
modificações, e envie um pull request.

Sua ajuda é crucial para apoiar a comunidade afetada pelas enchentes no Rio Grande do Sul!

