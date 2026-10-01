const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');

const artistas = require('./models/artista.js');
const diretores = require('./models/diretor.js');
const filmes = require('./models/filme.js');
const fichasTecnicas = require('./models/fichaTec.js');
const relacionamentos = require('./models/relacionamentos.js');

const methodOverride = require('method-override');

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.set('views', './views');


// ==================== HOME ====================

app.get('/', (req, res) => {
    res.render('home', {
        titulo: 'Página Inicial'
    });
});


// ==================== FILMES ====================
app.get('/filmes', async (req, res) => {
    const listaFilmes = await filmes.findAll({
        include: [
            {
                model: diretores,
                as: 'diretor'
            }
        ]
    });

    res.render('filmes/listarFilme', {
        titulo: 'Filmes',
        filmes: listaFilmes
    });
});


app.get('/filmes/cadastrar', async (req, res) => {
    const listaDiretores = await diretores.findAll();
    const listaArtistas = await artistas.findAll();

    res.render('filmes/cadastrarFilme', {
        titulo: 'Cadastrar Filme',
        diretores: listaDiretores,
        artistas: listaArtistas
    });
});


app.post('/filmes', async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);

        const filme = await filmes.create({
            titulo: req.body.titulo,
            ano: req.body.ano || null,
            sinopse: req.body.sinopse || null,
            duracao: req.body.duracao || null,
            genero: req.body.genero || null,
            clasIndicativa: req.body.clasIndicativa || null,
            paisOrigem: req.body.paisOrigem || null,
            diretorId: req.body.diretorId || null
        });

        let artistasSelecionados = req.body.artistas || [];

        if (!Array.isArray(artistasSelecionados)) {
            artistasSelecionados = [artistasSelecionados];
        }

        if (artistasSelecionados.length > 0) {
            await filme.setArtistas(artistasSelecionados);
        }

        res.redirect('/filmes');

    } catch (erro) {
        console.error('ERRO AO CADASTRAR FILME:');
        console.error(erro);
        res.status(500).send(erro.message);
    }
});


app.get('/filmes/:id', async (req, res) => {
    const id = Number(req.params.id);

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
        return res.status(404).send('Filme não encontrado');
    }

    res.render('filmes/detalharFilme', {
        titulo: 'Detalhes do Filme',
        filme: filme
    });
});


// ==================== FICHAS TÉCNICAS ====================

app.get('/ficha-tecnica', async (req, res) => {
    const listaFichas = await fichasTecnicas.findAll({
        include: [
            {
                model: filmes,
                as: 'filme'
            }
        ]
    });

    res.render('fichas/listarFichaTec', {
        titulo: 'Ficha Técnica',
        fichasTecnicas: listaFichas
    });
});

app.get('/ficha-tecnica/cadastrar', async (req, res) => {
    const listaFilmes = await filmes.findAll();

    res.render('fichas/cadastrarFichaTec', {
        titulo: 'Cadastrar Ficha Técnica',
        filmes: listaFilmes
    });
});

app.post('/ficha-tecnica', async (req, res) => {
    try {
        console.log('filmeId recebido:', req.body.filmeId);

        const filme = await filmes.findByPk(req.body.filmeId);

        if (!filme) {
            return res.status(400).send(
                'O filme selecionado não existe no banco de dados.'
            );
        }

        await fichasTecnicas.create({
            filmeId: req.body.filmeId,
            roteirista: req.body.roteirista || null,
            produtor: req.body.produtor || null,
            compositor: req.body.compositor || null,
            editor: req.body.editor || null,
            duracao: req.body.duracao || null,
            orcamento: req.body.orcamento || null
        });

        res.redirect('/ficha-tecnica');

    } catch (erro) {
        console.error('ERRO AO CADASTRAR FICHA TÉCNICA:');
        console.error(erro);

        res.status(500).send(erro.message);
    }
});

app.get('/ficha-tecnica/:id', async (req, res) => {
    const id = Number(req.params.id);

    const ficha = await fichasTecnicas.findByPk(id, {
        include: [
            {
                model: filmes,
                as: 'filme'
            }
        ]
    });

    if (!ficha) {
        return res.status(404).send('Ficha Técnica não encontrada');
    }

    res.render('fichas/detalharFichaTec', {
        titulo: 'Detalhes da Ficha Técnica',
        ficha: ficha
    });
});

// ==================== DIRETORES ====================

app.get('/diretores', async (req, res) => {
    const listaDiretores = await diretores.findAll();

    res.render('diretores/listarDiretor', {
        titulo: 'Diretores',
        diretores: listaDiretores
    });
});

app.get('/diretores/cadastrar', (req, res) => {
    res.render('diretores/cadastrarDiretor', {
        titulo: 'Cadastrar Diretor'
    });
});

app.post('/diretores', async (req, res) => {
    await diretores.create({
        nome: req.body.nome,
        foto: req.body.foto,
        dataNascimento: req.body.dataNascimento,
        biografia: req.body.biografia,
        nacionalidade: req.body.nacionalidade
    });

    res.redirect('/diretores');
});

app.get('/diretores/:id', async (req, res) => {
    const id = Number(req.params.id);

    const diretor = await diretores.findByPk(id, {
        include: [
            {
                model: filmes,
                as: 'filmes'
            }
        ]
    });

    if (!diretor) {
        return res.status(404).send('Diretor não encontrado');
    }

    res.render('diretores/detalharDiretor', {
        titulo: 'Detalhes do Diretor',
        diretor: diretor
    });
});

// ==================== ARTISTAS ====================

app.get('/artistas', async (req, res) => {
    const listaArtistas = await artistas.findAll();

    res.render('artistas/listarArtista', {
        titulo: 'Artistas',
        artistas: listaArtistas
    });
});

app.get('/artistas/cadastrar', (req, res) => {
    res.render('artistas/cadastrarArtista', {
        titulo: 'Cadastrar Artista'
    });
});

app.post('/artistas', async (req, res) => {
    await artistas.create({
        nome: req.body.nome,
        nacionalidade: req.body.nacionalidade,
        dataNascimento: req.body.dataNascimento,
        biografia: req.body.biografia,
        tipo: req.body.tipo,
        papeis: req.body.papeis
    });

    res.redirect('/artistas');
});

app.get('/artistas/:id', async (req, res) => {
    const id = Number(req.params.id);

    const artista = await artistas.findByPk(id, {
        include: [
            {
                model: filmes,
                as: 'filmes'
            }
        ]
    });

    if (!artista) {
        return res.status(404).send('Artista não encontrado');
    }

    res.render('artistas/detalharArtista', {
        titulo: 'Detalhes do Artista',
        artista: artista
    });
});


// ==================== BANCO ====================

async function conectarBD() {
    try {
        await sequelize.sync({ alter: true });

        console.log(
            'Conexão com o banco de dados estabelecida com sucesso!'
        );
    } catch (erro) {
        console.error(
            'Erro ao conectar:',
            erro
        );
    }
}

conectarBD();

app.listen(3000, () => {
    console.log(
        'Servidor executando em http://localhost:3000'
    );
});