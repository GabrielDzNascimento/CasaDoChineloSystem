const express = require('express');
const router = express.Router();
const db = require('../database');

// Relatório de saídas por data ou período
router.get('/relatorio/saidas', (req, res) => {
  const { data, dataInicio, dataFim } = req.query;

  let query, params;
  if (dataInicio && dataFim) {
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'saida' AND m.data BETWEEN ? AND ?
             ORDER BY m.data DESC`;
    params = [dataInicio, dataFim];
  } else {
    const dia = data || new Date().toISOString().split('T')[0];
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'saida' AND m.data = ?
             ORDER BY m.data DESC`;
    params = [dia];
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    res.json(rows);
  });
});

// Relatório de entradas por data ou período
router.get('/relatorio/entradas', (req, res) => {
  const { data, dataInicio, dataFim } = req.query;

  let query, params;
  if (dataInicio && dataFim) {
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'entrada' AND m.data BETWEEN ? AND ?
             ORDER BY m.data DESC`;
    params = [dataInicio, dataFim];
  } else {
    const dia = data || new Date().toISOString().split('T')[0];
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'entrada' AND m.data = ?
             ORDER BY m.data DESC`;
    params = [dia];
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    res.json(rows);
  });
});

// Relatório de estoque atual
router.get('/relatorio/estoque', (req, res) => {
  db.all(`SELECT id, nome, cor, tamanho, valor, quantidade, codigo_barras FROM produtos ORDER BY nome`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    res.json(rows);
  });
});

module.exports = router;