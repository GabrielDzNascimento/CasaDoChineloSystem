const BASE_URL = 'https://casadochinelosystem-1.onrender.com';

export const api = {
  login: (email, senha) =>
    fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    }).then(res => res.json()),

  cadastrarUsuario: (dados) =>
    fetch(`${BASE_URL}/usuarios/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(res => res.json()),

  listarProdutos: (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return fetch(`${BASE_URL}/produtos?${params}`).then(res => res.json());
  },

  cadastrarProduto: (dados) =>
    fetch(`${BASE_URL}/produtos/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(res => res.json()),

  editarProduto: (id, dados) =>
    fetch(`${BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(res => res.json()),

  registrarMovimentacao: (dados) =>
    fetch(`${BASE_URL}/movimentacoes/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(res => res.json()),

relatorioSaidas: (data, dataInicio, dataFim) => {
  const params = dataInicio && dataFim
    ? `?dataInicio=${dataInicio}&dataFim=${dataFim}`
    : data ? `?data=${data}` : '';
  return fetch(`${BASE_URL}/movimentacoes/relatorio/saidas${params}`).then(res => res.json());
},

relatorioEntradas: (data, dataInicio, dataFim) => {
  const params = dataInicio && dataFim
    ? `?dataInicio=${dataInicio}&dataFim=${dataFim}`
    : data ? `?data=${data}` : '';
  return fetch(`${BASE_URL}/movimentacoes/relatorio/entradas${params}`).then(res => res.json());
},
  relatorioEstoque: () =>
    fetch(`${BASE_URL}/movimentacoes/relatorio/estoque`).then(res => res.json()),
  
listarUsuarios: () =>
  fetch(`${BASE_URL}/usuarios`).then(res => res.json()),

atualizarPerfil: (id, dados) =>
  fetch(`${BASE_URL}/usuarios/${id}/perfil`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  }).then(res => res.json()),

};