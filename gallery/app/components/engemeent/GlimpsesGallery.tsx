'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './GlimpsesGallery.module.scss';

// All pages shown, full natural height — 2 per row
const GALLERY_PAGES = [1, 4, 7, 10, 14, 18, 22, 25, 28, 31, 36, 40];

// Corner bracket SVG frame — geometric L-bracket style, gold
function CornerBrackets() {
  const size = 36;
  const thick = 4;
  const thin = 1.5;
  const arm = 18;

  return (
    <>
      {/* Top-left */}
      <svg style={{ position: 'absolute', top: -2, left: -2, width: size, height: size, zIndex: 30, pointerEvents: 'none' }} viewBox={`0 0 ${size} ${size}`} fill="none">
        <rect x="0" y="0" width={thick} height={arm} fill="#d4af37" opacity="0.9" />
        <rect x="0" y="0" width={arm} height={thick} fill="#d4af37" opacity="0.9" />
        <line x1={thick + 2} y1={thick / 2} x2={size - 2} y2={thick / 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
        <line x1={thick / 2} y1={thick + 2} x2={thick / 2} y2={size - 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
      </svg>
      {/* Top-right */}
      <svg style={{ position: 'absolute', top: -2, right: -2, width: size, height: size, zIndex: 30, pointerEvents: 'none', transform: 'scaleX(-1)' }} viewBox={`0 0 ${size} ${size}`} fill="none">
        <rect x="0" y="0" width={thick} height={arm} fill="#d4af37" opacity="0.9" />
        <rect x="0" y="0" width={arm} height={thick} fill="#d4af37" opacity="0.9" />
        <line x1={thick + 2} y1={thick / 2} x2={size - 2} y2={thick / 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
        <line x1={thick / 2} y1={thick + 2} x2={thick / 2} y2={size - 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
      </svg>
      {/* Bottom-left */}
      <svg style={{ position: 'absolute', bottom: -2, left: -2, width: size, height: size, zIndex: 30, pointerEvents: 'none', transform: 'scaleY(-1)' }} viewBox={`0 0 ${size} ${size}`} fill="none">
        <rect x="0" y="0" width={thick} height={arm} fill="#d4af37" opacity="0.9" />
        <rect x="0" y="0" width={arm} height={thick} fill="#d4af37" opacity="0.9" />
        <line x1={thick + 2} y1={thick / 2} x2={size - 2} y2={thick / 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
        <line x1={thick / 2} y1={thick + 2} x2={thick / 2} y2={size - 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
      </svg>
      {/* Bottom-right */}
      <svg style={{ position: 'absolute', bottom: -2, right: -2, width: size, height: size, zIndex: 30, pointerEvents: 'none', transform: 'scale(-1)' }} viewBox={`0 0 ${size} ${size}`} fill="none">
        <rect x="0" y="0" width={thick} height={arm} fill="#d4af37" opacity="0.9" />
        <rect x="0" y="0" width={arm} height={thick} fill="#d4af37" opacity="0.9" />
        <line x1={thick + 2} y1={thick / 2} x2={size - 2} y2={thick / 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
        <line x1={thick / 2} y1={thick + 2} x2={thick / 2} y2={size - 2} stroke="#d4af37" strokeWidth={thin} opacity="0.45" />
      </svg>
    </>
  );
}

export default function GlimpsesGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title entrance — targets global .glimpses-title class
    gsap.fromTo('.glimpses-title',
      { opacity: 0, y: 50, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: '.glimpses-title', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.glimpses-ornament',
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1, opacity: 1, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.glimpses-ornament', start: 'top 88%', toggleActions: 'play none none none' }
      }
    );

    // Cards stagger — targets global .glimpse-card class
    const cards = sectionRef.current?.querySelectorAll('.glimpse-card');
    cards?.forEach((card, i) => {
      const fromX = i % 2 === 0 ? -60 : 60;
      gsap.fromTo(card,
        { opacity: 0, x: fromX, y: 40 },
        {
          opacity: 1, x: 0, y: 0, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          delay: (Math.floor(i / 2) % 2) * 0.12,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div ref={sectionRef} className={styles.section}>
      {/* Ambient gold glow */}
      <div className={styles.ambientGlow} />

      {/* Section header */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>A Sneak Peek</p>
        {/* glimpses-title is a global GSAP-targeted class */}
        <h2 className="glimpses-title">Glimpses of Forever</h2>
        <p className={styles.subtitle}>Captured moments from our wedding album</p>

        {/* glimpses-ornament is a global GSAP-targeted class */}
        <div className="glimpses-ornament">
          <div className={styles.ornamentLine} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" opacity="0.75">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <div className={`${styles.ornamentLine} ${styles['ornamentLine--right']}`} />
        </div>
      </div>

      {/* 2-column grid — glimpse-card is a global GSAP-targeted class */}
      <div className={styles.grid}>
        {GALLERY_PAGES.map((pageNum, i) => (
          <div
            key={pageNum}
            className="glimpse-card"
            onClick={() => router.push('/album')}
          >
            {/* Geometric corner brackets */}
            <CornerBrackets />

            {/* Inner thin gold border */}
            <div className={styles.innerBorder} />

            {/* Photo — no fixed aspect ratio */}
            <div className={styles.photoWrap}>
              <img
                src={`/api/image?key=album/page_${String(pageNum).padStart(3, '0')}.jpg`}
                alt={`Wedding Moment ${pageNum}`}
                className={styles.photo}
                loading="lazy"
              />

              {/* Subtle vignette */}
              <div className={styles.vignette} />

              {/* Hover reveal */}
              <div className={styles.hoverReveal}>
                <div className={styles.hoverContent}>
                  <div className={styles.hoverLine} />
                  <span className={styles.hoverLabel}>Santhosh &amp; Ambika</span>
                </div>
              </div>
            </div>

            {/* Page number tag */}
            <div className={styles.pageTag}>
              <span className={styles.pageTagLabel}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <button
          onClick={() => router.push('/album')}
          className="btn-3d text-base sm:text-lg px-12 py-5 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          Explore Full Album
        </button>
        <p className={styles.ctaHint}>48 memories await</p>
      </div>

      {/* Bottom ornament */}
      <div className={styles.bottomOrnament}>
        <div className={styles.bottomLine} />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#d4af37">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <div className={`${styles.bottomLine} ${styles['bottomLine--right']}`} />
      </div>
    </div>
  );
}
