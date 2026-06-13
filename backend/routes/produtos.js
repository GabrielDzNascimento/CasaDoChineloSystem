const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { nome, cor, codigo_barras, tamanho, valorMin, valorMax, valorExato } = req.query;
  let query = `SELECT * FROM produtos WHERE 1=1`;
  const params = [];

  if (nome) { query += ` AND nome LIKE ?`; params.push(`%${nome}%`); }
  if (cor) { query += ` AND cor LIKE ?`; params.push(`%${cor}%`); }
  if (codigo_barras) { query += ` AND codigo_barras = ?`; params.push(codigo_barras); }
  if (tamanho) { query += ` AND tamanho LIKE ?`; params.push(`%${tamanho}%`); }
  if (valorExato) {
    const val = parseFloat(String(valorExato).replace(',', '.'));
    query += ` AND valor >= ? AND valor <= ?`;
    params.push(val - 0.005); params.push(val + 0.005);
  }
  if (valorMin) { query += ` AND valor >= ?`; params.push(parseFloat(String(valorMin).replace(',', '.'))); }
  if (valorMax) { query += ` AND valor <= ?`; params.push(parseFloat(String(valorMax).replace(',', '.'))); }

  query += ` ORDER BY nome`;

  try {
    const rows = db.prepare(query).all(params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produtos.' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM produtos WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto.' });
  }
});

router.post('/cadastrar', (req, res) => {
  const { nome, cor, tamanho, valor, quantidade, codigo_barras } = req.body;
  const codigo = codigo_barras || `CC${Date.now()}`;
  try {
    const result = db.prepare(
      `INSERT INTO produtos (nome, cor, tamanho, valor, quantidade, codigo_barras) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(nome, cor, tamanho, valor, quantidade, codigo);
    res.json({ mensagem: 'Produto cadastrado com sucesso!', id: result.lastInsertRowid, codigo_barras: codigo });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar produto.' });
  }
});

router.put('/:id', (req, res) => {
  const { nome, cor, tamanho, valor, quantidade, codigo_barras } = req.body;
  try {
    db.prepare(
      `UPDATE produtos SET nome=?, cor=?, tamanho=?, valor=?, quantidade=?, codigo_barras=? WHERE id=?`
    ).run(nome, cor, tamanho, valor, quantidade, codigo_barras, req.params.id);
    res.json({ mensagem: 'Produto atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao editar produto.' });
  }
});

module.exports = router;