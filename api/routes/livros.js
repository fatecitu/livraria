import express from 'express'
/* Importar a biblioteca do MongoDB */
import {MongoClient} from 'mongodb'
/* Importar o express-validator */
import {check, validationResult} from 'express-validator'

/* Definido as variáveis de conexão */
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const dbName = 'livraria'
const router = express.Router()
// Função para conectar no banco de dados
async function connectToDatabase(){
    try{
        await client.connect()
        console.log(`Conectado ao database ${dbName}`)
    } catch(err){
        console.error(`Erro ao conectar: ${err.message}`)
    }
}


/* Definindo a rota /livros via método GET */
router.get('/', async(req, res)=> {
    try{
       await connectToDatabase()
       const db = client.db(dbName) 
       const livros = db.collection('livros') 
       let result = await livros.find().toArray()
       res.status(200).json(result)        
    } catch (err){
        res.status(500).json({"error": `${err.message}`})
    }
})

/* Definindo a rota /livros/:id via método GET */
router.get('/id/:id', async(req, res)=> {
    try{
       await connectToDatabase()
       const db = client.db(dbName) 
       const livros = db.collection('livros') 
       let result = await livros.find({'ISBN': req.params.id}).toArray()
       res.status(200).json(result)        
    } catch (err){
        res.status(500).json({"error": `${err.message}`})
    }
})

const validaLivro = [
    //Validações da collection livro
    check('ISBN').isString({min:13,max:17})
    .withMessage('O ISBN deve ter no mínimo 13 números e no máximo 17 caracteres'),
    check('titulo').notEmpty()
    .withMessage('O título do livro é obrigatório'),
    check('tituloEs').optional(), //é opcional
    check('paginas').isInt({min:1})
    .withMessage('O número de páginas deve ser positivo'),
    check('lancamento').isISO8601()
    .withMessage('A data deve estar no formato YYYY-MM-DD'),
    check('generos').isArray()
    .withMessage('Gêneros deve ser uma lista de strings'),
    check('editora').notEmpty()
    .withMessage('A editora é obrigatória'),
    check('autores').isArray()
    .withMessage('Autores deve ser uma lista'),
    check('avaliacao').matches(/^([★]{1,5})$/)
    .withMessage('A avaliação deve ser de 1 a 5 ★')
    // https://www.htmlsymbols.xyz/unicode/U+2B50
]

/* Definindo a rota /livros via método POST */
router.post('/', validaLivro, async(req, res)=> {
   //Verificando os eventuais erros
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
   }
   try{
    await connectToDatabase()
    const db = client.db(dbName)
    const livros = db.collection('livros')
    //Obtendo os dados que vem na requisição
    const novoLivro = req.body
    //Inserindo um novo livro no MongoDB
   const result = await livros.insertOne(novoLivro)
   //Retornamos uma mensagem de sucesso
   res.status(201).json({
    message: `Livro inserido com sucesso com o id ${result.insertedId}`
})
} catch (err){
    res.status(500).json({"error": err.message})
}
})

/* Definindo a rota /livros via método DELETE */
router.delete('/:isbn', async(req, res)=> {
    try{
        await connectToDatabase()
        const db = client.db(dbName)
        const livros = db.collection('livros')
        //Obtendo o ISBN da requisição
        const {isbn} = req.params
        //Deletando o livro no MongoDB
        const result = await 
                       livros.deleteOne({ISBN: isbn})
        if(result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Livro não encontrado!'
            })
        }               
        //retornando uma resposta de sucesso
        res.status(200).json({
            message: 'Livro removido com sucesso'
        })
    } catch (err) {
        res.status(500).json({"error": err.message})
    }
})

router.put('/:isbn', validaLivro, async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    try{
        //conectando ao MongoDB
        await connectToDatabase()
        const db = client.db(dbName)
        const livros = db.collection('livros')
        //Obtendo os dados para alteração
        const {isbn} = req.params
        const dadosAtualizados = req.body
        //Atualizar os dados no banco
        const result = await livros.updateOne(
            {ISBN: isbn}, //critério de busca
            {$set: dadosAtualizados} //Dados alterados
        )
        if (result.matchedCount === 0){
            return res.status(404).json(
                {message: 'Livro não encontrado'})
        }
        //Retornamos a mensagem que deu certo
        res.status(200).json(
            {message: 'Livro alterado com sucesso'})
    } catch(err){
        res.status(500).json({error: err.message})
    }
})

export default router