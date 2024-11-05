const apiUrl = 'http://localhost:4000/api/livros'

function carregarLivros(){
    fetch(apiUrl)
    .then(response => response.json())
    .then(data =>{
        const livrosTable = document.getElementById('livrosTable').getElementsByTagName('tbody')[0]
        livrosTable.innerHTML = '' //limpa a tabela
        data.forEach(livro => {
            const linha = livrosTable.insertRow()
            linha.innerHTML = `
            <td>${livro.ISBN}</td>
            <td>${livro.titulo}</td>
            <td>${livro.paginas}</td>
            <td>${livro.generos}</td>
            <td> 
            <button class="delete" onclick="excluirLivro('${livro.ISBN}')">🗑 Excluir</button>
            </td>
            `
        }) /* fecha o forEach */          
        }) /* fecha o then */
        .catch(error => console.error(error.message))    
} /* fecha a function */

//Carregar os livros ao carregar a página
window.onload = carregarLivros()

function excluirLivro(ISBN){
    fetch(`${apiUrl}/${ISBN}`,{ method: 'DELETE'})
    .then(()=> {
        alert('Livro excluído com sucesso!')
        carregarLivros() //para atualizar a UI
    })
    .catch(error => console.error('Error:', error))
}

document.getElementById('livroForm').addEventListener('submit', function(event){
    event.preventDefault() //evita o recarregamento
    const livro = {
    ISBN: document.getElementById('isbn').value,
    titulo: document.getElementById('titulo').value,
    tituloEs: document.getElementById('tituloEs').value,
    paginas: document.getElementById('paginas').value,
    lancamento: document.getElementById('lancamento').value,
    generos: document.getElementById('generos').value.split(','),
    editora: document.getElementById('editora').value,
    autores: document.getElementById('autores').value.split(',')
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(livro)
    })
    .then(response => {
        if(!response.ok) { //! = not 
          return response.json().then(errData =>{
           //lança um erro com informações da resposta
           throw { status: response.status,
                   errors: errData.errors
           } /* fecha throw */
          }) /* fecha then return */
        }
        return response.json()
    })
    .then(data => {
        alert('✅ Livro inserido com sucesso!')
        carregarLivros()
    })
    .catch(error => {
        if(error.status === 400 && error.errors){
            //obtém o primeiro erro
            const primeiroErro = error.errors[0]
            alert(`❌Erro de validação: ${primeiroErro.msg}`)
        }
    })
})