'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './CarouselView.module.scss';

interface CarouselViewProps {
  photos: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onDelete?: (key: string) => void;
  onFavorite?: (key: string) => void;
}

export default function CarouselView({ photos, selectedIndex, onSelect, onDelete, onFavorite }: CarouselViewProps) {
  return (
    <div
      className={styles.container}
      style={{ perspective: '1200px' }}
    >
      <AnimatePresence>
        {photos.map((photoKey, index) => {
          // Calculate shortest path for circular carousel
          let diff = index - selectedIndex;
          const half = Math.floor(photos.length / 2);

          if (diff > half) diff -= photos.length;
          if (diff < -half) diff += photos.length;

          const absOffset = Math.abs(diff);

          if (absOffset > 4) return null;

          const isCenter = diff === 0;
          const direction = Math.sign(diff);

          const baseTranslateX = 220;
          const baseTranslateZ = -150;

          let x = 0;
          if (!isCenter) {
            x = direction * (baseTranslateX + (absOffset - 1) * 120);
          }

          const z = isCenter ? 0 : baseTranslateZ * absOffset;
          const rotateY = isCenter ? 0 : direction * -20;
          const opacity = isCenter ? 1 : Math.max(0, 1 - absOffset * 0.25);
          const zIndex = 100 - absOffset;

          return (
              <motion.div
                key={index}
                className={styles.card}
                style={{
                  width: 'clamp(300px, 35vw, 460px)',
                  height: 'clamp(480px, 65vh, 760px)',
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ x, z, rotateY, opacity, scale: isCenter ? 1 : 0.95 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'tween', duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => onSelect(index)}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  const swipe = offset.x;
                  if (swipe < -50) {
                    onSelect((index + 1) % photos.length);
                  } else if (swipe > 50) {
                    onSelect((index - 1 + photos.length) % photos.length);
                  }
                }}
              >
              {/* Dimmer overlay for inactive items */}
              {!isCenter && <div className={styles.dimmer} />}

              <img
                src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                alt={`Gallery ${index}`}
                className={styles.photo}
                draggable={false}
                loading={isCenter ? "eager" : "lazy"}
              />

              {/* Optional: Number Badge */}
              <div className={styles.numberBadge}>
                {index + 1} / {photos.length}
              </div>

              {/* Action Buttons (Removed as requested) */}

              {/* Details Overlay (Only active card) */}
              {isCenter && (
                <div className={styles.detailsOverlay}>
                  <h3 className={styles.detailsTitle}>
                    {photoKey.split('/').pop()?.split('.').shift()?.replace(/_/g, ' ') || 'Wedding Moment'}
                  </h3>
                  <p className={styles.detailsSubtitle}>
                    Santhosh &amp; Ambika
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Slider at the bottom */}
      <div className={styles.sliderWrap}>
        <input
          type="range"
          min={0}
          max={photos.length - 1}
          value={selectedIndex}
          onChange={(e) => onSelect(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
    </div>
  );
}
