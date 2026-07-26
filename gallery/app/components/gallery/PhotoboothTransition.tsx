'use client';

import React, { useState, useEffect } from 'react';
import styles from './PhotoboothTransition.module.scss';

const PhotoboothTransition = () => {
  const [phase, setPhase] = useState<'idle' | 'dispensing' | 'paused' | 'dropping'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);

  // Fetch favorite photos from R2 on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos?prefix=favorites/');
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          // Convert keys to api/image URLs
          const urls = data.photos.map((key: string) => `/api/image?key=${encodeURIComponent(key)}&thumb=true`);
          setPhotos(urls);
        } else {
          // Fallback if no favorites are found
          setPhotos(['/api/image?key=album/page_001.jpg']);
        }
      } catch (e) {
        console.error('Failed to fetch favorite photos:', e);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    if (phase === 'idle') {
      const timer = setTimeout(() => setPhase('dispensing'), 500);
      return () => clearTimeout(timer);
    } else if (phase === 'dispensing') {
      const timer = setTimeout(() => setPhase('paused'), 1000); // 1 sec to slide out
      return () => clearTimeout(timer);
    } else if (phase === 'paused') {
      const timer = setTimeout(() => setPhase('dropping'), 3000); // wait 3 sec
      return () => clearTimeout(timer);
    } else if (phase === 'dropping') {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setPhase('idle');
      }, 800); // tear off drop time
      return () => clearTimeout(timer);
    }
  }, [phase, photos.length]);

  return (
    <div className={styles.container}>
      {/* Booth UI */}
      <div className={styles.boothUi}>
        <div className={styles.dispenserSign}>
          <h2>Mrs. &amp; Mr.</h2>
          <p>Photos delivered here<br/>in 4 minutes</p>
          <div className={styles.arrow}></div>
        </div>

        <div className={styles.slotContainer}>
          <div className={styles.slotOpening}></div>
          
          <div className={styles.photoStripWrapper}>
            {photos.length > 0 && (
              <div className={`${styles.photoWrapper} ${
                phase === 'dispensing' ? styles.dispensing :
                phase === 'paused' ? styles.paused :
                phase === 'dropping' ? styles.dropping : ''
              }`}>
                <div 
                  className={styles.photoImage} 
                  style={{ background: `url(${photos[currentIndex]}) center/cover` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoboothTransition;
