import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAnalista = usuario?.perfil === 'Analista';

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Casa do Chinelo</h2>
        <p style={styles.perfil}>👤 {usuario?.nome}</p>
        <p style={styles.perfilTipo}>{usuario?.perfil}</p>

        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate('/estoque')}>
            🔍 Consultar Estoque
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/relatorios')}>
            📊 Relatórios
          </button>

          {isAnalista && (
            <>
              <button style={styles.navBtn} onClick={() => navigate('/cadastrar-produto')}>
                ➕ Cadastrar Produto
              </button>
              <button style={styles.navBtn} onClick={() => navigate('/movimentacao')}>
                📦 Entrada / Saída
              </button>
              <button style={styles.navBtn} onClick={() => navigate('/usuarios')}>
                👥 Gerenciar Usuários
              </button>
            </>
          )}
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div style={styles.conteudo}>
        <h2 style={styles.bemVindo}>Bem-vindo, {usuario?.nome}! 👋</h2>
        <p style={styles.instrucao}>Selecione uma opção no menu ao lado para começar.</p>

        <div style={styles.cards}>
          <div style={styles.card} onClick={() => navigate('/estoque')}>
            <span style={styles.cardIcon}>🔍</span>
            <p style={styles.cardTxt}>Consultar Estoque</p>
          </div>
          <div style={styles.card} onClick={() => navigate('/relatorios')}>
            <span style={styles.cardIcon}>📊</span>
            <p style={styles.cardTxt}>Relatórios</p>
          </div>
          {isAnalista && (
            <>
              <div style={styles.card} onClick={() => navigate('/cadastrar-produto')}>
                <span style={styles.cardIcon}>➕</span>
                <p style={styles.cardTxt}>Cadastrar Produto</p>
              </div>
              <div style={styles.card} onClick={() => navigate('/movimentacao')}>
                <span style={styles.cardIcon}>📦</span>
                <p style={styles.cardTxt}>Entrada / Saída</p>
              </div>
              <div style={styles.card} onClick={() => navigate('/usuarios')}>
                <span style={styles.cardIcon}>👥</span>
                <p style={styles.cardTxt}>Gerenciar Usuários</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
  sidebar: {
    width: '220px', backgroundColor: '#8B0000', color: '#fff',
    display: 'flex', flexDirection: 'column', padding: '24px 16px'
  },
  logo: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' },
  perfil: { fontSize: '14px', textAlign: 'center', marginBottom: '2px' },
  perfilTipo: {
    fontSize: '11px', textAlign: 'center', marginBottom: '24px',
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '2px 8px'
  },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '10px 12px',
    textAlign: 'left', cursor: 'pointer', fontSize: '13px'
  },
  logoutBtn: {
    backgroundColor: 'transparent', color: '#ffaaaa',
    border: '1px solid #ffaaaa', borderRadius: '8px',
    padding: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '16px'
  },
  conteudo: { flex: 1, padding: '40px', backgroundColor: '#f5f5f5' },
  bemVindo: { color: '#8B0000', marginBottom: '8px' },
  instrucao: { color: '#666', marginBottom: '32px' },
  cards: { display: 'flex', flexWrap: 'wrap', gap: '16px' },
  card: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '24px',
    width: '140px', textAlign: 'center', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s'
  },
  cardIcon: { fontSize: '32px' },
  cardTxt: { fontSize: '13px', color: '#444', marginTop: '8px' }
};

export default Dashboard;