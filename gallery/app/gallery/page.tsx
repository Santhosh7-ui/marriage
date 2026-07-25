'use client';

import { useState, useEffect } from 'react';
import CurvedFilmstrip from '@/app/components/gallery/CurvedFilmstrip';
import GalleryPreview from '@/app/components/gallery/GalleryPreview';
import CarouselView from '@/app/components/gallery/CarouselView';
import Navigation from '@/app/components/Navigation';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'curved' | 'carousel'>('curved');

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
      <div className="w-full h-screen bg-[#111] flex items-center justify-center text-white">
        <div className="animate-pulse">Loading gallery...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="w-full h-screen bg-[#111] flex items-center justify-center text-white">
        <p>No photos found in the gallery.</p>
      </div>
    );
  }

  const selectedPhoto = photos[selectedIndex];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] overflow-hidden flex flex-col relative font-sans text-white">

      {/* Navigation */}
      <Navigation
        title="Santhosh & Ambika"
        isGallery={true}
        viewMode={viewMode}
        setViewMode={(mode: any) => setViewMode(mode)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative w-full h-full pt-16">
        {viewMode === 'carousel' && (
          <CarouselView
            photos={photos}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
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
            />

            {/* Mobile Bottom side: Horizontal Filmstrip */}
            <div className="md:hidden w-full h-[120px] bg-black/60 flex items-center overflow-x-auto px-4 gap-4 pb-6 pt-2 snap-x shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-30">
              {photos.map((photoKey, index) => (
                <div
                  key={photoKey}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-[80px] h-[60px] flex-shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer snap-center
                    ${index === selectedIndex ? 'border-blue-400 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent opacity-60'}`}
                >
                  <img
                    src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover"
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
