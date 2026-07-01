import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './AdminPage.module.css';

function formatTime(ts) {
  if (!ts?.seconds) return '';
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminCrisisPage() {
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'crisisReports'), snap => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setReports(data);
    });
    return () => unsub();
  }, []);

  async function markSeen(id) {
    await updateDoc(doc(db, 'crisisReports', id), { seen: true });
  }

  const unseen = reports.filter(r => !r.seen).length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>פניות חירום</h2>
          <p className={styles.pageSubtitle}>
            {reports.length} פניות סה"כ
            {unseen > 0 && <span style={{ color: '#A52A2A', fontWeight: 700 }}> · {unseen} לא נראו</span>}
          </p>
        </div>
      </div>

      <div className={styles.list}>
        {reports.length === 0 && <div className={styles.empty}>אין פניות חירום עדיין</div>}
        {reports.map(r => (
          <div
            key={r.id}
            className={styles.itemCard}
            style={{ borderRight: r.seen ? 'none' : '4px solid #A52A2A' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <div className={styles.itemTitle}>{r.userName}</div>
                <div className={styles.itemMeta}>{formatTime(r.timestamp)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {!r.seen && (
                  <button className={styles.editBtn} onClick={() => markSeen(r.id)}>סימון כנראה</button>
                )}
                <button
                  className={styles.editBtn}
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  {expanded === r.id ? 'סגור' : 'פרטים'}
                </button>
              </div>
            </div>

            {expanded === r.id && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '⚡ טריגר', value: r.trigger },
                  { label: '💭 מחשבות', value: r.thoughts },
                  { label: '🫐 גוף', value: r.body },
                  { label: '🔄 תגובה', value: r.reaction },
                ].map(item => item.value && (
                  <div key={item.label} style={{ background: '#FAF7F2', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9B8F93', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: '#3A3235', lineHeight: 1.6 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
