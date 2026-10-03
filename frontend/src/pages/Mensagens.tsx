import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { contactApi } from '../services/api';
import type { ContactMessage, ContactPayload, ContactSubject } from '../types/contact';
import './pages.css';

const emptyForm: ContactPayload = { nome: '', email: '', assunto: 'duvida', mensagem: '' };

const subjectLabel: Record<ContactSubject, string> = {
  duvida: 'Dúvida',
  sugestao: 'Sugestão',
  informacao: 'Solicitação de informação',
  outro: 'Outro',
};

export function Mensagens() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContactPayload>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadMessages() {
    setError('');
    try {
      setMessages(await contactApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar as mensagens.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMessages();
  }, []);

  function updateField<K extends keyof ContactPayload>(field: K, value: ContactPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEditing(message: ContactMessage) {
    setEditingId(message.id);
    setForm({ nome: message.nome, email: message.email, assunto: message.assunto, mensagem: message.mensagem });
    setError('');
    setSuccess('');
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await contactApi.update(editingId, form);
      setSuccess('Mensagem atualizada com sucesso.');
      cancelEditing();
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar a mensagem.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteMessage(id: number) {
    if (!window.confirm('Deseja realmente excluir esta mensagem?')) return;

    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      await contactApi.remove(id);
      if (editingId === id) cancelEditing();
      setSuccess('Mensagem excluída com sucesso.');
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a mensagem.');
    } finally {
      setDeletingId(null);
    }
  }

  return <div className="page">
    <div className="page-heading">
      <div><h1>Mensagens recebidas</h1><p>Consulte e gerencie as mensagens enviadas pelo formulário de contato.</p></div>
      <strong className="contact-message-count">{messages.length}</strong>
    </div>

    {error && <div className="error" role="alert">{error}</div>}
    {success && <div className="success" role="status">{success}</div>}

    {editingId !== null && <section className="card">
      <h2>Editar mensagem</h2>
      <form className="contact-edit-form" onSubmit={handleSubmit}>
        <label>Nome<input value={form.nome} onChange={(event) => updateField('nome', event.target.value)} required /></label>
        <label>E-mail<input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required /></label>
        <label>Assunto<select value={form.assunto} onChange={(event) => updateField('assunto', event.target.value as ContactSubject)}><option value="duvida">Dúvida</option><option value="sugestao">Sugestão</option><option value="informacao">Solicitação de informação</option><option value="outro">Outro</option></select></label>
        <label className="contact-edit-message">Mensagem<textarea rows={5} value={form.mensagem} onChange={(event) => updateField('mensagem', event.target.value)} required /></label>
        <div className="actions contact-edit-actions">
          <button className="primary-button" disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
          <button type="button" className="secondary-button" onClick={cancelEditing} disabled={saving}>Cancelar</button>
        </div>
      </form>
    </section>}

    <section className="card contact-messages">
      <h2>Caixa de entrada</h2>
      {loading ? <p role="status">Carregando mensagens...</p> : messages.length > 0 ? (
        <div className="contact-message-list">
          {messages.map((message) => <article className="contact-message-row" key={message.id}>
            <div className="contact-message-content">
              <div className="contact-message-meta">
                <strong>{message.nome}</strong>
                <a href={`mailto:${message.email}`}>{message.email}</a>
                <span>{subjectLabel[message.assunto]}</span>
                <time dateTime={message.createdAt}>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(message.createdAt))}</time>
              </div>
              <p>{message.mensagem}</p>
            </div>
            <div className="actions contact-message-actions">
              <button className="secondary-button" onClick={() => startEditing(message)} disabled={deletingId !== null || saving}>Editar</button>
              <button className="primary-button danger-button" onClick={() => void deleteMessage(message.id)} disabled={deletingId !== null || saving} aria-label={`Excluir mensagem de ${message.nome}`}>{deletingId === message.id ? 'Excluindo...' : 'Excluir'}</button>
            </div>
          </article>)}
        </div>
      ) : !error && <p>Não há mensagens recebidas.</p>}
    </section>
  </div>;
}
