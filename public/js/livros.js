const apiUrl = 'http://localhost:4000/api/livros'

function carregarLivros() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const livrosTable = document.getElementById('livrosTable').getElementsByTagName('tbody')[0]
            livrosTable.innerHTML = '' //limpa a tabela
            data.forEach(livro => {
                const linha = livrosTable.insertRow()
                linha.innerHTML = `
            <td>${livro.ISBN}</td>
            <td>${livro.titulo}</td>
            <td>${livro.paginas}</td>
            <td>${livro.generos}</td>
            <td>${livro.avaliacao}</td>
            <td> 
            <button class="delete" onclick="excluirLivro('${livro.ISBN}')">🗑 Excluir</button>

            <button onclick="editarLivro('${livro.ISBN}')">📝 Editar </button>
            </td>
            `
            }) /* fecha o forEach */
        }) /* fecha o then */
        .catch(error => console.error(error.message))
} /* fecha a function */

//Carregar os livros ao carregar a página
window.onload = carregarLivros()

function excluirLivro(ISBN) {
    // Primeiro mostra o diálogo de confirmação
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Se o usuário confirmou, faz a exclusão
            fetch(`${apiUrl}/${ISBN}`, { method: 'DELETE' })
                .then(() => {
                    Swal.fire(
                        'Excluído!',
                        'O livro foi excluído com sucesso.',
                        'success'
                    )
                    carregarLivros() // Atualiza a tabela
                })
                .catch(error => {
                    console.error('Error:', error)
                    Swal.fire(
                        'Erro!',
                        'Não foi possível excluir o livro.',
                        'error'
                    )
                })
        }
    })
}

// Modificar o event listener do formulário para suportar tanto criação quanto edição
document.getElementById('livroForm').addEventListener('submit', function(event) {
    event.preventDefault()
    
    const avaliacaoSelecionada = document.querySelector('input[name="avaliacao"]:checked')
    if (!avaliacaoSelecionada) {
        alert('❌ Por favor, selecione uma avaliação')
        return
    }
    
    const isEditMode = this.dataset.mode === 'edit'
    
    const livro = {
        ISBN: document.getElementById('isbn').value,
        titulo: document.getElementById('titulo').value,
        tituloEs: document.getElementById('tituloEs').value,
        paginas: document.getElementById('paginas').value,
        lancamento: document.getElementById('lancamento').value,
        generos: document.getElementById('generos').value.split(',').filter(g => g.trim() !== ''),
        editora: document.getElementById('editora').value,
        autores: document.getElementById('autores').value.split(',').filter(a => a.trim() !== ''),
        avaliacao: avaliacaoSelecionada.value
    }

    const method = isEditMode ? 'PUT' : 'POST'
    const url = isEditMode ? `${apiUrl}/${this.dataset.isbnOriginal}` : apiUrl

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw {
                    status: response.status,
                    errors: errData.errors
                }
            })
        }
        return response.json()
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: isEditMode ? 'Livro atualizado com sucesso!' : 'Livro inserido com sucesso!',
            showConfirmButton: false,
            timer: 1500
        })
        carregarLivros()
        
        // Resetar o formulário e voltar ao modo de criação
        this.reset()
        this.dataset.mode = 'create'
        delete this.dataset.isbnOriginal
        
        // Reabilita o campo ISBN e restaura o texto do botão
        document.getElementById('isbn').disabled = false
        this.querySelector('button[type="submit"]').textContent = '💾 Salvar Livro'
    })
    .catch(error => {
        if (error.status === 400 && error.errors) {
            const primeiroErro = error.errors[0]
            Swal.fire({
                icon: 'error',
                title: 'Erro de validação',
                text: primeiroErro.msg
            })
        } else {
            console.error('Erro ao salvar:', error)
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao salvar o livro'
            })
        }
    })
})
function editarLivro(ISBN) {
    // Busca os dados do livro específico
    fetch(`${apiUrl}/id/${ISBN}`)
        .then(response => response.json())
        .then(data => {
            // Pega o primeiro livro do array
            const livro = data[0]  // Esta é a mudança principal!
            
            if (!livro) {
                throw new Error('Livro não encontrado')
            }

            // Preenche o formulário com os dados atuais do livro
            document.getElementById('isbn').value = livro.ISBN || ''
            document.getElementById('titulo').value = livro.titulo || ''
            document.getElementById('tituloEs').value = livro.tituloEs || ''
            document.getElementById('paginas').value = livro.paginas || ''
            document.getElementById('lancamento').value = livro.lancamento || ''
            document.getElementById('generos').value = Array.isArray(livro.generos) ? livro.generos.join(',') : ''
            document.getElementById('editora').value = livro.editora || ''
            document.getElementById('autores').value = Array.isArray(livro.autores) ? livro.autores.join(',') : ''
            
            // Marca o radio button correto da avaliação
            if (livro.avaliacao) {
                const avaliacaoRadio = document.querySelector(`input[name="avaliacao"][value="${livro.avaliacao}"]`)
                if (avaliacaoRadio) {
                    avaliacaoRadio.checked = true
                }
            }

            // Modifica o formulário para modo de edição
            const form = document.getElementById('livroForm')
            form.dataset.mode = 'edit'
            form.dataset.isbnOriginal = ISBN

            // Altera o texto do botão de submit
            const submitButton = form.querySelector('button[type="submit"]')
            if (submitButton) {
                submitButton.textContent = '📝 Atualizar Livro'
            }

            // Desabilita o campo ISBN durante edição
            document.getElementById('isbn').disabled = true
            // Posiciona no primeiro campo editável
            document.getElementById('titulo').focus()
        })
        .catch(error => {
            console.error('Erro ao carregar dados do livro:', error)
            alert('❌ Erro ao carregar dados do livro. Por favor, tente novamente.')
        })
}