import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './PersonalAreaPage.module.css';

function getSliderColor(val) {
  if (val <= 3) return '#4CAF50';
  if (val <= 5) return '#8BC34A';
  if (val <= 7) return '#FF9800';
  return '#A52A2A';
}

function AnxietyGraph({ userId }) {
  const [activeRange, setActiveRange] = useState(14);

  const days = Array.from({ length: activeRange }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (activeRange - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = localStorage.getItem(`ab_anxiety_${userId}_${dateStr}`);
    const parsed = entry ? JSON.parse(entry) : null;
    return {
      date: d,
      value: parsed?.value ?? null,
      label: activeRange <= 7
        ? d.toLocaleDateString('he-IL', { weekday: 'short' })
        : d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }),
    };
  });

  const hasData = days.some(d => d.value !== null);
  const points = days.filter(d => d.value !== null);
  const avg = points.length ? Math.round(points.reduce((s, d) => s + d.value, 0) / points.length * 10) / 10 : null;
  const trend = points.length >= 2 ? points[points.length - 1].value - points[0].value : null;

  const W = 320, H = 120, PAD = 20;
  const gW = W - PAD * 2, gH = H - PAD;
  const xPos = i => PAD + (i / (activeRange - 1)) * gW;
  const yPos = v => PAD + (1 - (v - 1) / 9) * gH;

  const pathD = points.length > 1
    ? points.map((d, i) => {
        const idx = days.indexOf(d);
        return `${i === 0 ? 'M' : 'L'} ${xPos(idx)} ${yPos(d.value)}`;
      }).join(' ')
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>📊 גרף החרדה שלי</h3>
        <div className={styles.rangeTabs}>
          {[7, 14, 30].map(r => (
            <button key={r}
              className={`${styles.rangeTab} ${activeRange === r ? styles.rangeTabActive : ''}`}
              onClick={() => setActiveRange(r)}>{r} ימים</button>
          ))}
        </div>
      </div>

      {avg !== null && (
        <div className={styles.graphStats}>
          <div className={styles.graphStat}>
            <span className={styles.graphStatNum} style={{ color: getSliderColor(Math.round(avg)) }}>{avg}</span>
            <span className={styles.graphStatLabel}>ממוצע</span>
          </div>
          {trend !== null && (
            <div className={styles.graphStat}>
              <span className={styles.graphStatNum} style={{ color: trend < 0 ? '#4CAF50' : trend > 0 ? '#A52A2A' : '#9B8F93' }}>
                {trend > 0 ? `+${trend}` : trend}
              </span>
              <span className={styles.graphStatLabel}>{trend < 0 ? 'ירידה 📉' : trend > 0 ? 'עלייה 📈' : 'יציב'}</span>
            </div>
          )}
          <div className={styles.graphStat}>
            <span className={styles.graphStatNum} style={{ color: '#A52A2A' }}>{points.length}</span>
            <span className={styles.graphStatLabel}>ימי דיווח</span>
          </div>
        </div>
      )}

      {!hasData ? (
        <p className={styles.empty}>מלאי את מדד החרדה בדף הבית כל יום — הגרף יתמלא כאן 📊</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H + 28}`} className={styles.graphSvg}>
          <defs>
            <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A52A2A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A52A2A" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[2, 5, 8].map(v => (
            <line key={v} x1={PAD} x2={W - PAD} y1={yPos(v)} y2={yPos(v)}
              stroke="#E8DFD8" strokeWidth="1" strokeDasharray="4,3" />
          ))}
          {pathD && <>
            <path d={`${pathD} L ${xPos(days.indexOf(points[points.length-1]))} ${H} L ${xPos(days.indexOf(points[0]))} ${H} Z`}
              fill="url(#grad2)" />
            <path d={pathD} fill="none" stroke="#A52A2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>}
          {points.map(d => {
            const idx = days.indexOf(d);
            return (
              <g key={idx}>
                <circle cx={xPos(idx)} cy={yPos(d.value)} r="5" fill={getSliderColor(d.value)} stroke="white" strokeWidth="2" />
                <text x={xPos(idx)} y={yPos(d.value) - 9} textAnchor="middle" fontSize="9" fill={getSliderColor(d.value)} fontWeight="700">{d.value}</text>
              </g>
            );
          })}
          {days.filter((_, i) => activeRange <= 7 || i % Math.ceil(activeRange / 7) === 0).map(d => {
            const idx = days.indexOf(d);
            return (
              <text key={idx} x={xPos(idx)} y={H + 22} textAnchor="middle"
                fontSize="9" fill={d.value ? '#6B5F63' : '#C4B8BC'}>{d.label}</text>
            );
          })}
        </svg>
      )}
    </div>
  );
}

function StageProgress({ stages, currentStage }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>🌱 מסע ההתקדמות שלי</h3>
      <div className={styles.stagesTrack}>
        {stages.map((stage, i) => {
          const done = stage.id < currentStage;
          const active = stage.id === currentStage;
          return (
            <div key={stage.id} className={styles.stageRow}>
              <div className={styles.stageLeft}>
                <div className={`${styles.stageDot} ${done ? styles.stageDotDone : active ? styles.stageDotActive : styles.stageDotFuture}`}>
                  {done ? '✓' : stage.id}
                </div>
                {i < stages.length - 1 && (
                  <div className={`${styles.stageLine} ${done ? styles.stageLineDone : ''}`} />
                )}
              </div>
              <div className={`${styles.stageContent} ${active ? styles.stageContentActive : ''}`}>
                <div className={styles.stageName}>{stage.title}</div>
                {active && <p className={styles.stageDesc}>{stage.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightsSection({ userId }) {
  const storageKey = `ab_insights_${userId}`;
  const [insights, setInsights] = useState(() => {
    const s = localStorage.getItem(storageKey);
    return s ? JSON.parse(s) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');

  function handleAdd() {
    if (!text.trim()) return;
    const newInsight = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    const updated = [newInsight, ...insights];
    setInsights(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setText('');
    setShowForm(false);
  }

  function handleDelete(id) {
    const updated = insights.filter(i => i.id !== id);
    setInsights(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>💡 התובנות שלי</h3>
        <button className={styles.addBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'ביטול' : '+ הוספה'}
        </button>
      </div>

      {showForm && (
        <div className={styles.insightForm}>
          <textarea
            className={styles.insightTextarea}
            placeholder="מה למדת על עצמך? מה הבנת? מה השתנה בך..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            autoFocus
          />
          <button className={styles.saveBtn} onClick={handleAdd} disabled={!text.trim()}>
            שמירה
          </button>
        </div>
      )}

      {insights.length === 0 && !showForm ? (
        <p className={styles.empty}>הוסיפי כאן תובנות שעולות לך במהלך התהליך 🌱</p>
      ) : (
        <div className={styles.insightsList}>
          {insights.map(ins => (
            <div key={ins.id} className={styles.insightItem}>
              <div className={styles.insightBullet}>💡</div>
              <div className={styles.insightBody}>
                <p className={styles.insightText}>{ins.text}</p>
                <span className={styles.insightDate}>{ins.date}</span>
              </div>
              <button className={styles.deleteBtn} onClick={() => handleDelete(ins.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PersonalAreaPage() {
  const { currentUser, stages, logout } = useApp();
  const currentStage = currentUser?.currentStage ?? 1;
  const currentStageData = stages.find(s => s.id === currentStage);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.avatar}>{currentUser?.name?.[0]}</div>
        <h2 className={styles.heroName}>{currentUser?.name}</h2>
        <div className={styles.heroStage}>שלב {currentStage} — {currentStageData?.title}</div>
        {currentUser?.joinDate && (
          <div className={styles.heroJoin}>איתנו מאז {new Date(currentUser.joinDate).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</div>
        )}
      </div>

      <div className={styles.content}>
        <StageProgress stages={stages} currentStage={currentStage} />
        <AnxietyGraph userId={currentUser?.id} />
        <InsightsSection userId={currentUser?.id} />

        <button className={styles.logoutBtn} onClick={logout}>
          יציאה מהמערכת
        </button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
