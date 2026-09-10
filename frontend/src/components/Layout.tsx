import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './layout.css';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/ferias', label: 'Férias' },
  { to: '/aprovacoes', label: 'Aprovações' },
];

const demoLinks = [
  ['contracheque', 'Contracheque'],
  ['licencas', 'Licenças'],
  ['frequencia', 'Frequência'],
  ['servidores', 'Servidores'],
] as const;

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">RH</div>
          <div>
            <strong>RH Digital</strong>
            <span>Gestão de Pessoas</span>
          </div>
        </div>
        <nav className="nav">
          <span className="nav-section">Portal</span>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className="nav-item">
              {link.label}
            </NavLink>
          ))}
          <span className="nav-section">Demonstração</span>
          {demoLinks.map(([to, label]) => (
            <NavLink key={to} to={`/demo/${to}`} className="nav-item">
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="user-area">
          <div className="avatar">JS</div>
          <div className="user-info">
            <strong>{user?.name ?? 'Usuário'}</strong>
            <span>{user?.email ?? ''}</span>
          </div>
          <button className="link-button" onClick={handleLogout} title="Sair">
            Sair
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="header">Portal de Gestão de Pessoas</header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
