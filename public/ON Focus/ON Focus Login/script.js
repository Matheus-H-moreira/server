// Verificar se o usuário veio do cadastro
function verificarCadastroSucesso() {
    const urlParams = new URLSearchParams(window.location.search);
    const cadastroSucesso = urlParams.get('cadastro');
    
    if (cadastroSucesso === 'sucesso') {
        // Mostrar mensagem de boas-vindas
        setTimeout(() => {
            alert('Parabéns! Seu cadastro foi realizado com sucesso! Agora você pode fazer login com seu e-mail e senha.');
        }, 500);
        
        // Limpar o parâmetro da URL para não mostrar a mensagem novamente
        const novaUrl = window.location.pathname;
        window.history.replaceState({}, document.title, novaUrl);
    }
}

// Executar verificação quando a página carregar
document.addEventListener('DOMContentLoaded', verificarCadastroSucesso);

// Criação das partículas
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const numberOfParticles = 100;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        // Posição inicial aleatória
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        // Delay menor e mais consistente
        particle.style.setProperty('--delay', Math.random() * 5);
        // Garantir que cada partícula tenha um tipo de 0 a 3
        particle.setAttribute('data-type', i % 4);
        particlesContainer.appendChild(particle);

        // Forçar reflow para reiniciar a animação
        particle.offsetHeight;
    }
}

// Recriar partículas periodicamente para evitar que fiquem paradas
function refreshParticles() {
    const particlesContainer = document.querySelector('.particles');
    particlesContainer.innerHTML = '';
    createParticles();
}

// Inicializar partículas
createParticles();

// Recriar partículas a cada 30 segundos
setInterval(refreshParticles, 30000);

// Selecionando elementos do formulário
const loginForm = document.querySelector('form');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// Função para verificar força da senha
function checkPasswordStrength(password) {
    let strength = 0;
    let message = '';

    // Critérios de força
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;

    // Definir cor e mensagem baseado na força
    if (strength <= 25) {
        strengthBar.style.width = '25%';
        strengthBar.style.background = '#ff4444';
        message = 'Fraca';
    } else if (strength <= 50) {
        strengthBar.style.width = '50%';
        strengthBar.style.background = '#ffbb33';
        message = 'Média';
    } else if (strength <= 75) {
        strengthBar.style.width = '75%';
        strengthBar.style.background = '#00C851';
        message = 'Boa';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.style.background = '#007E33';
        message = 'Forte';
    }

    strengthText.textContent = message;
}

// Evento de input da senha
senhaInput.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});

// Evento de submit do formulário
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const senha = senhaInput.value;

    if (!email || !senha) {
        alert('Por favor, preencha e-mail e senha.');
        return;
    }

    try {
        const response = await fetch(`https://tiaw-obesidade.onrender.com/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
        const data = await response.json();
        if (data.length > 0) {
            // Usuário autenticado
            localStorage.setItem('usuarioLogado', JSON.stringify(data[0]));
            window.location.href = '../ON Focus HomePage/index.html';
        } else {
            alert('E-mail ou senha incorretos.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
});

// Função para verificar se um elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Elemento está visível quando pelo menos 30% dele está na tela
    const elementVisible = 30;
    
    return (
        rect.top <= (windowHeight - elementVisible) &&
        rect.bottom >= elementVisible
    );
}

// Função para adicionar/remover a classe 'visible' aos elementos
function handleScroll() {
    const sections = document.querySelectorAll('.quem-somos, .objetivo-marca, .avaliacoes, .comentarios');
    
    sections.forEach(section => {
        const isVisible = isElementInViewport(section);
        
        if (isVisible) {
            section.classList.add('visible');
        } else if (section.getBoundingClientRect().top > window.innerHeight) {
            // Só remove a classe se o elemento estiver completamente acima da viewport
            section.classList.remove('visible');
        }
    });
}

// Adicionar evento de scroll com throttle para melhor performance
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Verificar elementos visíveis quando a página carregar
window.addEventListener('load', handleScroll);

// Verificar elementos visíveis quando a página for redimensionada
window.addEventListener('resize', handleScroll);

// Manipulação do formulário de comentários
const comentarioForm = document.getElementById('comentarioForm');
if (comentarioForm) {
    comentarioForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
        const mensagem = document.getElementById('mensagem').value;
        
        // Aqui você pode adicionar código para enviar os dados para um servidor
        console.log('Comentário enviado:', { nome, email, rating, mensagem });
        
        // Mostrar mensagem de sucesso
        alert('Obrigado pelo seu comentário!');
        
        // Limpar o formulário
        comentarioForm.reset();
    });
}

// Mostrar/ocultar senha
const toggleSenha = document.getElementById('toggleSenha');
const senhaInput2 = document.getElementById('senha');
const iconeOlho = document.getElementById('iconeOlho');
if (toggleSenha && senhaInput2 && iconeOlho) {
    toggleSenha.addEventListener('click', () => {
        if (senhaInput2.type === 'password') {
            senhaInput2.type = 'text';
            iconeOlho.classList.remove('fa-eye');
            iconeOlho.classList.add('fa-eye-slash');
        } else {
            senhaInput2.type = 'password';
            iconeOlho.classList.remove('fa-eye-slash');
            iconeOlho.classList.add('fa-eye');
        }
    });
} 