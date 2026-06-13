const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database');

const CODIGO_ANALISTA = 'Helio';

// Cadastrar usuário
router.post('/cadastrar', (req, res) => {
  const { nome, email, senha, perfil, codigo } = req.body;

  if (perfil === 'Analista' && codigo !== CODIGO_ANALISTA) {
    return res.status(403).json({ erro: 'Código de liberação inválido.' });
  }

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha.' });

    db.run(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)`,
      [nome, email, hash, perfil],
      function (err) {
        if (err) return res.status(400).json({ erro: 'Email já cadastrado.' });
        res.json({ mensagem: 'Usuário cadastrado com sucesso!', id: this.lastID });
      }
    );
  });
});

// Listar todos os usuários
router.get('/', (req, res) => {
  db.all(`SELECT id, nome, email, perfil FROM usuarios ORDER BY nome`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao listar usuários.' });
    res.json(rows);
  });
});

// Atualizar perfil do usuário
router.put('/:id/perfil', (req, res) => {
  const { perfil, codigo } = req.body;
  const CODIGO_ANALISTA = 'helio';

  if (perfil === 'Analista' && codigo !== CODIGO_ANALISTA) {
    return res.status(403).json({ erro: 'Código de liberação inválido.' });
  }

  db.run(`UPDATE usuarios SET perfil = ? WHERE id = ?`, [perfil, req.params.id], function (err) {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
    res.json({ mensagem: 'Perfil atualizado com sucesso!' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, usuario) => {
    if (err || !usuario) return res.status(401).json({ erro: 'Usuário não encontrado.' });

    bcrypt.compare(senha, usuario.senha_hash, (err, resultado) => {
      if (!resultado) return res.status(401).json({ erro: 'Senha incorreta.' });

      res.json({
        mensagem: 'Login realizado com sucesso!',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        }
      });
    });
  });
});

module.exports = router;