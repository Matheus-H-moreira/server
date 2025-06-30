/**
 * Função de inicialização principal
 * Executa todas as funções necessárias quando o DOM está pronto.
 */
function inicializarPagina() {
    // Exibe notificação de boas-vindas se o cadastro foi um sucesso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('cadastro') && urlParams.get('cadastro') === 'sucesso') {
        const toast = document.getElementById('toast-notification');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const nomeUsuario = usuarioLogado ? usuarioLogado.nome : 'Usuário';
        
        toast.textContent = `Bem-vindo, ${nomeUsuario}! Cadastro realizado com sucesso!`;
        toast.className = "toast show";
        setTimeout(function(){ 
            toast.className = toast.className.replace("show", ""); 
            // Limpa a URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }

    // Carrega dados do usuário no perfil
    try {
        const usuarioLogadoString = localStorage.getItem('usuarioLogado');
        if (usuarioLogadoString) {
            const usuarioLogado = JSON.parse(usuarioLogadoString);

            // Atualiza o nome do usuário
            const userNameElement = document.getElementById('user-name');
            if (userNameElement && usuarioLogado.nome) {
                userNameElement.textContent = `${usuarioLogado.nome} ${usuarioLogado.sobrenome || ''}`.trim();
            }

            // Atualiza a foto de perfil
            const userAvatarElement = document.getElementById('user-avatar');
            if (userAvatarElement && usuarioLogado.foto) {
                userAvatarElement.src = usuarioLogado.foto;
            }

            // Atualiza o objetivo do usuário
            const objetivoUsuarioElement = document.getElementById('objetivo-usuario');
            if (objetivoUsuarioElement && usuarioLogado.objetivo) {
                // Formata para ter a primeira letra maiúscula
                const objetivoFormatado = usuarioLogado.objetivo.charAt(0).toUpperCase() + usuarioLogado.objetivo.slice(1);
                objetivoUsuarioElement.textContent = objetivoFormatado;
            }

            // Atualiza o peso atual do usuário
            const pesoAtualElement = document.getElementById('peso-atual');
            if (pesoAtualElement && usuarioLogado.peso) {
                pesoAtualElement.textContent = `${usuarioLogado.peso} kg`;
            }

            // Adiciona redirecionamento para a página de menu ao clicar no perfil
            const profileSection = document.querySelector('.profile-section');
            if (profileSection) {
                profileSection.style.cursor = 'pointer';
                profileSection.addEventListener('click', () => {
                    window.location.href = '../ON Focus Cadastro/Menu.html';
                });
            }
        }
    } catch (error) {
        console.error("Falha ao carregar dados do usuário:", error);
    }

    // Inicializa o sistema de tema
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    function updateThemeIcons(theme) {
        const darkIcons = document.querySelectorAll('.theme-toggle-dark');
        const lightIcons = document.querySelectorAll('.theme-toggle-light');
        if (theme === 'dark') {
            darkIcons.forEach(icon => icon.style.display = 'block');
            lightIcons.forEach(icon => icon.style.display = 'none');
        } else {
            darkIcons.forEach(icon => icon.style.display = 'none');
            lightIcons.forEach(icon => icon.style.display = 'block');
        }
    }

    updateThemeIcons(savedTheme);
    
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    // Carrega conteúdo dinâmico
    if(document.querySelector('.news-grid')){
        carregarNoticias();
    }
    if(document.querySelector('.depoimentos-container')){
        carregarDepoimentos();
    }

    // Exibe o treino de hoje na dashboard
    exibirTreinoHojeResumo();

    atualizarDiasFocado();

    renderizarCalendarioSimples();

    // ================= TEMPERATURA ATUAL =================
    buscarTemperaturaAtual();
}

/**
 * Botão Voltar ao Topo
 * Controla a visibilidade e funcionalidade do botão
 */
const backToTopButton = document.querySelector('.back-to-top');

// Mostra/oculta o botão baseado na posição da rolagem
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// Rola suavemente para o topo ao clicar
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/**
 * Sistema de Carregamento e Exibição de Notícias
 * Gerencia o carregamento e exibição das notícias com todas as informações
 */
let todasNoticias = [];
let noticiasExibidas = 0;
const NOTICIAS_POR_PAGINA = 4;

async function carregarNoticias() {
    try {
        const response = await fetch('noticias.json');
        if(!response.ok) throw new Error('Network response was not ok');
        todasNoticias = await response.json();
        noticiasExibidas = 0;
        exibirNoticiasFiltradas(true);
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
    }
}

function exibirNoticiasFiltradas(reset = false) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;
    if (reset) {
        newsGrid.innerHTML = '';
        noticiasExibidas = 0;
    }
    const topicosSelecionados = Array.from(document.querySelectorAll('.topic-checkbox:checked')).map(cb => cb.nextElementSibling.querySelector('.topic-text').textContent.trim());
    let noticiasParaExibir = todasNoticias;
    if (topicosSelecionados.length > 0) {
        noticiasParaExibir = todasNoticias.filter(noticia =>
            noticia.tags.some(tag => topicosSelecionados.includes(tag))
        );
    }
    // Paginação sem repetição
    const inicio = noticiasExibidas;
    const fim = noticiasExibidas + NOTICIAS_POR_PAGINA;
    let noticiasPagina = noticiasParaExibir.slice(inicio, fim);
    noticiasPagina.forEach(noticia => {
        const noticiaElement = criarElementoNoticia(noticia);
        newsGrid.appendChild(noticiaElement);
    });
    noticiasExibidas += noticiasPagina.length;
    // Adiciona ou remove o botão de carregar mais
    adicionarBotaoCarregarMais(newsGrid, noticiasParaExibir.length);
}

function adicionarBotaoCarregarMais(newsGrid, totalNoticias) {
    // Remove botão antigo se existir
    const botaoAntigo = document.querySelector('.load-more-btn');
    if (botaoAntigo) botaoAntigo.parentElement.remove();
    // Só adiciona o botão se ainda houver notícias para mostrar
    if (noticiasExibidas < totalNoticias) {
        const div = document.createElement('div');
        div.className = 'load-more';
        const btn = document.createElement('button');
        btn.className = 'load-more-btn';
        btn.innerHTML = '<span class="btn-text">Carregar mais notícias</span><span class="loader"></span>';
        btn.onclick = () => exibirNoticiasFiltradas();
        div.appendChild(btn);
        newsGrid.parentNode.insertBefore(div, newsGrid.nextSibling);
    }
}

function criarElementoNoticia(noticia) {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.dataset.id = noticia.id;
    
    // Formata a data
    const dataFormatada = new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    // Cria o HTML da notícia com todas as informações
    article.innerHTML = `
        <div class="news-tags">
            ${noticia.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="news-image">
            <img src="${noticia.imagem}" alt="${noticia.titulo}">
        </div>
        <div class="news-content">
            <div class="news-meta">
                <span class="news-date">${dataFormatada}</span>
            </div>
            <h2 class="news-title">${noticia.titulo}</h2>
            <p class="news-summary">${noticia.resumo}</p>
            <div class="news-actions">
                <a href="detalhes.html?id=${noticia.id}" class="read-more">Ler mais</a>
                <span class="actions-spacer"></span>
                <button class="share-btn-modern" title="Compartilhar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    <span>Compartilhar</span>
                </button>
            </div>
        </div>
    `;
    
    // Adiciona evento de clique para abrir os detalhes
    article.addEventListener('click', (e) => {
        if (!e.target.closest('.share-btn-modern')) {
            window.location.href = `detalhes.html?id=${noticia.id}`;
        }
    });
    
    return article;
}

function compartilharNoticia(id) {
    alert('Funcionalidade de compartilhamento não está disponível no momento.');
    event.stopPropagation(); // Impede que o clique se propague para o card
}

// Adiciona evento de mudança nos checkboxes de tópicos
const checkboxesTopicos = document.querySelectorAll('.topic-checkbox');
checkboxesTopicos.forEach(cb => {
    cb.addEventListener('change', () => exibirNoticiasFiltradas(true));
});

/**
 * Menu Mobile
 * Gerencia a funcionalidade do menu mobile e overlay
 */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const aside = document.querySelector('aside');
const menuOverlay = document.querySelector('.menu-overlay');

// Função para alternar o estado do menu mobile
function toggleMobileMenu() {
    if(!mobileMenuToggle || !aside || !menuOverlay) return;
    mobileMenuToggle.classList.toggle('active');
    aside.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = aside.classList.contains('active') ? 'hidden' : '';
}

// Event Listeners para o menu mobile
if(mobileMenuToggle && menuOverlay && aside) {
mobileMenuToggle.addEventListener('click', toggleMobileMenu);
menuOverlay.addEventListener('click', toggleMobileMenu);

const menuLinks = document.querySelectorAll('aside a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && aside.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
            if (aside.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
}

/**
 * Modal de Busca
 * Controla a funcionalidade do modal de busca
 */
const searchToggle = document.querySelector('.search-toggle');
const searchModal = document.querySelector('.search-modal');
const closeSearch = document.querySelector('.close-search');
const searchInput = document.querySelector('.search-modal input');

// Função para alternar o estado do modal de busca
function toggleSearchModal() {
    if(!searchModal) return;
    searchModal.classList.toggle('active');
    if (searchModal.classList.contains('active')) {
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Event Listeners para o modal de busca
if (searchToggle && searchModal && closeSearch && searchInput) {
searchToggle.addEventListener('click', toggleSearchModal);
closeSearch.addEventListener('click', toggleSearchModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        toggleSearchModal();
    }
});
}

/**
 * Newsletter - Mensagem de sucesso ao inscrever
 */
const newsletterForm = document.querySelector('.newsletter-form');
const newsletterContent = document.querySelector('.newsletter-content');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Mensagem de sucesso
        newsletterContent.innerHTML = `
            <h2>Fique por dentro!</h2>
            <p>Inscrição realizada com sucesso! Você receberá novidades no seu e-mail.</p>
        `;
    });
}

