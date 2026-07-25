'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HTMLFlipBook from 'react-pageflip';
import Navigation from '@/app/components/Navigation';

const FlipBook = HTMLFlipBook as any;

const Page = React.forwardRef((props: any, ref) => {
  return (
    <div className="page" ref={ref as any} data-density="soft">
      <div className="page-content w-full h-full flex items-center justify-center overflow-hidden bg-transparent">
        <img 
          src={props.image} 
          alt={`Page ${props.number}`} 
          className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
        />
      </div>
    </div>
  );
});

Page.displayName = 'Page';

function AlbumContent() {
  const searchParams = useSearchParams();
  const albumType = searchParams.get('type') || 'album';
  const prefix = albumType === 'reception' ? 'reception/' : 'album/';
  const albumTitle = albumType === 'reception' ? 'Reception Album' : 'Wedding Album';

  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbumPages() {
      try {
        const res = await fetch(`/api/photos?prefix=${encodeURIComponent(prefix)}`);
        const data = await res.json();
        setPages(data.photos || []);
      } catch (err) {
        console.error('Failed to fetch album pages', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbumPages();
  }, [prefix]);

  return (
    <div className="w-full h-screen bg-[#0a0a0a] overflow-y-auto overflow-x-hidden flex flex-col relative font-sans text-white">
      {/* Navigation */}
      <Navigation title={albumTitle} isGallery={false} />

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black relative pb-20">
        
        {/* Flipbook Section */}
        <div className="w-full min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
          {loading ? (
            <div className="animate-pulse text-[#d4af37] text-lg tracking-widest font-serif">
              Opening Album...
            </div>
          ) : pages.length === 0 ? (
            <div className="text-gray-400 text-lg tracking-widest">
              No album pages found.
            </div>
          ) : (
            <>
              <div className="w-full max-w-[1200px] aspect-[3/2] flex justify-center items-center p-8 mb-12">
                <FlipBook 
                  width={800} 
                  height={500} 
                  size="stretch"
                  minWidth={400}
                  maxWidth={1200}
                  minHeight={250}
                  maxHeight={750}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="album-flipbook"
                  style={{}}
                >
                  {pages.map((photoKey, i) => (
                    <Page key={photoKey} image={`/api/image?key=${encodeURIComponent(photoKey)}`} number={i + 1} />
                  ))}
                </FlipBook>
              </div>

              {/* Scroll down indicator */}
              <div className="text-gray-500 uppercase tracking-[0.3em] text-xs font-semibold animate-pulse flex flex-col items-center gap-2">
                <span>Scroll down for continuous view</span>
                <span className="text-xl">↓</span>
              </div>
            </>
          )}
        </div>

        {/* Continuous Scroll View Section */}
        {!loading && pages.length > 0 && (
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col items-center gap-12 mt-12">
            <div className="w-full border-t border-gray-800 pt-16 pb-8 text-center">
              <h2 className="text-2xl font-serif text-[#d4af37] tracking-widest">Continuous View</h2>
            </div>
            
            {pages.map((photoKey, i) => (
              <div key={`scroll-${i}`} className="w-full flex flex-col items-center relative group">
                {/* Page Number Indicator */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-gray-700 font-serif text-2xl hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
                  {i + 1}
                </div>
                
                <img 
                  src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                  alt={`Album Page ${i + 1}`}
                  className="w-full h-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-md border border-gray-800"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlbumPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center text-[#d4af37] text-lg tracking-widest font-serif">
        Opening Album...
      </div>
    }>
      <AlbumContent />
    </Suspense>
  );
}
