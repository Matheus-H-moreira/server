// Variável global para armazenar a receita ou notícia atual
let itemAtual = null;

// Carrega os detalhes da receita ou notícia quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));
    if (itemId) {
        await carregarDetalhesReceitaOuNoticia(itemId);
    } else {
        mostrarErro('Receita não encontrada');
    }
});

async function carregarDetalhesReceitaOuNoticia(id) {
    // Primeiro tenta buscar em receitas.json
    try {
        const response = await fetch('receitas.json');
        const receitas = await response.json();
        itemAtual = receitas.find(r => r.id === id);
        if (itemAtual) {
            exibirDetalhesReceita(itemAtual);
            return;
        }
    } catch (e) {}
    // Se não encontrar, busca em noticias.json (compatibilidade)
    try {
        const response = await fetch('noticias.json');
        const noticias = await response.json();
        itemAtual = noticias.find(n => n.id === id);
        if (itemAtual) {
            exibirDetalhesNoticia(itemAtual);
            return;
        }
    } catch (e) {}
    mostrarErro('Receita ou notícia não encontrada');
}

function exibirDetalhesReceita(receita) {
    const article = document.querySelector('.article-details-modern');
    document.title = `${receita.nome} - Receita | ON Focus Dietas`;
    article.innerHTML = `
        <header class="article-header">
            <h1 class="article-title">${receita.nome}</h1>
            <div class="article-tags">
                ${receita.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </header>
        <div class="article-image">
            <img src="${receita.imagem}" alt="${receita.nome}" onerror="this.style.display='none'">
        </div>
        <div class="article-content">
            <p class="receita-descricao">${receita.descricao}</p>
            <ul class="receita-info-list">
                <li><strong>Tempo de preparo:</strong> ${receita.tempo_preparo}</li>
                <li><strong>Rendimento:</strong> ${receita.rendimento}</li>
                <li><strong>Calorias:</strong> ${receita.calorias} kcal</li>
            </ul>
            <h3>Ingredientes</h3>
            <ul class="receita-ingredientes">
                ${receita.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h3>Modo de Preparo</h3>
            <ol class="receita-modo-preparo">
                ${receita.modo_preparo.map(passo => `<li>${passo}</li>`).join('')}
            </ol>
        </div>
    `;
}

function exibirDetalhesNoticia(noticia) {
    const article = document.querySelector('.article-details-modern');
    
    // Formata a data
    const dataFormatada = new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    // Atualiza o título da página
    document.title = `${noticia.titulo} - ON Focus Blog`;
    
    // Cria o HTML com todos os detalhes
    article.innerHTML = `
        <header class="article-header">
            <div class="article-meta">
                <span class="article-date">${dataFormatada}</span>
            </div>
            <h1 class="article-title">${noticia.titulo}</h1>
            <div class="article-tags">
                ${noticia.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </header>
        
        <div class="article-image">
            <img src="${noticia.imagem}" alt="${noticia.titulo}" onerror="this.style.display='none'">
        </div>
        
        <div class="article-content">
            ${formatarConteudo(noticia.conteudo)}
        </div>
        
        ${noticia.imagens_adicionais ? `
        <div class="article-gallery">
            ${noticia.imagens_adicionais.map(img => `
                <img src="${img}" alt="Imagem adicional" class="gallery-image" onerror="this.style.display='none'">
            `).join('')}
        </div>
        ` : ''}
    `;
}

function formatarConteudo(conteudo) {
    // Converte quebras de linha em parágrafos
    return conteudo.split('\n\n').map(paragrafo => {
        // Se o parágrafo começa com um número seguido de ponto, é uma lista numerada
        if (/^\d+\./.test(paragrafo)) {
            return `<ol>${paragrafo.split('\n').map(item => 
                `<li>${item.replace(/^\d+\.\s*/, '')}</li>`
            ).join('')}</ol>`;
        }
        // Se o parágrafo começa com hífen, é uma lista não numerada
        else if (paragrafo.startsWith('-')) {
            return `<ul>${paragrafo.split('\n').map(item => 
                `<li>${item.replace(/^-\s*/, '')}</li>`
            ).join('')}</ul>`;
        }
        // Caso contrário, é um parágrafo normal
        return `<p>${paragrafo}</p>`;
    }).join('');
}

function curtirNoticia(id) {
    // Aqui você implementaria a lógica para curtir a notícia
    alert('Funcionalidade de curtir em desenvolvimento!');
}

function compartilharNoticia(id) {
    if (navigator.share) {
        navigator.share({
            title: noticiaAtual.titulo,
            text: noticiaAtual.resumo,
            url: window.location.href
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        }).catch(console.error);
    }
}

function mostrarErro(mensagem) {
    const article = document.querySelector('.article-details-modern');
    article.innerHTML = `
        <div class="error-message">
            <h2>Ops!</h2>
            <p>${mensagem}</p>
            <a href="index.html" class="back-home">Voltar para a página inicial</a>
        </div>
    `;
}

// Sistema de Tema
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });
});

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