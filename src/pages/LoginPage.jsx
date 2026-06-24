import { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await login(username, password);
    if (!result.success) setError(result.error);
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoPlaceholder}>
            <span className={styles.logoHeart}>♥</span>
          </div>
          <h1 className={styles.title}>אהבה בריאה</h1>
          <p className={styles.subtitle}>מזל בורדו | ליווי לנשים עם חרדות זוגיות</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>שם משתמש</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="הכניסי את שם המשתמש שלך"
              autoComplete="username"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>סיסמה</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="הכניסי את הסיסמה שלך"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'מתחברת...' : 'כניסה לפורטל'}
          </button>
        </form>

        <p className={styles.footer}>
          קיבלת פרטי התחברות ממזל? הכניסי אותם כאן ✨
        </p>
      </div>
    </div>
  );
}
