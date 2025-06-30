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

// Função para carregar e exibir dicas
async function carregarDicas() {
    try {
        const response = await fetch('http://localhost:3000/dicas');
        const dicas = await response.json();
        const container = document.querySelector('.dicas-container');
        if (!container) return;
        container.innerHTML = '';
        dicas.forEach(dica => {
            const div = document.createElement('div');
            div.className = 'dica-card';
            div.innerHTML = `
                <div class="dica-emoji">${dica.emoji}</div>
                <div class="dica-titulo">${dica.titulo}</div>
                <div class="dica-descricao">${dica.descricao}</div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar dicas:', error);
    }
}

// Função para carregar e exibir dietas
async function carregarDietas() {
    try {
        const response = await fetch('http://localhost:3000/dietas');
        const dietas = await response.json();
        const container = document.querySelector('.dietas-container');
        if (!container) return;
        container.innerHTML = '';
        dietas.forEach(dieta => {
            const div = document.createElement('div');
            div.className = 'dieta-card';
            div.innerHTML = `
                <img src="${dieta.imagem}" alt="${dieta.nome}" class="dieta-imagem">
                <div class="dieta-nome">${dieta.nome}</div>
                <div class="dieta-descricao">${dieta.descricao}</div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar dietas:', error);
    }
}

// Filtro de categorias de dieta
let categoriaSelecionada = null;
document.addEventListener('DOMContentLoaded', () => {
    const botoesCategoria = document.querySelectorAll('.filtro-categoria-btn');
    botoesCategoria.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.textContent.trim().toLowerCase();
            if (categoriaSelecionada === categoria) {
                categoriaSelecionada = null;
                botoesCategoria.forEach(b => b.classList.remove('ativo'));
                carregarReceitas(); // Mostra todas
            } else {
                categoriaSelecionada = categoria;
                botoesCategoria.forEach(b => b.classList.remove('ativo'));
                this.classList.add('ativo');
                carregarReceitas(categoriaSelecionada);
            }
        });
    });
});

// ================= SISTEMA DE DIETAS AVANÇADO =================

// Variáveis globais
let todasReceitas = [];
let filtroAtual = 'todas';
let caloriasMeta = 2000;
let caloriasConsumido = 0;

// Carregar receitas do arquivo JSON
async function carregarReceitas() {
    try {
        const response = await fetch('receitas.json');
        todasReceitas = await response.json();
        exibirReceitas();
    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
    }
}

// Exibir receitas com filtro
function exibirReceitas() {
    const grid = document.getElementById('receitas-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    const receitasFiltradas = todasReceitas.filter(receita => {
        if (filtroAtual === 'todas') return true;
        return receita.tags.some(tag => tag.toLowerCase().includes(filtroAtual));
    });

    receitasFiltradas.forEach(receita => {
        const card = criarCardReceita(receita);
        grid.appendChild(card);
    });
}

// Criar card de receita
function criarCardReceita(receita) {
    const card = document.createElement('div');
    card.className = 'receita-card';
    card.innerHTML = `
        <div class="receita-imagem">
            <img src="${receita.imagem}" alt="${receita.nome}">
        </div>
        <div class="receita-conteudo">
            <h3 class="receita-titulo">${receita.nome}</h3>
            <p class="receita-descricao">${receita.descricao}</p>
            <div class="receita-info">
                <span class="receita-tempo">⏱️ ${receita.tempo_preparo}</span>
                <span class="receita-calorias">🔥 ${receita.calorias} kcal</span>
                <span class="receita-porcoes">👥 ${receita.rendimento}</span>
            </div>
            <div class="receita-tags">
                ${receita.tags.map(tag => `<span class="receita-tag">${tag}</span>`).join('')}
            </div>
            <button class="receita-btn" onclick="verReceita(${receita.id})">Ver Receita</button>
        </div>
    `;
    return card;
}

