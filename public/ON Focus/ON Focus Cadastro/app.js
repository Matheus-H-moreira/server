const botaoConcluir = document.getElementById('botaoConcluir');

if (botaoConcluir) {
    botaoConcluir.addEventListener('click', async (event) => {
        event.preventDefault(); // Garante que não haja submit padrão
        /*Início - Dados pessoais */
        let nome = document.getElementById('inputNome').value
        if(!nome){
            showToast("Por favor, escreva seu nome", 'fa-exclamation-triangle');
            return
        }

        let sobrenome = document.getElementById('inputSobrenome').value
        if(!sobrenome){
            showToast("Por favor, escreva seu sobrenome", 'fa-exclamation-triangle');
            return
        }

        let altura = document.getElementById('inputAltura').value
        if(!altura){
            showToast("Por favor, escreva sua altura", 'fa-exclamation-triangle');
            return
        }
        if(altura <= 0){
            showToast("A altura deve ser maior do que 0", 'fa-exclamation-triangle');
            return
        }

        let peso = document.getElementById('inputPeso').value
        if(!peso){
            showToast("Por favor, escreva seu peso", 'fa-exclamation-triangle');
            return
        }
        if(peso <= 0){
            showToast("O peso deve ser maior do que 0", 'fa-exclamation-triangle');
            return
        }

        let idade = document.getElementById('inputIdade').value
        if(!idade){
            showToast("Por favor, escreva sua idade", 'fa-exclamation-triangle');
            return
        }
        if(idade <= 0){
            showToast("A idade deve ser maior do que 0", 'fa-exclamation-triangle');
            return
        }

        let sexo = document.querySelector('input[name="genero"]:checked')?.value
        if(!sexo){
            showToast("Por favor, selecione um gênero", 'fa-exclamation-triangle');
            return
        }

        let tempo = document.querySelector('input[name="tempo"]:checked')?.value
        if(!tempo){
            showToast("Por favor, selecione o tempo disponível", 'fa-exclamation-triangle');
            return
        }
        
        /*Fim - Dados pessoais */

        /*Início - Dados complementares */
        /*Início - Preferência de treino */
        let preferencia = document.querySelector('input[name="preferencia"]:checked')?.value
        if(!preferencia){
            showToast("Por favor, selecione o local de preferência para realizar seus treinos", 'fa-exclamation-triangle');
            return
        }
        /*Fim - Preferência de treino */

        /*Início - Objetivo */
        let objetivo = document.querySelector('input[name="card"]:checked')?.value
        if(!objetivo){
            showToast("Por favor, selecione seu objetivo com esses treinos", 'fa-exclamation-triangle');
            return
        }
        /*Fim - Objetivo */

        /*Início - Nível de experiência */
        let experiencia = document.querySelector('input[name="nivel"]:checked')?.value
        if(!experiencia){
            showToast("Por favor, selecione seu nível de experiência", 'fa-exclamation-triangle');
            return
        }
        /*Fim - Nível de experiência */

        // Dados de login - Corrigido para usar o nome como usuário
        let usuario = document.getElementById('inputNome')?.value || '';
        let senha = document.getElementById('inputSenha')?.value || '';
        let email = document.getElementById('inputEmail')?.value || '';
        const fotoInput = document.getElementById('fotoPerfil');

        if (!usuario || !senha || !email) {
            showToast('Por favor, preencha usuário, senha e email.', 'fa-exclamation-triangle');
            return;
        }

        // VERIFICAÇÃO DE E-MAIL DUPLICADO
        try {
            const verificaEmail = await fetch(`http://https://localhost:3000/usuarios?email=${encodeURIComponent(email)}`);
            const usuariosComEmail = await verificaEmail.json();
            if (usuariosComEmail.length > 0) {
                showToast('Já existe uma conta cadastrada com este e-mail. Use outro e-mail ou faça login.', 'fa-exclamation-triangle');
                return;
            }
        } catch (error) {
            showToast('Erro ao verificar e-mail. Tente novamente.', 'fa-times-circle');
            return;
        }

        // Montar objeto do usuário
        let novoUsuario = {
            nome: nome,
            sobrenome: sobrenome,
            altura: altura,
            peso: peso,
            idade: idade,
            genero: sexo,
            tempo_disponivel: tempo,
            local_preferencia: preferencia,
            objetivo: objetivo,
            experiencia_treinos: experiencia,
            usuario: usuario,
            senha: senha,
            email: email,
            foto: null // Inicializa a foto como nula
        };

        // Função para ler a imagem como Data URL
        const lerImagem = new Promise((resolve) => {
            if (fotoInput.files && fotoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(fotoInput.files[0]);
            } else {
                resolve(null); // Resolve com null se nenhuma foto for selecionada
            }
        });

        // Aguarda a leitura da imagem e a adiciona ao objeto do usuário
        novoUsuario.foto = await lerImagem;

        try {
            const response = await fetch('http://https://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoUsuario)
            });
            if (response.ok) {
                // Pega a resposta do servidor, que inclui o ID do usuário
                const usuarioSalvo = await response.json();
                // Salva o usuário COM O ID no localStorage para manter a sessão
                // localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSalvo));
                // Redireciona imediatamente para a página de login
                console.log('Redirecionando para login...');
                window.location.href = '../ON Focus Login/index.html?cadastro=sucesso';
            } else {
                showToast('Erro ao cadastrar. Tente novamente.', 'fa-times-circle');
            }
        } catch (error) {
            showToast('Erro de conexão com o servidor.', 'fa-times-circle');
        }
    });
}

