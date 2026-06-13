import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Relatorios() {
  const [dados, setDados] = useState([]);
  const [tipoAtivo, setTipoAtivo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modoPeriodo, setModoPeriodo] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const buscarRelatorio = async (tipo) => {
    setErro('');

    if (modoPeriodo && tipo !== 'estoque' && dataInicio > dataFim) {
      setErro('A data de início não pode ser maior que a data de fim.');
      return;
    }

    setCarregando(true);
    setTipoAtivo(tipo);

    let resultado;
    if (tipo === 'saidas') {
      resultado = modoPeriodo
        ? await api.relatorioSaidas(null, dataInicio, dataFim)
        : await api.relatorioSaidas(dataSelecionada);
    } else if (tipo === 'entradas') {
      resultado = modoPeriodo
        ? await api.relatorioEntradas(null, dataInicio, dataFim)
        : await api.relatorioEntradas(dataSelecionada);
    } else {
      resultado = await api.relatorioEstoque();
    }

    setDados(resultado);
    setCarregando(false);
  };

  const handleImprimir = () => window.print();

  const colunasMov = ['Nome', 'Código de Barras', 'Quantidade', 'Data'];
  const colunasEstoque = ['Nome', 'Cor', 'Tamanho', 'Valor', 'Quantidade', 'Código de Barras'];
  const colunas = tipoAtivo === 'estoque' ? colunasEstoque : colunasMov;

  const tituloRelatorio = () => {
    if (tipoAtivo === 'estoque') return 'Estoque Atual';
    const tipo = tipoAtivo === 'saidas' ? 'Saídas' : 'Entradas';
    if (modoPeriodo) return `${tipo} de ${dataInicio} até ${dataFim}`;
    return `${tipo} do dia ${dataSelecionada}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="no-print">
        <button style={styles.voltar} onClick={() => navigate('/dashboard')}>← Voltar</button>
        <h2 style={styles.titulo}>Relatórios</h2>
      </div>

      <div style={styles.controles} className="no-print">

        {/* Toggle dia/período */}
        <div style={styles.toggleRow}>
          <span style={styles.label}>Modo de busca:</span>
          <div style={styles.toggle}>
            <button
              style={{ ...styles.toggleBtn, ...(! modoPeriodo ? styles.toggleAtivo : {}) }}
              onClick={() => setModoPeriodo(false)}>
              📅 Dia específico
            </button>
            <button
              style={{ ...styles.toggleBtn, ...(modoPeriodo ? styles.toggleAtivo : {}) }}
              onClick={() => setModoPeriodo(true)}>
              📆 Período
            </button>
          </div>
        </div>

        {/* Seletor de data */}
        {!modoPeriodo ? (
          <div style={styles.dataSeletor}>
            <label style={styles.label}>Data:</label>
            <input type="date" style={styles.inputData}
              value={dataSelecionada}
              onChange={e => setDataSelecionada(e.target.value)} />
          </div>
        ) : (
          <div style={styles.dataSeletor}>
            <label style={styles.label}>De:</label>
            <input type="date" style={styles.inputData}
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)} />
            <label style={styles.label}>Até:</label>
            <input type="date" style={styles.inputData}
              value={dataFim}
              onChange={e => setDataFim(e.target.value)} />
          </div>
        )}

        {erro && <p style={styles.erro}>{erro}</p>}

        {/* Botões de relatório */}
        <div style={styles.botoes}>
          <button
            style={{ ...styles.botaoRelatorio, ...(tipoAtivo === 'saidas' ? styles.ativo : {}) }}
            onClick={() => buscarRelatorio('saidas')}>
            📋 Saídas
          </button>
          <button
            style={{ ...styles.botaoRelatorio, ...(tipoAtivo === 'entradas' ? styles.ativo : {}) }}
            onClick={() => buscarRelatorio('entradas')}>
            📥 Entradas
          </button>
          <button
            style={{ ...styles.botaoRelatorio, ...(tipoAtivo === 'estoque' ? styles.ativo : {}) }}
            onClick={() => buscarRelatorio('estoque')}>
            📦 Estoque Atual
          </button>
        </div>
      </div>

      {carregando && <p style={styles.info}>Carregando...</p>}

      {!carregando && tipoAtivo && dados.length === 0 && (
        <p style={styles.info}>Nenhum registro encontrado para o período selecionado.</p>
      )}

      {!carregando && dados.length > 0 && (
        <div style={styles.resultado}>
          <div style={styles.printHeader} className="print-only">
            <h2 style={{ color: '#8B0000', margin: 0 }}>Casa do Chinelo</h2>
            <p style={{ margin: '4px 0', color: '#555' }}>Sistema de Controle de Estoque</p>
          </div>

          <div style={styles.resultadoHeader}>
            <div>
              <h3 style={styles.tituloRelatorio}>{tituloRelatorio()}</h3>
              <p style={styles.subtitulo}>{dados.length} registro(s) encontrado(s)</p>
            </div>
            <button style={styles.btnImprimir} className="no-print" onClick={handleImprimir}>
              🖨️ Imprimir / Salvar PDF
            </button>
          </div>

          <table style={styles.tabela}>
            <thead>
              <tr>
                {colunas.map(col => (
                  <th key={col} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.map((item, i) => (
                <tr key={i} style={styles.tr}>
                  {tipoAtivo === 'estoque' ? (
                    <>
                      <td style={styles.td}>{item.nome}</td>
                      <td style={styles.td}>{item.cor}</td>
                      <td style={styles.td}>{item.tamanho}</td>
                      <td style={styles.td}>R$ {Number(item.valor).toFixed(2)}</td>
                      <td style={styles.td}>{item.quantidade}</td>
                      <td style={styles.td}>{item.codigo_barras}</td>
                    </>
                  ) : (
                    <>
                      <td style={styles.td}>{item.nome}</td>
                      <td style={styles.td}>{item.codigo_barras}</td>
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
    </div>
  );
}

const styles = {
  container: { padding: '32px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  voltar: { backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' },
  titulo: { color: '#8B0000', margin: 0 },
  controles: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '16px' },
  toggleRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  toggle: { display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #8B0000' },
  toggleBtn: { padding: '8px 16px', border: 'none', backgroundColor: '#fff', color: '#8B0000', cursor: 'pointer', fontSize: '13px' },
  toggleAtivo: { backgroundColor: '#8B0000', color: '#fff' },
  dataSeletor: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  inputData: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' },
  botoes: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  botaoRelatorio: { padding: '10px 20px', backgroundColor: '#8B0000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', opacity: 0.65 },
  ativo: { opacity: 1, boxShadow: '0 2px 8px rgba(139,0,0,0.4)' },
  erro: { color: 'red', fontSize: '13px' },
  info: { color: '#888', textAlign: 'center', marginTop: '40px' },
  resultado: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  resultadoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  tituloRelatorio: { color: '#8B0000', margin: 0 },
  subtitulo: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
  btnImprimir: { padding: '8px 18px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#8B0000', color: '#fff', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '10px 16px', fontSize: '13px', color: '#333' },
  printHeader: { textAlign: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #8B0000' }
};

export default Relatorios;