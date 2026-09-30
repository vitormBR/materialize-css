const filme = require('./filme.models');
const Artista = require('./artista.models');
const fichaTec = require('./fichaTec.moldes');
const diretor = require('./diretor.moldes');

Filme.hasOne(FichaTecnica, {
    foreignKey: 'filmeId',
    as: 'fichaTecnica'
});

FichaTecnica.belongsTo(Filme, {
    foreignKey: 'filmeId',
    as: 'filme'
});

Diretor.hasMany(Filme, {
    foreignKey: 'diretorId',
    as: 'filmes'
});

Filme.belongsTo(Diretor, {
    foreignKey: 'diretorId',
    as: 'diretor'
});

Filme.belongsToMany(Artista, {
    through: 'FilmeArtista',
    foreignKey: 'filmeId',
    as: 'artistas'
});

Artista.belongsToMany(Filme, {
    through: 'FilmeArtista',
    foreignKey: 'artistaId',
    as: 'filmes'
});