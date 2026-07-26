'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './GalleryPreview.module.scss';

interface GalleryPreviewProps {
  photoKey: string;
  title: string;
  date: string;
  totalPhotos: number;
  onDelete?: (key: string) => void;
  onFavorite?: (key: string) => void;
}

export default function GalleryPreview({ photoKey, title, date, totalPhotos, onDelete, onFavorite }: GalleryPreviewProps) {
  return (
    <div className={styles.container}>

      {/* Main Image View */}
      <div className={styles.maxWrap}>

        {/* The Big Selected Photo */}
        <div className={styles.photoCol}>
          <div className={styles.photoInner}>
            <AnimatePresence mode="wait">
              <motion.div
                key={photoKey}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={styles.photoCard}
              >
                <img
                  src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                  alt={title}
                  className={styles.photo}
                />

                {/* Photo Number Overlay */}
                <div className={styles.badge}>
                  {title} • {totalPhotos} Fotos
                </div>

                {/* Action Buttons (Removed as requested) */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
