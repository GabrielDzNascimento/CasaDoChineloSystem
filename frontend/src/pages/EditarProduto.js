import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

function EditarProduto() {
  const [form, setForm] = useState({ nome: '', cor: '', tamanho: '', valor: '', quantidade: '', codigo_barras: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/produtos/${id}`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(() => setErro('Erro ao carregar produto.'));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSalvar = async () => {
    setErro('');
    setSucesso('');

    if (!form.nome || !form.valor || !form.quantidade) {
      setErro('Nome, valor e quantidade são obrigatórios.');
      return;
    }

    const resultado = await api.editarProduto(id, form);

    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }

    setSucesso('Produto atualizado com sucesso!');
    setTimeout(() => navigate('/estoque'), 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.voltar} onClick={() => navigate('/estoque')}>← Voltar</button>
        <h2 style={styles.titulo}>Editar Produto</h2>
      </div>

      <div style={styles.card}>
        {erro && <p style={styles.erro}>{erro}</p>}
        {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

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
            <input style={styles.input} name="codigo_barras" value={form.codigo_barras} onChange={handleChange} />
          </div>
        </div>

        <button style={styles.botao} onClick={handleSalvar}>Salvar Alterações</button>
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
  botao: { padding: '12px 32px', backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  erro: { color: 'red', fontSize: '13px', marginBottom: '12px' },
  sucesso: { color: 'green', fontSize: '13px', marginBottom: '12px' }
};

export default EditarProduto;