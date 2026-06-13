import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({
    nome: '', cor: '', codigo_barras: '', tamanho: '',
    valorExato: '', valorMin: '', valorMax: ''
  });
  const [modoValor, setModoValor] = useState('faixa');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAnalista = usuario?.perfil === 'Analista';

const buscar = async () => {
  const params = {};
  if (filtros.nome) params.nome = filtros.nome;
  if (filtros.cor) params.cor = filtros.cor;
  if (filtros.codigo_barras) params.codigo_barras = filtros.codigo_barras;
  if (filtros.tamanho) params.tamanho = filtros.tamanho;

  if (modoValor === 'exato' && filtros.valorExato) {
    params.valorExato = filtros.valorExato;
  } else if (modoValor === 'acima' && filtros.valorMin) {
    params.valorMin = filtros.valorMin;
  } else if (modoValor === 'ate' && filtros.valorMax) {
    params.valorMax = filtros.valorMax;
  } else if (modoValor === 'faixa') {
    if (filtros.valorMin) params.valorMin = filtros.valorMin;
    if (filtros.valorMax) params.valorMax = filtros.valorMax;
  }

  const resultado = await api.listarProdutos(params);
  setProdutos(resultado);
};

  const limpar = () => {
    setFiltros({ nome: '', cor: '', codigo_barras: '', tamanho: '', valorExato: '', valorMin: '', valorMax: '' });
    setModoValor('faixa');
    api.listarProdutos().then(setProdutos);
  };

  useEffect(() => { buscar(); }, []);

  const renderFiltroValor = () => {
    switch (modoValor) {
      case 'exato':
        return <input style={styles.input} type="text" placeholder="Ex: 29,90"
          value={filtros.valorExato}
          onChange={e => setFiltros({ ...filtros, valorExato: e.target.value })} />;
      case 'acima':
        return <input style={styles.input} type="text" placeholder="Acima de (Ex: 20,00)"
          value={filtros.valorMin}
          onChange={e => setFiltros({ ...filtros, valorMin: e.target.value })} />;
      case 'ate':
        return <input style={styles.input} type="text" placeholder="Até (Ex: 50,00)"
          value={filtros.valorMax}
          onChange={e => setFiltros({ ...filtros, valorMax: e.target.value })} />;
      case 'faixa':
        return (
          <div style={styles.faixa}>
            <input style={styles.inputFaixa} type="text" placeholder="De (Ex: 20,00)"
              value={filtros.valorMin}
              onChange={e => setFiltros({ ...filtros, valorMin: e.target.value })} />
            <span style={styles.ate}>até</span>
            <input style={styles.inputFaixa} type="text" placeholder="Até (Ex: 50,00)"
              value={filtros.valorMax}
              onChange={e => setFiltros({ ...filtros, valorMax: e.target.value })} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.voltar} onClick={() => navigate('/dashboard')}>← Voltar</button>
        <h2 style={styles.titulo}>Consultar Estoque</h2>
      </div>

      <div style={styles.painel}>
        <h4 style={styles.painelTitulo}>🔍 Filtros</h4>

        <div style={styles.grid}>
          {/* Nome */}
          <div style={styles.campo}>
            <label style={styles.label}>Nome</label>
            <input style={styles.input} placeholder="Ex: Havaianas"
              value={filtros.nome}
              onChange={e => setFiltros({ ...filtros, nome: e.target.value })} />
          </div>

          {/* Cor */}
          <div style={styles.campo}>
            <label style={styles.label}>Cor</label>
            <input style={styles.input} placeholder="Ex: Azul"
              value={filtros.cor}
              onChange={e => setFiltros({ ...filtros, cor: e.target.value })} />
          </div>

          {/* Código de barras */}
          <div style={styles.campo}>
            <label style={styles.label}>Código de Barras</label>
            <input style={styles.input} placeholder="Ex: 7891234567890"
              value={filtros.codigo_barras}
              onChange={e => setFiltros({ ...filtros, codigo_barras: e.target.value })} />
          </div>

          {/* Tamanho — sempre texto, suporta "38" ou "33/34" */}
          <div style={styles.campo}>
            <label style={styles.label}>Tamanho</label>
            <input style={styles.input} placeholder='Ex: 38 ou 33/34'
              value={filtros.tamanho}
              onChange={e => setFiltros({ ...filtros, tamanho: e.target.value })} />
            <span style={styles.dica}>💡 Digite parcial: "33" encontra "33/34"</span>
          </div>

          {/* Valor com modo variável */}
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
          <button style={styles.botaoLimpar} onClick={limpar}>Limpar Filtros</button>
        </div>
      </div>

      {produtos.length === 0 ? (
        <p style={styles.vazio}>Nenhum produto encontrado.</p>
      ) : (
        <>
          <p style={styles.contador}>{produtos.length} produto(s) encontrado(s)</p>
          <table style={styles.tabela}>
            <thead>
              <tr>
                {['Nome', 'Cor', 'Tamanho', 'Valor', 'Quantidade', 'Código de Barras',
                  ...(isAnalista ? ['Ações'] : [])].map(col => (
                  <th key={col} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.map(p => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>{p.nome}</td>
                  <td style={styles.td}>{p.cor}</td>
                  <td style={styles.td}>{p.tamanho}</td>
                  <td style={styles.td}>R$ {Number(p.valor).toFixed(2)}</td>
                  <td style={styles.td}>{p.quantidade}</td>
                  <td style={styles.td}>{p.codigo_barras}</td>
                  {isAnalista && (
                    <td style={styles.td}>
                      <button style={styles.editBtn}
                        onClick={() => navigate(`/editar-produto/${p.id}`)}>
                        ✏️ Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '32px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  voltar: { backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' },
  titulo: { color: '#8B0000', margin: 0 },
  painel: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  painelTitulo: { color: '#8B0000', margin: '0 0 16px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#555' },
  input: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' },
  dica: { fontSize: '11px', color: '#999', fontStyle: 'italic' },
  toggle: { display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #8B0000', marginBottom: '6px', width: 'fit-content' },
  toggleBtn: { padding: '5px 14px', border: 'none', backgroundColor: '#fff', color: '#8B0000', cursor: 'pointer', fontSize: '12px' },
  toggleAtivo: { backgroundColor: '#8B0000', color: '#fff' },
  faixa: { display: 'flex', alignItems: 'center', gap: '8px' },
  inputFaixa: { padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px', width: '100%' },
  ate: { fontSize: '12px', color: '#888', whiteSpace: 'nowrap' },
  acoes: { display: 'flex', gap: '10px' },
  botao: { padding: '10px 28px', backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  botaoLimpar: { padding: '10px 20px', backgroundColor: '#fff', color: '#8B0000', border: '1px solid #8B0000', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  contador: { color: '#666', fontSize: '13px', marginBottom: '10px' },
  vazio: { color: '#888', textAlign: 'center', marginTop: '40px' },
  tabela: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { backgroundColor: '#8B0000', color: '#fff', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '10px 16px', fontSize: '13px', color: '#333' },
  editBtn: { backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }
};

export default Estoque;