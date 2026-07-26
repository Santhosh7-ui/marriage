'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HTMLFlipBook from 'react-pageflip';
import Navigation from '@/app/components/Navigation';
import styles from './AlbumPage.module.scss';

const FlipBook = HTMLFlipBook as any;

const Page = React.forwardRef((props: { image: string, number: number }, ref) => {
  return (
    <div className={styles.flipbookPage} ref={ref as any} data-density="soft">
      <div className={styles.flipbookPage}>
        <img
          src={props.image}
          alt={`Page ${props.number}`}
          className={styles.flipbookPageImg}
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
    <div className={styles.page}>
      {/* Navigation */}
      <Navigation title={albumTitle} isGallery={false} />

      {/* Main Content Area */}
      <div className={styles.main}>

        {/* Flipbook Section */}
        <div className={styles.flipbookSection}>
          {loading ? (
            <div className={styles.loadingState}>Opening Album...</div>
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
                    <Page key={photoKey} image={`/api/image?key=${encodeURIComponent(photoKey)}`} number={i + 1} />
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
        {!loading && pages.length > 0 && (
          <div className={styles.continuousSection}>
            <div className={styles.continuousHeader}>
              <h2 className={styles.continuousTitle}>Continuous View</h2>
            </div>

            {pages.map((photoKey, i) => (
              <div key={`scroll-${i}`} className={styles.scrollPage}>
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
