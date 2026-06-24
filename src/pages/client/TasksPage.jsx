import { useApp } from '../../context/AppContext';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const { currentUser, getClientTasks, toggleTask } = useApp();
  const tasks = getClientTasks(currentUser?.id);

  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>המשימות שלי</h2>
        <p className={styles.pageSubtitle}>
          {done.length} מתוך {tasks.length} הושלמו
        </p>
      </div>

      {tasks.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✅</div>
          <p>אין משימות כרגע</p>
          <span>מזל תוסיף משימות בקרוב ✨</span>
        </div>
      )}

      {pending.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.groupTitle}>לביצוע ({pending.length})</h3>
          {pending.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </section>
      )}

      {done.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.groupTitle}>הושלמו ({done.length})</h3>
          {done.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </section>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle }) {
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })
    : null;

  return (
    <div className={`${styles.card} ${task.completed ? styles.cardDone : ''}`}>
      <button
        className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'בטלי סימון' : 'סמני כהושלם'}
      >
        {task.completed && <span className={styles.checkmark}>✓</span>}
      </button>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{task.title}</div>
        {task.description && <div className={styles.cardDesc}>{task.description}</div>}
        {dueDate && (
          <div className={styles.dueDate}>
            <span className={styles.dueDateIcon}>📆</span>
            {dueDate}
          </div>
        )}
      </div>
    </div>
  );
}
