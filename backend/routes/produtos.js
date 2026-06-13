const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar todos os produtos (com filtros opcionais)
router.get('/', (req, res) => {

const { nome, cor, codigo_barras, tamanho, valorMin, valorMax, valorExato } = req.query;
  let query = `SELECT * FROM produtos WHERE 1=1`;
  const params = [];

  if (nome) { query += ` AND nome LIKE ?`; params.push(`%${nome}%`); }
  if (cor) { query += ` AND cor LIKE ?`; params.push(`%${cor}%`); }
  if (codigo_barras) { query += ` AND codigo_barras = ?`; params.push(codigo_barras); }

  // Tamanho sempre como texto (suporta "38", "33/34", etc)
  if (tamanho) { query += ` AND tamanho LIKE ?`; params.push(`%${tamanho}%`); }

// Valor exato — usa margem de 0.005 para evitar problema de precisão float
if (valorExato) {
  const val = parseFloat(String(valorExato).replace(',', '.'));
  query += ` AND valor >= ? AND valor <= ?`;
  params.push(val - 0.005);
  params.push(val + 0.005);
}

// Faixa de valor
if (valorMin) {
  query += ` AND valor >= ?`;
  params.push(parseFloat(String(valorMin).replace(',', '.')));
}
if (valorMax) {
  query += ` AND valor <= ?`;
  params.push(parseFloat(String(valorMax).replace(',', '.')));
}
  query += ` ORDER BY nome`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    res.json(rows);
  });

});

// Buscar produto por ID
router.get('/:id', (req, res) => {
  db.get(`SELECT * FROM produtos WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(row);
  });
});

// Cadastrar produto
router.post('/cadastrar', (req, res) => {
  const { nome, cor, tamanho, valor, quantidade, codigo_barras } = req.body;

  const codigo = codigo_barras || `CC${Date.now()}`;

  db.run(
    `INSERT INTO produtos (nome, cor, tamanho, valor, quantidade, codigo_barras) VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, cor, tamanho, valor, quantidade, codigo],
    function (err) {
      if (err) return res.status(400).json({ erro: 'Erro ao cadastrar produto.' });
      res.json({ mensagem: 'Produto cadastrado com sucesso!', id: this.lastID, codigo_barras: codigo });
    }
  );
});

// Editar produto
router.put('/:id', (req, res) => {
  const { nome, cor, tamanho, valor, quantidade, codigo_barras } = req.body;

  db.run(
    `UPDATE produtos SET nome=?, cor=?, tamanho=?, valor=?, quantidade=?, codigo_barras=? WHERE id=?`,
    [nome, cor, tamanho, valor, quantidade, codigo_barras, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ erro: 'Erro ao editar produto.' });
      res.json({ mensagem: 'Produto atualizado com sucesso!' });
    }
  );
});

module.exports = router;