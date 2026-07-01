import { useApp } from '../../context/AppContext';
import styles from './AdminPage.module.css';

function formatTime(ts) {
  if (!ts?.seconds) return '';
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminCommunityPage() {
  const { posts, comments, deletePost, deleteComment } = useApp();

  const feedPosts     = posts.filter(p => p.type === 'feed').sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const questionPosts = posts.filter(p => p.type === 'question').sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  function getComments(postId) {
    return comments.filter(c => c.postId === postId).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }

  function PostBlock({ post }) {
    const postComments = getComments(post.id);
    return (
      <div className={styles.itemCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
          <div>
            <span className={styles.badge} style={{ background: post.isAdmin ? '#F0E8F5' : '#F5E8E8', color: post.isAdmin ? '#7B2A7B' : '#A52A2A' }}>
              {post.authorName}{post.isAdmin ? ' (מזל)' : ''}
            </span>
            <div className={styles.itemMeta} style={{ marginTop: 4 }}>{formatTime(post.createdAt)}</div>
          </div>
          <button className={styles.deleteBtn} onClick={() => deletePost(post.id)}>מחיקה</button>
        </div>
        <div className={styles.itemTitle} style={{ fontWeight: 400, fontSize: 14, color: '#3A3235', whiteSpace: 'pre-wrap', marginBottom: 8 }}>
          {post.content}
        </div>
        {postComments.length > 0 && (
          <div style={{ borderTop: '1px solid #F0EAE8', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {postComments.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#FAF7F2', borderRadius: 8, padding: '6px 10px', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.isAdmin ? '#7B2A7B' : '#6B5F63' }}>
                    {c.authorName}{c.isAdmin ? ' (מזל)' : ''}
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: '#3A3235', whiteSpace: 'pre-wrap' }}>{c.content}</p>
                </div>
                <button className={styles.deleteBtn} onClick={() => deleteComment(c.id)} style={{ flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>ניהול קהילה</h2>
          <p className={styles.pageSubtitle}>{posts.length} פוסטים · {comments.length} תגובות</p>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#3A3235', margin: '16px 0 10px' }}>
          🌸 פיד ({feedPosts.length})
        </h3>
        {feedPosts.length === 0 && <div className={styles.empty}>אין פוסטים בפיד עדיין</div>}
        {feedPosts.map(p => <PostBlock key={p.id} post={p} />)}

        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#3A3235', margin: '20px 0 10px' }}>
          💬 שאלות ועצות ({questionPosts.length})
        </h3>
        {questionPosts.length === 0 && <div className={styles.empty}>אין שאלות עדיין</div>}
        {questionPosts.map(p => <PostBlock key={p.id} post={p} />)}
      </div>
    </div>
  );
}