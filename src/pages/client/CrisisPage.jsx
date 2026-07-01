import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../../emailConfig';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './CrisisPage.module.css';

const STEPS = [
  {
    id: 'trigger',
    num: 1,
    icon: '⚡',
    title: 'מה הטריגר?',
    subtitle: 'מה קרה שגרם לך להרגיש ככה? תארי את הסיטואציה.',
    placeholder: 'לדוגמא: הוא לא ענה להודעה שלי כבר שעתיים...',
  },
  {
    id: 'thoughts',
    num: 2,
    icon: '💭',
    title: 'מה המחשבות?',
    subtitle: 'אילו מחשבות עולות לך עכשיו? ללא שיפוטיות — כתבי הכל.',
    placeholder: 'לדוגמא: אולי הוא כועס עליי, אולי הוא מתחרט...',
  },
  {
    id: 'body',
    num: 3,
    icon: '🫐',
    title: 'מה הרגשת בגוף?',
    subtitle: 'שימי לב לגוף שלך — מה את מרגישה פיזית עכשיו?',
    placeholder: 'לדוגמא: לב דופק מהר, צמרמורת, בטן קשה...',
  },
  {
    id: 'reaction',
    num: 4,
    icon: '🔄',
    title: 'איך הגבת?',
    subtitle: 'מה עשית? פנימית — ומה עשית בפועל?',
    placeholder: 'לדוגמא: שלחתי עוד הודעה, בדקתי את הסטטוס שלו שוב ושוב...',
  },
];

export default function CrisisPage() {
  const { sendCrisisReport } = useApp();
  const [answers, setAnswers] = useState({ trigger: '', thoughts: '', body: '', reaction: '' });
  const [step, setStep] = useState(0);
  const [talkSent, setTalkSent] = useState(false);
  const [sending, setSending] = useState(false);

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }

  function handleNext() {
    if (step < STEPS.length) setStep(s => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }

  async function handleTalk() {
    setSending(true);
    try {
      await sendCrisisReport(answers);
      if (EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        await emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.templateId,
          {
            to_email: EMAIL_CONFIG.toEmail,
            trigger:  answers.trigger,
            thoughts: answers.thoughts,
            body:     answers.body,
            reaction: answers.reaction,
          },
          EMAIL_CONFIG.publicKey
        );
      }
      setTalkSent(true);
    } catch {
      alert('שגיאה בשליחה — נסי שוב');
    } finally {
      setSending(false);
    }
  }

  if (step === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.intro}>
          <div className={styles.introIcon}>🤗</div>
          <h2 className={styles.introTitle}>את לא לבד</h2>
          <p className={styles.introText}>
            אני כאן איתך. בואי נעבור יחד על מה שקרה, צעד אחר צעד.
            זה יעזור לך להתבהר ולהרגיש טוב יותר.
          </p>
          <button className={styles.startBtn} onClick={() => setStep(1)}>
            בואי נתחיל ←
          </button>
        </div>
      </div>
    );
  }

  if (step === STEPS.length + 1) {
    return (
      <div className={styles.page}>
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>💜</div>
          <h2 className={styles.doneTitle}>תודה שסיפרת לי</h2>
          <p className={styles.doneText}>
            אמירת הדברים — גם בכתב — היא כבר צעד אמיץ ומרפא.
            את לא צריכה להתמודד עם זה לבד.
          </p>

          <div className={styles.summary}>
            {STEPS.map(s => answers[s.id] && (
              <div key={s.id} className={styles.summaryItem}>
                <span className={styles.summaryIcon}>{s.icon}</span>
                <div>
                  <div className={styles.summaryLabel}>{s.title}</div>
                  <div className={styles.summaryText}>{answers[s.id]}</div>
                </div>
              </div>
            ))}
          </div>

          {!talkSent ? (
            <div className={styles.actions}>
              <button className={styles.talkBtn} onClick={handleTalk} disabled={sending}>
                {sending ? 'שולחת...' : '💬 אני רוצה לדבר עם מזל'}
              </button>
              <p className={styles.talkNote}>מזל תקבל את הסיכום ותחזור אלייך בהקדם</p>
            </div>
          ) : (
            <div className={styles.sentBox}>
              <span className={styles.sentIcon}>✅</span>
              <p className={styles.sentText}>מזל קיבלה את הפנייה שלך ותחזור אלייך בקרוב 💜</p>
            </div>
          )}

          <button className={styles.restartBtn} onClick={() => { setStep(0); setTalkSent(false); }}>
            סיימתי — חזרה להתחלה
          </button>
        </div>
      </div>
    );
  }

  const current = STEPS[step - 1];
  const progress = step / STEPS.length;

  return (
    <div className={styles.page}>
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>
        <span className={styles.progressLabel}>שלב {step} מתוך {STEPS.length}</span>
      </div>

      <div className={styles.stepCard}>
        <div className={styles.stepNum}>{current.icon}</div>
        <h2 className={styles.stepTitle}>{current.title}</h2>
        <p className={styles.stepSubtitle}>{current.subtitle}</p>

        <textarea
          className={styles.textarea}
          placeholder={current.placeholder}
          value={answers[current.id]}
          onChange={e => setAnswer(current.id, e.target.value)}
          rows={5}
          autoFocus
        />

        <div className={styles.btnRow}>
          {step > 1 && (
            <button className={styles.backBtn} onClick={handleBack}>← חזרה</button>
          )}
          <button
            className={styles.nextBtn}
            onClick={step === STEPS.length ? () => setStep(STEPS.length + 1) : handleNext}
          >
            {step === STEPS.length ? 'סיום ←' : 'הבא ←'}
          </button>
        </div>
      </div>

      <div className={styles.tip}>
        <p className={styles.tipText}>
          💨 נשמי עמוק לפני שאת עונה — שאיפה 4 שניות, עצירה 4, נשיפה 6
        </p>
      </div>
    </div>
  );
}
