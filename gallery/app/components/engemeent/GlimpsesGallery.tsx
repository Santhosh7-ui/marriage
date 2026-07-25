'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    // Title entrance
    gsap.fromTo('.glimpses-title',
      { opacity: 0, y: 50, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: '.glimpses-title', start: 'top 85%', toggleActions: 'play none none none' } }
    );

    gsap.fromTo('.glimpses-ornament',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.glimpses-ornament', start: 'top 88%', toggleActions: 'play none none none' } }
    );

    // Cards stagger — left column slides from left, right column from right
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
    <div
      ref={sectionRef}
      className="w-full bg-[#080808] my-16 py-28 px-4 sm:px-10 lg:px-20 xl:px-32 2xl:px-48 flex flex-col items-center relative overflow-hidden border-t border-b border-white/5"
    >
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.07]"
        style={{ background: 'radial-gradient(ellipse at center top, #d4af37, transparent 70%)' }} />

      {/* Section header */}
      <div className="relative z-10 text-center mb-20">
        <p className="text-[#d4af37]/50 tracking-[0.45em] uppercase text-xs font-semibold mb-4">
          A Sneak Peek
        </p>
        <h2 className="glimpses-title font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#d4af37] tracking-[0.08em] mb-5">
          Glimpses of Forever
        </h2>
        <p className="text-white/35 tracking-[0.22em] uppercase text-xs sm:text-sm">
          Captured moments from our wedding album
        </p>
        {/* Ornament line */}
        <div className="glimpses-ornament flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-[#d4af37]/55" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" opacity="0.75">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-[#d4af37]/55" />
        </div>
      </div>

      {/* 2-column grid — no aspect-ratio crop, photos show full height */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 w-full max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px]">
        {GALLERY_PAGES.map((pageNum, i) => (
          <div
            key={pageNum}
            className="glimpse-card group cursor-pointer relative p-[10px] lg:p-[14px] xl:p-[18px] bg-[#0e0c0a]"
            style={{
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              border: '1px solid rgba(212,175,55,0.18)',
            }}
            onClick={() => router.push('/album')}
          >
            {/* Geometric corner brackets */}
            <CornerBrackets />

            {/* Inner thin gold border */}
            <div className="absolute inset-[10px] border border-[#d4af37]/10 pointer-events-none z-20" />

            {/* Photo — no fixed aspect ratio, shows full image naturally */}
            <div className="relative overflow-hidden">
              <img
                src={`/api/image?key=album/page_${String(pageNum).padStart(3, '0')}.jpg`}
                alt={`Wedding Moment ${pageNum}`}
                className="w-full h-auto object-contain block transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
                loading="lazy"
              />

              {/* Subtle vignette */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)' }} />

              {/* Hover reveal */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6">
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="w-6 h-px bg-[#d4af37]/70 mb-3" />
                  <span className="block text-white/45 text-[10px] tracking-[0.4em] uppercase">
                    Santhosh &amp; Ambika
                  </span>
                </div>
              </div>
            </div>

            {/* Page number tag — bottom right outside */}
            <div className="absolute -bottom-3 -right-3 z-30 bg-[#080808] border border-[#d4af37]/30 px-2 py-0.5">
              <span className="text-[#d4af37]/60 text-[9px] tracking-[0.3em] font-semibold uppercase">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-32 mb-8 relative z-10 flex flex-col items-center gap-5">
        <button
          onClick={() => router.push('/album')}
          className="btn-3d text-base sm:text-lg px-12 py-5 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          Explore Full Album
        </button>
        <p className="text-white/20 text-[10px] tracking-[0.35em] uppercase">48 memories await</p>
      </div>

      {/* Bottom ornament */}
      <div className="flex items-center justify-center gap-4 mt-16 opacity-25">
        <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#d4af37]" />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#d4af37">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#d4af37]" />
      </div>
    </div>
  );
}
