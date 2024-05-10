# README para o Backend do App de Ajuda em Enchentes

Este repositório contém o backend de um aplicativo desenvolvido para organizar e distribuir suprimentos, bem como
coordenar voluntários durante os alagamentos no Rio Grande do Sul. O backend fornece APIs para autenticação de usuários,
gerenciamento de abrigos e suprimentos, entre outros.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Prisma**: ORM para Node.js e TypeScript.
- **Docker**: Plataforma para desenvolvimento, envio e execução de aplicativos em contêineres.
- **Nest**: Framework para aplicação web para Node.js.
- **PostgreSQL**: Banco de dados relacional para armazenar dados de forma eficiente.

## Dump do banco de dados

Após toda a configuração feita, seja local ou via docker, você pode subir um dump do servidor para ter dados iniciais
para testar a aplicação.
O dump está disponível no arquivo `prisma/migration/dev_dump.sql`. Para subir o dump, basta executar ele.
Lembrando que a migrations já deve ter sido rodada para ele funcionar.

Caso esteja no docker o dump pode ser carregado com os seguintes comandos:

```bash
# Copiando o dump para a pasta temporária do docker
docker exec -it cp backup.sql POSTGRES_CONTAINER_ID:/tmp/backup.sql
# Importando o dump para o banco
docker exec -i POSTGRES_CONTAINER_ID psql -U root -d DATABASE_NAME -f /tmp/backup.sql
```

## Configuração com Docker

Caso você esteja desenvolvendo frontend e não precise rodar uma instancia da API e do banco localmente, siga essas
instruções:

1. Clone o .env de exemplo:
   ```bash
   cp .env.local .env
   ```

2. Criar e iniciar o banco via docker. Esse comando irá subir um container com a API e outro container com o banco
   Postgresql.
   Além disso, ele também irá rodar as migrations do Prisma e terá um banco com o schema já configurado.

    ```bash
    docker-compose -f docker-compose.dev.yml up
    ```

Se você estiver tendo problemas para acessar o banco via um gerenciador (dbeaver, etc), pode ser preciso adicionar o
port do serviço db no docker-compose.dev.yml

```yaml
ports:
  - '5432:5432'
  - '4000:4000'
```

## Configuração inicial para rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/projeto-enchentes-backend.git
   ```
2. Entre no diretório do projeto:
   ```bash
   cd projeto-enchentes-backend
   ```
3. Instale as dependências:
   ```bash
   npm install 
   npx prisma generate 
   npx prisma migrate dev 
   npm run start:dev
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   A API estará acessível via `http://localhost:4000`.

## API Endpoints

### Usuários

- **POST /users** - Cadastrar um novo usuário.
- **PUT /users** - Atualizar um usuário existente.

### Sessões

- **POST /sessions** - Criar uma nova sessão de usuário (login).
- **GET /sessions/:sessionId** - Obter detalhes de uma sessão.
- **PUT /sessions/:sessionId** - Atualizar uma sessão específica.

### Abrigos

- **POST /shelters** - Cadastrar um novo abrigo.
- **PUT /shelters/:shelterId** - Atualizar um abrigo existente.
- **GET /shelters** - Listar abrigos.

### Suprimentos

- **POST /supply** - Cadastrar um novo item de suprimento.
- **PUT /supplies/:supplyId** - Atualizar um suprimento.
- **GET /supplies** - Listar suprimentos.

### Categorias de Suprimentos

- **POST /supply-categories** - Cadastrar uma nova categoria de suprimentos.
- **PUT /supply-categories/:categoryId** - Atualizar uma categoria de suprimentos.
- **GET /supply-categories** - Listar categorias de suprimentos.

## Contribuição

Contribuições são bem-vindas! Se quiser contribuir, por favor faça um fork do repositório, crie uma branch para suas
modificações e depois envie um pull request.

Sua participação é essencial para ajudarmos a comunidade afetada pelas enchentes no Rio Grande do Sul!
