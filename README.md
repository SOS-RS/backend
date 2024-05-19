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

Se estiver usando Docker, os comandos para carregar o dump são:

```bash
# Copiar o dump para a pasta temporária do Docker
docker exec -it cp backup.sql POSTGRES_CONTAINER_ID:/tmp/backup.sql
# Importar o dump para o banco
docker exec -i POSTGRES_CONTAINER_ID psql -U root -d DATABASE_NAME -f /tmp/backup.sql
```

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

Adicione a porta do serviço de banco no `docker-compose.dev.yml` para acessos externos:

```yaml
ports:
  - '5432:5432'
  - '4000:4000'
```

## 🚀 Configuração Inicial Local

1. Faça um fork do repositório para o seu usuário (uma boa ideia é usar um nome mais descritivo do que `backend`, como `sos-rs-backend`).
2. Clone o repositório (troque `<seuusuario>` na url abaixo pelo seu usuário):

   ```bash
   git clone https://github.com/<seuusuario>/sos-rs-backend.git
   ```

3. Faça uma cópia do arquivo `.env`, e altere `DB_HOST=sos-rs-db` para `DB_HOST=localhost`:

   ```bash
   sed 's/sos-rs-db/localhost/g' .env.local > .env
   # ou copie o arquivo e altere no seu editor preferido
   ```

4. Inicie o banco de dados com o Docker (adicione `-d` para rodar em background):

   ```bash
   docker compose -f docker-compose.dev.yml up db
   # ou em background:
   docker compose -f docker-compose.dev.yml up db -d
   # para ver os logs:
   docker logs sos-rs-db
   ```

5. Instale as dependências:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   ```

6. Inicie o servidor:

   ```bash
   npm start
   # ou com watch:
   npm run start:dev
   ```

   A API estará disponível em <http://localhost:4000>. Você poderá acessar o Swagger em <http://localhost:4000/api>.

7. Rode os testes:

   ```bash
   npm test
   # ou com watch:
   npm run test:watch
   ```

### Contribuindo

1. Faça suas alterações;
2. Rode os testes com `npm test`;
3. Rode o lint com `npm run lint`;
4. Crie um branch com o git `git checkout -b nomedobranch`;
5. Faça um commit com `git commit`;
6. Faça um push para o seu repositório com `git push`;
7. [Sincronize seu repositório](#sincronizando);
8. Abra um pull request.

## Sincronizando

Você vai precisar, de tempos em tempos, sincronizar a branch `develop` do
seu repositório. Você pode usar o botão `Sync fork` do Github
(veja [os docs](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)).
Ou você pode fazer manualmente, o que te permite fazer a sincronização sem depender do Github:

1. Antes de mais nada, se estiver no meio de uma contribuição, verifique que já commitou
   tudo que tinha pra commitar, e então faça checkout do branch `develop`:

   ```bash
   git checkout develop
   ```

2. Adicione o repositório oficial como remoto com nome `upstream` (só necessário na primeira vez):

   ```bash
   git remote add upstream https://github.com/SOS-RS/backend.git
   ```

3. Faça pull do branch `develop`:

   ```bash
   git pull upstream develop
   ```

4. Se estiver no meio de uma contribuição, faça um rebase no branch `develop`
   (substitua `<seubranch>` pelo nome do seu branch):

   ```bash
   git checkout <seubranch>
   git rebase develop
   ```


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