// Ver detalhes da receita
function verReceita(id) {
    const receita = todasReceitas.find(r => r.id === id);
    if (!receita) return;

    const modal = document.createElement('div');
    modal.className = 'modal-receita';
    modal.innerHTML = `
        <div class="modal-receita-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="receita-detalhes">
                <img src="${receita.imagem}" alt="${receita.nome}" class="receita-detalhes-imagem">
                <h2>${receita.nome}</h2>
                <p class="receita-detalhes-descricao">${receita.descricao}</p>
                
                <div class="receita-detalhes-info">
                    <div class="info-item">
                        <strong>Tempo:</strong> ${receita.tempo_preparo}
                    </div>
                    <div class="info-item">
                        <strong>Rendimento:</strong> ${receita.rendimento}
                    </div>
                    <div class="info-item">
                        <strong>Calorias:</strong> ${receita.calorias} kcal
                    </div>
                </div>

                <div class="receita-detalhes-secao">
                    <h3>Ingredientes</h3>
                    <ul>
                        ${receita.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                    </ul>
                </div>

                <div class="receita-detalhes-secao">
                    <h3>Modo de Preparo</h3>
                    <ol>
                        ${receita.modo_preparo.map(passo => `<li>${passo}</li>`).join('')}
                    </ol>
                </div>

                <div class="receita-detalhes-acoes">
                    <button class="btn-adicionar-refeicao" onclick="adicionarRefeicao('${receita.nome}', ${receita.calorias})">
                        Adicionar ao Planejamento
                    </button>
                    <button class="btn-adicionar-calorias" onclick="adicionarCalorias(${receita.calorias})">
                        Adicionar Calorias
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Sistema de filtros
function inicializarFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            filtros.forEach(f => f.classList.remove('active'));
            filtro.classList.add('active');
            filtroAtual = filtro.dataset.filtro;
            exibirReceitas();
        });
    });
}

// Sistema de planejamento de refeições
function inicializarPlanejamento() {
    const refeicoes = document.querySelectorAll('.refeicao-item');
    refeicoes.forEach(refeicao => {
        refeicao.addEventListener('click', () => {
            abrirModalPlanejamento(refeicao.id);
        });
    });
}

function abrirModalPlanejamento(refeicaoId) {
    const modal = document.createElement('div');
    modal.className = 'modal-planejamento';
    modal.innerHTML = `
        <div class="modal-planejamento-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>Escolher Refeição</h3>
            <div class="opcoes-refeicao">
                ${todasReceitas.map(receita => `
                    <div class="opcao-refeicao" onclick="selecionarRefeicao('${refeicaoId}', '${receita.nome}')">
                        <img src="${receita.imagem}" alt="${receita.nome}">
                        <div>
                            <strong>${receita.nome}</strong>
                            <span>${receita.calorias} kcal</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selecionarRefeicao(refeicaoId, nomeReceita) {
    const elemento = document.getElementById(refeicaoId);
    if (elemento) {
        elemento.textContent = nomeReceita;
        elemento.classList.add('refeicao-selecionada');
        
        // Salvar no localStorage
        const planejamento = JSON.parse(localStorage.getItem('planejamentoRefeicoes') || '{}');
        planejamento[refeicaoId] = nomeReceita;
        localStorage.setItem('planejamentoRefeicoes', JSON.stringify(planejamento));
    }
    
    // Fechar modal
    const modal = document.querySelector('.modal-planejamento');
    if (modal) modal.remove();
}

// Sistema de controle de calorias
function inicializarControleCalorias() {
    const slider = document.getElementById('calorias-slider');
    const metaElement = document.getElementById('calorias-meta');
    const restanteElement = document.getElementById('calorias-restante');
    
    if (slider) {
        slider.addEventListener('input', (e) => {
            caloriasMeta = parseInt(e.target.value);
            metaElement.textContent = caloriasMeta;
            atualizarCaloriasRestante();
            
            // Salvar no localStorage
            localStorage.setItem('caloriasMeta', caloriasMeta);
        });
    }
    
    // Carregar dados salvos
    const metaSalva = localStorage.getItem('caloriasMeta');
    const consumidoSalvo = localStorage.getItem('caloriasConsumido');
    
    if (metaSalva) {
        caloriasMeta = parseInt(metaSalva);
        slider.value = caloriasMeta;
        metaElement.textContent = caloriasMeta;
    }
    
    if (consumidoSalvo) {
        caloriasConsumido = parseInt(consumidoSalvo);
        document.getElementById('calorias-consumido').textContent = caloriasConsumido;
    }
    
    atualizarCaloriasRestante();
}

function adicionarCalorias(calorias) {
    caloriasConsumido += calorias;
    document.getElementById('calorias-consumido').textContent = caloriasConsumido;
    localStorage.setItem('caloriasConsumido', caloriasConsumido);
    atualizarCaloriasRestante();
    
    // Fechar modal da receita
    const modal = document.querySelector('.modal-receita');
    if (modal) modal.remove();
}

function atualizarCaloriasRestante() {
    const restante = Math.max(0, caloriasMeta - caloriasConsumido);
    document.getElementById('calorias-restante').textContent = restante;
    
    // Atualizar barra de progresso
    const progresso = (caloriasConsumido / caloriasMeta) * 100;
    const barraProgresso = document.getElementById('calorias-progresso');
    if (barraProgresso) {
        barraProgresso.style.width = Math.min(100, progresso) + '%';
        barraProgresso.style.backgroundColor = progresso > 100 ? '#ff4444' : '#4CAF50';
    }
}

function adicionarRefeicao(nomeReceita, calorias) {
    // Adicionar automaticamente as calorias
    adicionarCalorias(calorias);
    
    // Mostrar notificação
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = `${nomeReceita} adicionada! +${calorias} kcal`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Carregar planejamento salvo
function carregarPlanejamentoSalvo() {
    const planejamento = JSON.parse(localStorage.getItem('planejamentoRefeicoes') || '{}');
    Object.keys(planejamento).forEach(refeicaoId => {
        const elemento = document.getElementById(refeicaoId);
        if (elemento) {
            elemento.textContent = planejamento[refeicaoId];
            elemento.classList.add('refeicao-selecionada');
        }
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarReceitas();
    inicializarFiltros();
    inicializarPlanejamento();
    inicializarControleCalorias();
    carregarPlanejamentoSalvo();
    
    // Carregar dados do usuário
    carregarDadosUsuario();
});

// Carregar dados do usuário
function carregarDadosUsuario() {
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

    // Adiciona redirecionamento ao clicar no card de usuário
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.style.cursor = 'pointer';
        profileSection.addEventListener('click', function() {
            window.location.href = '../ON Focus Cadastro/Menu.html';
        });
    }
}
