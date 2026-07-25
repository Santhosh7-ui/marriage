'use client';

import { useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { tsParticles } from '@tsparticles/engine';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './IntroScreen.module.scss';

export default function IntroScreen() {
  const router = useRouter();
  const [init, setInit] = useState(false);

  useEffect(() => {
    loadSlim(tsParticles).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        {/* Particles Background */}
        {init && (
          <Particles
            id="tsparticles"
            className={styles.particles}
            options={{
              background: { color: { value: '#000000' } },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: { enable: true, mode: 'push' },
                  onHover: { enable: true, mode: 'repulse' },
                  resize: true,
                },
                modes: {
                  push: { quantity: 4 },
                  repulse: { distance: 200, duration: 0.4 },
                },
              },
              particles: {
                color: { value: '#ffffff' },
                links: {
                  color: '#ffffff',
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
                },
                move: {
                  direction: 'none',
                  enable: true,
                  outModes: { default: 'bounce' },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: { enable: true, width: 1920, height: 1080 },
                  value: 80,
                },
                opacity: { value: 0.5 },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 5 } },
              },
              detectRetina: true,
            }}
          />
        )}

        {/* Main Content Overlay */}
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={styles.heroTitle}
          >
            Santhosh <br />
            <span className={styles.heroAmpersand}>&</span> <br />
            Ambika
          </motion.h1>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            onClick={() => router.push('/gallery')}
            className={styles.enterBtn}
          >
            Enter Gallery
          </motion.button>
        </div>
      </div>

      {/* Teaser Masonry Grid Section */}
      <div className={styles.teaserSection}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className={styles.teaserHeader}
        >
          <h2 className={styles.teaserTitle}>Glimpses of Forever</h2>
          <p className={styles.teaserSubtitle}>A sneak peek into our wedding album</p>
        </motion.div>

        <div className={styles.masonryGrid}>
          {[1, 2, 4, 7, 10, 14, 18, 22, 25, 28, 31, 36].map((pageNum, idx) => (
            <motion.div
              key={pageNum}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx % 3 * 0.2 }}
              className={styles.masonryCard}
            >
              <img
                src={`/api/image?key=album/page_${String(pageNum).padStart(3, '0')}.jpg`}
                alt={`Wedding Moment ${pageNum}`}
                className={styles.masonryImg}
                loading="lazy"
              />
              <div className={styles.masonryOverlay}>
                <span className={styles.masonryLabel}>Page {pageNum}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <button
            onClick={() => router.push('/album')}
            className="btn-3d text-lg px-8 py-4 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Explore Full Album
          </button>
        </div>
      </div>
    </div>
  );
}
