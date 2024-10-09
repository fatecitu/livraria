import express from 'express'
import rotasLivros from './routes/livros.js'

const app = express()
const PORT = 4000
app.use(express.json())
//removendo o x-powered-by por segurança
app.disable('x-powered-by')
//Rota de conteúdo público
app.use('/', express.static('public'))
//Configurando o favicon
app.use('/favicon.ico', express.static('public/images/backend.png'))

app.get('/api', (req, res) => {
    res.status(200).json({message: 'API Fatec 🚀⭐ ',
                          version: '1.0.0'
    })
})

/* Rotas da aplicação */
app.use('/api/livros', rotasLivros)
//Tratando rotas inexistentes no backend
app.use((req, res, next) => {
    const rotaInvalida = req.originalUrl
    res.status(404).json({
        message: `Rota ${rotaInvalida} não encontrada`,
        error: 'Invalid Route'
    })
})

app.listen(PORT, function() {
    console.log(`Servidor Web rodando na porta ${PORT}`)
})