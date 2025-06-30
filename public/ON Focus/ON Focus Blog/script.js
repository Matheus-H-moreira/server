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

// Função para carregar e exibir posts do blog
async function carregarPosts() {
    try {
        const response = await fetch('http://localhost:3000/posts');
        const posts = await response.json();
        const container = document.querySelector('.posts-container');
        if (!container) return;
        container.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post-card';
            div.innerHTML = `
                <img src="${post.imagem}" alt="${post.titulo}" class="post-imagem">
                <div class="post-titulo">${post.titulo}</div>
                <div class="post-resumo">${post.resumo}</div>
                <a href="detalhes.html?id=${post.id}" class="post-ler-mais">Ler mais</a>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarNoticias();
    carregarPosts();
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
});
