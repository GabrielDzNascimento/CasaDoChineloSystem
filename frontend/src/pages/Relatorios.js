import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Layout from '../components/Layout';

function Relatorios() {
  const [dados, setDados] = useState([]);
  const [tipoAtivo, setTipoAtivo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modoPeriodo, setModoPeriodo] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [erro, setErro] = useState('');

  const buscarRelatorio = async (tipo) => {
    setErro('');
    if (modoPeriodo && tipo !== 'estoque' && dataInicio > dataFim) {
      setErro('A data de início não pode ser maior que a data de fim.');
      return;
    }
    setCarregando(true);
    setTipoAtivo(tipo);
    let resultado;
    if (tipo === 'saidas') resultado = modoPeriodo ? await api.relatorioSaidas(null, dataInicio, dataFim) : await api.relatorioSaidas(dataSelecionada);
    else if (tipo === 'entradas') resultado = modoPeriodo ? await api.relatorioEntradas(null, dataInicio, dataFim) : await api.relatorioEntradas(dataSelecionada);
    else resultado = await api.relatorioEstoque();
    setDados(resultado);
    setCarregando(false);
  };

  const colunasMov = ['Nome', 'Código de Barras', 'Quantidade', 'Data'];
  const colunasEstoque = ['Nome', 'Cor', 'Tamanho', 'Valor', 'Quantidade', 'Código de Barras'];
  const colunas = tipoAtivo === 'estoque' ? colunasEstoque : colunasMov;

  const tituloRelatorio = () => {
    if (tipoAtivo === 'estoque') return 'Estoque Atual';
    const tipo = tipoAtivo === 'saidas' ? 'Saídas' : 'Entradas';
    if (modoPeriodo) return `${tipo} — ${dataInicio} até ${dataFim}`;
    return `${tipo} — ${dataSelecionada}`;
  };

  const TIPOS = [
    { key: 'saidas', label: 'Saídas', icon: '↓', color: '#dc2626' },
    { key: 'entradas', label: 'Entradas', icon: '↑', color: '#16a34a' },
    { key: 'estoque', label: 'Estoque Atual', icon: '📦', color: '#8B0000' },
  ];

  return (
    <Layout title="Relatórios" subtitle="Consulte movimentações e o estado atual do estoque">
      {/* Controles */}
      <div style={styles.controles} className="no-print">

        {/* Toggle modo */}
        <div style={styles.modoRow}>
          <span style={styles.modoLbl}>Período:</span>
          <div style={styles.toggle}>
            <button style={{ ...styles.toggleBtn, ...(! modoPeriodo ? styles.toggleAtivo : {}) }}
              onClick={() => setModoPeriodo(false)}>📅 Dia específico</button>
            <button style={{ ...styles.toggleBtn, ...(modoPeriodo ? styles.toggleAtivo : {}) }}
              onClick={() => setModoPeriodo(true)}>📆 Intervalo</button>
          </div>
        </div>

        {/* Datas */}
        {!modoPeriodo ? (
          <div style={styles.dateRow}>
            <label style={styles.label}>Data</label>
            <input type="date" style={styles.inputData} value={dataSelecionada}
              onChange={e => setDataSelecionada(e.target.value)} />
          </div>
        ) : (
          <div style={styles.dateRow}>
            <label style={styles.label}>De</label>
            <input type="date" style={styles.inputData} value={dataInicio}
              onChange={e => setDataInicio(e.target.value)} />
            <label style={styles.label}>Até</label>
            <input type="date" style={styles.inputData} value={dataFim}
              onChange={e => setDataFim(e.target.value)} />
          </div>
        )}

        {erro && <div style={styles.alertErro}><span>⚠️</span> {erro}</div>}

        {/* Botões de tipo */}
        <div style={styles.tiposRow}>
          {TIPOS.map(t => (
            <button key={t.key}
              style={{
                ...styles.tipoBtn,
                borderColor: tipoAtivo === t.key ? t.color : '#e8e8e8',
                backgroundColor: tipoAtivo === t.key ? t.color : '#fff',
                color: tipoAtivo === t.key ? '#fff' : '#666',
              }}
              onClick={() => buscarRelatorio(t.key)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {carregando && (
        <div style={styles.loading}>Carregando relatório...</div>
      )}

      {!carregando && tipoAtivo && dados.length === 0 && (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <div style={styles.emptyTitle}>Nenhum registro encontrado</div>
          <div style={styles.emptyDesc}>Tente ajustar o período selecionado</div>
        </div>
      )}

      {!carregando && dados.length > 0 && (
        <div style={styles.resultado}>
          <div style={styles.resultadoHeader}>
            <div>
              <h3 style={styles.resultadoTitulo}>{tituloRelatorio()}</h3>
              <p style={styles.resultadoSub}>{dados.length} registro(s)</p>
            </div>
            <button style={styles.btnImprimir} className="no-print" onClick={() => window.print()}>
              🖨️ Imprimir / PDF
            </button>
          </div>

          {/* Print header */}
          <div style={styles.printHeader} className="print-only">
            <h2 style={{ color: '#8B0000', margin: 0 }}>Casa do Chinelo</h2>
            <p style={{ margin: '4px 0', color: '#555' }}>{tituloRelatorio()}</p>
          </div>

          <table style={styles.tabela}>
            <thead>
              <tr>
                {colunas.map(col => <th key={col} style={styles.th}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {dados.map((item, i) => (
                <tr key={i} style={{ ...styles.tr, backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  {tipoAtivo === 'estoque' ? (
                    <>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{item.nome}</td>
                      <td style={styles.td}><span style={styles.badge}>{item.cor || '—'}</span></td>
                      <td style={styles.td}>{item.tamanho || '—'}</td>
                      <td style={{ ...styles.td, color: '#8B0000', fontWeight: 600 }}>R$ {Number(item.valor).toFixed(2)}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.qtdBadge,
                          backgroundColor: item.quantidade === 0 ? '#fef2f2' : item.quantidade <= 3 ? '#fffbeb' : '#f0fdf4',
                          color: item.quantidade === 0 ? '#dc2626' : item.quantidade <= 3 ? '#d97706' : '#16a34a',
                        }}>{item.quantidade}</span>
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: '#666' }}>{item.codigo_barras}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{item.nome}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: '#666' }}>{item.codigo_barras}</td>
                      <td style={styles.td}>{item.quantidade}</td>
                      <td style={styles.td}>{item.data}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
        }
      `}</style>
    </Layout>
  );
}

const styles = {
  controles: {
    backgroundColor: '#fff', borderRadius: 14, padding: '24px 28px',
    marginBottom: 24, border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 16
  },
  modoRow: { display: 'flex', alignItems: 'center', gap: 12 },
  modoLbl: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  toggle: { display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e8e8e8' },
  toggleBtn: { padding: '7px 16px', border: 'none', backgroundColor: '#fff', color: '#666', cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  toggleAtivo: { backgroundColor: '#8B0000', color: '#fff' },
  dateRow: { display: 'flex', alignItems: 'center', gap: 12 },
  label: { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputData: { padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e8e8e8', fontSize: 13 },
  alertErro: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '10px 14px', borderRadius: 8, fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8
  },
  tiposRow: { display: 'flex', gap: 10 },
  tipoBtn: {
    padding: '10px 20px', border: '1.5px solid', borderRadius: 8,
    cursor: 'pointer', fontSize: 13, fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s'
  },
  loading: { textAlign: 'center', color: '#888', padding: '40px 0', fontSize: 13 },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 4 },
  emptyDesc: { fontSize: 13, color: '#999' },
  resultado: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  },
  resultadoHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #f0f0f0'
  },
  resultadoTitulo: { fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 },
  resultadoSub: { fontSize: 12, color: '#999', margin: '3px 0 0' },
  btnImprimir: {
    padding: '8px 16px', backgroundColor: '#1a1a1a', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600
  },
  printHeader: { textAlign: 'center', padding: '20px', borderBottom: '2px solid #8B0000' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '11px 16px', textAlign: 'left', fontSize: 11,
    fontWeight: 600, color: '#888', textTransform: 'uppercase',
    letterSpacing: 0.5, borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa'
  },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: 13, color: '#444' },
  badge: { backgroundColor: '#f5f5f5', color: '#555', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
  qtdBadge: { padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' },
};

export default Relatorios;