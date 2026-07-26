'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

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
          <Link href="/">
            <AntigravityLogo />
          </Link>

          {/* Centered Navigation Links */}
          <nav className={styles.nav}>
            <Link
              href="/"
              className={`${styles.navLink} ${isHomeActive ? styles['navLink--active'] : ''}`}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={`${styles.navLink} ${isGalleryActive ? styles['navLink--active'] : ''}`}
            >
              Gallery
            </Link>
            <Link
              href="/album"
              className={`${styles.navLink} ${isWeddingActive ? styles['navLink--active'] : ''}`}
            >
              Wedding Album
            </Link>
            <Link
              href="/album?type=reception"
              className={`${styles.navLink} ${isReceptionActive ? styles['navLink--active'] : ''}`}
            >
              Reception Album
            </Link>
            <button
              onClick={handleLogout}
              className={styles.navLink}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}
            >
              Logout
            </button>
          </nav>

          {/* Pill Action Button (Right) */}
          <div>
            {pillAction ? (
              <button onClick={pillAction} className={styles.pill}>
                {pillLabel}
              </button>
            ) : (
              <Link href={pillHref} className={styles.pill}>
                {pillLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile View — Hamburger & Brand */}
        <div className={styles.mobileRow}>
          <Link href="/" className={styles.mobileBrand}>
            S &amp; A
          </Link>

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
              <Link href="/" onClick={toggleMenu} className={styles.mobileNavLink}>
                Home
              </Link>
              <Link href="/gallery" onClick={toggleMenu} className={styles.mobileNavLink}>
                Gallery
              </Link>
              <Link href="/album" onClick={toggleMenu} className={styles.mobileNavLink}>
                3D Wedding Album
              </Link>
              <Link href="/album?type=reception" onClick={toggleMenu} className={styles.mobileNavLink}>
                3D Reception Album
              </Link>
              <button 
                onClick={() => { toggleMenu(); handleLogout(); }} 
                className={styles.mobileNavLink}
                style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%' }}
              >
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
