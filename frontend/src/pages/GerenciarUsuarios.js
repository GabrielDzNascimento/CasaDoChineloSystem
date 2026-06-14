import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Layout from '../components/Layout';

function GerenciarUsuarios() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'Auxiliar', codigo: '' });
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoPerfil, setNovoPerfil] = useState('');
  const [codigoEdicao, setCodigoEdicao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  const carregarUsuarios = async () => {
    const resultado = await api.listarUsuarios();
    if (!resultado.erro) setUsuarios(resultado);
  };

  useEffect(() => { carregarUsuarios(); }, []);

  const handleCadastrar = async () => {
    setErro(''); setSucesso('');
    if (!form.nome || !form.email || !form.senha) { setErro('Nome, e-mail e senha são obrigatórios.'); return; }
    const resultado = await api.cadastrarUsuario(form);
    if (resultado.erro) { setErro(resultado.erro); return; }
    setSucesso('Usuário cadastrado com sucesso!');
    setForm({ nome: '', email: '', senha: '', perfil: 'Auxiliar', codigo: '' });
    carregarUsuarios();
  };

  const handleEditarPerfil = async (id) => {
    setErro(''); setSucesso('');
    const resultado = await api.atualizarPerfil(id, { perfil: novoPerfil, codigo: codigoEdicao });
    if (resultado.erro) { setErro(resultado.erro); return; }
    setSucesso('Perfil atualizado com sucesso!');
    setEditando(null); setCodigoEdicao('');
    carregarUsuarios();
  };

  return (
    <Layout title="Usuários" subtitle="Gerencie os perfis de acesso ao sistema">
      {erro && <div style={styles.alertErro}><span>⚠️</span> {erro}</div>}
      {sucesso && <div style={styles.alertSucesso}><span>✅</span> {sucesso}</div>}

      {/* Lista */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Usuários cadastrados</span>
          <span style={styles.cardCount}>{usuarios.length} usuário(s)</span>
        </div>
        <table style={styles.tabela}>
          <thead>
            <tr>
              {['Usuário', 'E-mail', 'Perfil', 'Ações'].map(col => (
                <th key={col} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={u.id} style={{ ...styles.tr, backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.miniAvatar}>{u.nome.charAt(0).toUpperCase()}</div>
                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{u.nome}</span>
                  </div>
                </td>
                <td style={{ ...styles.td, color: '#666' }}>{u.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.perfilBadge,
                    backgroundColor: u.perfil === 'Analista' ? '#fef2f2' : '#f0f4ff',
                    color: u.perfil === 'Analista' ? '#8B0000' : '#3b4fd8',
                    borderColor: u.perfil === 'Analista' ? '#fecaca' : '#c7d2fe',
                  }}>
                    {u.perfil}
                  </span>
                </td>
                <td style={styles.td}>
                  {u.id !== usuarioLogado.id ? (
                    editando === u.id ? (
                      <div style={styles.editRow}>
                        <select style={styles.selectInline} value={novoPerfil}
                          onChange={e => setNovoPerfil(e.target.value)}>
                          <option value="Auxiliar">Auxiliar</option>
                          <option value="Analista">Analista</option>
                        </select>
                        {novoPerfil === 'Analista' && (
                          <input style={styles.inputInline} placeholder="Código"
                            value={codigoEdicao} onChange={e => setCodigoEdicao(e.target.value)} />
                        )}
                        <button style={styles.btnSalvar} onClick={() => handleEditarPerfil(u.id)}>Salvar</button>
                        <button style={styles.btnCancelar} onClick={() => { setEditando(null); setCodigoEdicao(''); }}>✕</button>
                      </div>
                    ) : (
                      <button style={styles.btnEditar}
                        onClick={() => { setEditando(u.id); setNovoPerfil(u.perfil); }}>
                        Alterar perfil
                      </button>
                    )
                  ) : (
                    <span style={styles.voce}>Você</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cadastro */}
      <div style={{ ...styles.card, marginTop: 24 }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Cadastrar novo usuário</span>
        </div>
        <div style={styles.grid}>
          <div style={styles.campo}>
            <label style={styles.label}>Nome completo *</label>
            <input style={styles.input} value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: João Silva" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>E-mail *</label>
            <input style={styles.input} type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Ex: joao@email.com" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Senha *</label>
            <input style={styles.input} type="password" value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })} placeholder="Mínimo 6 caracteres" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Perfil *</label>
            <select style={styles.input} value={form.perfil}
              onChange={e => setForm({ ...form, perfil: e.target.value })}>
              <option value="Auxiliar">Auxiliar</option>
              <option value="Analista">Analista</option>
            </select>
          </div>
          {form.perfil === 'Analista' && (
            <div style={styles.campo}>
              <label style={styles.label}>Código de liberação *</label>
              <input style={styles.input} value={form.codigo}
                onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="Código para perfil Analista" />
            </div>
          )}
        </div>
        <button style={styles.botao} onClick={handleCadastrar}>Cadastrar usuário</button>
      </div>
    </Layout>
  );
}

const styles = {
  alertErro: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  alertSucesso: {
    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
    padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  card: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #f0f0f0'
  },
  cardTitle: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  cardCount: { fontSize: 12, color: '#999' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '11px 16px', textAlign: 'left', fontSize: 11,
    fontWeight: 600, color: '#888', textTransform: 'uppercase',
    letterSpacing: 0.5, borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa'
  },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: 13, color: '#444' },
  userCell: { display: 'flex', alignItems: 'center', gap: 10 },
  miniAvatar: {
    width: 30, height: 30, borderRadius: '50%',
    backgroundColor: '#8B0000', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0
  },
  perfilBadge: {
    fontSize: 11, fontWeight: 600, padding: '3px 10px',
    borderRadius: 20, border: '1px solid', display: 'inline-block'
  },
  editRow: { display: 'flex', alignItems: 'center', gap: 6 },
  selectInline: { padding: '5px 8px', borderRadius: 6, border: '1.5px solid #e8e8e8', fontSize: 12 },
  inputInline: { padding: '5px 8px', borderRadius: 6, border: '1.5px solid #e8e8e8', fontSize: 12, width: 120 },
  btnEditar: {
    padding: '5px 14px', backgroundColor: '#fff', border: '1.5px solid #8B0000',
    color: '#8B0000', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600
  },
  btnSalvar: { padding: '5px 12px', backgroundColor: '#15803d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  btnCancelar: { padding: '5px 10px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  voce: { fontSize: 12, color: '#aaa', fontStyle: 'italic' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: '20px 20px 0' },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e8e8e8',
    fontSize: 13, outline: 'none', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif'
  },
  botao: {
    margin: '20px', padding: '11px 28px', backgroundColor: '#8B0000', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600
  },
};

export default GerenciarUsuarios;