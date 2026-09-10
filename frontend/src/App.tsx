import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { Aprovacoes } from './pages/Aprovacoes';
import { Dashboard } from './pages/Dashboard';
import { Demo } from './pages/Demo';
import { Ferias } from './pages/Ferias';
import { Login } from './pages/Login';

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 30 }}>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

export function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoutes />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ferias" element={<Ferias />} />
      <Route path="/aprovacoes" element={<Aprovacoes />} />
      <Route path="/demo/:section" element={<Demo />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
