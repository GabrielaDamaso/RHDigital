import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { vacationApi } from '../services/api';
import type { VacationRequest, VacationType } from '../types';
import './pages.css';

const labels: Record<VacationType, string> = {
  '30_dias': '30 dias',
  '20_mais_10': '20 dias + 10 dias',
  '15_mais_15': '15 dias + 15 dias',
};

export function Ferias() {
  const [type, setType] = useState<VacationType>('30_dias');
  const [startDate, setStartDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<VacationRequest | null>(null);
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() { try { setRequests(await vacationApi.list()); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao carregar férias.'); } }
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(''); setError('');
    if (!startDate) return setError('Informe a data de início.');
    try {
      if (editingId === null) {
        const request = await vacationApi.create({ type, startDate });
        setMessage(`Solicitação criada com protocolo ${request.protocol}.`);
      } else {
        const request = await vacationApi.update(editingId, { type, startDate });
        setMessage(`Solicitação ${request.protocol} atualizada.`);
      }
      setEditingId(null); setType('30_dias'); setStartDate(''); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível solicitar férias.'); }
  }

  async function editRequest(id: number) {
    setMessage(''); setError('');
    try {
      const request = await vacationApi.get(id);
      setEditingId(request.id); setType(request.type); setStartDate(request.startDate);
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível carregar a solicitação.'); }
  }

  async function deleteRequest() {
    if (!requestToDelete) return;
    setMessage(''); setError('');
    try {
      await vacationApi.remove(requestToDelete.id);
      setRequestToDelete(null); setMessage('Solicitação excluída.'); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível excluir a solicitação.'); }
  }

  function cancelEdit() {
    setEditingId(null); setType('30_dias'); setStartDate(''); setMessage(''); setError('');
  }

  return <div className="page">
    <div className="page-heading"><div><h1>Férias</h1><p>Solicite e acompanhe seus períodos de férias.</p></div></div>
    <div className="two-columns">
      <div className="card"><h2>{editingId === null ? 'Nova solicitação' : 'Editar solicitação'}</h2><form onSubmit={submit}>
        <label>Período<select value={type} onChange={(e) => setType(e.target.value as VacationType)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Data de início<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
        <div className="hint">O período final é calculado automaticamente conforme o tipo selecionado.</div>
        {message && <div className="success">{message}</div>}{error && <div className="error">{error}</div>}
        <div className="actions"><button className="primary-button">{editingId === null ? 'Confirmar solicitação' : 'Salvar alterações'}</button>{editingId !== null && <button type="button" onClick={cancelEdit}>Cancelar</button>}</div>
      </form></div>
      <div className="card"><h2>Saldo</h2><div className="big-number">30 <small>dias</small></div><p>Saldo demonstrativo disponível para o usuário inicial.</p></div>
    </div>
    <div className="card"><h2>Histórico</h2>{requests.length === 0 ? <p>Nenhuma solicitação cadastrada.</p> : <div className="table-wrap"><table><thead><tr><th>Protocolo</th><th>Período</th><th>Início</th><th>Fim</th><th>Status</th><th>Ações</th></tr></thead><tbody>{requests.map((item) => <tr key={item.id}><td>{item.protocol}</td><td>{labels[item.type]}</td><td>{item.startDate}</td><td>{item.endDate}</td><td><span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span></td><td>{item.status === 'PENDENTE' && <div className="actions"><button type="button" onClick={() => void editRequest(item.id)}>Editar</button><button type="button" className="danger-button" onClick={() => setRequestToDelete(item)}>Excluir</button></div>}</td></tr>)}</tbody></table></div>}</div>
    {requestToDelete && <div className="modal-backdrop" role="presentation" onClick={() => setRequestToDelete(null)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" onClick={(event) => event.stopPropagation()}><h2 id="delete-modal-title">Excluir solicitação?</h2><p>Você está prestes a excluir a solicitação <strong>{requestToDelete.protocol}</strong> do período de <strong>{labels[requestToDelete.type]}</strong>, com início em <strong>{requestToDelete.startDate}</strong>.</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setRequestToDelete(null)}>Cancelar</button><button type="button" className="secondary-button delete-button" onClick={() => void deleteRequest()}>Excluir solicitação</button></div></div></div>}
  </div>;
}
