import React, { useState } from 'react';
import { Image as ImageIcon, Grid3x3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: number;
  src: string;
  title: string;
  category: string;
}

export default function PhotosApp() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Generate photos from skills folder
  const skillIcons = [
    'aws_dark.svg',
    'aws_light.svg',
    'docker.svg',
    'fastapi.svg',
    'figma.svg',
    'firebase.svg',
    'git.svg',
    'mongodb-icon-dark.svg',
    'nextjs_icon_dark.svg',
    'nodejs.svg',
    'postgresql.svg',
    'react_dark.svg',
    'react_light.svg',
    'supabase.svg',
    'tailwindcss.svg',
    'typescript.svg'
  ];

  const photos: Photo[] = skillIcons.map((icon, idx) => ({
    id: idx + 1,
    src: `/skills/${icon}`,
    title: icon.replace(/\.(svg|png)$/, '').replace(/_/g, ' ').toUpperCase(),
    category: 'Tech Stack'
  }));

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeViewer = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedPhoto(photos[newIndex]);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 flex items-center justify-between px-6 shrink-0 bg-[#1c1c1c] border-b border-white/5">
        <div className="flex items-center gap-4">
          <ImageIcon size={20} className="text-[#dcae48]" />
          <h1 className="text-sm font-semibold text-gray-300">Photos</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#dcae48]/20 text-[#dcae48]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="flex-1 overflow-y-auto macos-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1">Tech Stack Icons</h2>
            <p className="text-sm text-gray-500">{photos.length} items</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square bg-[#252525] rounded-lg border border-white/5 hover:border-[#dcae48]/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="w-full h-full flex items-center justify-center p-6 relative">
                  <img 
                    src={photo.src} 
                    alt={photo.title}
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.currentTarget.src = '/icons/Photos.png';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white font-medium truncate">{photo.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center"
            onClick={closeViewer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeViewer}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigatePhoto('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={() => navigatePhoto('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
              >
                <ChevronRight size={24} />
              </button>

              {/* Image Container */}
              <div className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-center p-12 min-h-125">
                  <img 
                    src={selectedPhoto.src} 
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
                
                {/* Image Info */}
                <div className="bg-[#252525] border-t border-white/5 p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{selectedPhoto.title}</h3>
                  <p className="text-sm text-gray-500">{selectedPhoto.category}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
