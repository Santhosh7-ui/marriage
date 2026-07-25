'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import AntigravityLogo from './AntigravityLogo';
import styles from './Navigation.module.scss';

interface NavigationProps {
  title: string;
  viewMode?: string;
  setViewMode?: (mode: string) => void;
  isGallery?: boolean;
}

export default function Navigation({ title, viewMode, setViewMode, isGallery }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isHomeActive = pathname === '/';
  const isGalleryActive = pathname === '/gallery';
  const isWeddingActive = pathname === '/album' && title === 'Wedding Album';
  const isReceptionActive = pathname === '/album' && title === 'Reception Album';

  // Determine the label and action for the pill button
  let pillLabel = "Enter Gallery";
  let pillHref = "/gallery";
  let pillAction: (() => void) | undefined = undefined;

  if (isGallery && setViewMode && viewMode) {
    pillLabel = viewMode === 'curved' ? "3D Carousel" : "Curved View";
    pillAction = () => setViewMode(viewMode === 'curved' ? 'carousel' : 'curved');
  } else if (title === 'Wedding Album' || title === 'Reception Album' || !isGallery) {
    pillLabel = "Back to Gallery";
    pillHref = "/gallery";
  }

  return (
    <>
      <header className={styles.header}>
        {/* Desktop View */}
        <div className={styles.desktopRow}>
          {/* Logo / Brand (Left) */}
          <a href="/">
            <AntigravityLogo />
          </a>

          {/* Centered Navigation Links */}
          <nav className={styles.nav}>
            <a
              href="/"
              className={`${styles.navLink} ${isHomeActive ? styles['navLink--active'] : ''}`}
            >
              Home
            </a>
            <a
              href="/gallery"
              className={`${styles.navLink} ${isGalleryActive ? styles['navLink--active'] : ''}`}
            >
              Gallery
            </a>
            <a
              href="/album"
              className={`${styles.navLink} ${isWeddingActive ? styles['navLink--active'] : ''}`}
            >
              Wedding Album
            </a>
            <a
              href="/album?type=reception"
              className={`${styles.navLink} ${isReceptionActive ? styles['navLink--active'] : ''}`}
            >
              Reception Album
            </a>
          </nav>

          {/* Pill Action Button (Right) */}
          <div>
            {pillAction ? (
              <button onClick={pillAction} className={styles.pill}>
                {pillLabel}
              </button>
            ) : (
              <a href={pillHref} className={styles.pill}>
                {pillLabel}
              </a>
            )}
          </div>
        </div>

        {/* Mobile View — Hamburger & Brand */}
        <div className={styles.mobileRow}>
          <a href="/" className={styles.mobileBrand}>
            S &amp; A
          </a>

          <div className={styles.mobileActions}>
            {isGallery && setViewMode && viewMode && (
              <button onClick={pillAction} className={styles.mobileViewToggle}>
                {viewMode === 'curved' ? "Carousel" : "Curved"}
              </button>
            )}
            <button
              onClick={toggleMenu}
              className={styles.hamburger}
              aria-label="Toggle Menu"
            >
              <div className={styles.hamburgerIcon}>
                <span className={`${styles.bar} ${isOpen ? styles['bar--top-open'] : ''}`} />
                <span className={`${styles.bar} ${isOpen ? styles['bar--mid-open'] : ''}`} />
                <span className={`${styles.bar} ${isOpen ? styles['bar--bottom-open'] : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.mobileOverlay}
          >
            <nav className={styles.mobileNav}>
              <a href="/" onClick={toggleMenu} className={styles.mobileNavLink}>
                Home
              </a>
              <a href="/gallery" onClick={toggleMenu} className={styles.mobileNavLink}>
                Gallery
              </a>
              <a href="/album" onClick={toggleMenu} className={styles.mobileNavLink}>
                3D Wedding Album
              </a>
              <a href="/album?type=reception" onClick={toggleMenu} className={styles.mobileNavLink}>
                3D Reception Album
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
