import { Navigate } from 'react-router-dom';

function RotaProtegida({ children, apenasAnalista = false }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (apenasAnalista && usuario.perfil !== 'Analista') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default RotaProtegida;