'use client';

import { motion } from 'framer-motion';
import styles from './CurvedFilmstrip.module.scss';

interface CurvedFilmstripProps {
  photos: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function CurvedFilmstrip({ photos, selectedIndex, onSelect }: CurvedFilmstripProps) {
  const emojis = ['💖', '✨', '📸', '🎉', '🥂', '💍', '💌'];

  const radius = 800;   // Large radius for a gentle curve
  const centerX = 950;  // Shifted right so centerX - radius = 150px (visible)

  return (
    <div className={styles.container}>
      <div className={styles.inner}>

        {/* Background Dark Arc — dynamic size stays inline */}
        <div
          className={styles.darkArc}
          style={{
            width: radius * 2,
            height: radius * 2,
            left: centerX - radius,
            top: '50%',
            transform: 'translateY(-50%)',
            boxShadow: 'inset -20px 0 50px rgba(0,0,0,0.8)',
          }}
        />

        {/* Photos & Icons */}
        {photos.map((photoKey, index) => {
          const offset = index - selectedIndex;
          const angleDeg = offset * 12;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = centerX - (radius * Math.cos(angleRad));
          const y = radius * Math.sin(angleRad);

          if (Math.abs(offset) > 10) return null;

          return (
            <motion.div
              key={photoKey}
              className={styles.thumb}
              style={{
                left: x - 60,
                top: `calc(50% + ${y}px)`,
                transform: `translateY(-50%) rotate(${angleDeg}deg)`,
                zIndex: offset === 0 ? 10 : 1,
              }}
              onClick={() => onSelect(index)}
              initial={false}
              animate={{
                scale: offset === 0 ? 1.2 : 0.9,
                opacity: Math.abs(offset) > 5 ? 0 : 1 - (Math.abs(offset) * 0.15),
              }}
            >
              {/* Photo Thumbnail */}
              <div className={`${styles.thumbFrame} ${offset === 0 ? styles['thumbFrame--active'] : ''}`}>
                <img
                  src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                  alt={`Thumbnail ${index}`}
                  className={styles.thumbImg}
                />
              </div>

              {/* Emoji on the inner curve */}
              {Math.abs(offset) < 5 && (
                <div
                  className={styles.emoji}
                  style={{ filter: offset === 0 ? 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' : 'none' }}
                >
                  {emojis[index % emojis.length]}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Vertical Slider for Drag Navigation */}
      <div className={styles.sliderWrap}>
        <input
          type="range"
          min={0}
          max={photos.length > 0 ? photos.length - 1 : 0}
          value={selectedIndex}
          onChange={(e) => onSelect(parseInt(e.target.value))}
          className={styles.slider}
        />
      </div>
    </div>
  );
}
