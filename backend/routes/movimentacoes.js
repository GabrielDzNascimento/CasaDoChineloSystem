const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/registrar', (req, res) => {
  const { produto_id, usuario_id, tipo, quantidade } = req.body;
  const data = new Date().toISOString().split('T')[0];

  try {
    const produto = db.prepare(`SELECT * FROM produtos WHERE id = ?`).get(produto_id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

    const novaQuantidade = tipo === 'entrada'
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;

    if (novaQuantidade < 0) return res.status(400).json({ erro: 'Quantidade insuficiente em estoque.' });

    db.prepare(`UPDATE produtos SET quantidade = ? WHERE id = ?`).run(novaQuantidade, produto_id);
    db.prepare(
      `INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data) VALUES (?, ?, ?, ?, ?)`
    ).run(produto_id, usuario_id, tipo, quantidade, data);

    res.json({ mensagem: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!` });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar movimentação.' });
  }
});

router.get('/relatorio/saidas', (req, res) => {
  const { data, dataInicio, dataFim } = req.query;
  try {
    let rows;
    if (dataInicio && dataFim) {
      rows = db.prepare(
        `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
         FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
         WHERE m.tipo = 'saida' AND m.data BETWEEN ? AND ?
         ORDER BY m.data DESC`
      ).all(dataInicio, dataFim);
    } else {
      const dia = data || new Date().toISOString().split('T')[0];
      rows = db.prepare(
        `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
         FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
         WHERE m.tipo = 'saida' AND m.data = ?
         ORDER BY m.data DESC`
      ).all(dia);
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao gerar relatório.' });
  }
});

router.get('/relatorio/entradas', (req, res) => {
  const { data, dataInicio, dataFim } = req.query;
  try {
    let rows;
    if (dataInicio && dataFim) {
      rows = db.prepare(
        `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
         FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
         WHERE m.tipo = 'entrada' AND m.data BETWEEN ? AND ?
         ORDER BY m.data DESC`
      ).all(dataInicio, dataFim);
    } else {
      const dia = data || new Date().toISOString().split('T')[0];
      rows = db.prepare(
        `SELECT m.id, p.nome, p.codigo_barras, m.quantidade, m.data
         FROM movimentacoes m JOIN produtos p ON m.produto_id = p.id
         WHERE m.tipo = 'entrada' AND m.data = ?
         ORDER BY m.data DESC`
      ).all(dia);
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao gerar relatório.' });
  }
});

router.get('/relatorio/estoque', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT id, nome, cor, tamanho, valor, quantidade, codigo_barras FROM produtos ORDER BY nome`
    ).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao gerar relatório.' });
  }
});

module.exports = router;