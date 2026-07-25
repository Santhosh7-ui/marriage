'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AntigravityLogo from './AntigravityLogo';

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
      <header className="absolute top-0 left-0 w-full h-24 md:h-28 z-50 flex items-center justify-between px-6 md:px-16 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        {/* Desktop View */}
        <div className="hidden md:flex items-center w-full justify-between">
          {/* Logo / Brand (Left) */}
          <Link href="/">
            <AntigravityLogo />
          </Link>

          {/* Centered Navigation Links (Center) */}
          <nav className="flex items-center gap-10 lg:gap-14 text-[13px] font-semibold uppercase tracking-[0.2em]">
            <Link 
              href="/" 
              className={`transition-all duration-300 hover:text-[#d4af37] hover:[text-shadow:0_0_12px_rgba(212,175,55,0.8)] ${isHomeActive ? 'text-[#d4af37] [text-shadow:0_0_12px_rgba(212,175,55,0.8)]' : 'text-white/70'}`}
            >
              Home
            </Link>
            <Link 
              href="/gallery" 
              className={`transition-all duration-300 hover:text-[#d4af37] hover:[text-shadow:0_0_12px_rgba(212,175,55,0.8)] ${isGalleryActive ? 'text-[#d4af37] [text-shadow:0_0_12px_rgba(212,175,55,0.8)]' : 'text-white/70'}`}
            >
              Gallery
            </Link>
            <Link 
              href="/album" 
              className={`transition-all duration-300 hover:text-[#d4af37] hover:[text-shadow:0_0_12px_rgba(212,175,55,0.8)] ${isWeddingActive ? 'text-[#d4af37] [text-shadow:0_0_12px_rgba(212,175,55,0.8)]' : 'text-white/70'}`}
            >
              Wedding Album
            </Link>
            <Link 
              href="/album?type=reception" 
              className={`transition-all duration-300 hover:text-[#d4af37] hover:[text-shadow:0_0_12px_rgba(212,175,55,0.8)] ${isReceptionActive ? 'text-[#d4af37] [text-shadow:0_0_12px_rgba(212,175,55,0.8)]' : 'text-white/70'}`}
            >
              Reception Album
            </Link>
          </nav>

          {/* Pill Action Button (Right) */}
          <div>
            {pillAction ? (
              <button
                onClick={pillAction}
                className="px-8 py-3.5 bg-white text-black font-bold text-[12px] uppercase tracking-[0.18em] rounded-full hover:bg-gray-200 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {pillLabel}
              </button>
            ) : (
              <Link
                href={pillHref}
                className="px-8 py-3.5 bg-white text-black font-bold text-[12px] uppercase tracking-[0.18em] rounded-full hover:bg-gray-200 active:scale-95 inline-block text-center transition-all shadow-md cursor-pointer"
              >
                {pillLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile View - Hamburger & Title */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Link href="/" className="text-sm font-serif uppercase tracking-[0.2em] text-white">
            S &amp; A
          </Link>
          
          <div className="flex items-center gap-4">
            {isGallery && setViewMode && viewMode && (
              <button
                onClick={pillAction}
                className="px-4 py-1.5 bg-white/10 text-white border border-white/20 font-semibold text-[9px] uppercase tracking-wider rounded-full active:scale-95 transition-all"
              >
                {viewMode === 'curved' ? "Carousel" : "Curved"}
              </button>
            )}
            <button 
              onClick={toggleMenu}
              className="text-white p-2 focus:outline-none z-[60]"
              aria-label="Toggle Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between relative">
                <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col gap-6 text-center text-lg font-serif tracking-[0.15em] w-full px-8 uppercase">
              <Link href="/" onClick={toggleMenu} className="text-white hover:text-[#d4af37] py-3 border-b border-white/10">
                Home
              </Link>
              <Link href="/gallery" onClick={toggleMenu} className="text-white hover:text-[#d4af37] py-3 border-b border-white/10">
                Gallery
              </Link>
              <Link href="/album" onClick={toggleMenu} className="text-white hover:text-[#d4af37] py-3 border-b border-white/10">
                3D Wedding Album
              </Link>
              <Link href="/album?type=reception" onClick={toggleMenu} className="text-white hover:text-[#d4af37] py-3 border-b border-white/10">
                3D Reception Album
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
