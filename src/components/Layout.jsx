import { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { id: 'home',     label: 'בית',         icon: '🏠' },
  { id: 'program',  label: 'התוכנית שלי', icon: '📖' },
  { id: 'schedule', label: 'לוח זמנים',  icon: '📅' },
  { id: 'tasks',    label: 'משימות',      icon: '✅' },
  { id: 'crisis',   label: 'צריכה עזרה', icon: '🆘', crisis: true },
];

const ADMIN_NAV_ITEMS = [
  { id: 'admin-clients', label: 'לקוחות', icon: '👩' },
  { id: 'admin-events', label: 'אירועים', icon: '📅' },
  { id: 'admin-tasks', label: 'משימות', icon: '✅' },
  { id: 'admin-videos', label: 'סרטונים', icon: '🎬' },
];

export default function Layout({ children, activePage, onNavigate }) {
  const { currentUser, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)} aria-label="תפריט">
            <span /><span /><span />
          </button>
          <div className={styles.logoArea}>
            <span className={styles.logoHeart}>♥</span>
            <span className={styles.logoText}>אהבה בריאה</span>
          </div>
          <div className={styles.userChip}>
            <span className={styles.userName}>{currentUser?.name}</span>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.menuPanel} onClick={e => e.stopPropagation()}>
            <div className={styles.menuHeader}>
              <div className={styles.menuAvatar}>
                {currentUser?.name?.[0]}
              </div>
              <div>
                <div className={styles.menuName}>{currentUser?.name}</div>
                <div className={styles.menuRole}>{isAdmin ? 'מנהלת' : 'משתתפת'}</div>
              </div>
            </div>
            <nav className={styles.menuNav}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={`${styles.menuItem} ${activePage === item.id ? styles.menuItemActive : ''}`}
                  onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            <button className={styles.logoutBtn} onClick={logout}>
              יציאה מהמערכת
            </button>
          </div>
        </div>
      )}

      <nav className={styles.topNav}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navBtn} ${activePage === item.id ? styles.navBtnActive : ''} ${item.crisis ? styles.navBtnCrisis : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={`${styles.navIcon} ${item.crisis ? styles.navIconCrisis : ''}`}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
