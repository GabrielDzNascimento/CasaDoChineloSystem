import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErro('');
    const resultado = await api.login(email, senha);

    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Casa do Chinelo</h2>
        <p style={styles.subtitulo}>Sistema de Controle de Estoque</p>

        {erro && <p style={styles.erro}>{erro}</p>}

        <input
          style={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <button style={styles.botao} onClick={handleLogin}>
          Entrar
        </button>

        <p
          style={styles.link}
          onClick={() => navigate('/cadastro')}
        >
          Criar conta
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh',
    backgroundColor: '#f0f0f0'
  },
  card: {
    backgroundColor: '#fff', padding: '40px',
    borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', width: '340px'
  },
  titulo: { color: '#8B0000', margin: 0, fontSize: '26px' },
  subtitulo: { color: '#666', marginBottom: '24px', fontSize: '13px' },
  input: {
    width: '100%', padding: '10px 14px',
    marginBottom: '12px', borderRadius: '8px',
    border: '1px solid #ccc', fontSize: '14px',
    boxSizing: 'border-box'
  },
  botao: {
    width: '100%', padding: '12px',
    backgroundColor: '#8B0000', color: '#fff',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer', marginTop: '4px'
  },
  erro: { color: 'red', fontSize: '13px', marginBottom: '8px' },
  link: {
    marginTop: '16px', color: '#8B0000',
    cursor: 'pointer', fontSize: '13px'
  }
};

export default Login;