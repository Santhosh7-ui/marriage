'use client';

import { motion } from 'framer-motion';

interface CurvedFilmstripProps {
  photos: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function CurvedFilmstrip({ photos, selectedIndex, onSelect }: CurvedFilmstripProps) {
  // A simple list of emojis for the inner curve (as requested)
  const emojis = ['💖', '✨', '📸', '🎉', '🥂', '💍', '💌'];

  // We'll calculate positions so they form a curve on the left.
  // The center of the curve is far to the right.
  const radius = 800; // Large radius for a gentle curve
  const centerX = 950; // Shifted right so centerX - radius = 150px (visible)
  
  return (
    <div className="relative w-[400px] h-full overflow-hidden flex-shrink-0 z-10 hidden md:block">
      {/* Scrollable container. In a real advanced setup, this would use a custom wheel handler.
          For now, we'll map the items statically with a fixed offset based on selectedIndex to simulate scrolling. */}
      <div className="absolute inset-0 flex items-center">
        
        {/* Background Dark Arc */}
        <div 
          className="absolute bg-[#111] rounded-full"
          style={{
            width: radius * 2,
            height: radius * 2,
            left: centerX - radius, // Centered far right
            top: '50%',
            transform: 'translateY(-50%)',
            boxShadow: 'inset -20px 0 50px rgba(0,0,0,0.8)'
          }}
        />

        {/* Photos & Icons */}
        {photos.map((photoKey, index) => {
          // Calculate angle relative to the selected index
          // 0 means it's the selected one (center), negative is above, positive is below
          const offset = index - selectedIndex;
          const angleDeg = offset * 12; // 12 degrees per item
          const angleRad = (angleDeg * Math.PI) / 180;

          // x = r * cos(theta), y = r * sin(theta)
          // Since our origin is (centerX, 50%), we want the left edge of the circle:
          const x = centerX - (radius * Math.cos(angleRad));
          const y = radius * Math.sin(angleRad);

          // Only render items that are somewhat visible to save DOM nodes
          if (Math.abs(offset) > 10) return null;

          return (
            <motion.div
              key={photoKey}
              className={`absolute cursor-pointer transition-all duration-500 ease-out`}
              style={{
                left: x - 60, // adjust for width
                top: `calc(50% + ${y}px)`,
                transform: `translateY(-50%) rotate(${angleDeg}deg)`,
                zIndex: offset === 0 ? 10 : 1,
              }}
              onClick={() => onSelect(index)}
              initial={false}
              animate={{
                scale: offset === 0 ? 1.2 : 0.9,
                opacity: Math.abs(offset) > 5 ? 0 : 1 - (Math.abs(offset) * 0.15)
              }}
            >
              {/* Photo Thumbnail */}
              <div className={`
                w-[120px] h-[80px] rounded-md overflow-hidden border-2 transition-all duration-300
                ${offset === 0 
                  ? 'border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]' 
                  : 'border-transparent hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]'}
              `}>
                <img 
                  src={`/api/image?key=${encodeURIComponent(photoKey)}`} 
                  alt={`Thumbnail ${index}`} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Emoji on the inner curve (if available) */}
              {Math.abs(offset) < 5 && (
                <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-2xl" style={{ filter: offset === 0 ? 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' : 'none' }}>
                  {emojis[index % emojis.length]}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Vertical Slider for Drag Navigation */}
      <div className="absolute left-6 top-1/4 bottom-1/4 flex items-center justify-center z-50">
        <input 
          type="range" 
          min={0} 
          max={photos.length > 0 ? photos.length - 1 : 0} 
          value={selectedIndex}
          onChange={(e) => onSelect(parseInt(e.target.value))}
          className="w-1 h-full appearance-none bg-gray-800 rounded-full outline-none slider-vertical cursor-pointer"
          style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
        />
        {/* Custom CSS for the thumb might be needed in globals.css, but this basic implementation provides the drag functionality */}
      </div>
      
      {/* Scroll prompt / instruction overlay could go here */}
    </div>
  );
}
