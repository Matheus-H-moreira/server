const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

// Obter middlewares padrão (logger, static, cors...)
// mas desativar o body-parser padrão.
const middlewares = jsonServer.defaults({
  bodyParser: false
});

server.use(middlewares);

// Adicionar middleware body-parser com um limite maior.
// Isto deve vir antes do router.
const express = require('express');
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Adicionar middleware de validação para criação e edição de usuários
function validarUsuario(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (req.path.startsWith('/usuarios')) {
      const {
        nome, sobrenome, altura, peso, idade, genero,
        tempo_disponivel, local_preferencia, objetivo,
        experiencia_treinos, usuario, senha, email
      } = req.body;

      // Validação dos campos obrigatórios
      if (!nome || !sobrenome || !altura || !peso || !idade || !genero ||
          !tempo_disponivel || !local_preferencia || !objetivo ||
          !experiencia_treinos || !usuario || !senha || !email) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
      }
      // Validação de tipos e limites
      if (typeof nome !== 'string' || nome.length < 2) {
        return res.status(400).json({ erro: 'Nome inválido.' });
      }
      if (typeof sobrenome !== 'string' || sobrenome.length < 2) {
        return res.status(400).json({ erro: 'Sobrenome inválido.' });
      }
      if (isNaN(Number(altura)) || Number(altura) <= 0 || Number(altura) > 2.5) {
        return res.status(400).json({ erro: 'Altura inválida.' });
      }
      if (isNaN(Number(peso)) || Number(peso) <= 0 || Number(peso) > 400) {
        return res.status(400).json({ erro: 'Peso inválido.' });
      }
      if (isNaN(Number(idade)) || Number(idade) < 10 || Number(idade) > 120) {
        return res.status(400).json({ erro: 'Idade inválida.' });
      }
      if (!["Masculino", "Feminino"].includes(genero)) {
        return res.status(400).json({ erro: 'Gênero inválido.' });
      }
      // Validação simples de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ erro: 'E-mail inválido.' });
      }
      // Validação de senha (mínimo 6 caracteres)
      if (typeof senha !== 'string' || senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
      }
    }
  }
  next();
}

server.use(validarUsuario);

// Adicionar o router do JSON Server.
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server está rodando na porta 3000 com limite de dados aumentado (config corrigida).');
}); 