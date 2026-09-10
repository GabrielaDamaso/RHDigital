import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { vacationApi } from '../services/api';
import type { VacationRequest, VacationType } from '../types';
import './pages.css';

const labels: Record<VacationType, string> = { '30_dias': '30 dias' };

export function Ferias() {
  const [type, setType] = useState<VacationType>('30_dias');
  const [startDate, setStartDate] = useState('');
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() { try { setRequests(await vacationApi.list()); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao carregar férias.'); } }
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(''); setError('');
    if (!startDate) return setError('Informe a data de início.');
    try {
      const request = await vacationApi.create({ type, startDate });
      setMessage(`Solicitação criada com protocolo ${request.protocol}.`);
      setStartDate(''); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível solicitar férias.'); }
  }

  return <div className="page">
    <div className="page-heading"><div><h1>Férias</h1><p>Solicite e acompanhe seus períodos de férias.</p></div></div>
    <div className="two-columns">
      <div className="card"><h2>Nova solicitação</h2><form onSubmit={submit}>
        <label>Período<select value={type} onChange={(e) => setType(e.target.value as VacationType)}><option value="30_dias">30 dias</option></select></label>
        <label>Data de início<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
        <div className="hint">O período final é calculado automaticamente conforme o tipo selecionado.</div>
        {message && <div className="success">{message}</div>}{error && <div className="error">{error}</div>}
        <button className="primary-button">Confirmar solicitação</button>
      </form></div>
      <div className="card"><h2>Saldo</h2><div className="big-number">30 <small>dias</small></div><p>Saldo demonstrativo disponível para o usuário inicial.</p></div>
    </div>
    <div className="card"><h2>Histórico</h2>{requests.length === 0 ? <p>Nenhuma solicitação cadastrada.</p> : <div className="table-wrap"><table><thead><tr><th>Protocolo</th><th>Período</th><th>Início</th><th>Fim</th><th>Status</th></tr></thead><tbody>{requests.map((item) => <tr key={item.id}><td>{item.protocol}</td><td>{labels[item.type]}</td><td>{item.startDate}</td><td>{item.endDate}</td><td><span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span></td></tr>)}</tbody></table></div>}</div>
  </div>;
}