// Função para carregar e exibir depoimentos
async function carregarDepoimentos() {
    try {
        const response = await fetch('http://localhost:3000/depoimentos');
        if(!response.ok) throw new Error('Network response was not ok');
        const depoimentos = await response.json();
        const container = document.querySelector('.depoimentos-container');
        if (!container) return;
        container.innerHTML = '';
        depoimentos.forEach(dep => {
            const div = document.createElement('div');
            div.className = 'depoimento-card';
            div.innerHTML = `
                <img src="${dep.foto}" alt="${dep.nome}" class="depoimento-foto">
                <div class="depoimento-nome">${dep.nome}</div>
                <div class="depoimento-mensagem">"${dep.mensagem}"</div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar depoimentos:', error);
    }
}

// Adiciona o listener principal para inicializar a página
document.addEventListener('DOMContentLoaded', inicializarPagina);

// Redireciona o botão 'Comece Agora' para a página de rotina personalizada
window.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.hero-cta');
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'rotina.html';
        });
    }

    // Modal de edição de perfil (peso)
    const btnEditarPeso = document.getElementById('editarPeso');
    const modalEditarPerfil = document.getElementById('modal-editar-perfil');
    const closeModalEditar = document.getElementById('close-modal-editar');
    const formEditarPerfil = document.getElementById('form-editar-perfil');
    const inputNome = document.getElementById('editar-nome');
    const inputPeso = document.getElementById('editar-peso');
    if (btnEditarPeso && modalEditarPerfil && closeModalEditar && formEditarPerfil && inputNome && inputPeso) {
        btnEditarPeso.addEventListener('click', function() {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            inputNome.value = usuario.nome || '';
            inputPeso.value = usuario.peso || '';
            modalEditarPerfil.classList.add('active');
            modalEditarPerfil.style.display = 'flex';
        });
        closeModalEditar.addEventListener('click', function() {
            modalEditarPerfil.classList.remove('active');
            modalEditarPerfil.style.display = 'none';
        });
        formEditarPerfil.addEventListener('submit', function(e) {
            e.preventDefault();
            let usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            usuario.nome = inputNome.value;
            usuario.peso = inputPeso.value;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            document.getElementById('peso-atual').textContent = usuario.peso + ' kg';
            modalEditarPerfil.classList.remove('active');
            modalEditarPerfil.style.display = 'none';
        });
    }

    atualizarDiasFocado();
    const btnResetDias = document.getElementById('resetDias');
    if (btnResetDias) {
        btnResetDias.addEventListener('click', function() {
            localStorage.setItem('diasFocado', '0');
            atualizarDiasFocado();
        });
    }
});

function exibirTreinoHojeResumo() {
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    const treinoHojeDiv = document.getElementById('treino-hoje-resumo');
    if (!usuarioLogadoString || !treinoHojeDiv) return;
    const usuario = JSON.parse(usuarioLogadoString);
    if (!usuario.objetivo) {
        treinoHojeDiv.textContent = 'Defina um objetivo para ver seu treino de hoje.';
        return;
    }
    const plano = getPlanoRotina(usuario.objetivo);
    const hoje = new Date();
    const dia = hoje.getDate();
    const treinoCompleto = plano.treinos[dia - 1];
    // Extrai apenas o resumo (após o hífen, se existir)
    let resumo = treinoCompleto;
    if (treinoCompleto.includes('-')) {
        resumo = treinoCompleto.split('-')[1].trim();
    }
    treinoHojeDiv.innerHTML = `<strong>${resumo}</strong><br><button id="btn-ir-treino" class="btn-ir-treino">Ir ao treino</button>`;
    const btnIrTreino = document.getElementById('btn-ir-treino');
    if (btnIrTreino) {
        btnIrTreino.onclick = function() {
            window.location.href = 'rotina.html';
        };
    }
}

// Funções utilitárias importadas de rotina.js (copiar ou importar getPlanoRotina e getDetalhesTreinoMassa aqui)
function getPlanoRotina(objetivo) {
    const planos = {
        'ganho de massa': {
            treinos: [
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps', 
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps',
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps',
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps',
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps',
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps',
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps',
                'Treino C - Pernas e Ombros',
                'Descanso',
                'Treino A - Peito e Tríceps',
                'Treino B - Costas e Bíceps'
            ]
        },
        'perder peso': {
            treinos: [
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Caminhada/Corrida - 45 min',
                'Treino Funcional - Circuito',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Descanso Ativo - Yoga',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Caminhada/Corrida - 45 min',
                'Treino Funcional - Circuito',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Descanso Ativo - Yoga',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Caminhada/Corrida - 45 min',
                'Treino Funcional - Circuito',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Descanso Ativo - Yoga',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Caminhada/Corrida - 45 min',
                'Treino Funcional - Circuito',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito',
                'Descanso Ativo - Yoga',
                'Cardio HIIT - 30 min',
                'Treino Funcional - Circuito'
            ]
        },
        'saúde': {
            treinos: [
                'Yoga Matinal - 20 min',
                'Caminhada Leve - 30 min',
                'Pilates - 25 min',
                'Meditação e Respiração',
                'Yoga Matinal - 20 min',
                'Caminhada Leve - 30 min',
                'Descanso',
                'Pilates - 25 min',
                'Yoga Matinal - 20 min',
                'Caminhada Leve - 30 min',
                'Meditação e Respiração',
                'Yoga Matinal - 20 min',
                'Pilates - 25 min',
                'Caminhada Leve - 30 min',
                'Descanso',
                'Yoga Matinal - 20 min',
                'Meditação e Respiração',
                'Pilates - 25 min',
                'Caminhada Leve - 30 min',
                'Yoga Matinal - 20 min',
                'Descanso',
                'Pilates - 25 min',
                'Caminhada Leve - 30 min',
                'Yoga Matinal - 20 min',
                'Meditação e Respiração',
                'Pilates - 25 min',
                'Caminhada Leve - 30 min',
                'Descanso',
                'Yoga Matinal - 20 min',
                'Pilates - 25 min'
            ]
        },
        'condicionamento': {
            treinos: [
                'Treino CrossFit - WOD',
                'Corrida - 5km',
                'Treino CrossFit - WOD',
                'Natação - 30 min',
                'Treino CrossFit - WOD',
                'Corrida - 5km',
                'Descanso',
                'Treino CrossFit - WOD',
                'Natação - 30 min',
                'Treino CrossFit - WOD',
                'Corrida - 5km',
                'Treino CrossFit - WOD',
                'Natação - 30 min',
                'Treino CrossFit - WOD',
                'Descanso',
                'Corrida - 5km',
                'Treino CrossFit - WOD',
                'Natação - 30 min',
                'Treino CrossFit - WOD',
                'Corrida - 5km',
                'Treino CrossFit - WOD',
                'Natação - 30 min',
                'Treino CrossFit - WOD',
                'Corrida - 5km',
                'Treino CrossFit - WOD',
                'Natação - 30 min',
                'Treino CrossFit - WOD',
                'Descanso',
                'Corrida - 5km',
                'Treino CrossFit - WOD'
            ]
        }
    };
    return planos[objetivo.toLowerCase()] || planos['ganho de massa'];
}

function getDetalhesTreinoMassa(treino) {
    switch (treino) {
        case 'Treino A - Peito e Tríceps':
            return `<strong>Exemplo de Exercícios:</strong><ul><li>Supino reto com barra: 4x8-12</li><li>Supino inclinado com halteres: 3x10</li><li>Crucifixo: 3x12</li><li>Tríceps testa: 3x10</li><li>Tríceps corda: 3x12</li></ul><strong>Dicas:</strong><ul><li>Desça o peso devagar e foque na contração.</li><li>Descanse 60-90s entre as séries.</li></ul>`;
        case 'Treino B - Costas e Bíceps':
            return `<strong>Exemplo de Exercícios:</strong><ul><li>Puxada na barra: 4x8-12</li><li>Remada curvada: 3x10</li><li>Pulldown: 3x12</li><li>Rosca direta: 3x10</li><li>Rosca alternada: 3x12</li></ul><strong>Dicas:</strong><ul><li>Mantenha a postura e evite \"roubar\" o movimento.</li><li>Foque na amplitude total.</li></ul>`;
        case 'Treino C - Pernas e Ombros':
            return `<strong>Exemplo de Exercícios:</strong><ul><li>Agachamento livre: 4x8-12</li><li>Leg press: 3x10</li><li>Cadeira extensora: 3x12</li><li>Desenvolvimento com halteres: 3x10</li><li>Elevação lateral: 3x12</li></ul><strong>Dicas:</strong><ul><li>Priorize a execução correta, não o peso.</li><li>Desça bem no agachamento e mantenha o abdômen firme.</li></ul>`;
        case 'Descanso':
            return `<em>Dia de descanso! Foque em recuperação, hidratação e alongamentos leves.</em>`;
        default:
            return '';
    }
}

function atualizarDiasFocado() {
    const diasFocadoSpan = document.getElementById('dias-focado');
    const dashboardCard = diasFocadoSpan?.closest('.dashboard-card');
    let diasFocado = parseInt(localStorage.getItem('diasFocado') || '0');
    let ultimoLogin = localStorage.getItem('ultimoLogin');
    const hoje = new Date().toLocaleDateString();
    if (ultimoLogin !== hoje) {
        diasFocado++;
        localStorage.setItem('diasFocado', diasFocado);
        localStorage.setItem('ultimoLogin', hoje);
    }
    // Ajusta o tamanho do fogo conforme a sequência
    let classeFogo = 'dias-fogo-1';
    if (diasFocado >= 15) classeFogo = 'dias-fogo-5';
    else if (diasFocado >= 10) classeFogo = 'dias-fogo-4';
    else if (diasFocado >= 5) classeFogo = 'dias-fogo-3';
    else if (diasFocado >= 2) classeFogo = 'dias-fogo-2';
    if (dashboardCard) {
        dashboardCard.classList.remove('dias-fogo-1','dias-fogo-2','dias-fogo-3','dias-fogo-4','dias-fogo-5');
        dashboardCard.classList.add(classeFogo);
    }
    if (diasFocadoSpan) {
        diasFocadoSpan.innerHTML = `<span id='fogo-emoji'>🔥</span> ${diasFocado}`;
    }
}

// ================= METAS (GOALS) =================
function carregarMetas() {
    const lista = document.getElementById('goals-list');
    if (!lista) return;
    lista.innerHTML = '';
    const metas = JSON.parse(localStorage.getItem('metasUsuario') || '[]');
    metas.forEach((meta, idx) => {
        const li = document.createElement('li');
        li.className = 'goal-item';
        li.innerHTML = `
            <input type="checkbox" ${meta.concluida ? 'checked' : ''} data-idx="${idx}" class="goal-check">
            <span style="text-decoration:${meta.concluida ? 'line-through' : 'none'};color:${meta.concluida ? '#888' : '#222'};">${meta.texto}</span>
            <button class="goal-remove" data-idx="${idx}" title="Remover" aria-label="Remover meta">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M9 10v6M15 10v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
        `;
        lista.appendChild(li);
    });
}

function salvarMetas(metas) {
    localStorage.setItem('metasUsuario', JSON.stringify(metas));
    carregarMetas();
}

function abrirModalMeta() {
    document.getElementById('modal-nova-meta').classList.add('active');
    document.getElementById('input-nova-meta').value = '';
    document.getElementById('erro-meta').style.display = 'none';
    setTimeout(() => {
        document.getElementById('input-nova-meta').focus();
    }, 100);
}

function fecharModalMeta() {
    document.getElementById('modal-nova-meta').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    carregarMetas();
    const btnAdd = document.getElementById('addGoalBtn');
    const lista = document.getElementById('goals-list');
    const modal = document.getElementById('modal-nova-meta');
    const btnSalvar = document.getElementById('btn-salvar-meta');
    const btnCancelar = document.getElementById('btn-cancelar-meta');
    const inputMeta = document.getElementById('input-nova-meta');
    const erroMeta = document.getElementById('erro-meta');

    if (btnAdd && lista && modal && btnSalvar && btnCancelar && inputMeta) {
        btnAdd.addEventListener('click', function() {
            abrirModalMeta();
        });
        btnCancelar.addEventListener('click', function() {
            fecharModalMeta();
        });
        btnSalvar.addEventListener('click', function() {
            const texto = inputMeta.value.trim();
            if (!texto) {
                erroMeta.textContent = 'Digite uma meta válida!';
                erroMeta.style.display = 'block';
                inputMeta.focus();
                return;
            }
            if (texto.length > 60) {
                erroMeta.textContent = 'A meta deve ter no máximo 60 caracteres.';
                erroMeta.style.display = 'block';
                inputMeta.focus();
                return;
            }
            const metas = JSON.parse(localStorage.getItem('metasUsuario') || '[]');
            metas.push({ texto, concluida: false });
            salvarMetas(metas);
            fecharModalMeta();
        });
        inputMeta.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') btnSalvar.click();
        });
        // Fechar modal ao clicar fora do conteúdo
        modal.addEventListener('mousedown', function(e) {
            if (e.target === modal) fecharModalMeta();
        });
        // Fechar modal com ESC
        document.addEventListener('keydown', function(e) {
            if (modal.classList.contains('active') && e.key === 'Escape') fecharModalMeta();
        });
        lista.addEventListener('click', function(e) {
            const btnRemove = e.target.closest('.goal-remove');
            if (btnRemove) {
                const idx = btnRemove.getAttribute('data-idx');
                let metas = JSON.parse(localStorage.getItem('metasUsuario') || '[]');
                metas.splice(idx, 1);
                salvarMetas(metas);
                return;
            }
            if (e.target.classList.contains('goal-check')) {
                const idx = e.target.getAttribute('data-idx');
                let metas = JSON.parse(localStorage.getItem('metasUsuario') || '[]');
                metas[idx].concluida = !metas[idx].concluida;
                salvarMetas(metas);
            }
        });
    }
});

