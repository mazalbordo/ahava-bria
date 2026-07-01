import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/initialData';
import styles from './ProgramPage.module.css';

function VideosList({ videos, category, activeTab, onDeepen }) {
  const [playing, setPlaying] = useState(null);
  const showDeepenBtn = activeTab === 'core' && category?.type === 'both';

  if (!videos.length) return (
    <p className={styles.videosEmpty}>אין סרטונים בקטגוריה זו עדיין ✨</p>
  );

  return (
    <div className={styles.videosList}>
      {videos.map(v => (
        <div key={v.id} className={styles.videoItem}>
          {playing === v.id ? (
            <div className={styles.videoEmbed}>
              <iframe src={v.url + '?autoplay=1'} title={v.title}
                frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
              <button className={styles.closeVideo} onClick={() => setPlaying(null)}>✕ סגירה</button>
            </div>
          ) : (
            <button className={styles.videoThumb} onClick={() => setPlaying(v.id)}>
              <div className={styles.thumbPlaceholder}>
                <span className={styles.playIcon}>▶</span>
              </div>
              <div className={styles.videoInfo}>
                <div className={styles.videoTitle}>{v.title}</div>
                {v.description && <div className={styles.videoDesc}>{v.description}</div>}
              </div>
            </button>
          )}
        </div>
      ))}
      {showDeepenBtn && (
        <button className={styles.deepenBtn} onClick={onDeepen}>
          ✨ רוצה להעמיק בנושא?
        </button>
      )}
    </div>
  );
}

export default function ProgramPage() {
  const { currentUser, videos } = useApp();
  const [activeTab, setActiveTab] = useState('core');
  const [activeCategory, setActiveCategory] = useState(null);

  const myVideos = videos.filter(v =>
    v.accessLevel === 'all' || v.accessLevel === currentUser?.id
  );

  const tabVideos = myVideos.filter(v =>
    activeTab === 'core' ? v.contentType !== 'extra' : v.contentType === 'extra'
  );

  const usedCategories = CATEGORIES.filter(c =>
    tabVideos.some(v => v.category === c.id)
  );

  const filteredVideos = activeCategory
    ? tabVideos.filter(v => v.category === activeCategory)
    : tabVideos;

  const activeCategoryObj = activeCategory
    ? CATEGORIES.find(c => c.id === activeCategory)
    : null;

  function handleDeepen() {
    setActiveTab('extra');
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>התוכנית שלי</h2>
        <p className={styles.heroSub}>הסרטונים והתכנים שמזל הכינה עבורך</p>
      </div>

      <div className={styles.mainTabs}>
        <button
          className={`${styles.mainTab} ${activeTab === 'core' ? styles.mainTabActive : ''}`}
          onClick={() => { setActiveTab('core'); setActiveCategory(null); }}
        >
          תוכן ליבה
        </button>
        <button
          className={`${styles.mainTab} ${activeTab === 'extra' ? styles.mainTabActive : ''}`}
          onClick={() => { setActiveTab('extra'); setActiveCategory(null); }}
        >
          ⭐ תוכן העשרה
        </button>
      </div>

      {usedCategories.length > 0 && (
        <div className={styles.categoriesRow}>
          <button
            className={`${styles.categoryChip} ${!activeCategory ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            הכל
          </button>
          {usedCategories.map(c => (
            <button
              key={c.id}
              className={`${styles.categoryChip} ${activeCategory === c.id ? styles.categoryChipActive : ''}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.content}>
        {myVideos.length === 0 ? (
          <p className={styles.videosEmpty}>מזל תעלה סרטונים עבורך בקרוב ✨</p>
        ) : (
          <VideosList
            videos={filteredVideos}
            category={activeCategoryObj}
            activeTab={activeTab}
            onDeepen={handleDeepen}
          />
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
