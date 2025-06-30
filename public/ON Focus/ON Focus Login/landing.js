// Dados dos depoimentos
const testimonials = [
    {
        name: "Maria Silva",
        avatar: "imagens/cliente maria.png",
        text: "A ON Focus transformou completamente minha vida! Em 6 meses, perdi 15kg e ganhei muita disposição. Os treinos são personalizados e os instrutores são muito atenciosos.",
        rating: 5
    },
    {
        name: "João Santos",
        avatar: "imagens/cliente joao.png",
        text: "Nunca imaginei que conseguiria ter tanta força e resistência. A metodologia da ON Focus é única e os resultados são impressionantes. Recomendo a todos!",
        rating: 4.5
    },
    {
        name: "Ana Oliveira",
        avatar: "imagens/cliente ana.jpg",
        text: "A ON Focus não é só uma academia, é um estilo de vida. A equipe é incrível e os resultados superam todas as expectativas. Já são 2 anos de transformação!",
        rating: 5
    }
];

// Variáveis globais
let currentTestimonial = 0;
const testimonialSlider = document.querySelector('.testimonials-slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const menuMobile = document.querySelector('.menu-mobile');
const navLinks = document.querySelector('.nav-links');
const leadForm = document.getElementById('leadForm');

// Função para criar o HTML do depoimento
function createTestimonialHTML(testimonial) {
    const stars = Array(Math.floor(testimonial.rating))
        .fill('<i class="fas fa-star"></i>')
        .join('');
    
    const halfStar = testimonial.rating % 1 !== 0 
        ? '<i class="fas fa-star-half-alt"></i>' 
        : '';

    return `
        <div class="testimonial-card">
            <div class="testimonial-content">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <h4>${testimonial.name}</h4>
                <div class="stars">
                    ${stars}${halfStar}
                </div>
            </div>
        </div>
    `;
}

// Função para atualizar o slider de depoimentos
function updateTestimonialSlider() {
    testimonialSlider.innerHTML = createTestimonialHTML(testimonials[currentTestimonial]);
}

// Função para navegar entre os depoimentos
function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonialSlider();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonialSlider();
}

// Função para alternar o menu mobile
function toggleMobileMenu() {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Função para validar o formulário
function validateForm(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    
    // Validação básica
    if (!nome || !email || !telefone) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }
    
    // Validação de telefone (formato brasileiro)
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
        alert('Por favor, insira um telefone válido no formato (99) 99999-9999');
        return;
    }
    
    // Aqui você pode adicionar o código para enviar os dados para seu backend
    alert('Obrigado pelo seu interesse! Entraremos em contato em breve.');
    leadForm.reset();
}

// Função para formatar o número de telefone
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 0) {
        if (value.length <= 2) {
            value = `(${value}`;
        } else if (value.length <= 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
    }
    
    input.value = value;
}

// Função para animar elementos quando entram na viewport
function animateOnScroll() {
    const elements = document.querySelectorAll('.benefit-card, .testimonial-card, .contact-content, .contact-image');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o slider de depoimentos
    updateTestimonialSlider();
    
    // Configurar o intervalo para trocar depoimentos automaticamente
    setInterval(nextTestimonial, 5000);
    
    // Adicionar event listeners
    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);
    menuMobile.addEventListener('click', toggleMobileMenu);
    leadForm.addEventListener('submit', validateForm);
    
    // Adicionar máscara ao campo de telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', () => formatPhoneNumber(telefoneInput));
    
    // Configurar animações de scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Inicializar animações
    animateOnScroll();
});

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Fechar menu mobile se estiver aberto
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
}); 