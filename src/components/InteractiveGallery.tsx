import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Eye, Sparkles, SlidersHorizontal } from 'lucide-react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';

export default function InteractiveGallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'terrace' | 'living' | 'bedroom' | 'amenity'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterOptions = [
    { value: 'all', label: 'All Photos' },
    { value: 'terrace', label: 'Rooftop Terrace' },
    { value: 'living', label: 'Living Spaces' },
    { value: 'bedroom', label: 'Bedrooms & Hot Tub' },
    { value: 'transit', label: 'VIP Transfer' }
  ] as const;

  const filteredItems = GALLERY_ITEMS.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'amenity') return item.category === 'amenity' || item.category === 'transit';
    return item.category === activeFilter;
  });

  const handleOpenLightbox = (id: string) => {
    const idx = GALLERY_ITEMS.findIndex(item => item.id === id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') setLightboxIndex(null);
  };

  return (
    <div className="space-y-12" onKeyDown={handleKeyDown}>
      {/* Category Filter Selector */}
      <div className="flex flex-wrap justify-center items-center gap-2.5">
        <div className="text-gold flex items-center mr-2 text-xs uppercase tracking-wider font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Filter:
        </div>
        {filterOptions.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => setActiveFilter(option.value)}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeFilter === option.value
                ? 'bg-gold text-white shadow-md scale-105'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-gold/30 hover:text-gold'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Masonry Columns Gallery Grid */}
      <motion.div
        layout
        className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="break-inside-avoid relative group overflow-hidden rounded-2xl border border-gray-50 bg-white cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              onClick={() => handleOpenLightbox(item.id)}
            >
              {/* Image element with JSX referrerPolicy="no-referrer" as mandated in image skill */}
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-gold text-[10px] uppercase tracking-widest font-bold flex items-center mb-1">
                  <Sparkles className="w-3 h-3 mr-1" /> Istanbul Luxe Residence
                </span>
                <h4 className="font-serif text-lg font-semibold leading-snug">{item.title}</h4>
                <p className="text-gray-300 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-gold space-x-1.5 uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Enlarge Residence View</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Immersive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/95 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none cursor-pointer"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              type="button"
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none cursor-pointer hidden sm:block"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none cursor-pointer hidden sm:block"
              onClick={handleNext}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <div
              className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              {/* Image Frame */}
              <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[450px]">
                <img
                  src={GALLERY_ITEMS[lightboxIndex].imageUrl}
                  alt={GALLERY_ITEMS[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[80vh] md:max-h-[600px] object-contain"
                />
                
                {/* Mobile Tap zones for sliding */}
                <div className="absolute inset-y-0 left-0 w-1/4 sm:hidden cursor-left" onClick={handlePrev} />
                <div className="absolute inset-y-0 right-0 w-1/4 sm:hidden cursor-right" onClick={handleNext} />
              </div>

              {/* Storytelling Side Panel */}
              <div className="md:w-2/5 p-8 flex flex-col justify-between bg-cream text-charcoal">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gold text-xs uppercase tracking-widest font-bold">
                      {GALLERY_ITEMS[lightboxIndex].category === 'transit' ? 'VIP Service' : 'Interior Showcase'}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {lightboxIndex + 1} / {GALLERY_ITEMS.length}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl mb-4 text-charcoal leading-snug">
                    {GALLERY_ITEMS[lightboxIndex].title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light">
                    {GALLERY_ITEMS[lightboxIndex].description}
                  </p>
                </div>

                {/* Additional Trust / Luxury details inside lightbox */}
                <div className="border-t border-gray-200/60 pt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span>Professionally Cleaned & Prepared</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span>Climate Controlled Spaces</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setLightboxIndex(null)}
                      className="text-xs font-semibold text-charcoal hover:text-gold transition flex items-center space-x-1 underline cursor-pointer"
                    >
                      Back to Gallery
                    </button>
                    <div className="flex space-x-2 sm:hidden">
                      <button
                        onClick={handlePrev}
                        className="p-1.5 rounded-lg border border-gray-200 text-charcoal hover:border-gold hover:text-gold transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-1.5 rounded-lg border border-gray-200 text-charcoal hover:border-gold hover:text-gold transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
