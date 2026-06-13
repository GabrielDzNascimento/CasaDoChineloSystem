import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import CadastrarProduto from './pages/CadastrarProduto';
import Movimentacao from './pages/Movimentacao';
import Relatorios from './pages/Relatorios';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import EditarProduto from './pages/EditarProduto';
import RotaProtegida from './components/RotaProtegida';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/dashboard" element={
          <RotaProtegida><Dashboard /></RotaProtegida>
        } />
        <Route path="/estoque" element={
          <RotaProtegida><Estoque /></RotaProtegida>
        } />
        <Route path="/relatorios" element={
          <RotaProtegida><Relatorios /></RotaProtegida>
        } />

        {/* Rotas exclusivas do Analista */}
        <Route path="/cadastrar-produto" element={
          <RotaProtegida apenasAnalista><CadastrarProduto /></RotaProtegida>
        } />
        <Route path="/editar-produto/:id" element={
          <RotaProtegida apenasAnalista><EditarProduto /></RotaProtegida>
        } />
        <Route path="/movimentacao" element={
          <RotaProtegida apenasAnalista><Movimentacao /></RotaProtegida>
        } />
        <Route path="/usuarios" element={
          <RotaProtegida apenasAnalista><GerenciarUsuarios /></RotaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;