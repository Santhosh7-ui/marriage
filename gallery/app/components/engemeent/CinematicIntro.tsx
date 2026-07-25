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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Run custom animations
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        initAnimations();
      }
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, [router]);

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
           HERO SECTION (CINEMATIC TEXT)
      ═══════════════════════════════════════════════ */}
      <section className="hero" id="hero">
        <svg className="hero-bg-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <line className="svg-line" x1="0" y1="450" x2="1440" y2="450" />
          <line className="svg-line" x1="720" y1="0" x2="720" y2="900" />
          <circle className="svg-circle" cx="720" cy="450" r="300" />
          <circle className="svg-circle svg-circle--outer" cx="720" cy="450" r="420" />
        </svg>

        <div className="glow-orb glow-orb--gold" aria-hidden="true" style={{ opacity: 0.02 }}></div>
        <div className="glow-orb glow-orb--lavender" aria-hidden="true" style={{ opacity: 0.02 }}></div>

        <div className="hero-content" id="heroContent">
          <div className="hero-step" id="step1" aria-label="Two Souls">
            <h1 className="hero-text hero-text--large" data-split="chars">
              Two 
              <svg style={{ width: '0.8em', height: '0.8em', margin: '0 0.1em', transform: 'translateY(0.1em)' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg> 
              Souls
            </h1>
          </div>

          <div className="hero-step" id="step2" aria-label="One Journey">
            <p className="hero-text hero-text--medium" data-split="words">
              One 
              <svg style={{ width: '0.8em', height: '0.8em', margin: '0 0.1em', transform: 'translateY(0.1em)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg> 
              Journey
            </p>
          </div>

          <div className="hero-step" id="step3" aria-label="Santhosh and Ambika">
            <p className="hero-text hero-text--names" id="coupleNames" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5em', textTransform: 'none', letterSpacing: '2px' }}>
              Santhosh ❤️ Ambika
            </p>
          </div>

          <div className="hero-step" id="step4" aria-label="Are Getting Engaged">
            <p className="hero-text hero-text--engaged" data-split="words">Are Getting Engaged</p>
          </div>

          {/* Save the date section removed */}

          <div className="scroll-cue" id="scrollCue" aria-label="Scroll to explore">
            <span className="scroll-cue__line"></span>
            <span className="scroll-cue__label">Scroll</span>
          </div>
        </div>
      </section>

      {/* Removed middle sections per user request */}

      {/* ═══════════════════════════════════════════════
           TEASER GALLERY SECTION — Luxury Framed
      ═══════════════════════════════════════════════ */}
      <GlimpsesGallery />

      {/* ═══════════════════════════════════════════════
           FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="footer-names">Santhosh ❤️ Ambika</div>
        <div className="footer-date">22 · 03 · 2026</div>
        <div className="footer-divider" aria-hidden="true"></div>
        <p className="footer-note">Made with love ✦</p>
      </footer>
    </div>
  );
}
