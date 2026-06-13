const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/registrar', (req, res) => {
  const { produto_id, usuario_id, tipo, quantidade } = req.body;
  const data = new Date().toISOString().split('T')[0];

  db.get(`SELECT * FROM produtos WHERE id = ?`, [produto_id], (err, produto) => {
    if (err || !produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

    const novaQuantidade = tipo === 'entrada'
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;

    if (novaQuantidade < 0) return res.status(400).json({ erro: 'Quantidade insuficiente em estoque.' });

    db.run(`UPDATE produtos SET quantidade = ? WHERE id = ?`, [novaQuantidade, produto_id], (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar estoque.' });
      db.run(
        `INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data) VALUES (?, ?, ?, ?, ?)`,
        [produto_id, usuario_id, tipo, quantidade, data],
        function (err) {
          if (err) return res.status(500).json({ erro: 'Erro ao registrar movimentação.' });
          res.json({ mensagem: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!` });
        }
      );
    });
  });
});

router.get('/relatorio/saidas', (req, res) => {
  const { data, dataInicio, dataFim } = req.query;
  let query, params;
  if (dataInicio && dataFim) {
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'saida' AND m.data BETWEEN ? AND ? ORDER BY m.data DESC`;
    params = [dataInicio, dataFim];
  } else {
    const dia = data || new Date().toISOString().split('T')[0];
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'saida' AND m.data = ? ORDER BY m.data DESC`;
    params = [dia];
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    res.json(rows);
  });
});

router.get('/relatorio/entradas', (req, res) => {
  const { data, dataInicio, dataFim } = req.query;
  let query, params;
  if (dataInicio && dataFim) {
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'entrada' AND m.data BETWEEN ? AND ? ORDER BY m.data DESC`;
    params = [dataInicio, dataFim];
  } else {
    const dia = data || new Date().toISOString().split('T')[0];
    query = `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
             FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
             WHERE m.tipo = 'entrada' AND m.data = ? ORDER BY m.data DESC`;
    params = [dia];
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    res.json(rows);
  });
});

router.get('/relatorio/estoque', (req, res) => {
  db.all(`SELECT id, nome, cor, tamanho, valor, quantidade, codigo_barras FROM produtos ORDER BY nome`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    res.json(rows);
  });
});

module.exports = router;