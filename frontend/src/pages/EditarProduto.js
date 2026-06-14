import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import Layout from '../components/Layout';

function EditarProduto() {
  const [form, setForm] = useState({ nome: '', cor: '', tamanho: '', valor: '', quantidade: '', codigo_barras: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

useEffect(() => {
  api.listarProdutos().then(produtos => {
    const produto = produtos.find(p => p.id === Number(id));
    if (produto) setForm(produto);
    else setErro('Produto não encontrado.');
  }).catch(() => setErro('Erro ao carregar produto.'));
}, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSalvar = async () => {
    setErro(''); setSucesso('');
    if (!form.nome || !form.valor || !form.quantidade) {
      setErro('Nome, valor e quantidade são obrigatórios.');
      return;
    }
    const resultado = await api.editarProduto(id, form);
    if (resultado.erro) { setErro(resultado.erro); return; }
    setSucesso('Produto atualizado com sucesso!');
    setTimeout(() => navigate('/estoque'), 1500);
  };

  return (
    <Layout title="Editar Produto" subtitle="Atualize as informações do produto selecionado">
      <div style={styles.card}>
        {erro && <div style={styles.alertErro}><span>⚠️</span> {erro}</div>}
        {sucesso && <div style={styles.alertSucesso}><span>✅</span> {sucesso}</div>}

        <div style={styles.grid}>
          <div style={styles.campo}>
            <label style={styles.label}>Nome *</label>
            <input style={styles.input} name="nome" value={form.nome} onChange={handleChange} />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Cor</label>
            <input style={styles.input} name="cor" value={form.cor} onChange={handleChange} />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Tamanho</label>
            <input style={styles.input} name="tamanho" value={form.tamanho} onChange={handleChange} />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Valor (R$) *</label>
            <input style={styles.input} name="valor" type="number" value={form.valor} onChange={handleChange} />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Quantidade *</label>
            <input style={styles.input} name="quantidade" type="number" value={form.quantidade} onChange={handleChange} />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Código de Barras</label>
            <input style={{ ...styles.input, fontFamily: 'monospace' }} name="codigo_barras" value={form.codigo_barras} onChange={handleChange} />
          </div>
        </div>

        <div style={styles.acoes}>
          <button style={styles.botao} onClick={handleSalvar}>Salvar alterações</button>
          <button style={styles.botaoSecundario} onClick={() => navigate('/estoque')}>Cancelar</button>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: '28px 32px',
    border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  },
  alertErro: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  alertSucesso: {
    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
    padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e8e8e8',
    fontSize: 13, outline: 'none', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif'
  },
  acoes: { display: 'flex', gap: 10 },
  botao: {
    padding: '11px 28px', backgroundColor: '#8B0000', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600
  },
  botaoSecundario: {
    padding: '11px 20px', backgroundColor: '#fff', color: '#666',
    border: '1.5px solid #e8e8e8', borderRadius: 8, cursor: 'pointer', fontSize: 13
  },
};

export default EditarProduto;