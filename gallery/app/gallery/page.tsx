'use client';

import { useState, useEffect } from 'react';
import CurvedFilmstrip from '@/app/components/gallery/CurvedFilmstrip';
import GalleryPreview from '@/app/components/gallery/GalleryPreview';
import CarouselView from '@/app/components/gallery/CarouselView';
import Navigation from '@/app/components/Navigation';
import styles from './GalleryPage.module.scss';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'curved' | 'carousel'>('curved');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showActionMessage = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDeletePhoto = async (key: string) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch(`/api/photos?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (res.ok) {
        showActionMessage('Photo deleted successfully');
        setPhotos(prev => prev.filter(p => p !== key));
        // Adjust selectedIndex if the deleted photo is the last one or earlier
        setSelectedIndex(prev => (prev >= photos.length - 1 ? Math.max(0, photos.length - 2) : prev));
      } else {
        alert('Failed to delete photo');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete photo');
    }
  };

  const handleFavoritePhoto = async (key: string) => {
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, action: 'favorite' }),
      });
      if (res.ok) {
        showActionMessage('Added to favorites!');
      } else {
        alert('Failed to favorite photo');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to favorite photo');
    }
  };

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        if (res.ok) {
          const data = await res.json();
          setPhotos(data.photos || []);
        }
      } catch (err) {
        console.error('Failed to load photos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (photos.length === 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingPulse}>Loading gallery...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.loadingState}>
        <p>No photos found in the gallery.</p>
      </div>
    );
  }

  const selectedPhoto = photos[selectedIndex];

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {actionMessage && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)', color: 'white', padding: '12px 24px',
          borderRadius: '50px', zIndex: 1000, backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {actionMessage}
        </div>
      )}

      {/* Navigation */}
      <Navigation
        title="Santhosh & Ambika"
        isGallery={true}
        viewMode={viewMode}
        setViewMode={(mode: any) => setViewMode(mode)}
      />

      {/* Main Content Area */}
      <div className={styles.content}>
        {viewMode === 'carousel' && (
          <CarouselView
            photos={photos}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            onDelete={handleDeletePhoto}
            onFavorite={handleFavoritePhoto}
          />
        )}

        {viewMode === 'curved' && (
          <>
            {/* Desktop Left side: Curved Filmstrip */}
            <CurvedFilmstrip
              photos={photos}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />

            {/* Right side (Desktop) / Top side (Mobile): Preview area */}
            <GalleryPreview
              photoKey={selectedPhoto}
              title={`Memory ${selectedIndex + 1}`}
              date="22 de Agosto 2012"
              totalPhotos={photos.length}
              onDelete={handleDeletePhoto}
              onFavorite={handleFavoritePhoto}
            />

            {/* Mobile Bottom side: Horizontal Filmstrip */}
            <div className={styles.mobileStrip}>
              {photos.map((photoKey, index) => (
                <div
                  key={photoKey}
                  onClick={() => setSelectedIndex(index)}
                  className={`${styles.mobileThumb} ${index === selectedIndex ? styles['mobileThumb--active'] : ''}`}
                >
                  <img
                    src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                    alt={`Thumbnail ${index}`}
                    className={styles.mobileThumbImg}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
