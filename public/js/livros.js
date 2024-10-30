const apiUrl = 'http://localhost:4001/api/livros'

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