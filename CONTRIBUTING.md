# Contribuindo

Você pode contribuir com o projeto de diversas formas, implementando uma
funcionalidade nova, corrigindo um bug, procurando bugs, revisando pull
requests, entre outras.
Para se inteirar do projeto, entre no
[Discord](https://discord.gg/vjZS6BQXvM) e participe das discussões.

## 🤝 Contribuindo com atividades que não são de código

O projeto precisa de ajuda em diversas frentes diferentes como: QA, produto,
design e gestão. Entre no servidor do Discord onde há canais específicos para
essas atividades.

Se você encontrou um bug, vá nas
[issues](https://github.com/SOS-RS/backend/issues)
do projeto e reporte-o lá. Verifique antes se já não existe um bug aberto para o
problema que quer relatar, usando a busca. O mesmo vale para novas
funcionalidades.

O restante deste documento focará nas contribuições de código.

## ✅ Escolhendo qual será sua contribuição de código

Verifique no [projeto do Github](https://github.com/orgs/SOS-RS/projects/1)
quais funcionalidades ainda não foram implementadas e já estão prontas para
serem desenvolvidas, elas estarão na coluna "Disponível pra dev". Lá há itens de
backend e frontend, então atente-se para qual você gostaria de participar.

Após escolher o item que quer trabalhar, faça um comentário no issue informando
que quer contribuir para sua entrega. Uma pessoa que administra o repositório
marcará você como a pessoa responsável por aquele issue, e marcará o item como
"Em desenvolvimento".

A partir daí você já pode trabalhar no item que escolheu.

Você também pode mandar a contribuição diretamente sem avisar, mas corre o
risco de alguém solicitar para trabalhar no item e entregá-lo junto ou antes de
você, desperdiçando assim esforços. Somente faça isso se a correção for bem rápida e pontual para
evitar o desperdício.

⚠️ **Importante**: Itens de alta prioridade precisam ser entregues o mais rápido possível,
idealmente em até dois dias. Verifique se tem tempo livre suficiente para se
dedicar a um item de urgência, a fim de evitar segurar o item por tempo demais
de forma desnecessária.

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

## 💻 Codificando e enviando

1. Faça suas alterações. Não deixe de criar os testes.
2. Rode os testes com `npm test`, feitos com [Jest](https://jestjs.io/).
3. Rode o lint com `npm run lint`.
4. Crie um branch com o git `git checkout -b nomedobranch`.
5. Faça um commit com `git commit`.
6. Faça um push para o seu repositório com `git push`.
7. [Sincronize seu repositório](#-sincronizando).
8. [Abra um pull request](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
  Não deixe de informar, no seu pull request, qual a issue que está fechando.
  Idealmente coloque um comentário no PR que já fechará a issue, como
  `fixes #xxxx` ou `closes #xxxx` (onde `xxxx` é o número do issue). Veja
  [como isso funciona](https://docs.github.com/pt/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests).
9. Acompanhe a revisão do PR. Algumas verificações automáticas serão feitas (o
   Github Actions rodará os testes, por exemplo). Se uma delas falhar, corrija-a, a
   revisão humana só começa quando estas checagem estão passando. Após abrir o
   PR uma pessoa que administra o projeto pode pedir revisões e alterações.
   Busque respondê-las o mais rápido possível para que o PR possa ser integrado.

## 🔄 Sincronizando

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

   Após o rebase, é importante rodar novamente a aplicação e verificar se tudo
   continua funcionando, inclusive os testes.

## 🗂 Dump do Banco de Dados

Para iniciar com dados de exemplo, utilize o dump do banco disponível em `prisma/dev_dump.sql`. Este arquivo
pode ser executado após as migrations estarem aplicadas.

Se estiver usando Docker, os comandos para carregar o dump são:

```bash
# Copiar o dump para a pasta temporária do Docker
docker cp prisma/dev_dump.sql sos-rs-db:/tmp/dump.sql
# Importar o dump para o banco
docker exec -i sos-rs-db psql -U root -d sos_rs -f /tmp/dump.sql
```

## 🐳 Configuração com Docker

Para desenvolvedores de frontend que não precisam executar localmente a API e o banco, siga estes passos:

1. Clone o arquivo `.env` de exemplo:

   ```bash
   cp .env.local .env
   ```

   Se você não fizer este passo você precisa adicionar as portas no
   `docker-compose.dev.yml` para permitir acessos externos:

      ```yaml
      ports:
        - '5432:5432'
        - '4000:4000'
      ```

2. Use o seguinte comando para criar e iniciar o banco via Docker:

    ```bash
    docker-compose -f docker-compose.dev.yml up
    ```
