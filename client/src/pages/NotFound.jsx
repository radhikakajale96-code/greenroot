import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-8xl mb-6 select-none"
      >
        🌱
      </motion.div>
      <h1 className="text-6xl font-bold font-display text-gradient mb-2">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-gray-400 text-sm max-w-md mb-8">
        Looks like this leaf blew away in the wind. The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn-primary text-sm px-8 py-3">
        Return to Home 🌿
      </Link>
    </div>
  );
}
