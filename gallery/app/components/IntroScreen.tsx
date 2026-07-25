'use client';

import { useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { tsParticles } from '@tsparticles/engine';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function IntroScreen() {
  const router = useRouter();
  const [init, setInit] = useState(false);

  useEffect(() => {
    loadSlim(tsParticles).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-y-auto overflow-x-hidden flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center shrink-0">
        {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0"
        options={{
          background: {
            color: {
              value: '#000000',
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#ffffff',
            },
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
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 1920,
                height: 1080,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      )}

      {/* Main Content Overlay */}
      <div className="z-10 text-center flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-6xl md:text-8xl font-serif text-white tracking-widest"
          style={{ textShadow: '0px 4px 20px rgba(255,255,255,0.3)' }}
        >
          Santhosh <br/>
          <span className="text-4xl md:text-6xl text-gray-400 italic">&amp;</span> <br/>
          Ambika
        </motion.h1>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          onClick={() => router.push('/gallery')}
          className="px-8 py-3 mt-8 border border-white/50 text-white rounded-full hover:bg-white hover:text-black transition-colors duration-300 text-lg uppercase tracking-widest backdrop-blur-sm"
        >
          Enter Gallery
        </motion.button>
      </div>
    </div>

      {/* Teaser Masonry Grid Section */}
      <div className="w-full min-h-screen bg-gradient-to-b from-black to-[#0a0a0a] py-24 px-4 sm:px-8 flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-serif text-[#d4af37] tracking-widest mb-4">Glimpses of Forever</h2>
          <p className="text-gray-400 tracking-[0.2em] uppercase text-sm sm:text-base">A sneak peek into our wedding album</p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full max-w-[1400px] space-y-6">
          {[1, 2, 4, 7, 10, 14, 18, 22, 25, 28, 31, 36].map((pageNum, idx) => (
            <motion.div
              key={pageNum}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx % 3 * 0.2 }}
              className="break-inside-avoid relative group cursor-pointer rounded-lg overflow-hidden border border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <img
                src={`/api/image?key=album/page_${String(pageNum).padStart(3, '0')}.jpg`}
                alt={`Wedding Moment ${pageNum}`}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-[#d4af37] font-serif tracking-widest">Page {pageNum}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20">
          <button 
            onClick={() => router.push('/gallery')}
            className="btn-3d text-lg px-8 py-4 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Explore Full Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