// ================= CALENDÁRIO SIMPLES =================
function renderizarCalendarioSimples() {
    const calendarDiv = document.getElementById('calendar');
    if (!calendarDiv) return;
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const diaHoje = hoje.getDate();
    const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const nomesDias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1).getDay();
    // Dias no mês
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    let html = `<div class='calendario-wrapper'>`;
    html += `<div class='calendario-cabecalho'><strong>${nomesMeses[mes]} ${ano}</strong></div>`;
    html += `<div class='calendario-grid'>`;
    nomesDias.forEach(d => html += `<div class='cal-dia-nome'>${d}</div>`);
    for (let i = 0; i < primeiroDia; i++) html += `<div></div>`;
    for (let d = 1; d <= diasNoMes; d++) {
        const isHoje = d === diaHoje;
        html += `<div class='cal-dia${isHoje ? ' cal-dia-hoje' : ''}'>${d}</div>`;
    }
    html += `</div></div>`;
    calendarDiv.innerHTML = html;
}

// ================= TEMPERATURA ATUAL =================
function buscarTemperaturaAtual() {
    const weatherDiv = document.getElementById('weather-info');
    if (!weatherDiv) return;
    if (!navigator.geolocation) {
        weatherDiv.textContent = 'Geolocalização não suportada';
        return;
    }
    weatherDiv.textContent = 'Carregando...';
    navigator.geolocation.getCurrentPosition(async function(pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
            // Usando Open-Meteo API (sem necessidade de chave)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
            const resp = await fetch(url);
            const data = await resp.json();
            if (data && data.current_weather && typeof data.current_weather.temperature === 'number') {
                weatherDiv.textContent = `${Math.round(data.current_weather.temperature)}°C`;
            } else {
                weatherDiv.textContent = 'Não foi possível obter a temperatura';
            }
        } catch (e) {
            weatherDiv.textContent = 'Erro ao buscar temperatura';
        }
    }, function() {
        weatherDiv.textContent = 'Permissão negada';
    });
}

// ================= SISTEMA DE LOGOUT =================
function realizarLogout() {
    // Limpa os dados do usuário do localStorage
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('diasFocado');
    localStorage.removeItem('ultimoLogin');
    localStorage.removeItem('metasUsuario');
    
    // Mostra notificação de logout
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.textContent = 'Logout realizado com sucesso!';
        toast.className = "toast show";
        setTimeout(function(){ 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
    }
    
    // Redireciona para a página de login
    setTimeout(() => {
        window.location.href = '../ON Focus Login/index.html';
    }, 1000);
}

// Adiciona evento de logout quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            realizarLogout();
        });
    }
    
    // Inicializa a página
    inicializarPagina();
});
