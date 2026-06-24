import { useApp } from '../../context/AppContext';
import styles from './SchedulePage.module.css';

const TYPE_MAP = {
  meeting: { label: 'פגישה אישית', color: '#A52A2A', bg: '#F5E8E8', icon: '💬' },
  live: { label: 'לייב קבוצתי', color: '#7B4A7B', bg: '#F0E8F5', icon: '📡' },
  event: { label: 'אירוע', color: '#2A6AA5', bg: '#E8F0F5', icon: '🎯' },
};

export default function SchedulePage() {
  const { currentUser, getClientEvents } = useApp();
  const allEvents = getClientEvents(currentUser?.id);
  const focusDate = localStorage.getItem('ab_schedule_focus');
  if (focusDate) localStorage.removeItem('ab_schedule_focus');

  const sorted = [...allEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = new Date(new Date().toDateString());
  const upcoming = sorted.filter(e => new Date(e.date) >= today);
  const past = sorted.filter(e => new Date(e.date) < today).reverse();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>לוח זמנים</h2>
        <p className={styles.pageSubtitle}>הפגישות, הלייבים והאירועים שלך</p>
      </div>

      {upcoming.length === 0 && past.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📅</div>
          <p>אין אירועים מתוכננים כרגע</p>
          <span>מזל תעדכן בקרוב ✨</span>
        </div>
      )}

      {upcoming.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.groupTitle}>אירועים קרובים</h3>
          {upcoming.map(ev => <EventCard key={ev.id} event={ev} highlight={focusDate === ev.date} />)}
        </section>
      )}

      {past.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.groupTitle}>אירועים שעברו</h3>
          {past.map(ev => <EventCard key={ev.id} event={ev} past />)}
        </section>
      )}
    </div>
  );
}

function EventCard({ event, past, highlight }) {
  const t = TYPE_MAP[event.type] || TYPE_MAP.event;
  const d = new Date(event.date);
  const dateStr = d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={`${styles.card} ${past ? styles.cardPast : ''} ${highlight ? styles.cardHighlight : ''}`}>
      <div className={styles.cardLeft}>
        <div className={styles.typeIcon} style={{ background: t.bg }}>{t.icon}</div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{event.title}</div>
        <div className={styles.cardDate}>{dateStr} | {event.time}</div>
        {event.description && <div className={styles.cardDesc}>{event.description}</div>}
        <span className={styles.typeBadge} style={{ color: t.color, background: t.bg }}>{t.label}</span>
      </div>
    </div>
  );
}
