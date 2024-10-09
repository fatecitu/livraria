use('livraria')
db.livros.insertOne({
    "ISBN": "9780807286005",
    "titulo" : "Harry Potter e a Pedra Filosofal",
    "tituloEs" : "Harry Potter e la pietra filosofale",
    "paginas": 304,
    "lancamento": '2014-07-02',
    "generos": ["infantil","fantasia","ação"],
    "editora": "Saraiva",
    "autores": ["J.K. Rowling"],
    "avaliacao": "★★★★"
})
//Criando um índice para evitar registros duplicados
use('livraria')
db.livros.createIndex({ISBN:1},{unique:true})

use('livraria')
//Equivale ao select * from livros
db.livros.find()

use('livraria')
//select ISBN, titulo, paginas from livros
db.livros.find({},{ISBN:1, titulo:1, paginas:1,_id:0})

use('livraria')
db.livros.insertOne({
    "ISBN": "9780807286006",
    "titulo" : "A Biblia",
    "tituloEs" : "La Biblia",
    "paginas": 1803,
    "lancamento": new Date('2010-07-02'),
    "generos": ["religioso","fantasia","ação"],
    "editora": "Aparecida",
    "autores": ["São Mateus","São Lucas"],
    "avaliacao": "★★★★★"
})

use('livraria')
//select titulo, editora, autores from livros 
//where titulo = 'A Biblia'
db.livros.find({"titulo": {$eq: "A Biblia"}},
               {titulo:1, editora:1, autores:1,_id:0}
)

use('livraria')
//select titulo, ISBN, avaliacao from livros 
//where paginas <= 400
db.livros.find({"paginas": {$lte: 400}},
               {titulo:1, ISBN:1, avaliacao:1, _id:0}
)

use('livraria')
//select ISBN, titulo, paginas, avaliacao from livros
//where editora = 'Saraiva'
db.livros.find({"editora": {$eq: "Saraiva"}},
          {ISBN:1, titulo:1, paginas:1, avaliacao:1,_id:0}
)

use('livraria')
cidades = [{nome: "Itu",
            estado: {sigla:"SP", nome:"São Paulo"}},
           {nome: "Sorocaba",
            estado: {sigla:"SP", nome:"São Paulo"}},
           {nome: "Niterói",
            estado: {sigla:"RJ", nome:"Rio de Janeiro"}}
        ]
db.municipios.insertMany(cidades) //Permite inserir + de 1
//Para consultar:
use('livraria')        
db.municipios.find()
//Listar apenas o nome do municipio e nome do estado
//da cidade de Sorocaba
use('livraria')
db.municipios.find({"nome":{$eq: "Sorocaba"}},
                   {nome:1, "estado.nome":1, _id:0})

/*Listar apenas o nome do municipio e a sigla do estado
 das cidades que contenham a palavra "caba"                   
 select nome, sigla from municipios 
 where nome like '%caba%'   */
 use('livraria') //i=insensitive case
 db.municipios.find({"nome": /CABA/i},
                    {nome:1, "estado.sigla":1, _id:0}
 )
/*Listar todos os municipios que sejam do estado de SP
  e o nome seja Itu */
use('livraria')  
db.municipios.find({$and: [
    {"nome": /itu/i},
    {"estado.sigla": {$eq: "SP"}}
]},{})

/* Exemplo de exclusão - Retorna o número de exclusões */
use('livraria')
db.municipios.deleteOne({nome: {$eq: "Itu"}})

use('livraria')
db.municipios.deleteMany({"estado.sigla": {$ne: "AC"}})
/* */
use('livraria')
db.produtos.insertOne({nome:"Mapa Mundi", preco:49.90,
    emEstoque: true, caracteristicas: ["papel","objeto"]
})

/* Alterando o preço do produto */
use('livraria')
db.produtos.updateOne({nome: "Mapa Mundi"},
    {$set: {preco: 64.50}}
)
/* Para ver a alteração */
use('livraria')
db.produtos.find()

/* Exercício de Fixação 
(Insira pelo menos mais 2 produtos para testes)
1- Liste o nome e o preço de todos os produtos que
   contenham o texto mundi e não tenha a característica
   digital.

2- Liste o nome, preço e emEstoque de todos os produtos
disponíveis no estoque e que o preço seja menor que 1000.   
*/
