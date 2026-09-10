import { dashboardMock } from '../mocks/dashboard';
import './pages.css';

export function Dashboard() {
  return <div className="page">
    <div className="page-heading"><div><h1>Olá, Josiane</h1><p>Confira seus principais indicadores.</p></div></div>
    <div className="metrics">
      <div className="metric"><span>Férias disponíveis</span><strong>{dashboardMock.vacationDays} dias</strong><small>Saldo atual</small></div>
      <div className="metric"><span>Banco de horas</span><strong>{dashboardMock.timeBank}</strong><small>Saldo acumulado</small></div>
      <div className="metric"><span>Frequência</span><strong>{dashboardMock.frequency}</strong><small>Período atual</small></div>
      <div className="metric"><span>Próximo salário</span><strong>{dashboardMock.nextSalary}</strong><small>Valor demonstrativo</small></div>
    </div>
    <div className="card"><h2>Próximos passos</h2><p>O fluxo funcional do MVP está disponível em <strong>Férias</strong> e <strong>Aprovações</strong>.</p></div>
  </div>;
}
