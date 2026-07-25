'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

interface GalleryPreviewProps {
  photoKey: string;
  title: string;
  date: string;
  totalPhotos: number;
}

export default function GalleryPreview({ photoKey, title, date, totalPhotos }: GalleryPreviewProps) {
  return (
    <div className="flex-1 h-full flex items-center justify-center p-4 md:p-8 relative z-20">
      
      {/* Main Image View */}
      <div className="w-full h-full max-w-7xl flex items-center justify-center relative">
        
        {/* The Big Selected Photo */}
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={photoKey}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-[75vh] md:h-[85vh] rounded-xl overflow-hidden border-2 border-transparent hover:border-white shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.7)] transition-all duration-300 relative group"
              >
                <img 
                  src={`/api/image?key=${encodeURIComponent(photoKey)}`} 
                  alt={title}
                  className="w-full h-full object-contain bg-black/50 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Photo Number Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {title} • {totalPhotos} Fotos
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
