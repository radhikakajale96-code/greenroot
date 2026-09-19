import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiMapPin, FiCamera } from 'react-icons/fi';

const galleryPhotos = [
  { id: 1, title: 'Red Oak Sapling', category: 'Oak', location: 'Portland, OR', planter: 'Sarah Jenkins', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60', likes: 24 },
  { id: 2, title: 'Cherry Blossom Grove', category: 'Cherry', location: 'Kyoto, Japan', planter: 'Kenji Sato', img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=60', likes: 56 },
  { id: 3, title: 'Silver Birch Forest', category: 'Birch', location: 'Berlin, Germany', planter: 'Elena Rostova', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=60', likes: 38 },
  { id: 4, title: 'Pine Canopy Trail', category: 'Pine', location: 'Colorado, USA', planter: 'Marcus Chen', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60', likes: 41 },
  { id: 5, title: 'Urban Garden Seedling', category: 'Oak', location: 'London, UK', planter: 'Aaliyah Patel', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60', likes: 19 },
  { id: 6, title: 'Autumn Red Maple', category: 'Maple', location: 'Toronto, Canada', planter: 'David Kim', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60', likes: 62 },
];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = ['All', 'Oak', 'Pine', 'Cherry', 'Birch', 'Maple'];

  const filteredPhotos = galleryPhotos.filter(
    (p) => filter === 'All' || p.category === filter
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold font-display text-gradient">Tree Gallery</h1>
        <p className="text-gray-300 text-sm mt-2">
          Explore real tree plantings uploaded by GreenRoots environmental stewards worldwide.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex justify-center items-center gap-2 overflow-x-auto pb-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === cat
                ? 'bg-forest text-white shadow-lg shadow-forest/30'
                : 'glass text-gray-300 hover:text-light-green'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setSelectedPhoto(photo)}
            className="card glass overflow-hidden cursor-pointer group relative"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-forest text-white inline-block mb-1">
                  {photo.category}
                </span>
                <h3 className="font-bold text-lg leading-snug">{photo.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-300 mt-2">
                  <span className="flex items-center gap-1"><FiMapPin /> {photo.location}</span>
                  <span className="flex items-center gap-1 text-red-400 font-semibold"><FiHeart /> {photo.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass w-full max-w-3xl overflow-hidden relative border border-forest/40"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full glass text-white hover:bg-white/20"
              >
                <FiX size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-80 md:h-full max-h-[500px]">
                  <img src={selectedPhoto.img} alt={selectedPhoto.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold px-2.5 py-1 rounded-full bg-forest text-white inline-block mb-2">
                      {selectedPhoto.category}
                    </span>
                    <h2 className="text-2xl font-bold font-display text-white mb-2">{selectedPhoto.title}</h2>
                    <p className="text-xs text-gray-300 flex items-center gap-1 mb-4">
                      <FiMapPin /> Location: {selectedPhoto.location}
                    </p>
                    <div className="glass p-3 rounded-xl text-xs text-gray-300">
                      Planted & documented by <strong className="text-light-green">{selectedPhoto.planter}</strong>.
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-semibold text-red-400 flex items-center gap-1">
                      <FiHeart className="fill-current" /> {selectedPhoto.likes} Likes
                    </span>
                    <button onClick={() => setSelectedPhoto(null)} className="btn-outline text-xs !py-1.5 !px-4">
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
