# README para o Backend do App de Ajuda em Enchentes

Este repositório contém o backend de um aplicativo desenvolvido para organizar e distribuir suprimentos, bem como coordenar voluntários durante os alagamentos no Rio Grande do Sul. O backend fornece APIs para autenticação de usuários, gerenciamento de abrigos e suprimentos, entre outros.

## Sobre o Projeto

O sistema backend é projetado para ser robusto e escalável, garantindo que possa lidar com o alto volume de acessos durante emergências. Ele opera com diversas APIs que permitem a interação com o frontend e outros serviços potenciais.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para aplicação web para Node.js.
- **MongoDB**: Banco de dados NoSQL para armazenar dados de forma eficiente.
- **JWT**: Para autenticação segura via tokens.

## Backlog

- [ ] **Importar abrigos**: Importar a lista de abrigos e suas necessidades em csv para facilitar integração com outros sistemas.
- [ ] **Criar sistema de notificação**: Notificar em algum canal (whatsapp, discord, telegram) sobre atualizações.

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

## Configuração Inicial

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
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   A API estará acessível via `http://localhost:4000`.

## Deploy

A aplicação executa em um Lambda, da AWS. O deploy é realizado pela framework [Serverless][1]. Contudo, alguns passos extras devem ser feitos. Isto se deve ao fato de ser necessário realizar as migrações do Prisma durante a inicialização do Lambda. Para mais informações, favor consultar a [documentação][2].

:warning: Os passos abaixo são apenas necessários para realizar o deploy em um lambda!

Como os Lambdas rodam em uma versão modificada do RedHat linux, devemos dizer ao Prisma que queremos suportar esta versão. Na hora da instalação, devemos passar uma variável de ambiente:

```sh
PRISMA_CLI_BINARY_TARGETS=native,rhel-openssl-1.0.x npm install
```

Para realizar o deploy, basta executar:

```
npx prisma generate
npm run build
npx serverless deploy --verbose
```

## Contribuição

Contribuições são bem-vindas! Se quiser contribuir, por favor faça um fork do repositório, crie uma branch para suas modificações e depois envie um pull request.


Sua participação é essencial para ajudarmos a comunidade afetada pelas enchentes no Rio Grande do Sul!

[1]: https://www.serverless.com/
[2]: https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda