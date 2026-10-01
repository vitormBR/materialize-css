const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

const sequelize = require('./config/bd');

const artistas = require('./models/artista');
const diretores = require('./models/diretor');
const filmes = require('./models/filme');
const fichasTecnicas = require('./models/fichaTec');

require('./models/relacionamentos');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main'
    })
);

app.set('view engine', 'handlebars');
app.set('views', './views');

function toPlainArray(lista) {
    return lista.map(item => item.toJSON());
}

function toPlain(item) {
    return item ? item.toJSON() : null;
}

/* =========================
   HOME
========================= */

app.get('/', (req, res) => {
    res.render('home', {
        titulo: 'Página Inicial'
    });
});

/* =========================
   FILMES
========================= */

app.get('/filmes', async (req, res) => {
    try {
        const lista = await filmes.findAll({
            include: [
                {
                    model: diretores,
                    as: 'diretor'
                }
            ],
            order: [['id', 'ASC']]
        });

        res.render('filmes/listarFilme', {
            titulo: 'Filmes',
            filmes: toPlainArray(lista)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/filmes/cadastrar', async (req, res) => {
    try {
        const listaDiretores = await diretores.findAll({
            order: [['nome', 'ASC']]
        });

        const listaArtistas = await artistas.findAll({
            order: [['nome', 'ASC']]
        });

        res.render('filmes/cadastrarFilme', {
            titulo: 'Cadastrar Filme',
            diretores: toPlainArray(listaDiretores),
            artistas: toPlainArray(listaArtistas)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.post('/filmes', async (req, res) => {
    try {
        const {
            titulo,
            ano,
            sinopse,
            duracao,
            genero,
            clasIndicativa,
            paisOrigem,
            diretorId
        } = req.body;

        if (!titulo || !titulo.trim()) {
            return res.status(400).send('O título do filme é obrigatório.');
        }

        if (diretorId) {
            const diretor = await diretores.findByPk(Number(diretorId));

            if (!diretor) {
                return res.status(400).send('O diretor selecionado não existe.');
            }
        }

        const filme = await filmes.create({
            titulo: titulo.trim(),
            ano: ano ? Number(ano) : null,
            sinopse: sinopse || null,
            duracao: duracao ? Number(duracao) : null,
            genero: genero || null,
            clasIndicativa: clasIndicativa ? Number(clasIndicativa) : null,
            paisOrigem: paisOrigem || null,
            diretorId: diretorId ? Number(diretorId) : null
        });

        let artistasSelecionados = req.body.artistas || [];

        if (!Array.isArray(artistasSelecionados)) {
            artistasSelecionados = [artistasSelecionados];
        }

        artistasSelecionados = artistasSelecionados
            .filter(valor => valor !== '')
            .map(valor => Number(valor))
            .filter(Number.isInteger);

        if (artistasSelecionados.length > 0) {
            const artistasExistentes = await artistas.findAll({
                where: {
                    id: artistasSelecionados
                }
            });

            await filme.setArtistas(artistasExistentes);
        }

        res.redirect('/filmes');
    } catch (erro) {
        console.error('ERRO AO CADASTRAR FILME:');
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/filmes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).send('ID de filme inválido.');
        }

        const filme = await filmes.findByPk(id, {
            include: [
                {
                    model: diretores,
                    as: 'diretor'
                },
                {
                    model: fichasTecnicas,
                    as: 'fichaTecnica'
                },
                {
                    model: artistas,
                    as: 'artistas'
                }
            ]
        });

        if (!filme) {
            return res.status(404).send('Filme não encontrado.');
        }

        res.render('filmes/detalharFilme', {
            titulo: 'Detalhes do Filme',
            filme: toPlain(filme)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

/* =========================
   FICHA TÉCNICA
========================= */

app.get('/ficha-tecnica', async (req, res) => {
    try {
        const lista = await fichasTecnicas.findAll({
            include: [
                {
                    model: filmes,
                    as: 'filme'
                }
            ],
            order: [['id', 'ASC']]
        });

        res.render('fichas/listarFichaTec', {
            titulo: 'Fichas Técnicas',
            fichasTecnicas: toPlainArray(lista)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/ficha-tecnica/cadastrar', async (req, res) => {
    try {
        const listaFilmes = await filmes.findAll({
            order: [['titulo', 'ASC']]
        });

        res.render('fichas/cadastrarFichaTec', {
            titulo: 'Cadastrar Ficha Técnica',
            filmes: toPlainArray(listaFilmes)
        });
    } catch (erro) {
        console.error('ERRO AO CARREGAR FILMES:');
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.post('/ficha-tecnica', async (req, res) => {
    try {
        const filmeId = Number(req.body.filmeId);

        if (!Number.isInteger(filmeId) || filmeId <= 0) {
            return res.status(400).send('Selecione um filme válido.');
        }

        const filme = await filmes.findByPk(filmeId);

        if (!filme) {
            return res.status(400).send('O filme selecionado não existe no banco de dados.');
        }

        await fichasTecnicas.create({
            filmeId: filmeId,
            roteirista: req.body.roteirista || null,
            produtor: req.body.produtor || null,
            compositor: req.body.compositor || null,
            editor: req.body.editor || null,
            duracao: req.body.duracao ? Number(req.body.duracao) : null,
            orcamento: req.body.orcamento ? Number(req.body.orcamento) : null
        });

        res.redirect('/ficha-tecnica');
    } catch (erro) {
        console.error('ERRO AO CADASTRAR FICHA TÉCNICA:');
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/ficha-tecnica/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).send('ID de ficha inválido.');
        }

        const ficha = await fichasTecnicas.findByPk(id, {
            include: [
                {
                    model: filmes,
                    as: 'filme'
                }
            ]
        });

        if (!ficha) {
            return res.status(404).send('Ficha Técnica não encontrada.');
        }

        res.render('fichas/detalharFichaTec', {
            titulo: 'Detalhes da Ficha Técnica',
            ficha: toPlain(ficha)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

/* =========================
   DIRETORES
========================= */

app.get('/diretores', async (req, res) => {
    try {
        const lista = await diretores.findAll({
            order: [['id', 'ASC']]
        });

        res.render('diretores/listarDiretor', {
            titulo: 'Diretores',
            diretores: toPlainArray(lista)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/diretores/cadastrar', (req, res) => {
    res.render('diretores/cadastrarDiretor', {
        titulo: 'Cadastrar Diretor'
    });
});

app.post('/diretores', async (req, res) => {
    try {
        if (!req.body.nome || !req.body.nome.trim()) {
            return res.status(400).send('O nome do diretor é obrigatório.');
        }

        await diretores.create({
            nome: req.body.nome.trim(),
            foto: req.body.foto || null,
            dataNascimento: req.body.dataNascimento || null,
            biografia: req.body.biografia || null,
            nacionalidade: req.body.nacionalidade || null
        });

        res.redirect('/diretores');
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/diretores/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).send('ID de diretor inválido.');
        }

        const diretor = await diretores.findByPk(id, {
            include: [
                {
                    model: filmes,
                    as: 'filmes'
                }
            ]
        });

        if (!diretor) {
            return res.status(404).send('Diretor não encontrado.');
        }

        res.render('diretores/detalharDiretor', {
            titulo: 'Detalhes do Diretor',
            diretor: toPlain(diretor)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

/* =========================
   ARTISTAS
========================= */

app.get('/artistas', async (req, res) => {
    try {
        const lista = await artistas.findAll({
            order: [['id', 'ASC']]
        });

        res.render('artistas/listarArtista', {
            titulo: 'Artistas',
            artistas: toPlainArray(lista)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/artistas/cadastrar', (req, res) => {
    res.render('artistas/cadastrarArtista', {
        titulo: 'Cadastrar Artista'
    });
});

app.post('/artistas', async (req, res) => {
    try {
        if (!req.body.nome || !req.body.nome.trim()) {
            return res.status(400).send('O nome do artista é obrigatório.');
        }

        await artistas.create({
            nome: req.body.nome.trim(),
            nacionalidade: req.body.nacionalidade || null,
            dataNascimento: req.body.dataNascimento || null,
            biografia: req.body.biografia || null,
            tipo: req.body.tipo || null,
            papeis: req.body.papeis || null
        });

        res.redirect('/artistas');
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

app.get('/artistas/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).send('ID de artista inválido.');
        }

        const artista = await artistas.findByPk(id, {
            include: [
                {
                    model: filmes,
                    as: 'filmes'
                }
            ]
        });

        if (!artista) {
            return res.status(404).send('Artista não encontrado.');
        }

        res.render('artistas/detalharArtista', {
            titulo: 'Detalhes do Artista',
            artista: toPlain(artista)
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});

/* =========================
   BANCO E SERVIDOR
========================= */

async function iniciar() {
    try {
        await sequelize.authenticate();
        console.log('Banco de dados conectado.');

        await sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas.');

        app.listen(PORT, () => {
            console.log(`Servidor executando em http://localhost:${PORT}`);
        });
    } catch (erro) {
        console.error('ERRO AO INICIAR A APLICAÇÃO:');
        console.error(erro);
    }
}

iniciar();
