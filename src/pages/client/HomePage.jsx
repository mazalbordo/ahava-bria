import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './HomePage.module.css';

const ANXIETY_LABELS = {
  1: 'שלווה מוחלטת 🌸',
  2: 'רגועה מאוד 😌',
  3: 'רגועה 🙂',
  4: 'בסדר גמור 👍',
  5: 'קצת מתוחה 🤔',
  6: 'מתוחה 😐',
  7: 'חרדה בינונית 😟',
  8: 'חרדה גבוהה 😰',
  9: 'חרדה חזקה מאוד 😣',
  10: 'חרדה מקסימלית 🆘',
};

function getSliderColor(val) {
  if (val <= 3) return '#4CAF50';
  if (val <= 5) return '#8BC34A';
  if (val <= 7) return '#FF9800';
  return '#A52A2A';
}

// ─── Quick Insight (דף הבית) ─────────────────────────────────────
function QuickInsight({ userId, onNavigate }) {
  const storageKey = `ab_insights_${userId}`;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [flash, setFlash] = useState(false);

  function handleSave() {
    if (!text.trim()) return;
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newItem = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    localStorage.setItem(storageKey, JSON.stringify([newItem, ...existing]));
    setText('');
    setOpen(false);
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  }

  return (
    <section className={styles.section}>
      {!open ? (
        <button
          className={`${styles.anxietyBtn} ${styles.insightQuickBtn}`}
          onClick={() => setOpen(true)}
        >
          <span className={styles.anxietyBtnIcon}>💡</span>
          <span>{flash ? 'התובנה נשמרה! ✓' : 'יש לי תובנה חדשה — לחצי לכתוב'}</span>
          {!flash && (
            <span className={styles.insightLink} onClick={e => { e.stopPropagation(); onNavigate('program'); }}>
              כל התובנות ←
            </span>
          )}
        </button>
      ) : (
        <div className={styles.insightQuickCard}>
          <div className={styles.anxietyTop}>
            <p className={styles.anxietyQuestion}>💡 התובנה שלי</p>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>
          <textarea
            className={styles.triggerTextarea}
            placeholder="מה הבנת? מה גילית על עצמך? מה השתנה בך..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            autoFocus
          />
          <button
            className={styles.saveBtn}
            style={{ background: 'linear-gradient(135deg,#7B4A7B,#A52A2A)', marginTop: 10 }}
            onClick={handleSave}
            disabled={!text.trim()}
          >
            שמירה
          </button>
        </div>
      )}
    </section>
  );
}

function todayKey(userId, suffix) {
  return `ab_${suffix}_${userId}_${new Date().toISOString().split('T')[0]}`;
}

