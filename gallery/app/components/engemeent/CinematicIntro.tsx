'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Lenis from 'lenis';
import { initAnimations } from './animations';
import Navigation from '@/app/components/Navigation';
import GlimpsesGallery from './GlimpsesGallery';
import SocialCarousel from '../SocialCarousel';
import styles from './CinematicIntro.module.scss';

export default function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1, // 'smoothWheel' is deprecated in newer lenis versions
    });

    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    // Store the ticker callback so we can remove it on cleanup
    const lenisUpdate = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisUpdate);
    gsap.ticker.lagSmoothing(0);

    // Run custom animations
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        initAnimations();
      }
    }, containerRef);

    return () => {
      gsap.ticker.remove(lenisUpdate); // ← prevents stacked ticker callbacks on re-mount
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* Navigation Header */}
      <Navigation title="Santhosh & Ambika" isGallery={false} />

      {/* ═══════════════════════════════════════════════
           BACKGROUND EFFECTS
      ═══════════════════════════════════════════════ */}
      <div className="bg-glow-container" aria-hidden="true">
        <div className="ambient-glow ambient-glow-1"></div>
        <div className="ambient-glow ambient-glow-2"></div>
        <div className="ambient-glow ambient-glow-3"></div>
      </div>

      <div className="cursor-glow" id="cursorGlow"></div>
      <div className="grain-overlay" aria-hidden="true"></div>
      <div className="particles-container" id="particles" aria-hidden="true"></div>

      {/* ═══════════════════════════════════════════════
           PARTICLE HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="particle-hero" id="particleHero">
        <div className="glow-orb glow-orb--gold" aria-hidden="true"></div>
        <div className="glow-orb glow-orb--lavender" aria-hidden="true"></div>
        <canvas id="particleCanvas" className="particle-canvas is-active"></canvas>

        <div className="scroll-cue is-fixed-cue" aria-label="Scroll to explore">
          <span className="scroll-cue__line"></span>
          <span className="scroll-cue__label">Scroll</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
           SOCIAL CAROUSEL SECTION
      ═══════════════════════════════════════════════ */}
      <section className="social-carousel-section" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <SocialCarousel />
      </section>



      {/* Removed middle sections per user request */}

      {/* ═══════════════════════════════════════════════
           TEASER GALLERY SECTION — Luxury Framed
      ═══════════════════════════════════════════════ */}
      <GlimpsesGallery />
    </div>
  );
}
