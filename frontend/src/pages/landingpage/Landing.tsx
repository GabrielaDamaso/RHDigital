import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { contactApi } from '../../services/api';
import type { ContactMessage, ContactPayload, ContactSubject } from '../../types/contact';
import './landing.css';

const emptyForm: ContactPayload = { nome: '', email: '', assunto: 'duvida', mensagem: '' };

const subjectLabel: Record<ContactSubject, string> = {
  duvida: 'Dúvida',
  sugestao: 'Sugestão',
  informacao: 'Solicitação de informação',
  outro: 'Outro',
};

export function Landing() {
  const [form, setForm] = useState<ContactPayload>(emptyForm);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadMessages() {
    try {
      setMessages(await contactApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar as mensagens.');
    }
  }

  useEffect(() => {
    void loadMessages();
  }, []);

  function updateField<K extends keyof ContactPayload>(field: K, value: ContactPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editingId === null) {
        await contactApi.create(form);
        setSuccess('Mensagem enviada com sucesso.');
      } else {
        await contactApi.update(editingId, form);
        setSuccess('Mensagem atualizada com sucesso.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a mensagem.');
    } finally {
      setLoading(false);
    }
  }

  function editMessage(message: ContactMessage) {
    setEditingId(message.id);
    setForm({ nome: message.nome, email: message.email, assunto: message.assunto, mensagem: message.mensagem });
    setSuccess('');
    setError('');
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function deleteMessage(id: number) {
    if (!window.confirm('Deseja realmente excluir esta mensagem?')) return;
    setError('');
    setSuccess('');
    try {
      await contactApi.remove(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setSuccess('Mensagem excluída com sucesso.');
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a mensagem.');
    }
  }

  return <div className="landing">
    <header className="landing-header">
      <div className="landing-nav">
        <a className="landing-brand" href="#inicio"><span className="brand-mark" />RH Digital</a>
        <nav><a href="#sobre">Sobre</a><a href="#funcionalidades">Funcionalidades</a><a href="#tecnologia">Tecnologia</a><a className="nav-contact" href="#contato">Contato</a></nav>
      </div>
    </header>
    <main>
      <section className="hero wrap" id="inicio">
        <div className="hero-copy">
          <span className="pill">Portal do Servidor</span>
          <h1>RH Digital</h1>
          <p className="hero-lead">Uma experiência mais simples para a Gestão de Pessoas.</p>
          <p>Uma plataforma unificada de RH, com autoatendimento ao servidor, Gestão de Pessoas e integrações institucionais.</p>
          <a className="dark-button" href="#contato">Fale conosco</a>
          <a className="portal-link" href="/login">Acessar o portal</a>
        </div>
        <div className="hero-card"><span>RH</span><strong>Digital</strong><small>Autoatendimento · Gestão · Integrações</small></div>
      </section>
      <section className="section wrap" id="sobre"><span className="eyebrow">Sobre o projeto</span><h2>Modernização da Gestão de Pessoas</h2><p className="section-text">O RH Digital propõe uma plataforma digital unificada para Gestão de Pessoas, reduzindo a fragmentação de sistemas e melhorando a experiência dos servidores.</p></section>
      <section className="section wrap" id="funcionalidades"><span className="eyebrow">Funcionalidades</span>
        <div className="feature-row"><h3>Autoatendimento</h3><p>Recursos de RH disponíveis de forma digital e centralizada.</p><div className="tags"><span>Solicitações</span><span>Consultas</span><span>Histórico</span></div></div>
        <div className="feature-row"><h3>Gestão de Pessoas</h3><p>Informações organizadas para apoiar os processos de RH.</p><div className="tags"><span>Dados funcionais</span><span>Férias</span><span>Aprovações</span></div></div>
      </section>
      <section className="section wrap" id="tecnologia"><span className="eyebrow">Tecnologia</span><h2>Integrações</h2><p className="section-text">O núcleo de RH pode ser integrado a sistemas externos e institucionais.</p><div className="tags"><span>SSO corporativo</span><span>Banco de dados</span><span>BI institucional</span><span>API REST</span></div></section>
      <section className="contact-band" id="contato"><div className="wrap contact-layout">
        <div><span className="eyebrow">Contato</span><h2>Entre em contato</h2><p>Tem dúvidas, sugestões ou gostaria de saber mais sobre o RH Digital? Envie uma mensagem pelo formulário.</p></div>
        <div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="nome">Nome</label><input id="nome" value={form.nome} onChange={(event) => updateField('nome', event.target.value)} required /></div>
            <div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required /></div>
            <div className="field wide"><label htmlFor="assunto">Assunto</label><select id="assunto" value={form.assunto} onChange={(event) => updateField('assunto', event.target.value as ContactSubject)}><option value="duvida">Dúvida</option><option value="sugestao">Sugestão</option><option value="informacao">Solicitação de informação</option><option value="outro">Outro</option></select></div>
            <div className="field wide"><label htmlFor="mensagem">Mensagem</label><textarea id="mensagem" rows={6} value={form.mensagem} onChange={(event) => updateField('mensagem', event.target.value)} required /></div>
            <div className="form-actions"><button className="dark-button" disabled={loading}>{loading ? 'Salvando...' : editingId === null ? 'Enviar mensagem' : 'Salvar alterações'}</button>{editingId !== null && <button type="button" className="light-button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar</button>}</div>
            {success && <div className="feedback success" role="status">{success}</div>}{error && <div className="feedback error" role="alert">{error}</div>}
          </form>
        </div>
      </div></section>
      <section className="messages-section wrap"><div className="list-heading"><div><span className="eyebrow">CRUD</span><h2>Mensagens recebidas</h2></div><strong>{messages.length}</strong></div>
        {messages.length === 0 ? <p className="empty">Nenhuma mensagem cadastrada ainda.</p> : <div className="message-list">{messages.map((message) => <article className="message-card" key={message.id}><div><div className="message-meta"><strong>{message.nome}</strong><span>{message.email}</span><span>{subjectLabel[message.assunto]}</span></div><p>{message.mensagem}</p></div><div className="message-actions"><button onClick={() => editMessage(message)}>Editar</button><button className="delete" onClick={() => void deleteMessage(message.id)}>Excluir</button></div></article>)}</div>}
      </section>
    </main>
    <footer><div className="wrap"><strong>RH Digital — Portal do Servidor</strong><span>Proposta de modernização da Gestão de Pessoas.</span></div></footer>
  </div>;
}
