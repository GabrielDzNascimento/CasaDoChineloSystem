const express = require('express');
const cors = require('cors');
const db = require('./database');
const usuariosRoutes = require('./routes/usuarios');
const produtosRoutes = require('./routes/produtos');
const movimentacoesRoutes = require('./routes/movimentacoes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/produtos', produtosRoutes);
app.use('/movimentacoes', movimentacoesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Casa do Chinelo funcionando!' });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});