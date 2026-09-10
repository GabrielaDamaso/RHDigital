import { useParams } from 'react-router-dom';
import './pages.css';

const titles: Record<string, string> = { contracheque: 'Contracheque', licencas: 'Licenças', frequencia: 'Frequência', servidores: 'Servidores' };
export function Demo() { const { section } = useParams(); const title = titles[section ?? ''] ?? 'Demonstração'; return <div className="page"><div className="page-heading"><div><h1>{title}</h1><p>Área demonstrativa do protótipo.</p></div></div><div className="card"><h2>Funcionalidade demonstrativa</h2><p>Esta tela permanece preparada para receber dados mockados, conforme o PRD. Não faz parte do núcleo funcional do MVP.</p></div></div>; }
