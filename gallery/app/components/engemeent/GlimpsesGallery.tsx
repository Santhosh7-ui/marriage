'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GALLERY_ITEMS = [
  { pageNum: 1,  size: 'portrait',   label: 'Two Hearts Begin' },
  { pageNum: 4,  size: 'landscape',  label: 'Blessed Moments' },
  { pageNum: 7,  size: 'square',     label: 'A Sacred Promise' },
  { pageNum: 10, size: 'portrait',   label: 'Eternal Love' },
  { pageNum: 14, size: 'landscape',  label: 'Family & Joy' },
  { pageNum: 18, size: 'square',     label: 'Golden Memories' },
  { pageNum: 22, size: 'portrait',   label: 'Together Forever' },
  { pageNum: 25, size: 'landscape',  label: 'A New Chapter' },
  { pageNum: 28, size: 'square',     label: 'Timeless Bonds' },
];

export default function GlimpsesGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const frames = sectionRef.current?.querySelectorAll('.glimpse-frame');
    if (!frames) return;

    gsap.fromTo('.glimpses-title',
      { opacity: 0, y: 60, filter: 'blur(8px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.glimpses-title', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.glimpses-subtitle',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.glimpses-subtitle', start: 'top 88%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.glimpses-ornament',
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1, opacity: 1, duration: 1.2, delay: 0.4,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.glimpses-ornament', start: 'top 90%', toggleActions: 'play none none none' }
      }
    );

    frames.forEach((frame, i) => {
      const col = i % 3;
      const fromY = 80 + (i % 2) * 30;
      const fromX = col === 0 ? -40 : col === 2 ? 40 : 0;
      const initRotate = col === 0 ? -2 : col === 2 ? 2 : 0;

      gsap.fromTo(frame,
        { opacity: 0, y: fromY, x: fromX, scale: 0.88, rotateZ: initRotate },
        {
          opacity: 1, y: 0, x: 0, scale: 1, rotateZ: 0,
          duration: 1.1 + (i % 3) * 0.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: frame, start: 'top 88%', toggleActions: 'play none none none' },
          delay: (i % 3) * 0.08,
        }
      );

      const shine = (frame as HTMLElement).querySelector('.frame-shine');
      if (shine) {
        ScrollTrigger.create({
          trigger: frame,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(shine,
              { x: '-120%', opacity: 0.6 },
              { x: '120%', opacity: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.6 }
            );
          },
        });
      }
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="glimpses-section w-full bg-[#080808] py-28 px-4 sm:px-8 flex flex-col items-center relative overflow-hidden border-t border-white/5"
    >
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(ellipse, #d4af37 0%, transparent 70%)' }} />

      <div className="relative z-10 text-center mb-20">
        <p className="glimpses-subtitle text-[#d4af37]/60 tracking-[0.4em] uppercase text-xs font-semibold mb-5">
          A Sneak Peek
        </p>
        <h2 className="glimpses-title font-serif text-4xl sm:text-6xl text-[#d4af37] tracking-[0.08em] mb-6">
          Glimpses of Forever
        </h2>
        <p className="glimpses-subtitle text-white/40 tracking-[0.2em] uppercase text-sm">
          Captured moments from our wedding album
        </p>
        <div className="glimpses-ornament flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#d4af37" opacity="0.8">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
        </div>
      </div>

      <div className="glimpses-grid columns-1 sm:columns-2 lg:columns-3 gap-7 w-full max-w-[1320px]">
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={item.pageNum}
            className="glimpse-frame break-inside-avoid mb-7 group cursor-pointer relative"
            onClick={() => router.push('/album')}
          >
            <div className="glimpse-outer-frame relative">
              <div className="absolute inset-0 border border-[#d4af37]/25 pointer-events-none z-20" />
              <div className="absolute inset-[6px] border border-[#d4af37]/10 pointer-events-none z-20" />

              {(['tl','tr','bl','br'] as const).map(pos => (
                <svg
                  key={pos}
                  className="corner-ornament absolute z-30 pointer-events-none"
                  style={{
                    width: 32, height: 32,
                    top: pos.startsWith('t') ? -1 : 'auto',
                    bottom: pos.startsWith('b') ? -1 : 'auto',
                    left: pos.endsWith('l') ? -1 : 'auto',
                    right: pos.endsWith('r') ? -1 : 'auto',
                    transform: pos === 'tr' ? 'rotate(90deg)' : pos === 'br' ? 'rotate(180deg)' : pos === 'bl' ? 'rotate(270deg)' : 'none'
                  }}
                  viewBox="0 0 32 32" fill="none"
                >
                  <path d="M2 30 L2 2 L30 2" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                  <path d="M2 2 L10 2" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                  <path d="M2 2 L2 10" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                  <circle cx="2" cy="2" r="2.5" fill="#d4af37" opacity="0.9"/>
                </svg>
              ))}

              <div className={`overflow-hidden relative ${
                item.size === 'portrait'  ? 'aspect-[3/4]' :
                item.size === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'
              }`}>
                <div className="frame-shine absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.18) 50%, transparent 60%)', transform: 'translateX(-120%)' }}
                />

                <img
                  src={`/api/image?key=album/page_${String(item.pageNum).padStart(3, '0')}.jpg`}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none z-10" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-7">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="block text-[#d4af37] font-serif tracking-[0.15em] text-base uppercase mb-2">
                      {item.label}
                    </span>
                    <div className="w-8 h-px bg-[#d4af37]/60 mb-2" />
                    <span className="block text-white/50 text-[10px] tracking-[0.35em] uppercase font-light">
                      Santhosh &amp; Ambika
                    </span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full border border-[#d4af37]/40 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="text-[#d4af37] text-[9px] font-bold tracking-wide">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 relative z-10 flex flex-col items-center gap-4">
        <button
          onClick={() => router.push('/album')}
          className="btn-3d text-base sm:text-lg px-10 py-4 shadow-[0_0_30px_rgba(212,175,55,0.35)]"
        >
          Explore Full Album
        </button>
        <p className="text-white/25 text-xs tracking-[0.3em] uppercase">48 memories await</p>
      </div>

      <div className="flex items-center justify-center gap-4 mt-16 opacity-30">
        <div className="h-px w-32 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4af37">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        <div className="h-px w-32 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
      </div>
    </div>
  );
}
