import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './AdminPage.module.css';

export default function AdminVideosPage() {
  const { videos, addVideo, updateVideo, deleteVideo } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editVideo, setEditVideo] = useState(null);

  function handleSave(data) {
    if (editVideo) updateVideo(editVideo.id, data);
    else addVideo(data);
    setShowForm(false);
    setEditVideo(null);
  }

  function handleDelete(id) {
    if (confirm('למחוק את הסרטון?')) deleteVideo(id);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>ניהול סרטונים</h2>
          <p className={styles.pageSubtitle}>{videos.length} סרטונים בספרייה</p>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditVideo(null); setShowForm(true); }}>+ הוספה</button>
      </div>

      <div className={styles.list}>
        {videos.length === 0 && <div className={styles.empty}>אין סרטונים עדיין</div>}
        {videos.map(v => (
          <div key={v.id} className={styles.itemCard}>
            <span className={styles.badge}>{v.category}</span>
            <div className={styles.itemTitle}>{v.title}</div>
            <div className={styles.itemMeta}>{v.uploadDate}</div>
            {v.description && <div className={styles.itemDesc}>{v.description}</div>}
            <div className={styles.itemDesc} style={{ fontSize: '12px', color: '#9B8F93', wordBreak: 'break-all' }}>
              🔗 {v.url}
            </div>
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => { setEditVideo(v); setShowForm(true); }}>עריכה</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(v.id)}>מחיקה</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <VideoForm
          initial={editVideo}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditVideo(null); }}
        />
      )}
    </div>
  );
}

function VideoForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    url: initial?.url || '',
    category: initial?.category || '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{initial ? 'עריכת סרטון' : 'הוספת סרטון'}</h3>
        <div className={styles.formGrid}>
          <div className={styles.field} style={{ gridColumn: '1/-1' }}>
            <label className={styles.label}>כותרת</label>
            <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className={styles.field} style={{ gridColumn: '1/-1' }}>
            <label className={styles.label}>קישור לסרטון (YouTube embed)</label>
            <input className={styles.input} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>קטגוריה</label>
            <input className={styles.input} value={form.category} onChange={e => set('category', e.target.value)} placeholder="למשל: כלים מעשיים" />
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
