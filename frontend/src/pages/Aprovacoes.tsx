import { useEffect, useState } from 'react';
import { approvalApi } from '../services/api';
import type { VacationRequest } from '../types';
import './pages.css';

export function Aprovacoes() {
  const [items, setItems] = useState<(VacationRequest & { userName: string })[]>([]);
  const [error, setError] = useState('');
  async function load() { try { setItems(await approvalApi.list()); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao carregar aprovações.'); } }
  useEffect(() => { void load(); }, []);
  async function decide(id: number, status: 'APROVADA' | 'NEGADA') { try { await approvalApi.decide(id, status); await load(); } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível atualizar a solicitação.'); } }

  return <div className="page"><div className="page-heading"><div><h1>Aprovações</h1><p>Solicitações pendentes para análise do SGP.</p></div></div>
    {error && <div className="error">{error}</div>}
    <div className="card">{items.length === 0 ? <p>Não há solicitações pendentes.</p> : <div className="table-wrap"><table><thead><tr><th>Servidor</th><th>Protocolo</th><th>Período</th><th>Início</th><th>Ações</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.userName}</td><td>{item.protocol}</td><td>{item.type}</td><td>{item.startDate}</td><td className="actions"><button onClick={() => void decide(item.id, 'APROVADA')}>Aprovar</button><button className="danger-button" onClick={() => void decide(item.id, 'NEGADA')}>Negar</button></td></tr>)}</tbody></table></div>}</div>
  </div>;
}
