import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './ProgramPage.module.css';

function ProgramVideos({ videos }) {
  const [playing, setPlaying] = useState(null);

  if (!videos.length) return (
    <div className={styles.videosCard}>
      <h3 className={styles.cardTitle}>🎬 הסרטונים שלי</h3>
      <p className={styles.videosEmpty}>מזל תעלה סרטונים עבורך בקרוב ✨</p>
    </div>
  );

  return (
    <div className={styles.videosCard}>
      <h3 className={styles.cardTitle}>🎬 הסרטונים שלי</h3>
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
                  <div className={styles.videoMeta}>
                    <span className={styles.videoCat}>{v.category}</span>
                    <span className={styles.videoDate}>{v.uploadDate}</span>
                  </div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgramPage() {
  const { currentUser, videos } = useApp();
  const myVideos = videos.filter(v => v.accessLevel === 'all' || v.accessLevel === currentUser?.id);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>התוכנית שלי</h2>
        <p className={styles.heroSub}>הסרטונים והתכנים שמזל הכינה עבורך</p>
      </div>
      <div className={styles.content}>
        <ProgramVideos videos={myVideos} />
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
