import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './AdminPage.module.css';

export default function AdminClientsPage() {
  const { clients, stages, addUser, updateUser, deleteUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);

  function openAdd() { setEditClient(null); setShowForm(true); }
  function openEdit(c) { setEditClient(c); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditClient(null); }

  function handleSave(data) {
    if (editClient) {
      updateUser(editClient.id, data);
    } else {
      addUser(data);
    }
    closeForm();
  }

  function handleDelete(id) {
    if (confirm('למחוק את הלקוחה?')) deleteUser(id);
  }

  const stageLabel = id => stages.find(s => s.id === id)?.title?.split('—')[0].trim() || 'לא מוגדר';

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>ניהול לקוחות</h2>
          <p className={styles.pageSubtitle}>{clients.length} לקוחות רשומות</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ הוספה</button>
      </div>

      <div className={styles.list}>
        {clients.length === 0 && (
          <div className={styles.empty}>אין לקוחות עדיין. הוסיפי לקוחה ראשונה!</div>
        )}
        {clients.map(c => (
          <div key={c.id} className={styles.clientCard}>
            <div className={styles.clientAvatar}>{c.name?.[0]}</div>
            <div className={styles.clientInfo}>
              <div className={styles.clientName}>{c.name}</div>
              <div className={styles.clientMeta}>
                <span>@{c.username}</span>
                <span className={styles.dot}>·</span>
                <span>{stageLabel(c.currentStage)}</span>
              </div>
              {c.notes && <div className={styles.clientNotes}>{c.notes}</div>}
            </div>
            <div className={styles.cardActions}>
              <button className={styles.editBtn} onClick={() => openEdit(c)}>עריכה</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>מחיקה</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ClientForm
          initial={editClient}
          stages={stages}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

function ClientForm({ initial, stages, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    username: initial?.username || '',
    password: initial?.password || '',
    currentStage: initial?.currentStage || 1,
    notes: initial?.notes || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{initial ? 'עריכת לקוחה' : 'הוספת לקוחה חדשה'}</h3>
        <div className={styles.formGrid}>
          <Field label="שם מלא" value={form.name} onChange={v => set('name', v)} />
          <Field label="שם משתמש" value={form.username} onChange={v => set('username', v)} />
          <Field label="סיסמה" value={form.password} onChange={v => set('password', v)} type="text" />
          <div className={styles.field}>
            <label className={styles.label}>שלב נוכחי</label>
            <select
              className={styles.input}
              value={form.currentStage}
              onChange={e => set('currentStage', Number(e.target.value))}
            >
              {stages.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          <div className={styles.field} style={{ gridColumn: '1/-1' }}>
            <label className={styles.label}>הערות</label>
            <textarea
              className={styles.input}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder="הערות פנימיות..."
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>ביטול</button>
          <button className={styles.saveBtn} onClick={() => onSave(form)}>שמירה</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
