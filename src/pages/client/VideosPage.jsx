import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './VideosPage.module.css';

export default function VideosPage() {
  const { videos } = useApp();
  const [selected, setSelected] = useState(null);
  const [filterCat, setFilterCat] = useState('הכל');

  const categories = ['הכל', ...new Set(videos.map(v => v.category))];
  const filtered = filterCat === 'הכל' ? videos : videos.filter(v => v.category === filterCat);

  if (selected) {
    return <VideoPlayer video={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>ספריית וידאו</h2>
        <p className={styles.pageSubtitle}>סרטוני העשרה ממזל</p>
      </div>

      <div className={styles.cats}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.catBtn} ${filterCat === cat ? styles.catActive : ''}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎬</div>
          <p>אין סרטונים עדיין</p>
          <span>מזל תעלה סרטונים בקרוב ✨</span>
        </div>
      )}

      <div className={styles.grid}>
        {filtered.map(video => (
          <button key={video.id} className={styles.videoCard} onClick={() => setSelected(video)}>
            <div className={styles.thumb}>
              <span className={styles.playBtn}>▶</span>
            </div>
            <div className={styles.videoInfo}>
              <div className={styles.videoTitle}>{video.title}</div>
              <div className={styles.videoMeta}>
                <span className={styles.catTag}>{video.category}</span>
                <span className={styles.uploadDate}>
                  {new Date(video.uploadDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function VideoPlayer({ video, onBack }) {
  return (
    <div className={styles.playerPage}>
      <div className={styles.playerHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          ← חזרה לספרייה
        </button>
      </div>
      <div className={styles.videoWrap}>
        <iframe
          src={video.url}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
      <div className={styles.playerInfo}>
        <span className={styles.catTag}>{video.category}</span>
        <h3 className={styles.playerTitle}>{video.title}</h3>
        <p className={styles.playerDesc}>{video.description}</p>
      </div>
    </div>
  );
}
