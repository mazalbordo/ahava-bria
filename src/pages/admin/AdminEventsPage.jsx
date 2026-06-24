import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './AdminPage.module.css';

const TYPES = [
  { value: 'meeting', label: 'פגישה אישית' },
  { value: 'live', label: 'לייב קבוצתי' },
  { value: 'event', label: 'אירוע' },
];

export default function AdminEventsPage() {
  const { events, clients, addEvent, updateEvent, deleteEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

  const clientName = id => id === 'all' ? 'כל הלקוחות' : clients.find(c => c.id === id)?.name || id;
  const typeName = t => TYPES.find(x => x.value === t)?.label || t;

  function handleSave(data) {
    if (editEvent) updateEvent(editEvent.id, data);
    else addEvent(data);
    setShowForm(false);
    setEditEvent(null);
  }

  function handleDelete(id) {
    if (confirm('למחוק את האירוע?')) deleteEvent(id);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>ניהול אירועים</h2>
          <p className={styles.pageSubtitle}>{events.length} אירועים</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditEvent(null); setShowForm(true); }}>+ הוספה</button>
      </div>

      <div className={styles.list}>
        {sorted.length === 0 && <div className={styles.empty}>אין אירועים עדיין</div>}
        {sorted.map(ev => (
          <div key={ev.id} className={styles.itemCard}>
            <span className={styles.badge}>{typeName(ev.type)}</span>
            <div className={styles.itemTitle}>{ev.title}</div>
            <div className={styles.itemMeta}>{ev.date} | {ev.time} | {clientName(ev.clientId)}</div>
            {ev.description && <div className={styles.itemDesc}>{ev.description}</div>}
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => { setEditEvent(ev); setShowForm(true); }}>עריכה</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(ev.id)}>מחיקה</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <EventForm
          initial={editEvent}
          clients={clients}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditEvent(null); }}
        />
      )}
    </div>
  );
}

function EventForm({ initial, clients, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    date: initial?.date || '',
    time: initial?.time || '',
    type: initial?.type || 'meeting',
    description: initial?.description || '',
    clientId: initial?.clientId || 'all',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{initial ? 'עריכת אירוע' : 'הוספת אירוע'}</h3>
        <div className={styles.formGrid}>
          <div className={styles.field} style={{ gridColumn: '1/-1' }}>
            <label className={styles.label}>כותרת</label>
            <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>תאריך</label>
            <input className={styles.input} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>שעה</label>
            <input className={styles.input} type="time" value={form.time} onChange={e => set('time', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>סוג</label>
            <select className={styles.input} value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>לקוחה</label>
            <select className={styles.input} value={form.clientId} onChange={e => set('clientId', e.target.value)}>
              <option value="all">כל הלקוחות</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ gridColumn: '1/-1' }}>
            <label className={styles.label}>תיאור</label>
            <textarea className={styles.input} rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
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
