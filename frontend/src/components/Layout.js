import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/estoque', icon: '🔍', label: 'Estoque', desc: 'Consultar produtos' },
  { path: '/relatorios', icon: '📊', label: 'Relatórios', desc: 'Movimentações' },
];

const ANALISTA_ITEMS = [
  { path: '/cadastrar-produto', icon: '＋', label: 'Novo produto', desc: 'Cadastrar item' },
  { path: '/movimentacao', icon: '↕', label: 'Entrada / Saída', desc: 'Movimentar estoque' },
  { path: '/usuarios', icon: '👥', label: 'Usuários', desc: 'Gerenciar equipe' },
];

export default function Layout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAnalista = usuario?.perfil === 'Analista';

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const NavItem = ({ item }) => {
    const active = location.pathname === item.path;
    return (
      <button
        onClick={() => navigate(item.path)}
        style={{
          ...styles.navItem,
          backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
          borderLeft: active ? '3px solid #fff' : '3px solid transparent',
        }}
      >
        <span style={styles.navIcon}>{item.icon}</span>
        <div style={styles.navText}>
          <span style={styles.navLabel}>{item.label}</span>
          <span style={styles.navDesc}>{item.desc}</span>
        </div>
        {active && <span style={styles.navDot} />}
      </button>
    );
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader} onClick={() => navigate('/dashboard')}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <div style={styles.logoMark}>CC</div>
          <div>
            <div style={styles.logoName}>Casa do Chinelo</div>
            <div style={styles.logoSub}>Sistema de Estoque</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.userCard}>
          <div style={styles.avatar}>{usuario?.nome?.charAt(0).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{usuario?.nome?.split(' ')[0]}</div>
            <div style={styles.userBadge}>{usuario?.perfil}</div>
          </div>
        </div>

        <div style={styles.divider} />

        <nav style={styles.nav}>
          <div style={styles.navSection}>GERAL</div>
          {NAV_ITEMS.map(item => <NavItem key={item.path} item={item} />)}
          {isAnalista && (
            <>
              <div style={{ ...styles.navSection, marginTop: 20 }}>GESTÃO</div>
              {ANALISTA_ITEMS.map(item => <NavItem key={item.path} item={item} />)}
            </>
          )}
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <span>↩</span> Sair do sistema
        </button>
      </div>

      {/* Conteúdo */}
      <main style={styles.main}>
        {(title || subtitle) && (
          <div style={styles.pageHeader}>
            {title && <h1 style={styles.pageTitle}>{title}</h1>}
            {subtitle && <p style={styles.pageSubtitle}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', height: '100vh', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', backgroundColor: '#f7f7f5' },
  sidebar: {
    width: 240, minWidth: 240,
    background: 'linear-gradient(160deg, #8B0000 0%, #6b0000 60%, #4a0000 100%)',
    display: 'flex', flexDirection: 'column', padding: '0 0 16px',
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
  },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '24px 20px 20px', cursor: 'pointer', transition: 'opacity 0.2s' },
  logoMark: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: 1,
    border: '1.5px solid rgba(255,255,255,0.3)'
  },
  logoName: { fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: 0.3 },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 20px' },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.3)'
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 13, fontWeight: 600, color: '#fff' },
  userBadge: {
    fontSize: 10, color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '1px 7px', borderRadius: 10, display: 'inline-block', marginTop: 2
  },
  nav: { flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' },
  navSection: { fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', padding: '8px 8px 4px', fontWeight: 600 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 10px', borderRadius: 8, border: 'none',
    cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
    transition: 'all 0.15s', textAlign: 'left', width: '100%'
  },
  navIcon: { fontSize: 15, width: 20, textAlign: 'center' },
  navText: { flex: 1, display: 'flex', flexDirection: 'column' },
  navLabel: { fontSize: 13, fontWeight: 500, color: '#fff' },
  navDesc: { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 },
  navDot: { width: 5, height: 5, borderRadius: '50%', backgroundColor: '#fff' },
  logoutBtn: {
    margin: '8px 12px 0', padding: '10px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
    fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
  },
  main: { flex: 1, overflow: 'auto', padding: '36px 40px' },
  pageHeader: { marginBottom: 28 },
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#888', margin: '4px 0 0' },
};