// ─── Anxiety Widget ──────────────────────────────────────────────
function AnxietyWidget({ userId, onHighAnxiety }) {
  const key = todayKey(userId, 'anxiety');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(5);
  const [saved, setSaved] = useState(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  });

  function handleSave() {
    const entry = { value, time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) };
    localStorage.setItem(key, JSON.stringify(entry));
    setSaved(entry);
    if (value >= 7) onHighAnxiety(value);
    setTimeout(() => setOpen(false), 600);
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>איך את מרגישה היום?</h3>
        {saved && (
          <span className={styles.savedBadge} style={{ color: getSliderColor(saved.value) }}>
            {saved.value}/10
          </span>
        )}
      </div>

      {!open ? (
        <button className={styles.anxietyBtn} onClick={() => { setOpen(true); if (saved) setValue(saved.value); }}>
          {saved ? (
            <><span className={styles.anxietyBtnIcon}>✏️</span><span>עדכני את המדד שלך · {ANXIETY_LABELS[saved.value]}</span></>
          ) : (
            <><span className={styles.anxietyBtnIcon}>💭</span><span>לחצי לדווח על רמת החרדה שלך היום</span></>
          )}
        </button>
      ) : (
        <div className={styles.anxietyCard}>
          <div className={styles.anxietyTop}>
            <p className={styles.anxietyQuestion}>מה רמת החרדה שלך עכשיו?</p>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className={styles.valueDisplay} style={{ color: getSliderColor(value) }}>
            <span className={styles.valueBig}>{value}</span>
            <span className={styles.valueMax}>/10</span>
          </div>
          <p className={styles.valueLabel}>{ANXIETY_LABELS[value]}</p>
          <div className={styles.sliderWrap}>
            <span className={styles.sliderMin}>1</span>
            <input
              type="range" min={1} max={10} value={value}
              onChange={e => setValue(Number(e.target.value))}
              className={styles.slider}
              style={{ '--fill-clr': getSliderColor(value), '--fill-pct': `${(value - 1) / 9 * 100}%`, direction: 'ltr' }}
            />
            <span className={styles.sliderMax}>10</span>
          </div>
          <div className={styles.sliderTicks}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i + 1} className={`${styles.tick} ${value === i + 1 ? styles.tickActive : ''}`}
                style={value === i + 1 ? { color: getSliderColor(value) } : {}}>
                {i + 1}
              </span>
            ))}
          </div>
          <button className={styles.saveBtn} style={{ background: getSliderColor(value) }} onClick={handleSave}>
            שמירה
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Trigger Widget (נפתח כשחרדה ≥ 7) ───────────────────────────
function TriggerWidget({ userId, anxietyValue }) {
  const key = todayKey(userId, 'trigger');
  const [open, setOpen] = useState(false);
  const [what, setWhat] = useState('');
  const [feel, setFeel] = useState('');
  const [saved, setSaved] = useState(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  });

  if (anxietyValue < 7 && !saved) return null;

  function handleSave() {
    const entry = { what, feel, value: anxietyValue, time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) };
    localStorage.setItem(key, JSON.stringify(entry));
    setSaved(entry);
    setOpen(false);
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>🔍 מה עורר אותך?</h3>
        {saved && <span className={styles.savedBadge} style={{ color: '#A52A2A' }}>נשמר ✓</span>}
      </div>

      {!open ? (
        <button className={styles.anxietyBtn} style={{ borderColor: '#F5E8E8' }} onClick={() => { setOpen(true); if (saved) { setWhat(saved.what); setFeel(saved.feel); } }}>
          <span className={styles.anxietyBtnIcon}>💬</span>
          <span>{saved ? 'ערכי את הטריגר שלך' : 'החרדה שלך גבוהה — רוצה לספר מה קרה?'}</span>
        </button>
      ) : (
        <div className={styles.triggerCard}>
          <div className={styles.anxietyTop}>
            <p className={styles.anxietyQuestion}>מה עורר את החרדה?</p>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className={styles.triggerField}>
            <label className={styles.triggerLabel}>מה קרה?</label>
            <textarea
              className={styles.triggerTextarea}
              placeholder="תארי את הסיטואציה שגרמה לחרדה..."
              value={what}
              onChange={e => setWhat(e.target.value)}
              rows={3}
            />
          </div>
          <div className={styles.triggerField}>
            <label className={styles.triggerLabel}>מה הרגשת בגוף ובנפש?</label>
            <textarea
              className={styles.triggerTextarea}
              placeholder="לב דופק, מחשבות שחוזרות, תחושת חנק..."
              value={feel}
              onChange={e => setFeel(e.target.value)}
              rows={3}
            />
          </div>
          <p className={styles.triggerNote}>
            💡 מזל תראה את זה ותוכל לעזור לך בפגישה הבאה
          </p>
          <button className={styles.saveBtn} style={{ background: '#A52A2A' }} onClick={handleSave}>
            שמירה
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Morning Intentions ──────────────────────────────────────────
const INTENTIONS = [
  { key: 'intention', icon: '🌟', label: 'הכוונה שלי להיום', placeholder: 'מה אני מתכוונת להביא לתוך היום הזה...' },
  { key: 'gratitude', icon: '🙏', label: 'על מה אני מודה', placeholder: 'דבר קטן או גדול שטוב לי בחיים...' },
  { key: 'focus',     icon: '🎯', label: 'במה אני מתמקדת', placeholder: 'דבר אחד שאשים עליו את הכוונה שלי...' },
];

function IntentionsWidget({ userId }) {
  const key = todayKey(userId, 'intentions');
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ intention: '', gratitude: '', focus: '' });
  const [saved, setSaved] = useState(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  });

  function handleSave() {
    localStorage.setItem(key, JSON.stringify(values));
    setSaved(values);
    setOpen(false);
  }

  const filledCount = saved ? Object.values(saved).filter(v => v.trim()).length : 0;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>כוונות הבוקר</h3>
        {saved && (
          <span className={styles.savedBadge} style={{ color: '#7B4A7B' }}>
            {filledCount}/3 ✓
          </span>
        )}
      </div>

      {!open ? (
        <button className={styles.anxietyBtn} style={{ borderColor: '#EDE8F5' }}
          onClick={() => { setOpen(true); if (saved) setValues(saved); }}>
          <span className={styles.anxietyBtnIcon}>✨</span>
          <span>{saved ? 'ערכי את כוונות הבוקר שלך' : 'התחילי את היום עם כוונה — לחצי כאן'}</span>
        </button>
      ) : (
        <div className={styles.intentionsCard}>
          <div className={styles.anxietyTop}>
            <p className={styles.anxietyQuestion}>כוונות הבוקר שלי</p>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>
          {INTENTIONS.map(({ key: k, icon, label, placeholder }) => (
            <div className={styles.triggerField} key={k}>
              <label className={styles.triggerLabel}>{icon} {label}</label>
              <textarea
                className={styles.triggerTextarea}
                placeholder={placeholder}
                value={values[k]}
                onChange={e => setValues(prev => ({ ...prev, [k]: e.target.value }))}
                rows={2}
              />
            </div>
          ))}
          <button className={styles.saveBtn} style={{ background: 'linear-gradient(135deg,#7B4A7B,#A52A2A)' }} onClick={handleSave}>
            שמירה
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Progress Graph (7 ימים אחרונים) ────────────────────────────
function ProgressGraph({ userId }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = localStorage.getItem(`ab_anxiety_${userId}_${dateStr}`);
    const parsed = entry ? JSON.parse(entry) : null;
    return {
      date: d,
      value: parsed?.value ?? null,
      label: d.toLocaleDateString('he-IL', { weekday: 'short' }),
    };
  });

  const hasData = days.some(d => d.value !== null);
  const W = 280, H = 100, PAD = 16;
  const graphW = W - PAD * 2;
  const graphH = H - PAD;

  function xPos(i) { return PAD + (i / 6) * graphW; }
  function yPos(v) { return PAD + (1 - (v - 1) / 9) * graphH; }

  const points = days.filter(d => d.value !== null);
  const pathD = points.length > 1
    ? points.map((d, i) => {
        const idx = days.indexOf(d);
        return `${i === 0 ? 'M' : 'L'} ${xPos(idx)} ${yPos(d.value)}`;
      }).join(' ')
    : null;

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>התקדמות — 7 ימים אחרונים</h3>
      <div className={styles.graphCard}>
        {!hasData ? (
          <p className={styles.graphEmpty}>נתונים יופיעו כאן לאחר שתמלאי את מדד החרדה מדי יום 📊</p>
        ) : (
          <svg viewBox={`0 0 ${W} ${H + 20}`} className={styles.graphSvg}>
            {/* Grid lines */}
            {[2, 5, 8].map(v => (
              <line key={v} x1={PAD} x2={W - PAD} y1={yPos(v)} y2={yPos(v)}
                stroke="#E8DFD8" strokeWidth="1" strokeDasharray="4,4" />
            ))}
            {/* Area fill */}
            {pathD && (
              <path
                d={`${pathD} L ${xPos(days.indexOf(points[points.length - 1]))} ${H} L ${xPos(days.indexOf(points[0]))} ${H} Z`}
                fill="url(#graphGrad)" opacity="0.25"
              />
            )}
            {/* Line */}
            {pathD && (
              <path d={pathD} fill="none" stroke="#A52A2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {/* Dots */}
            {points.map(d => {
              const idx = days.indexOf(d);
              return (
                <g key={idx}>
                  <circle cx={xPos(idx)} cy={yPos(d.value)} r="5" fill={getSliderColor(d.value)} stroke="white" strokeWidth="2" />
                  <text x={xPos(idx)} y={yPos(d.value) - 10} textAnchor="middle"
                    fontSize="10" fill={getSliderColor(d.value)} fontWeight="700">{d.value}</text>
                </g>
              );
            })}
            {/* Day labels */}
            {days.map((d, i) => (
              <text key={i} x={xPos(i)} y={H + 16} textAnchor="middle"
                fontSize="10" fill={d.value ? '#6B5F63' : '#C4B8BC'}>{d.label}</text>
            ))}
            <defs>
              <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A52A2A" />
                <stop offset="100%" stopColor="#A52A2A" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </section>
  );
}

// ─── Mini Calendar ───────────────────────────────────────────────
function MiniCalendar({ events, onNavigate }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

  const eventDays = new Set(
    events
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .map(e => new Date(e.date).getDate())
  );

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>📅 {monthName}</h3>
        <button className={styles.seeAll} onClick={() => onNavigate('schedule')}>כל האירועים</button>
      </div>
      <div className={styles.calendarCard} onClick={() => onNavigate('schedule')}>
        <div className={styles.calendarGrid}>
          {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
            <div key={d} className={styles.calendarDayName}>{d}</div>
          ))}
          {cells.map((day, i) => (
            <div key={i} className={`${styles.calendarDay} ${day === today.getDate() ? styles.calendarToday : ''} ${day && eventDays.has(day) ? styles.calendarHasEvent : ''} ${!day ? styles.calendarEmpty : ''}`}>
              {day}
              {day && eventDays.has(day) && <span className={styles.calendarDot} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function HomePage({ onNavigate }) {
  const { currentUser, stages, getClientTasks, getClientEvents } = useApp();
  const [todayAnxiety, setTodayAnxiety] = useState(() => {
    const key = `ab_anxiety_${currentUser?.id}_${new Date().toISOString().split('T')[0]}`;
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s).value : 0;
  });

  const stage = stages.find(s => s.id === currentUser?.currentStage);
  const tasks = getClientTasks(currentUser?.id);
  const pendingTasks = tasks.filter(t => !t.completed);
  const events = getClientEvents(currentUser?.id);
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h2 className={styles.hi}>שלום, {currentUser?.name?.split(' ')[0]} 🌸</h2>
        <p className={styles.tagline}>ברוכה הבאה לפורטל שלך</p>
      </div>

      <QuickInsight userId={currentUser?.id} onNavigate={onNavigate} />
      <IntentionsWidget userId={currentUser?.id} />
      <AnxietyWidget userId={currentUser?.id} onHighAnxiety={setTodayAnxiety} />
      <TriggerWidget userId={currentUser?.id} anxietyValue={todayAnxiety} />
      <ProgressGraph userId={currentUser?.id} />
      <MiniCalendar events={events} onNavigate={onNavigate} />

      {/* Stage */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>התוכנית שלי</h3>
        {stage ? (
          <div className={styles.stageCard} style={{ borderColor: stage.color }}>
            <div className={styles.stageBadge} style={{ background: stage.color }}>שלב {stage.id} מתוך {stages.length}</div>
            <h4 className={styles.stageTitle}>{stage.title}</h4>
            <p className={styles.stageDesc}>{stage.description}</p>
            <div className={styles.stageProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(stage.id / stages.length) * 100}%`, background: stage.color }} />
              </div>
              <span className={styles.progressLabel}>{Math.round((stage.id / stages.length) * 100)}%</span>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCard}><p>מזל תעדכן בקרוב את השלב שלך בתוכנית ✨</p></div>
        )}
      </section>

      <div className={styles.statsRow}>
        <button className={styles.statCard} onClick={() => onNavigate('tasks')}>
          <span className={styles.statNum}>{pendingTasks.length}</span>
          <span className={styles.statLabel}>משימות ממתינות</span>
        </button>
        <button className={styles.statCard} onClick={() => onNavigate('schedule')}>
          <span className={styles.statNum}>{upcomingEvents.length}</span>
          <span className={styles.statLabel}>אירועים קרובים</span>
        </button>
      </div>

      {upcomingEvents.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>הקרוב בלוח שלי</h3>
            <button className={styles.seeAll} onClick={() => onNavigate('schedule')}>הכל</button>
          </div>
          {upcomingEvents.map(ev => <EventChip key={ev.id} event={ev} />)}
        </section>
      )}

      {pendingTasks.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>משימות לביצוע</h3>
            <button className={styles.seeAll} onClick={() => onNavigate('tasks')}>הכל</button>
          </div>
          {pendingTasks.slice(0, 2).map(task => (
            <div key={task.id} className={styles.taskPreview}>
              <span className={styles.taskDot} />
              <span className={styles.taskTitle}>{task.title}</span>
            </div>
          ))}
        </section>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}

function EventChip({ event }) {
  const typeMap = {
    meeting: { label: 'פגישה אישית', color: '#A52A2A', bg: '#F5E8E8' },
    live:    { label: 'לייב', color: '#7B4A7B', bg: '#F0E8F5' },
    event:   { label: 'אירוע', color: '#2A6AA5', bg: '#E8F0F5' },
  };
  const t = typeMap[event.type] || typeMap.event;
  const d = new Date(event.date);
  return (
    <div className={styles.eventChip}>
      <div className={styles.eventDate}>
        <span className={styles.eventDay}>{d.getDate()}</span>
        <span className={styles.eventMonth}>{d.toLocaleDateString('he-IL', { month: 'short' })}</span>
      </div>
      <div className={styles.eventInfo}>
        <div className={styles.eventTitle}>{event.title}</div>
        <div className={styles.eventMeta}>
          <span className={styles.eventType} style={{ color: t.color, background: t.bg }}>{t.label}</span>
          <span className={styles.eventTime}>{event.time}</span>
        </div>
      </div>
    </div>
  );
}
