/**
 * Sistema de Tema
 * Gerencia a alternância entre tema claro e escuro
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões de tema
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;
    
    // Recupera o tema salvo ou usa 'dark' como padrão
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    // Atualiza os ícones dos botões de tema
    updateThemeIcons(savedTheme);
    
    // Adiciona evento de clique para cada botão de tema
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });
    
    // Função para atualizar os ícones de acordo com o tema
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
});

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
        todasNoticias = await response.json();
        noticiasExibidas = 0;
        exibirNoticiasFiltradas(true);
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
    }
}

function exibirNoticiasFiltradas(reset = false) {
    const newsGrid = document.querySelector('.news-grid');
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
                <button class="share-btn-modern" onclick="compartilharNoticia(${noticia.id})" title="Compartilhar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    <span>Compartilhar</span>
                </button>
            </div>
        </div>
    `;
    
    // Adiciona evento de clique para abrir os detalhes
    article.addEventListener('click', (e) => {
        if (!e.target.closest('.share-btn')) {
            window.location.href = `detalhes.html?id=${noticia.id}`;
        }
    });
    
    return article;
}

function compartilharNoticia(id) {
    alert('Funcionalidade de compartilhamento não está disponível no momento.');
}

// Adiciona evento de mudança nos checkboxes de tópicos
const checkboxesTopicos = document.querySelectorAll('.topic-checkbox');
checkboxesTopicos.forEach(cb => {
    cb.addEventListener('change', () => exibirNoticiasFiltradas(true));
});

// Carrega as notícias quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', carregarNoticias);

/**
 * Menu Mobile
 * Gerencia a funcionalidade do menu mobile e overlay
 */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const aside = document.querySelector('aside');
const menuOverlay = document.querySelector('.menu-overlay');

// Função para alternar o estado do menu mobile
function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    aside.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = aside.classList.contains('active') ? 'hidden' : '';
}

// Event Listeners para o menu mobile
mobileMenuToggle.addEventListener('click', toggleMobileMenu);
menuOverlay.addEventListener('click', toggleMobileMenu);

// Fecha o menu ao clicar em um link
const menuLinks = document.querySelectorAll('aside a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMobileMenu();
        }
    });
});

// Fecha o menu ao redimensionar a janela
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenuToggle.classList.remove('active');
        aside.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

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
    searchModal.classList.toggle('active');
    if (searchModal.classList.contains('active')) {
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Event Listeners para o modal de busca
searchToggle.addEventListener('click', toggleSearchModal);
closeSearch.addEventListener('click', toggleSearchModal);

// Fecha o modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        toggleSearchModal();
    }
});

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

