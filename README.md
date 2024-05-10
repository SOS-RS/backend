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
3. Inicie o ambiente Docker Compose (Isso irá instalar as dependências):
   ```bash
   npm run docker:start
   ```
4. Acesse o bash do container (Se preferir, use o VSCode dev-container, abrindo o diretório `/usr/app/`):
   ```bash
   npm run docker:shell
   ```
4. Rode as migrations para criar as tabelas no banco de dados:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

   A API estará acessível via `http://localhost:4000`.

Para parar o ambiente Docker Compose, execute o seguinte comando no host:
```bash
npm run docker:stop
```

## Contribuição

Contribuições são bem-vindas! Se quiser contribuir, por favor faça um fork do repositório, crie uma branch para suas modificações e depois envie um pull request.


Sua participação é essencial para ajudarmos a comunidade afetada pelas enchentes no Rio Grande do Sul!
