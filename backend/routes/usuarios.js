const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database');

const CODIGO_ANALISTA = 'helio';

router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`SELECT id, nome, email, perfil FROM usuarios ORDER BY nome`).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
});

router.post('/cadastrar', async (req, res) => {
  const { nome, email, senha, perfil, codigo } = req.body;
  if (perfil === 'Analista' && codigo !== CODIGO_ANALISTA)
    return res.status(403).json({ erro: 'Código de liberação inválido.' });
  try {
    const hash = await bcrypt.hash(senha, 10);
    const stmt = db.prepare(`INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)`);
    const result = stmt.run(nome, email, hash, perfil);
    res.json({ mensagem: 'Usuário cadastrado com sucesso!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ erro: 'Email já cadastrado.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = db.prepare(`SELECT * FROM usuarios WHERE email = ?`).get(email);
    if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado.' });
    const resultado = await bcrypt.compare(senha, usuario.senha_hash);
    if (!resultado) return res.status(401).json({ erro: 'Senha incorreta.' });
    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao realizar login.' });
  }
});

router.put('/:id/perfil', async (req, res) => {
  const { perfil, codigo } = req.body;
  if (perfil === 'Analista' && codigo !== CODIGO_ANALISTA)
    return res.status(403).json({ erro: 'Código de liberação inválido.' });
  try {
    db.prepare(`UPDATE usuarios SET perfil = ? WHERE id = ?`).run(perfil, req.params.id);
    res.json({ mensagem: 'Perfil atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
  }
});

module.exports = router;