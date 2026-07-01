import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/initialData';
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
            <span className={styles.badge} style={{ background: v.contentType === 'extra' ? '#E8F0E8' : '#F5E8E8', color: v.contentType === 'extra' ? '#2A7A2A' : '#A52A2A', marginRight: 6 }}>
              {v.contentType === 'extra' ? 'העשרה' : 'ליבה'}
            </span>
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
    contentType: initial?.contentType || 'core',
  });

  function set(k, v) {
    setForm(f => {
      if (k === 'category') {
        const cat = CATEGORIES.find(c => c.id === v);
        const autoType = cat?.type === 'extra' ? 'extra' : 'core';
        return { ...f, [k]: v, contentType: autoType };
      }
      return { ...f, [k]: v };
    });
  }

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
            <select className={styles.input} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">בחרי קטגוריה</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>סוג תוכן</label>
            <select className={styles.input} value={form.contentType} onChange={e => set('contentType', e.target.value)}>
              <option value="core">ליבה</option>
              <option value="extra">העשרה</option>
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
