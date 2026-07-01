import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './CommunityPage.module.css';

function formatTime(ts) {
  if (!ts?.seconds) return '';
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' }) + ' · ' +
    d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function PostCard({ post }) {
  const { currentUser, addComment, deleteComment, deletePost, getPostComments } = useApp();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const isAdmin = currentUser?.role === 'admin';
  const postComments = getPostComments(post.id);

  async function handleComment() {
    if (!text.trim()) return;
    setSending(true);
    await addComment(post.id, text.trim());
    setText('');
    setSending(false);
  }

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar} data-admin={post.isAdmin}>
          {post.authorName?.[0]}
        </div>
        <div className={styles.postMeta}>
          <span className={styles.postAuthor}>
            {post.authorName}
            {post.isAdmin && <span className={styles.adminBadge}>מזל</span>}
          </span>
          <span className={styles.postTime}>{formatTime(post.createdAt)}</span>
        </div>
        {(isAdmin || post.authorId === currentUser?.id) && (
          <button className={styles.deleteBtn} onClick={() => deletePost(post.id)} title="מחיקה">✕</button>
        )}
      </div>

      <p className={styles.postContent}>{post.content}</p>

      <button className={styles.commentsToggle} onClick={() => setOpen(o => !o)}>
        💬 {postComments.length > 0 ? `${postComments.length} תגובות` : 'הגיבי'}
        {open ? ' ▲' : ' ▼'}
      </button>

      {open && (
        <div className={styles.commentsSection}>
          {postComments.map(c => (
            <div key={c.id} className={styles.comment}>
              <div className={styles.commentAvatar} data-admin={c.isAdmin}>{c.authorName?.[0]}</div>
              <div className={styles.commentBody}>
                <span className={styles.commentAuthor}>
                  {c.authorName}
                  {c.isAdmin && <span className={styles.adminBadge}>מזל</span>}
                </span>
                <p className={styles.commentText}>{c.content}</p>
              </div>
              {(isAdmin || c.authorId === currentUser?.id) && (
                <button className={styles.deleteBtn} onClick={() => deleteComment(c.id)}>✕</button>
              )}
            </div>
          ))}
          <div className={styles.commentForm}>
            <textarea
              className={styles.commentInput}
              placeholder="כתבי תגובה..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
            />
            <button className={styles.commentSend} onClick={handleComment} disabled={sending || !text.trim()}>
              שלחי
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewPostForm({ type, onClose }) {
  const { addPost } = useApp();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSending(true);
    await addPost(type, text.trim());
    setText('');
    setSending(false);
    onClose();
  }

  return (
    <div className={styles.newPostForm}>
      <textarea
        className={styles.newPostInput}
        placeholder={type === 'feed' ? 'שתפי משהו עם הקהילה...' : 'מה תרצי לשאול?'}
        value={text}
        onChange={e => setText(e.target.value)}
        rows={4}
        autoFocus
      />
      <div className={styles.newPostActions}>
        <button className={styles.cancelBtn} onClick={onClose}>ביטול</button>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={sending || !text.trim()}>
          {sending ? 'שולחת...' : 'פרסמי'}
        </button>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { posts, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('feed');
  const [showForm, setShowForm] = useState(false);

  const tabPosts = posts
    .filter(p => p.type === activeTab)
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>הקהילה שלנו</h2>
        <p className={styles.heroSub}>מקום בטוח לשתף, לשאול ולהתחבר</p>
      </div>

      <div className={styles.mainTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'feed' ? styles.tabActive : ''}`}
          onClick={() => { setActiveTab('feed'); setShowForm(false); }}
        >
          🌸 פיד
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'question' ? styles.tabActive : ''}`}
          onClick={() => { setActiveTab('question'); setShowForm(false); }}
        >
          💬 שאלות ועצות
        </button>
      </div>

      <div className={styles.content}>
        {!showForm ? (
          <button className={styles.newPostBtn} onClick={() => setShowForm(true)}>
            {activeTab === 'feed' ? '+ שתפי משהו' : '+ שאלי את הקהילה'}
          </button>
        ) : (
          <NewPostForm type={activeTab} onClose={() => setShowForm(false)} />
        )}

        {tabPosts.length === 0 && !showForm && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>{activeTab === 'feed' ? '🌸' : '💬'}</div>
            <p>עדיין אין פוסטים כאן</p>
            <span>היי הראשונה לשתף!</span>
          </div>
        )}

        {tabPosts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}