const botaoEditarPerfil = document.getElementById('botaoEditarPerfil');
if (botaoEditarPerfil) {
    botaoEditarPerfil.addEventListener('click', () => {
        const modal = document.getElementById('edit-profile-modal');
        if (modal) {
            preencherFormularioEdicao();
            modal.style.display = 'flex';
        }
    });
}

function fecharModalEdicao() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('close-modal-btn')?.addEventListener('click', fecharModalEdicao);
document.getElementById('cancel-edit-btn')?.addEventListener('click', fecharModalEdicao);

function preencherFormularioEdicao() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    document.getElementById('nomeEditar').value = usuarioLogado.nome;
    document.getElementById('sobrenomeEditar').value = usuarioLogado.sobrenome;
    document.getElementById('alturaEditar').value = usuarioLogado.altura;
    document.getElementById('pesoEditar').value = usuarioLogado.peso;
    document.getElementById('idadeEditar').value = usuarioLogado.idade;

    if (usuarioLogado.genero === 'Masculino') {
        document.getElementById('generoMasculinoEditar').checked = true;
    } else if (usuarioLogado.genero === 'Feminino') {
        document.getElementById('generoFemininoEditar').checked = true;
    }

    // Foto de perfil
    const fotoPreview = document.getElementById('fotoPreviewEditar');
    if (fotoPreview) {
        fotoPreview.src = usuarioLogado.foto || '/ON Focus/ON Focus Blog/imagens/download.png';
    }
    // Limpa o input de arquivo
    const fotoInput = document.getElementById('fotoEditar');
    if (fotoInput) {
        fotoInput.value = '';
    }
}

