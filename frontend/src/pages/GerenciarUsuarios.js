import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function GerenciarUsuarios() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'Auxiliar', codigo: '' });
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoPerfil, setNovoPerfil] = useState('');
  const [codigoEdicao, setCodigoEdicao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  const carregarUsuarios = async () => {
    const resultado = await api.listarUsuarios();
    if (!resultado.erro) setUsuarios(resultado);
  };

  useEffect(() => { carregarUsuarios(); }, []);

  const handleCadastrar = async () => {
    setErro(''); setSucesso('');
    if (!form.nome || !form.email || !form.senha) {
      setErro('Nome, e-mail e senha são obrigatórios.');
      return;
    }
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
    setEditando(null);
    setCodigoEdicao('');
    carregarUsuarios();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.voltar} onClick={() => navigate('/dashboard')}>← Voltar</button>
        <h2 style={styles.titulo}>Gerenciar Usuários</h2>
      </div>

      {erro && <p style={styles.erro}>{erro}</p>}
      {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

      {/* Lista de usuários */}
      <div style={styles.card}>
        <h3 style={styles.subtitulo}>Usuários Cadastrados</h3>
        <table style={styles.tabela}>
          <thead>
            <tr>
              {['Nome', 'E-mail', 'Perfil', 'Ações'].map(col => (
                <th key={col} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>{u.nome}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: u.perfil === 'Analista' ? '#8B0000' : '#555' }}>
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
                          <input style={styles.inputInline} placeholder="Código de liberação"
                            value={codigoEdicao}
                            onChange={e => setCodigoEdicao(e.target.value)} />
                        )}
                        <button style={styles.btnSalvar} onClick={() => handleEditarPerfil(u.id)}>
                          Salvar
                        </button>
                        <button style={styles.btnCancelar} onClick={() => { setEditando(null); setCodigoEdicao(''); }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button style={styles.btnEditar} onClick={() => { setEditando(u.id); setNovoPerfil(u.perfil); }}>
                        ✏️ Alterar perfil
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

      {/* Cadastrar novo usuário */}
      <div style={styles.card}>
        <h3 style={styles.subtitulo}>Cadastrar Novo Usuário</h3>
        <div style={styles.grid}>
          <div style={styles.campo}>
            <label style={styles.label}>Nome completo *</label>
            <input style={styles.input} name="nome" value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: João Silva" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>E-mail *</label>
            <input style={styles.input} name="email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Ex: joao@email.com" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Senha *</label>
            <input style={styles.input} name="senha" type="password" value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })} placeholder="Mínimo 6 caracteres" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Perfil *</label>
            <select style={styles.input} name="perfil" value={form.perfil}
              onChange={e => setForm({ ...form, perfil: e.target.value })}>
              <option value="Auxiliar">Auxiliar</option>
              <option value="Analista">Analista</option>
            </select>
          </div>
          {form.perfil === 'Analista' && (
            <div style={styles.campo}>
              <label style={styles.label}>Código de liberação *</label>
              <input style={styles.input} name="codigo" value={form.codigo}
                onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="Código para perfil Analista" />
            </div>
          )}
        </div>
        <button style={styles.botao} onClick={handleCadastrar}>Cadastrar Usuário</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  voltar: { backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' },
  titulo: { color: '#8B0000', margin: 0 },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' },
  subtitulo: { color: '#8B0000', marginTop: 0, marginBottom: '16px' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#8B0000', color: '#fff', padding: '10px 16px', textAlign: 'left', fontSize: '13px' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '10px 16px', fontSize: '13px', color: '#333' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' },
  editRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  selectInline: { padding: '5px 8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' },
  inputInline: { padding: '5px 8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', width: '160px' },
  btnEditar: { backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px' },
  btnSalvar: { backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px' },
  btnCancelar: { backgroundColor: '#999', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px' },
  voce: { fontSize: '12px', color: '#aaa', fontStyle: 'italic' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', color: '#555', fontWeight: 'bold' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' },
  botao: { padding: '12px 32px', backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  erro: { color: 'red', fontSize: '13px', marginBottom: '12px' },
  sucesso: { color: 'green', fontSize: '13px', marginBottom: '12px' }
};

export default GerenciarUsuarios;