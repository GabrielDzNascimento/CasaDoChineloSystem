const Database = require('better-sqlite3');

const db = new Database('./chinelo.db');

db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  perfil TEXT NOT NULL CHECK(perfil IN ('Analista', 'Auxiliar'))
)`);

db.exec(`CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cor TEXT,
  tamanho TEXT,
  valor REAL NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  codigo_barras TEXT UNIQUE
)`);

db.exec(`CREATE TABLE IF NOT EXISTS movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
  quantidade INTEGER NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY (produto_id) REFERENCES produtos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
)`);

module.exports = db;