// Preview da nova foto ao selecionar
const fotoInputEditar = document.getElementById('fotoEditar');
if (fotoInputEditar) {
    fotoInputEditar.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('fotoPreviewEditar').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

document.getElementById('edit-profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !usuarioLogado.id) {
        showToast("Erro: ID do usuário não encontrado. Por favor, faça o login novamente.", 'fa-times-circle');
        return;
    }

    // Função para ler a imagem como Data URL
    async function lerImagemEditar() {
        const fotoInput = document.getElementById('fotoEditar');
        return new Promise((resolve) => {
            if (fotoInput.files && fotoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(fotoInput.files[0]);
            } else {
                resolve(usuarioLogado.foto || null); // Mantém a foto atual se não trocar
            }
        });
    }

    const novaFoto = await lerImagemEditar();

    const dadosAtualizados = {
        ...usuarioLogado, // Mantém campos não editáveis como objetivo, etc.
        nome: document.getElementById('nomeEditar').value,
        sobrenome: document.getElementById('sobrenomeEditar').value,
        altura: document.getElementById('alturaEditar').value,
        peso: document.getElementById('pesoEditar').value,
        idade: document.getElementById('idadeEditar').value,
        genero: document.querySelector('input[name="generoEditar"]:checked').value,
        foto: novaFoto
    };

    try {
        const response = await fetch(`http://https://localhost:3000/usuarios/${usuarioLogado.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosAtualizados));
            preencherPerfilMenu();
            fecharModalEdicao();
            showToast('Perfil atualizado com sucesso!', 'fa-check-circle');
        } else {
            showToast('Falha ao atualizar o perfil. Tente novamente.', 'fa-times-circle');
        }
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        showToast('Erro de conexão ao salvar as alterações.', 'fa-times-circle');
    }
});

// Função para preencher o perfil do usuário no menu
async function preencherPerfilMenu() {
    // Tenta obter o usuário logado do localStorage
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    if (!usuarioLogadoString) {
        // Se não encontrar no localStorage, tenta buscar pelo json-server (fallback)
        // Você pode adaptar essa lógica conforme necessário
        console.log("Nenhum usuário logado encontrado no localStorage.");
        return;
    }

    try {
        const usuario = JSON.parse(usuarioLogadoString);
        document.getElementById('nomePerfil').textContent = usuario.nome + ' ' + usuario.sobrenome;
        document.getElementById('idadePerfil').textContent = 'Idade: ' + usuario.idade;
        document.getElementById('generoPerfil').textContent = 'Gênero: ' + usuario.genero;
        document.getElementById('alturaPerfil').textContent = usuario.altura + ' m';
        document.getElementById('pesoPerfil').textContent = usuario.peso + ' kg';
        document.getElementById('tempoPerfil').textContent = usuario.tempo_disponivel;
        
        // Adiciona as novas informações
        document.getElementById('preferenciaPerfil').textContent = usuario.local_preferencia;
        document.getElementById('objetivoPerfil').textContent = usuario.objetivo;
        document.getElementById('experienciaPerfil').textContent = usuario.experiencia_treinos;

        const fotoPerfilMenu = document.getElementById('fotoPerfilMenu');
        if (fotoPerfilMenu && usuario.foto) {
            fotoPerfilMenu.src = usuario.foto;
        }
    } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
    }
}

// Garante que a função seja chamada quando a página de menu carregar
if (window.location.pathname.endsWith('Menu.html')) {
    document.addEventListener('DOMContentLoaded', preencherPerfilMenu);
}

// Função global para exibir toast
function showToast(message, icon = 'fa-check-circle') {
    // Remove toast anterior se existir
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();
    // Cria o toast
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `<i class='fa ${icon} toast-icon'></i> ${message}`;
    document.body.appendChild(toast);
    // Remove após 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- Logout do Menu ---
const logoutBtnMenu = document.getElementById('logout-btn-menu');
const logoutModal = document.getElementById('logout-modal');
const cancelLogout = document.getElementById('cancel-logout');
const confirmLogout = document.getElementById('confirm-logout');

if (logoutBtnMenu) {
    logoutBtnMenu.addEventListener('click', function() {
        logoutModal.classList.add('show');
    });
}

if (cancelLogout) {
    cancelLogout.addEventListener('click', function() {
        logoutModal.classList.remove('show');
    });
}

if (confirmLogout) {
    confirmLogout.addEventListener('click', function() {
        localStorage.removeItem('usuarioLogado');
        showToast('Logout realizado com sucesso!', 'fa-check-circle');
        setTimeout(() => {
            window.location.href = '../ON Focus Login/index.html';
        }, 1000);
    });
}

// Fechar modal ao clicar fora dele
if (logoutModal) {
    logoutModal.addEventListener('click', function(e) {
        if (e.target === logoutModal) {
            logoutModal.classList.remove('show');
        }
    });
}
