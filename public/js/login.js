document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault() //evita o recarregamento
    const usuario = document.getElementById('usuario').value
    const senha = document.getElementById('senha').value
    if (btoa(usuario) === 'YWRtaW4=' && btoa(senha) === 'MTIzNA==') {
        window.location.href = 'livros.html'//abre a página
    } else {
        document.getElementById('error-message').textContent = '❌Usuário ou senha informados estão incorretos!'
    }
})