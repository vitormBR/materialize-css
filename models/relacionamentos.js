const Filme = require('./filme');
const Artista = require('./artista');
const FichaTecnica = require('./fichaTec');
const Diretor = require('./diretor');

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
    otherKey: 'artistaId',
    as: 'artistas'
});

Artista.belongsToMany(Filme, {
    through: 'FilmeArtista',
    foreignKey: 'artistaId',
    otherKey: 'filmeId',
    as: 'filmes'
});

module.exports = {
    Filme,
    Artista,
    FichaTecnica,
    Diretor
};
