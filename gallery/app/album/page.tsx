'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HTMLFlipBook from 'react-pageflip';
import Navigation from '@/app/components/Navigation';
import styles from './AlbumPage.module.scss';

// Minimal prop interface for the FlipBook component
interface FlipBookProps {
  width: number;
  height: number;
  size?: 'fixed' | 'stretch';
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  maxShadowOpacity?: number;
  showCover?: boolean;
  mobileScrollSupport?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Cast once with a typed interface instead of `any`
const FlipBook = HTMLFlipBook as unknown as React.ComponentType<FlipBookProps>;

interface PageProps {
  image: string;
  number: number;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    // Removed the duplicate nested div that had the same class
    <div className={styles.flipbookPage} ref={ref} data-density="soft">
      <img
        src={props.image}
        alt={`Page ${props.number}`}
        className={styles.flipbookPageImg}
      />
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbumPages() {
      try {
        const res = await fetch(`/api/photos?prefix=${encodeURIComponent(prefix)}`);
        // Check res.ok before attempting to parse JSON
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setPages(data.photos || []);
      } catch (err) {
        console.error('Failed to fetch album pages', err);
        setError('Could not load album pages. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    }
    fetchAlbumPages();
  }, [prefix]);

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <Navigation title={albumTitle} isGallery={false} />

      {/* Main Content Area */}
      <div className={styles.main}>

        {/* Flipbook Section */}
        <div className={styles.flipbookSection}>
          {loading ? (
            <div className={styles.loadingState}>Opening Album...</div>
          ) : error ? (
            <div className={styles.emptyState} style={{ color: '#ff6b6b' }}>
              {error}
              <br />
              <button
                onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
                style={{
                  marginTop: '1rem', padding: '10px 24px', borderRadius: '50px',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                Retry
              </button>
            </div>
          ) : pages.length === 0 ? (
            <div className={styles.emptyState}>No album pages found.</div>
          ) : (
            <>
              <div className={styles.flipbookWrap}>
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
                    <Page
                      key={photoKey}
                      image={`/api/image?key=${encodeURIComponent(photoKey)}`}
                      number={i + 1}
                    />
                  ))}
                </FlipBook>
              </div>

              {/* Scroll down indicator */}
              <div className={styles.scrollHint}>
                <span>Scroll down for continuous view</span>
                <span className={styles.scrollArrow}>↓</span>
              </div>
            </>
          )}
        </div>

        {/* Continuous Scroll View Section */}
        {!loading && !error && pages.length > 0 && (
          <div className={styles.continuousSection}>
            <div className={styles.continuousHeader}>
              <h2 className={styles.continuousTitle}>Continuous View</h2>
            </div>

            {pages.map((photoKey, i) => (
              <div key={`scroll-${photoKey}`} className={styles.scrollPage}>
                {/* Page Number Indicator */}
                <div className={styles.pageNumber}>{i + 1}</div>

                <img
                  src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                  alt={`Album Page ${i + 1}`}
                  className={styles.scrollPageImg}
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
      <div className={styles.fallback}>Opening Album...</div>
    }>
      <AlbumContent />
    </Suspense>
  );
}
