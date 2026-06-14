import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Layout from '../components/Layout';
 
function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({
    nome: '', cor: '', codigo_barras: '', tamanho: '',
    valorExato: '', valorMin: '', valorMax: ''
  });
  const [modoValor, setModoValor] = useState('faixa');
  const [buscado, setBuscado] = useState(false);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAnalista = usuario?.perfil === 'Analista';
 
  const buscar = async () => {
    const params = {};
    if (filtros.nome) params.nome = filtros.nome;
    if (filtros.cor) params.cor = filtros.cor;
    if (filtros.codigo_barras) params.codigo_barras = filtros.codigo_barras;
    if (filtros.tamanho) params.tamanho = filtros.tamanho;
 
    if (modoValor === 'exato' && filtros.valorExato) params.valorExato = filtros.valorExato;
    else if (modoValor === 'acima' && filtros.valorMin) params.valorMin = filtros.valorMin;
    else if (modoValor === 'ate' && filtros.valorMax) params.valorMax = filtros.valorMax;
    else if (modoValor === 'faixa') {
      if (filtros.valorMin) params.valorMin = filtros.valorMin;
      if (filtros.valorMax) params.valorMax = filtros.valorMax;
    }
 
    const resultado = await api.listarProdutos(params);
    setProdutos(resultado);
    setBuscado(true);
  };
 
  const limpar = () => {
    setFiltros({ nome: '', cor: '', codigo_barras: '', tamanho: '', valorExato: '', valorMin: '', valorMax: '' });
    setModoValor('faixa');
    setBuscado(false);
    api.listarProdutos().then(setProdutos);
  };
 
  useEffect(() => { buscar(); }, []);
 
  const renderFiltroValor = () => {
    switch (modoValor) {
      case 'exato':
        return <input style={styles.input} type="text" placeholder="Ex: 29,90"
          value={filtros.valorExato} onChange={e => setFiltros({ ...filtros, valorExato: e.target.value })} />;
      case 'acima':
        return <input style={styles.input} type="text" placeholder="Acima de (Ex: 20,00)"
          value={filtros.valorMin} onChange={e => setFiltros({ ...filtros, valorMin: e.target.value })} />;
      case 'ate':
        return <input style={styles.input} type="text" placeholder="Até (Ex: 50,00)"
          value={filtros.valorMax} onChange={e => setFiltros({ ...filtros, valorMax: e.target.value })} />;
      case 'faixa':
        return (
          <div style={styles.faixa}>
            <input style={styles.inputFaixa} type="text" placeholder="De (Ex: 20,00)"
              value={filtros.valorMin} onChange={e => setFiltros({ ...filtros, valorMin: e.target.value })} />
            <span style={styles.ate}>até</span>
            <input style={styles.inputFaixa} type="text" placeholder="Até (Ex: 50,00)"
              value={filtros.valorMax} onChange={e => setFiltros({ ...filtros, valorMax: e.target.value })} />
          </div>
        );
      default: return null;
    }
  };
 
  return (
    <Layout title="Consultar Estoque" subtitle="Busque produtos por nome, cor, tamanho, código ou valor">
      {/* Painel de filtros */}
      <div style={styles.painel}>
        <div style={styles.painelHeader}>
          <span style={styles.painelIcon}>🔍</span>
          <span style={styles.painelTitulo}>Filtros de busca</span>
        </div>
 
        <div style={styles.grid}>
          <div style={styles.campo}>
            <label style={styles.label}>Nome</label>
            <input style={styles.input} placeholder="Ex: Havaianas"
              value={filtros.nome} onChange={e => setFiltros({ ...filtros, nome: e.target.value })} />
          </div>
 
          <div style={styles.campo}>
            <label style={styles.label}>Cor</label>
            <input style={styles.input} placeholder="Ex: Azul"
              value={filtros.cor} onChange={e => setFiltros({ ...filtros, cor: e.target.value })} />
          </div>
 
          <div style={styles.campo}>
            <label style={styles.label}>Código de Barras</label>
            <input style={styles.input} placeholder="Ex: 7891234567890"
              value={filtros.codigo_barras} onChange={e => setFiltros({ ...filtros, codigo_barras: e.target.value })} />
          </div>
 
          <div style={styles.campo}>
            <label style={styles.label}>Tamanho</label>
            <input style={styles.input} placeholder='Ex: 38 ou 33/34'
              value={filtros.tamanho} onChange={e => setFiltros({ ...filtros, tamanho: e.target.value })} />
            <span style={styles.dica}>Digite "33" para encontrar "33/34"</span>
          </div>
 
          <div style={{ ...styles.campo, gridColumn: 'span 2' }}>
            <label style={styles.label}>Valor (R$)</label>
            <div style={styles.toggle}>
              {[
                { key: 'exato', label: 'Exato' },
                { key: 'acima', label: 'Acima de' },
                { key: 'ate', label: 'Até' },
                { key: 'faixa', label: 'Faixa' },
              ].map(op => (
                <button key={op.key}
                  style={{ ...styles.toggleBtn, ...(modoValor === op.key ? styles.toggleAtivo : {}) }}
                  onClick={() => {
                    setModoValor(op.key);
                    setFiltros({ ...filtros, valorExato: '', valorMin: '', valorMax: '' });
                  }}>
                  {op.label}
                </button>
              ))}
            </div>
            {renderFiltroValor()}
          </div>
        </div>
 
        <div style={styles.acoes}>
          <button style={styles.botao} onClick={buscar}>Buscar</button>
          <button style={styles.botaoLimpar} onClick={limpar}>Limpar filtros</button>
        </div>
      </div>
 
      {/* Resultado */}
      {buscado && produtos.length === 0 && (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <div style={styles.emptyTitle}>Nenhum produto encontrado</div>
          <div style={styles.emptyDesc}>Tente ajustar os filtros de busca</div>
        </div>
      )}
 
      {produtos.length > 0 && (
        <div style={styles.tabelaWrap}>
          <div style={styles.tabelaHeader}>
            <span style={styles.contador}>{produtos.length} produto(s) encontrado(s)</span>
            {isAnalista && (
              <button style={styles.btnNovo} onClick={() => navigate('/cadastrar-produto')}>
                + Novo produto
              </button>
            )}
          </div>
          <table style={styles.tabela}>
            <thead>
              <tr>
                {['Nome', 'Cor', 'Tamanho', 'Valor', 'Quantidade', 'Código de Barras',
                  ...(isAnalista ? [''] : [])].map((col, i) => (
                  <th key={i} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.map((p, i) => (
                <tr key={p.id} style={{ ...styles.tr, backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#1a1a1a' }}>{p.nome}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{p.cor || '—'}</span>
                  </td>
                  <td style={styles.td}>{p.tamanho || '—'}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#8B0000' }}>
                    R$ {Number(p.valor).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.qtdBadge,
                      backgroundColor: p.quantidade === 0 ? '#fef2f2' : p.quantidade <= 3 ? '#fffbeb' : '#f0fdf4',
                      color: p.quantidade === 0 ? '#dc2626' : p.quantidade <= 3 ? '#d97706' : '#16a34a',
                    }}>
                      {p.quantidade}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: '#666' }}>
                    {p.codigo_barras}
                  </td>
                  {isAnalista && (
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => navigate(`/editar-produto/${p.id}`)}>
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
 
const styles = {
  painel: {
    backgroundColor: '#fff', borderRadius: 14, padding: '24px 28px',
    marginBottom: 24, border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  },
  painelHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 },
  painelIcon: { fontSize: 16 },
  painelTitulo: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    padding: '9px 12px', borderRadius: 8,
    border: '1.5px solid #e8e8e8', fontSize: 13,
    outline: 'none', transition: 'border-color 0.15s',
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif'
  },
  dica: { fontSize: 10, color: '#bbb', fontStyle: 'italic' },
  toggle: {
    display: 'flex', borderRadius: 8, overflow: 'hidden',
    border: '1.5px solid #e8e8e8', marginBottom: 8, width: 'fit-content'
  },
  toggleBtn: {
    padding: '6px 14px', border: 'none',
    backgroundColor: '#fff', color: '#666',
    cursor: 'pointer', fontSize: 12, fontWeight: 500
  },
  toggleAtivo: { backgroundColor: '#8B0000', color: '#fff' },
  faixa: { display: 'flex', alignItems: 'center', gap: 8 },
  inputFaixa: {
    padding: '9px 12px', borderRadius: 8,
    border: '1.5px solid #e8e8e8', fontSize: 13, width: '100%',
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif'
  },
  ate: { fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' },
  acoes: { display: 'flex', gap: 10 },
  botao: {
    padding: '10px 24px', backgroundColor: '#8B0000', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontSize: 13, fontWeight: 600
  },
  botaoLimpar: {
    padding: '10px 20px', backgroundColor: '#fff', color: '#666',
    border: '1.5px solid #e8e8e8', borderRadius: 8,
    cursor: 'pointer', fontSize: 13
  },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 4 },
  emptyDesc: { fontSize: 13, color: '#999' },
  tabelaWrap: {
    backgroundColor: '#fff', borderRadius: 14,
    border: '1px solid #f0f0f0', overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  },
  tabelaHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #f0f0f0'
  },
  contador: { fontSize: 13, color: '#888' },
  btnNovo: {
    padding: '7px 16px', backgroundColor: '#8B0000', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600
  },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5,
    borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa'
  },
  tr: { borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' },
  td: { padding: '12px 16px', fontSize: 13, color: '#444' },
  badge: {
    backgroundColor: '#f5f5f5', color: '#555',
    padding: '3px 10px', borderRadius: 20, fontSize: 12
  },
  qtdBadge: {
    padding: '3px 12px', borderRadius: 20,
    fontSize: 12, fontWeight: 600, display: 'inline-block'
  },
  editBtn: {
    padding: '5px 14px', backgroundColor: '#fff',
    border: '1.5px solid #8B0000', color: '#8B0000',
    borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600
  },
};
 
export default Estoque;