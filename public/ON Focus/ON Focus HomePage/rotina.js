// Utilitário para obter o plano de rotina do usuário
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
            return `
                <strong>Exemplo de Exercícios:</strong>
                <ul>
                    <li>Supino reto com barra: 4x8-12</li>
                    <li>Supino inclinado com halteres: 3x10</li>
                    <li>Crucifixo: 3x12</li>
                    <li>Tríceps testa: 3x10</li>
                    <li>Tríceps corda: 3x12</li>
                </ul>
                <strong>Dicas:</strong>
                <ul>
                    <li>Desça o peso devagar e foque na contração.</li>
                    <li>Descanse 60-90s entre as séries.</li>
                </ul>
            `;
        case 'Treino B - Costas e Bíceps':
            return `
                <strong>Exemplo de Exercícios:</strong>
                <ul>
                    <li>Puxada na barra: 4x8-12</li>
                    <li>Remada curvada: 3x10</li>
                    <li>Pulldown: 3x12</li>
                    <li>Rosca direta: 3x10</li>
                    <li>Rosca alternada: 3x12</li>
                </ul>
                <strong>Dicas:</strong>
                <ul>
                    <li>Mantenha a postura e evite "roubar" o movimento.</li>
                    <li>Foque na amplitude total.</li>
                </ul>
            `;
        case 'Treino C - Pernas e Ombros':
            return `
                <strong>Exemplo de Exercícios:</strong>
                <ul>
                    <li>Agachamento livre: 4x8-12</li>
                    <li>Leg press: 3x10</li>
                    <li>Cadeira extensora: 3x12</li>
                    <li>Desenvolvimento com halteres: 3x10</li>
                    <li>Elevação lateral: 3x12</li>
                </ul>
                <strong>Dicas:</strong>
                <ul>
                    <li>Priorize a execução correta, não o peso.</li>
                    <li>Desça bem no agachamento e mantenha o abdômen firme.</li>
                </ul>
            `;
        case 'Descanso':
            return `<em>Dia de descanso! Foque em recuperação, hidratação e alongamentos leves.</em>`;
        default:
            return '';
    }
}

function renderCalendarioRotina() {
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    const calendario = document.getElementById('calendario-rotina');
    const treinoDia = document.getElementById('treino-dia');
    const objetivoUsuario = document.getElementById('objetivo-usuario');
    const recomendacoesDiv = document.getElementById('recomendacoes-rotina');
    if (!usuarioLogadoString || !calendario || !treinoDia) {
        if (treinoDia) treinoDia.innerHTML = '<p>Faça login ou cadastro para ver sua rotina personalizada.</p>';
        return;
    }
    const usuario = JSON.parse(usuarioLogadoString);
    const plano = getPlanoRotina(usuario.objetivo);
    // Exibe o objetivo escolhido
    if (objetivoUsuario && usuario.objetivo) {
        objetivoUsuario.textContent = `Objetivo: ${usuario.objetivo.charAt(0).toUpperCase() + usuario.objetivo.slice(1)}`;
    }
    // Recomendações personalizadas
    if (recomendacoesDiv) {
        let recs = [];
        if (usuario.objetivo && usuario.objetivo.toLowerCase().includes('massa')) {
            recs = [
                'Faça 3-4 séries de 8-12 repetições para hipertrofia muscular.',
                'Consuma 1,6-2,2g de proteína por kg de peso corporal.',
                'Descanse 60-90 segundos entre as séries.',
                'Priorize exercícios compostos (agachamento, supino, levantamento terra).',
                'Durma 7-9 horas por noite para recuperação muscular.'
            ];
        } else if (usuario.objetivo && usuario.objetivo.toLowerCase().includes('perder')) {
            recs = [
                'Mantenha déficit calórico de 300-500 calorias por dia.',
                'Faça cardio 3-5 vezes por semana por 30-45 minutos.',
                'Inclua treinos de força 2-3 vezes por semana.',
                'Beba 2-3L de água por dia para acelerar o metabolismo.',
                'Evite alimentos processados e bebidas açucaradas.'
            ];
        } else if (usuario.objetivo && usuario.objetivo.toLowerCase().includes('saúde')) {
            recs = [
                'Pratique exercícios de baixo impacto regularmente.',
                'Inclua alongamentos e exercícios de flexibilidade.',
                'Mantenha uma alimentação equilibrada e colorida.',
                'Reserve tempo para meditação e relaxamento.',
                'Faça check-ups médicos regulares.'
            ];
        } else if (usuario.objetivo && usuario.objetivo.toLowerCase().includes('condicionamento')) {
            recs = [
                'Varie a intensidade dos treinos (alta, média, baixa).',
                'Inclua exercícios de força, cardio e flexibilidade.',
                'Aumente gradualmente a carga e intensidade.',
                'Alimente-se adequadamente antes e após os treinos.',
                'Mantenha-se hidratado durante toda a atividade física.'
            ];
        } else {
            recs = [
                'Mantenha uma rotina consistente de exercícios.',
                'Combine diferentes tipos de treino para resultados completos.',
                'Cuide da alimentação, sono e hidratação.',
                'Escute seu corpo e respeite os limites.',
                'Busque equilíbrio entre treino, trabalho e lazer.'
            ];
        }
        recomendacoesDiv.innerHTML = `<strong>Recomendações para o mês:</strong><ul>${recs.map(r => `<li>${r}</li>`).join('')}</ul>`;
    }
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const diaHoje = hoje.getDate();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    let selecionado = diaHoje;

    function renderTreinoDia(dia) {
        const treino = plano.treinos[dia - 1];
        const isDescanso = treino.toLowerCase().includes('descanso');
        let detalhes = '';
        if (usuario.objetivo && usuario.objetivo.toLowerCase().includes('massa')) {
            detalhes = getDetalhesTreinoMassa(treino);
        }
        treinoDia.innerHTML = `
            <h3>Treino do Dia ${dia}</h3>
            <p class="${isDescanso ? 'descanso' : 'treino'}">${treino}</p>
            <div class="detalhes-treino">${detalhes}</div>
        `;
    }

    function renderDias() {
        calendario.innerHTML = '';
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const div = document.createElement('div');
            div.className = 'cal-dia';
            if (dia === diaHoje) div.classList.add('hoje');
            if (dia === selecionado) div.classList.add('selecionado');
            div.textContent = dia;
            div.onclick = function() {
                selecionado = dia;
                renderDias();
                renderTreinoDia(dia);
            };
            calendario.appendChild(div);
        }
    }

    renderDias();
    renderTreinoDia(selecionado);
}

renderCalendarioRotina();

// Carrega nome e foto do usuário no aside
(function(){
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    if (!usuarioLogadoString) return;
    const usuario = JSON.parse(usuarioLogadoString);
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && usuario.nome) {
        userNameElement.textContent = `${usuario.nome} ${usuario.sobrenome || ''}`.trim();
    }
    const userAvatarElement = document.getElementById('user-avatar');
    if (userAvatarElement && usuario.foto) {
        userAvatarElement.src = usuario.foto;
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.style.cursor = 'pointer';
        profileSection.addEventListener('click', function() {
            window.location.href = '../ON Focus Cadastro/Menu.html';
        });
    }
}); 