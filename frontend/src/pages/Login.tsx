import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/api';
import type { User } from '../types';
import './pages.css';

export function Login() {
  const [email, setEmail] = useState('gabriela@rhdigital.local');
  const [senha, setSenha] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const result = await authApi.login(email, senha);
      localStorage.setItem('rh_token', result.token);
      const user: User = { id: result.usuario.id, name: result.usuario.nome, email: result.usuario.email };
      login(user);
      navigate('/');
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível entrar.'); }
    finally { setLoading(false); }
  }

  return <div className="login-page">
    <div className="login-card">
      <div className="brand-badge">RH</div>
      <h1>RH Digital</h1>
      <p>Uma nova experiência digital para a Gestão de Pessoas.</p>
      <form onSubmit={submit}>
        <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Senha<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required /></label>
        {error && <div className="error">{error}</div>}
        <button className="primary-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <small>Usuário de demonstração disponível no README.</small>
    </div>
  </div>;
}
