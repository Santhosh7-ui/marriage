'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SocialCarousel.module.scss';

export default function SocialCarousel() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchCarouselPhotos() {
      try {
        const res = await fetch('/api/photos?prefix=carousel/');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (err) {
        console.error('Failed to fetch carousel photos', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCarouselPhotos();
  }, []);

  const handleNext = useCallback(() => {
    if (photos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    if (photos.length > 0) {
      setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }
  }, [photos.length]);

  // Auto-scroll every 1 second
  useEffect(() => {
    if (photos.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // 3 seconds auto-scroll

    return () => clearInterval(interval);
  }, [photos.length, handleNext, isPaused]);

  if (loading) {
    return <div className={styles.carouselWrapper}>Loading...</div>;
  }

  if (photos.length === 0) {
    return <div className={styles.carouselWrapper}>No photos found in carousel/</div>;
  }

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.postCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              {/* Replace with actual avatar URL if available */}
              <img src="/api/image?key=favorites/IMG_20240516_201727.jpg&thumb=true" alt="Avatar" onError={(e) => e.currentTarget.src = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.username}>Santhosh & Ambika</span>
              <span className={styles.location}>Our Wedding Moments</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.followBtn}>Following</button>
            <svg aria-label="More options" className={styles.moreIcon} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="6" cy="12" r="1.5"></circle>
              <circle cx="18" cy="12" r="1.5"></circle>
            </svg>
          </div>
        </div>

        {/* Image Slider */}
        <div 
          className={styles.sliderContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev} aria-label="Previous">
            <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
          </button>
          
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext} aria-label="Next">
            <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
          </button>

          {/* Slide Indicator */}
          <div className={styles.slideIndicator}>
            {currentIndex + 1} / {photos.length}
          </div>

          <div className={styles.sliderTrack}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.slide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <img 
                  src={`/api/image?key=${encodeURIComponent(photos[currentIndex])}`} 
                  alt={`Slide ${currentIndex + 1}`} 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.actionRow}>
            <div className={styles.actionIcons}>
              {/* Like Icon */}
              <svg aria-label="Like" onClick={() => setLiked(!liked)} fill={liked ? '#ed4956' : 'transparent'} stroke={liked ? 'none' : 'currentColor'} strokeWidth={liked ? 0 : 2} height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.14 6.14 0 0 0-4.896 2.479 6.096 6.096 0 0 0-4.9-2.479C3.064 1.904 0 4.887 0 9.122c0 4.417 3.32 6.643 6.18 9.167 2.19 1.93 4.4 3.774 4.82 4.195a1.5 1.5 0 0 0 2 0c.42-.421 2.63-2.265 4.82-4.195C20.68 15.765 24 13.539 24 9.122c0-4.235-3.064-7.218-7.208-7.218Z"></path>
              </svg>
              {/* Comment Icon */}
              <svg aria-label="Comment" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              {/* Share Icon */}
              <svg aria-label="Share Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
              </svg>
            </div>
            {/* Save Icon */}
            <svg aria-label="Save" onClick={() => setSaved(!saved)} fill={saved ? 'currentColor' : 'transparent'} height="24" role="img" viewBox="0 0 24 24" width="24">
              <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
            </svg>
          </div>

          <div className={styles.likes}>
            {liked ? '1,001' : '1,000'} likes
          </div>
          
          <div className={styles.caption}>
            <span className={styles.username}>Santhosh & Ambika</span>
            A glimpse into our beautiful journey together. Swipe through these moments! ✨💍
          </div>
          
          <div className={styles.time}>
            2 HOURS AGO
          </div>
        </div>
      </div>
    </div>
  );
}
