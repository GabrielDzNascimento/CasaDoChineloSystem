import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('Auxiliar');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async () => {
    setErro('');
    setSucesso('');

    const resultado = await api.cadastrarUsuario({ nome, email, senha, perfil, codigo });

    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }

    setSucesso('Usuário cadastrado com sucesso!');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Criar Conta</h2>
        <p style={styles.subtitulo}>Casa do Chinelo</p>

        {erro && <p style={styles.erro}>{erro}</p>}
        {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

        <input style={styles.input} placeholder="Nome completo"
          value={nome} onChange={e => setNome(e.target.value)} />
        <input style={styles.input} type="email" placeholder="E-mail"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Senha"
          value={senha} onChange={e => setSenha(e.target.value)} />

        <select style={styles.input} value={perfil} onChange={e => setPerfil(e.target.value)}>
          <option value="Auxiliar">Auxiliar</option>
          <option value="Analista">Analista</option>
        </select>

        {perfil === 'Analista' && (
          <input style={styles.input} placeholder="Código de liberação"
            value={codigo} onChange={e => setCodigo(e.target.value)} />
        )}

        <button style={styles.botao} onClick={handleCadastro}>Cadastrar</button>
        <p style={styles.link} onClick={() => navigate('/login')}>Voltar ao login</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0'
  },
  card: {
    backgroundColor: '#fff', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex',
    flexDirection: 'column', alignItems: 'center', width: '340px'
  },
  titulo: { color: '#8B0000', margin: 0, fontSize: '24px' },
  subtitulo: { color: '#666', marginBottom: '24px', fontSize: '13px' },
  input: {
    width: '100%', padding: '10px 14px', marginBottom: '12px',
    borderRadius: '8px', border: '1px solid #ccc',
    fontSize: '14px', boxSizing: 'border-box'
  },
  botao: {
    width: '100%', padding: '12px', backgroundColor: '#8B0000',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer', marginTop: '4px'
  },
  erro: { color: 'red', fontSize: '13px', marginBottom: '8px' },
  sucesso: { color: 'green', fontSize: '13px', marginBottom: '8px' },
  link: { marginTop: '16px', color: '#8B0000', cursor: 'pointer', fontSize: '13px' }
};

export default Cadastro;