// Função para carregar e exibir treinos
async function carregarTreinos() {
    try {
        const response = await fetch('http://https://localhost:3000/treinos');
        const treinos = await response.json();
        const container = document.querySelector('.treinos-container');
        if (!container) return;
        container.innerHTML = '';
        treinos.forEach(treino => {
            const div = document.createElement('div');
            div.className = 'treino-card';
            div.innerHTML = `
                <img src="${treino.imagem}" alt="${treino.titulo}" class="treino-imagem">
                <div class="treino-titulo">${treino.titulo}</div>
                <div class="treino-descricao">${treino.descricao}</div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar treinos:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarNoticias();
    carregarTreinos();
});

document.addEventListener('DOMContentLoaded', function() {
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

            // Atualiza peso, altura e IMC
            const pesoElement = document.getElementById('user-peso');
            const alturaElement = document.getElementById('user-altura');
            const imcElement = document.getElementById('user-imc');
            if (pesoElement && usuarioLogado.peso) {
                pesoElement.textContent = `${usuarioLogado.peso} kg`;
            }
            if (alturaElement && usuarioLogado.altura) {
                alturaElement.textContent = `${usuarioLogado.altura} m`;
            }
            if (imcElement && usuarioLogado.peso && usuarioLogado.altura) {
                const peso = parseFloat(usuarioLogado.peso);
                const altura = parseFloat(usuarioLogado.altura);
                if (peso > 0 && altura > 0) {
                    const imc = peso / (altura * altura);
                    imcElement.textContent = imc.toFixed(2);

                    // Classificação do IMC
                    const classificacaoElement = document.getElementById('imc-classificacao');
                    let classificacao = '--';
                    if (imc < 18.5) classificacao = 'Abaixo do peso';
                    else if (imc < 25) classificacao = 'Peso normal';
                    else if (imc < 30) classificacao = 'Sobrepeso';
                    else if (imc < 35) classificacao = 'Obesidade I';
                    else if (imc < 40) classificacao = 'Obesidade II';
                    else classificacao = 'Obesidade III';
                    if (classificacaoElement) classificacaoElement.textContent = classificacao;
                } else {
                    imcElement.textContent = '--';
                    const classificacaoElement = document.getElementById('imc-classificacao');
                    if (classificacaoElement) classificacaoElement.textContent = '--';
                }
            }
        }
    } catch (error) {
        console.error("Falha ao carregar dados do usuário:", error);
    }

    // Adiciona redirecionamento para a página de menu ao clicar no perfil
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.style.cursor = 'pointer';
        profileSection.addEventListener('click', () => {
            window.location.href = '../ON Focus Cadastro/Menu.html';
        });
    }

    const botoes = document.querySelectorAll('.treino-card-btn');
    fetch('noticias.json')
        .then(resp => resp.json())
        .then(treinos => {
            botoes.forEach((btn, idx) => {
                btn.addEventListener('click', function() {
                    const treino = treinos[idx];
                    if (treino && treino.id) {
                        window.location.href = `detalhes.html?id=${treino.id}`;
                    }
                });
            });

            // FILTRO POR TÓPICO
            const topicButtons = document.querySelectorAll('.treino-topic-card');
            const cards = document.querySelectorAll('.treino-card');
            topicButtons.forEach(topicBtn => {
                topicBtn.addEventListener('click', function() {
                    const texto = topicBtn.textContent.trim().toLowerCase();
                    if (topicBtn.classList.contains('active')) {
                        cards.forEach(card => card.style.display = '');
                        topicButtons.forEach(btn => btn.classList.remove('active'));
                        return;
                    }
                    topicButtons.forEach(btn => btn.classList.remove('active'));
                    topicBtn.classList.add('active');
                    cards.forEach((card, idx) => {
                        const treino = treinos[idx];
                        if (!treino) return;
                        const match = treino.titulo.toLowerCase().includes(texto) ||
                                      (treino.tags && treino.tags.some(tag => tag.toLowerCase().includes(texto)));
                        card.style.display = match ? '' : 'none';
                    });
                });
            });

            // FILTRO POR PESQUISA
            const searchInput = document.querySelector('.search-bar input');
            const searchBtn = document.querySelector('.search-bar button');
            function filtrarPorPesquisa() {
                const termo = searchInput.value.trim().toLowerCase();
                cards.forEach((card, idx) => {
                    const treino = treinos[idx];
                    if (!treino) return;
                    const match = treino.titulo.toLowerCase().includes(termo) ||
                                  treino.descricao.toLowerCase().includes(termo) ||
                                  (treino.tags && treino.tags.some(tag => tag.toLowerCase().includes(termo)));
                    card.style.display = match ? '' : 'none';
                });
                // Remove destaque de tópicos
                topicButtons.forEach(btn => btn.classList.remove('active'));
            }
            if (searchInput) {
                searchInput.addEventListener('input', filtrarPorPesquisa);
            }
            if (searchBtn) {
                searchBtn.addEventListener('click', filtrarPorPesquisa);
            }
        });
});

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

// Sistema de Favoritos
let favoritos = JSON.parse(localStorage.getItem('treinosFavoritos') || '[]');

function toggleFavorito(treinoId) {
    const index = favoritos.indexOf(treinoId);
    const btn = document.querySelector(`[data-treino-id="${treinoId}"] .favorito-btn`);
    
    if (index === -1) {
        // Adicionar aos favoritos
        favoritos.push(treinoId);
        btn.classList.add('favorito');
        btn.innerHTML = '<i class="fa fa-heart"></i>';
        showToast('Treino adicionado aos favoritos!', 'fa-heart');
    } else {
        // Remover dos favoritos
        favoritos.splice(index, 1);
        btn.classList.remove('favorito');
        btn.innerHTML = '<i class="fa fa-heart-o"></i>';
        showToast('Treino removido dos favoritos!', 'fa-heart-o');
    }
    
    // Salvar no localStorage
    localStorage.setItem('treinosFavoritos', JSON.stringify(favoritos));
    
    // Atualizar seção de favoritos
    atualizarSecaoFavoritos();
}

function atualizarSecaoFavoritos() {
    const favoritosSection = document.getElementById('favoritos-section');
    const favoritosGrid = document.getElementById('favoritos-grid');
    
    if (favoritos.length === 0) {
        favoritosSection.style.display = 'none';
        return;
    }
    
    favoritosSection.style.display = 'block';
    favoritosGrid.innerHTML = '';
    
    // Dados dos treinos (simulando um banco de dados)
    const treinosData = {
        1: { titulo: 'Treino Full Body', descricao: 'Treino completo para o corpo todo, ideal para iniciantes e intermediários.' },
        2: { titulo: 'HIIT 20 Minutos', descricao: 'Treino intenso de alta queima calórica em pouco tempo.' },
        3: { titulo: 'Alongamento e Mobilidade', descricao: 'Série de exercícios para melhorar a flexibilidade e prevenir lesões.' },
        4: { titulo: 'Treino de Pernas Avançado', descricao: 'Foque no fortalecimento e hipertrofia das pernas com exercícios avançados.' }
    };
    
    favoritos.forEach(treinoId => {
        const treino = treinosData[treinoId];
        if (treino) {
            const card = document.createElement('div');
            card.className = 'treino-card';
            card.dataset.treinoId = treinoId;
            
            card.innerHTML = `
                <div class="treino-card-header">
                    <h3 class="treino-card-title">${treino.titulo}</h3>
                    <button class="favorito-btn favorito" data-treino-id="${treinoId}" title="Remover dos favoritos">
                        <i class="fa fa-heart"></i>
                    </button>
                </div>
                <p class="treino-card-desc">${treino.descricao}</p>
                <button class="treino-card-btn">Ver Detalhes</button>
            `;
            
            // Adicionar evento de clique para o botão de favorito
            const favoritoBtn = card.querySelector('.favorito-btn');
            favoritoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorito(treinoId);
            });
            
            favoritosGrid.appendChild(card);
        }
    });
}

function inicializarFavoritos() {
    // Atualizar botões de favorito baseado no localStorage
    favoritos.forEach(treinoId => {
        const btn = document.querySelector(`[data-treino-id="${treinoId}"] .favorito-btn`);
        if (btn) {
            btn.classList.add('favorito');
            btn.innerHTML = '<i class="fa fa-heart"></i>';
        }
    });
    
    // Adicionar eventos de clique para todos os botões de favorito
    document.querySelectorAll('.favorito-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const treinoId = btn.dataset.treinoId;
            toggleFavorito(treinoId);
        });
    });
    
    // Atualizar seção de favoritos
    atualizarSecaoFavoritos();
}

// Inicializar favoritos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    inicializarFavoritos();
    carregarNoticias();
});
