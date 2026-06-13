import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Movimentacao() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ produto_id: '', tipo: 'entrada', quantidade: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    api.listarProdutos().then(setProdutos);
  }, []);

  const handleRegistrar = async () => {
    setErro('');
    setSucesso('');

    if (!form.produto_id || !form.quantidade) {
      setErro('Selecione um produto e informe a quantidade.');
      return;
    }

    const resultado = await api.registrarMovimentacao({
      produto_id: Number(form.produto_id),
      usuario_id: usuario.id,
      tipo: form.tipo,
      quantidade: Number(form.quantidade)
    });

    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }

    setSucesso(resultado.mensagem);
    setForm({ produto_id: '', tipo: 'entrada', quantidade: '' });
    api.listarProdutos().then(setProdutos);
  };

  const produtoSelecionado = produtos.find(p => p.id === Number(form.produto_id));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.voltar} onClick={() => navigate('/dashboard')}>← Voltar</button>
        <h2 style={styles.titulo}>Registrar Entrada / Saída</h2>
      </div>

      <div style={styles.card}>
        {erro && <p style={styles.erro}>{erro}</p>}
        {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

        <div style={styles.grid}>
          <div style={styles.campo}>
            <label style={styles.label}>Produto *</label>
            <select style={styles.input} value={form.produto_id}
              onChange={e => setForm({ ...form, produto_id: e.target.value })}>
              <option value="">Selecione um produto</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.cor} — Tam. {p.tamanho} (Estoque: {p.quantidade})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Tipo *</label>
            <select style={styles.input} value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Quantidade *</label>
            <input style={styles.input} type="number" min="1"
              value={form.quantidade}
              onChange={e => setForm({ ...form, quantidade: e.target.value })}
              placeholder="Ex: 5" />
          </div>

          {produtoSelecionado && (
            <div style={styles.infoBox}>
              <p style={styles.infoTxt}>📦 Estoque atual: <strong>{produtoSelecionado.quantidade}</strong></p>
              <p style={styles.infoTxt}>💰 Valor: <strong>R$ {Number(produtoSelecionado.valor).toFixed(2)}</strong></p>
              <p style={styles.infoTxt}>🔖 Código: <strong>{produtoSelecionado.codigo_barras}</strong></p>
            </div>
          )}
        </div>

        <button style={styles.botao} onClick={handleRegistrar}>
          Registrar {form.tipo === 'entrada' ? 'Entrada' : 'Saída'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  voltar: { backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' },
  titulo: { color: '#8B0000', margin: 0 },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', color: '#555', fontWeight: 'bold' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' },
  infoBox: { backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px 16px', border: '1px solid #eee' },
  infoTxt: { margin: '4px 0', fontSize: '13px', color: '#444' },
  botao: { padding: '12px 32px', backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  erro: { color: 'red', fontSize: '13px', marginBottom: '12px' },
  sucesso: { color: 'green', fontSize: '13px', marginBottom: '12px' }
};

export default Movimentacao;