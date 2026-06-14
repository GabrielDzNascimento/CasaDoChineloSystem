import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
 
const NAV_ITEMS = [
  { path: '/estoque', icon: '🔍', label: 'Estoque', desc: 'Consultar produtos' },
  { path: '/relatorios', icon: '📊', label: 'Relatórios', desc: 'Movimentações' },
];
 
const ANALISTA_ITEMS = [
  { path: '/cadastrar-produto', icon: '＋', label: 'Novo produto', desc: 'Cadastrar item' },
  { path: '/movimentacao', icon: '↕', label: 'Entrada / Saída', desc: 'Movimentar estoque' },
  { path: '/usuarios', icon: '👥', label: 'Usuários', desc: 'Gerenciar equipe' },
];
 
function Sidebar({ usuario, stats }) {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.sidebarHeader}>
        <div style={styles.logoMark}>CC</div>
        <div>
          <div style={styles.logoName}>Casa do Chinelo</div>
          <div style={styles.logoSub}>Sistema de Estoque</div>
        </div>
      </div>
 
      {/* Divider */}
      <div style={styles.divider} />
 
      {/* User info */}
      <div style={styles.userCard}>
        <div style={styles.avatar}>
          {usuario?.nome?.charAt(0).toUpperCase()}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{usuario?.nome?.split(' ')[0]}</div>
          <div style={styles.userBadge}>{usuario?.perfil}</div>
        </div>
      </div>
 
      <div style={styles.divider} />
 
      {/* Stats rápidos */}
      {stats && (
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{stats.produtos}</span>
            <span style={styles.statLbl}>Produtos</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statBox}>
            <span style={styles.statNum}>{stats.usuarios}</span>
            <span style={styles.statLbl}>Usuários</span>
          </div>
        </div>
      )}
 
      <div style={styles.divider} />
 
      {/* Nav */}
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
 
      {/* Logout */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        <span>↩</span> Sair do sistema
      </button>
    </div>
  );
}
 
export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAnalista = usuario?.perfil === 'Analista';
  const [stats, setStats] = useState(null);
 
  useEffect(() => {
    Promise.all([
      api.listarProdutos(),
      api.listarUsuarios(),
    ]).then(([produtos, usuarios]) => {
      setStats({
        produtos: Array.isArray(produtos) ? produtos.length : 0,
        usuarios: Array.isArray(usuarios) ? usuarios.length : 0,
        semEstoque: Array.isArray(produtos) ? produtos.filter(p => p.quantidade === 0).length : 0,
      });
    }).catch(() => {});
  }, []);
 
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
 
  const CARDS = [
    { path: '/estoque', icon: '🔍', label: 'Consultar Estoque', color: '#c0392b', desc: 'Busque por nome, cor, tamanho ou código' },
    { path: '/relatorios', icon: '📊', label: 'Relatórios', color: '#922b21', desc: 'Entradas, saídas e estoque atual' },
    ...(isAnalista ? [
      { path: '/cadastrar-produto', icon: '📦', label: 'Novo Produto', color: '#7b241c', desc: 'Cadastre com código de barras' },
      { path: '/movimentacao', icon: '↕️', label: 'Entrada / Saída', color: '#641e16', desc: 'Registre movimentações de estoque' },
      { path: '/usuarios', icon: '👥', label: 'Usuários', color: '#512e5f', desc: 'Gerencie perfis da equipe' },
    ] : [])
  ];
 
  return (
    <div style={styles.layout}>
      <Sidebar usuario={usuario} stats={stats} />
 
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.mainHeader}>
          <div>
            <h1 style={styles.greeting}>{saudacao}, {usuario?.nome?.split(' ')[0]}.</h1>
            <p style={styles.greetingSub}>O que você vai gerenciar hoje?</p>
          </div>
          <div style={styles.dateChip}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
 
        {/* Stats bar */}
        {stats && (
          <div style={styles.statsBar}>
            <div style={styles.statCard}>
              <div style={styles.statCardNum}>{stats.produtos}</div>
              <div style={styles.statCardLbl}>produtos cadastrados</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statCardNum, color: stats.semEstoque > 0 ? '#c0392b' : '#27ae60' }}>
                {stats.semEstoque}
              </div>
              <div style={styles.statCardLbl}>sem estoque</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statCardNum}>{stats.usuarios}</div>
              <div style={styles.statCardLbl}>usuários ativos</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statCardNum, color: '#27ae60' }}>●</div>
              <div style={styles.statCardLbl}>sistema online</div>
            </div>
          </div>
        )}
 
        {/* Cards */}
        <div style={styles.cardGrid}>
          {CARDS.map(card => (
            <button
              key={card.path}
              style={styles.card}
              onClick={() => navigate(card.path)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                e.currentTarget.querySelector('.card-bar').style.width = '100%';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                e.currentTarget.querySelector('.card-bar').style.width = '40px';
              }}
            >
              <div className="card-bar" style={{ ...styles.cardBar, backgroundColor: card.color }} />
              <div style={styles.cardIcon}>{card.icon}</div>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={styles.cardDesc}>{card.desc}</div>
              <div style={{ ...styles.cardArrow, color: card.color }}>→</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
 
const styles = {
  layout: { display: 'flex', height: '100vh', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', backgroundColor: '#f7f7f5' },
 
  // Sidebar
  sidebar: {
    width: 240, minWidth: 240, backgroundColor: '#7d1111',
    background: 'linear-gradient(160deg, #8B0000 0%, #6b0000 60%, #4a0000 100%)',
    display: 'flex', flexDirection: 'column', padding: '0 0 16px',
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
  },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '24px 20px 20px' },
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
  statsRow: { display: 'flex', padding: '12px 20px', gap: 8 },
  statBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: 700, color: '#fff' },
  statLbl: { fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
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
    transition: 'all 0.15s'
  },
 
  // Main
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '36px 40px' },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  greeting: { fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: 0, letterSpacing: -0.5 },
  greetingSub: { fontSize: 14, color: '#888', margin: '4px 0 0' },
  dateChip: {
    fontSize: 12, color: '#666', backgroundColor: '#fff',
    padding: '8px 14px', borderRadius: 20,
    border: '1px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
  },
 
  // Stats bar
  statsBar: {
    display: 'flex', gap: 16, marginBottom: 32
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px',
    border: '1px solid #f0f0f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
  },
  statCardNum: { fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 },
  statCardLbl: { fontSize: 11, color: '#999', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
 
  // Cards
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  card: {
    backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 14,
    padding: '24px 20px', cursor: 'pointer', textAlign: 'left',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
  },
  cardBar: { height: 3, width: 40, borderRadius: 2, marginBottom: 16, transition: 'width 0.3s ease' },
  cardIcon: { fontSize: 26, marginBottom: 10 },
  cardLabel: { fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#999', lineHeight: 1.4 },
  cardArrow: { fontSize: 18, fontWeight: 700, marginTop: 12, display: 'block' },
};