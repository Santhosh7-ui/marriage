'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CarouselViewProps {
  photos: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function CarouselView({ photos, selectedIndex, onSelect }: CarouselViewProps) {
  return (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <AnimatePresence>
        {photos.map((photoKey, index) => {
          // Calculate shortest path for circular carousel
          let diff = index - selectedIndex;
          const half = Math.floor(photos.length / 2);
          
          if (diff > half) diff -= photos.length;
          if (diff < -half) diff += photos.length;

          const absOffset = Math.abs(diff);

          // Only render items that are close to the center
          if (absOffset > 4) return null;

          const isCenter = diff === 0;
          const direction = Math.sign(diff);
          
          // Layout variables
          // The center card is at x=0, z=0
          // The other cards push outwards and backwards
          const baseTranslateX = 220; // horizontal spacing
          const baseTranslateZ = -150; // depth spacing
          
          let x = 0;
          if (!isCenter) {
            x = direction * (baseTranslateX + (absOffset - 1) * 120);
          }
          
          const z = isCenter ? 0 : baseTranslateZ * absOffset;
          const rotateY = isCenter ? 0 : direction * -20;
          const opacity = isCenter ? 1 : Math.max(0, 1 - absOffset * 0.25);
          const zIndex = 100 - absOffset;

          return (
            <motion.div
              key={index}
              className="absolute cursor-pointer rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
              style={{
                width: 'clamp(300px, 35vw, 460px)',
                height: 'clamp(480px, 65vh, 760px)',
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                x,
                z,
                rotateY,
                opacity,
                scale: isCenter ? 1 : 0.95
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "tween", 
                duration: 0.6, 
                ease: [0.25, 0.1, 0.25, 1] 
              }}
              onClick={() => onSelect(index)}
            >
              {/* Dimmer overlay for inactive items to emphasize the center */}
              {!isCenter && (
                <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300"></div>
              )}
              
              <img
                src={`/api/image?key=${encodeURIComponent(photoKey)}`}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
              
              {/* Top Right Photo Number */}
              <div className="absolute top-0 right-0 bg-black/60 backdrop-blur-md px-8 py-4 rounded-bl-3xl text-xs sm:text-sm font-bold tracking-widest text-white/90 z-20 shadow-lg border-b border-l border-white/10">
                {index + 1} / {photos.length}
              </div>

              {/* Centered Photo Details overlay at the bottom of the active card */}
              {isCenter && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-12 sm:p-16 pb-14 sm:pb-20 z-20 flex flex-col items-center text-center">
                  <h3 className="text-xl sm:text-3xl font-serif text-white tracking-wide uppercase px-4">
                    {photoKey.split('/').pop()?.split('.').shift()?.replace(/_/g, ' ') || 'Wedding Moment'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d4af37] font-semibold tracking-[0.3em] uppercase mt-4">
                    Santhosh & Ambika
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Slider at the bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] max-w-[400px] z-[200]">
        <input 
          type="range"
          min={0}
          max={photos.length - 1}
          value={selectedIndex}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="w-full appearance-none bg-white/20 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer cursor-pointer transition-all hover:bg-white/40"
        />
      </div>
    </div>
  );
}
