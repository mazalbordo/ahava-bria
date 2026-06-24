import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './AdminPage.module.css';

export default function AdminTasksPage() {
  const { tasks, clients, addTask, updateTask, deleteTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const clientName = id => clients.find(c => c.id === id)?.name || id;

  function handleSave(data) {
    if (editTask) updateTask(editTask.id, data);
    else addTask(data);
    setShowForm(false);
    setEditTask(null);
  }

  function handleDelete(id) {
    if (confirm('למחוק את המשימה?')) deleteTask(id);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>ניהול משימות</h2>
          <p className={styles.pageSubtitle}>{tasks.length} משימות</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditTask(null); setShowForm(true); }}>+ הוספה</button>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 && <div className={styles.empty}>אין משימות עדיין</div>}
        {tasks.map(task => (
          <div key={task.id} className={styles.itemCard}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className={styles.badge}>{clientName(task.clientId)}</span>
              {task.completed && <span style={{ fontSize: '11px', color: '#5A8A5A', background: '#E8F5E8', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>הושלם ✓</span>}
            </div>
            <div className={styles.itemTitle}>{task.title}</div>
            {task.dueDate && <div className={styles.itemMeta}>עד: {task.dueDate}</div>}
            {task.description && <div className={styles.itemDesc}>{task.description}</div>}
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => { setEditTask(task); setShowForm(true); }}>עריכה</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(task.id)}>מחיקה</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TaskForm
          initial={editTask}
          clients={clients}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}

function TaskForm({ initial, clients, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    dueDate: initial?.dueDate || '',
    clientId: initial?.clientId || (clients[0]?.id || ''),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{initial ? 'עריכת משימה' : 'הוספת משימה'}</h3>
        <div className={styles.formGrid}>
          <div className={styles.field} style={{ gridColumn: '1/-1' }}>
            <label className={styles.label}>כותרת המשימה</label>
            <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>לקוחה</label>
            <select className={styles.input} value={form.clientId} onChange={e => set('clientId', e.target.value)}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>תאריך יעד</label>
            <input className={styles.input} type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
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
