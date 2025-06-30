# ON Focus

ON Focus é uma plataforma web completa para acompanhamento de treinos, dietas, metas e evolução fitness, com foco em usabilidade, visual moderno e experiência personalizada.

## ✨ Funcionalidades Principais
- Cadastro e login de usuários
- Dashboard com perfil, metas, rotina e histórico
- Sistema de treinos com filtros, favoritos e IMC
- Sistema de dietas e receitas saudáveis
- Blog com notícias e dicas fitness
- Notificações toast animadas
- Modal de confirmação para logout
- Responsividade total (desktop, tablet, mobile)
- Validação de dados no backend
- Favicon personalizado

## 🛠️ Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Design:** Flexbox, Grid, CSS Custom Properties, SVG, Font Awesome
- **Backend:** Node.js, Express, JSON Server (mock API)
- **Persistência:** localStorage (usuário, favoritos, etc.)
- **Outros:** Toast notifications, animações CSS, modais customizados

## 📁 Estrutura de Pastas
```
ON Focus Projeto Final/
├── db.json                # Banco de dados mock (JSON Server)
├── server.js              # Servidor Express customizado
├── ON Focus/
│   ├── ON Focus HomePage/ # Página inicial, rotina, dashboard
│   ├── ON Focus Treinos/  # Módulo de treinos
│   ├── ON Focus Dietas/   # Módulo de dietas e receitas
│   ├── ON Focus Blog/     # Blog de notícias
│   ├── ON Focus Cadastro/ # Cadastro, perfil, menu
│   ├── ON Focus Login/    # Login e landing page
│   └── ...
├── package.json           # Dependências do projeto
├── README.md              # Este arquivo
└── ...
```

## 🚀 Como rodar o projeto

### 1. Instale as dependências
```bash
npm install
```

### 2. Inicie o backend (JSON Server + Express)
```bash
node server.js
```
O backend ficará disponível em [http://localhost:3000](http://localhost:3000)

### 3. Inicie o frontend
Você pode abrir os arquivos HTML diretamente no navegador, ou usar uma extensão como Live Server no VSCode, ou rodar um servidor local:

```bash
npx live-server ON\ Focus/ON\ Focus\ HomePage/
```
Ou acesse pelo caminho do seu ambiente, por exemplo:
```
http://127.0.0.1:8080/ON%20Focus/ON%20Focus%20Login/landing.html
```

## 📢 Observações
- O backend é um mock (JSON Server), ideal para testes e prototipação.
- O frontend é 100% estático, sem frameworks, focado em performance e responsividade.
- Para produção, recomenda-se migrar o backend para uma API real e adicionar autenticação JWT.

---

Desenvolvido com 💪 por Cauã Moreira e colaboradores. 