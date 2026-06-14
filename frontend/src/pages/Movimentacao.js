import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Layout from '../components/Layout';

function Movimentacao() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ produto_id: '', tipo: 'entrada', quantidade: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => { api.listarProdutos().then(setProdutos); }, []);

  const handleRegistrar = async () => {
    setErro(''); setSucesso('');
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
    if (resultado.erro) { setErro(resultado.erro); return; }
    setSucesso(resultado.mensagem);
    setForm({ produto_id: '', tipo: 'entrada', quantidade: '' });
    api.listarProdutos().then(setProdutos);
  };

  const produtoSelecionado = produtos.find(p => p.id === Number(form.produto_id));
  const isEntrada = form.tipo === 'entrada';

  return (
    <Layout title="Entrada / Saída" subtitle="Registre a movimentação de mercadoria no estoque">
      <div style={styles.wrapper}>
        <div style={styles.card}>
          {erro && <div style={styles.alertErro}><span>⚠️</span> {erro}</div>}
          {sucesso && <div style={styles.alertSucesso}><span>✅</span> {sucesso}</div>}

          {/* Tipo */}
          <div style={styles.campo}>
            <label style={styles.label}>Tipo de movimentação</label>
            <div style={styles.tipoRow}>
              {['entrada', 'saida'].map(t => (
                <button key={t}
                  style={{
                    ...styles.tipoBtn,
                    ...(form.tipo === t ? (t === 'entrada' ? styles.tipoBtnEntrada : styles.tipoBtnSaida) : {})
                  }}
                  onClick={() => setForm({ ...form, tipo: t })}>
                  {t === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                </button>
              ))}
            </div>
          </div>

          {/* Produto */}
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

          {/* Quantidade */}
          <div style={styles.campo}>
            <label style={styles.label}>Quantidade *</label>
            <input style={styles.input} type="number" min="1"
              value={form.quantidade}
              onChange={e => setForm({ ...form, quantidade: e.target.value })}
              placeholder="Ex: 5" />
          </div>

          <button
            style={{ ...styles.botao, backgroundColor: isEntrada ? '#15803d' : '#8B0000' }}
            onClick={handleRegistrar}>
            {isEntrada ? '↑ Registrar Entrada' : '↓ Registrar Saída'}
          </button>
        </div>

        {/* Info do produto selecionado */}
        {produtoSelecionado && (
          <div style={styles.infoCard}>
            <div style={styles.infoTitle}>Produto selecionado</div>
            <div style={styles.infoNome}>{produtoSelecionado.nome}</div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLbl}>Cor</span>
                <span style={styles.infoVal}>{produtoSelecionado.cor || '—'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLbl}>Tamanho</span>
                <span style={styles.infoVal}>{produtoSelecionado.tamanho || '—'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLbl}>Valor</span>
                <span style={{ ...styles.infoVal, color: '#8B0000', fontWeight: 700 }}>
                  R$ {Number(produtoSelecionado.valor).toFixed(2)}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLbl}>Estoque atual</span>
                <span style={{
                  ...styles.infoVal, fontWeight: 700,
                  color: produtoSelecionado.quantidade === 0 ? '#dc2626' : produtoSelecionado.quantidade <= 3 ? '#d97706' : '#16a34a'
                }}>
                  {produtoSelecionado.quantidade} unid.
                </span>
              </div>
            </div>
            <div style={styles.codigoBox}>
              <span style={styles.infoLbl}>Código de barras</span>
              <span style={styles.codigo}>{produtoSelecionado.codigo_barras}</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  wrapper: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: '28px 32px',
    border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 20
  },
  alertErro: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '12px 16px', borderRadius: 8, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  alertSucesso: {
    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
    padding: '12px 16px', borderRadius: 8, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  campo: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e8e8e8',
    fontSize: 13, outline: 'none', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif'
  },
  tipoRow: { display: 'flex', gap: 10 },
  tipoBtn: {
    flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid #e8e8e8',
    backgroundColor: '#fff', color: '#888', cursor: 'pointer', fontSize: 14,
    fontWeight: 600, transition: 'all 0.15s'
  },
  tipoBtnEntrada: { backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#15803d' },
  tipoBtnSaida: { backgroundColor: '#fef2f2', borderColor: '#fca5a5', color: '#dc2626' },
  botao: {
    padding: '12px', color: '#fff', border: 'none',
    borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600
  },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: '24px 28px',
    border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  },
  infoTitle: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  infoNome: { fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  infoLbl: { fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoVal: { fontSize: 15, color: '#1a1a1a' },
  codigoBox: { display: 'flex', flexDirection: 'column', gap: 4, padding: '12px', backgroundColor: '#f7f7f5', borderRadius: 8 },
  codigo: { fontSize: 13, fontFamily: 'monospace', color: '#444', letterSpacing: 1 },
};

export default Movimentacao;