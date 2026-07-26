'use client';

import { useState, useEffect, useRef } from 'react';
import CurvedFilmstrip from '@/app/components/gallery/CurvedFilmstrip';
import GalleryPreview from '@/app/components/gallery/GalleryPreview';
import CarouselView from '@/app/components/gallery/CarouselView';
import Navigation from '@/app/components/Navigation';
import styles from './GalleryPage.module.scss';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'curved' | 'carousel'>('curved');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // ── Timer ref to avoid leaking setTimeout on unmount ──────────────────────
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showActionMessage = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setActionMessage(msg);
    toastTimerRef.current = setTimeout(() => setActionMessage(null), 3000);
  };

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ── Delete handler — fixed stale closure bug ───────────────────────────────
  const handleDeletePhoto = async (key: string) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch(`/api/photos?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to delete photo');
        return;
      }
      showActionMessage('Photo deleted successfully');
      // Derive new index inside setPhotos so we always reference the latest array
      setPhotos((prev) => {
        const next = prev.filter((p) => p !== key);
        setSelectedIndex((idx) => (idx >= next.length ? Math.max(0, next.length - 1) : idx));
        return next;
      });
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

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (err) {
        console.error('Failed to load photos:', err);
        setError('Could not load photos. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────────────────
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

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingPulse}>Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingState}>
        <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
          style={{
            padding: '10px 24px', borderRadius: '50px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', cursor: 'pointer', fontSize: '0.9rem',
          }}
        >
          Retry
        </button>
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
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          {actionMessage}
        </div>
      )}

      {/* Navigation */}
      <Navigation
        title="Santhosh & Ambika"
        isGallery={true}
        viewMode={viewMode}
        setViewMode={(mode: string) => setViewMode(mode as 'carousel' | 'curved')}
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
                    src={`/api/image?key=${encodeURIComponent(photoKey)}&thumb=true`}
                    alt={`Thumbnail ${index + 1}`}
                    className={styles.mobileThumbImg}
                    loading="lazy"
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
