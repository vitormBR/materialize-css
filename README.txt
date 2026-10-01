PROJETO CRUD DE FILMES

TECNOLOGIAS
- Node.js
- Express
- Express Handlebars
- Sequelize
- SQLite
- Materialize CSS

INSTALAÇÃO

1. Abra o terminal na pasta do projeto.

2. Instale as dependências:
   npm install

3. Inicie:
   npm start

4. Abra:
   http://localhost:3000

IMPORTANTE

O banco utilizado é:
   ./bd.sqlite

A aplicação sincroniza as tabelas automaticamente com:
   sequelize.sync({ alter: true })

ROTAS

/
 /filmes
 /filmes/cadastrar
 /filmes/:id

 /diretores
 /diretores/cadastrar
 /diretores/:id

 /artistas
 /artistas/cadastrar
 /artistas/:id

 /ficha-tecnica
 /ficha-tecnica/cadastrar
 /ficha-tecnica/:id

A ficha técnica só pode ser cadastrada para um filme que já exista na tabela Filmes.

O projeto converte os resultados do Sequelize com toJSON() antes de enviá-los ao Handlebars. Isso evita o erro de acesso a propriedades do Sequelize/Handlebars.
