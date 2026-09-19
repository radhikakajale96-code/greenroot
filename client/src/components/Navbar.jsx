import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiX, FiSun, FiMoon, FiBell, FiLogOut, FiUser } from 'react-icons/fi';

const navLinks = [
  { to: '/feed', label: 'Feed' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-forest/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              🌱
            </motion.span>
            <span className="font-display font-bold text-xl text-gradient">GreenRoots</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group ${
                  location.pathname === to
                    ? 'text-light-green'
                    : 'text-gray-300 hover:text-light-green'
                }`}
              >
                {label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-forest-light rounded-full transition-all duration-300 ${
                  location.pathname === to ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full glass text-light-green hover:text-white transition-colors"
              title="Toggle theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.button>

            {user ? (
              <>
                {/* Diary shortcut */}
                <Link to="/diary" className="text-sm text-gray-300 hover:text-light-green transition-colors">
                  🌿 Diary
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2 glass rounded-full px-3 py-1.5 cursor-pointer"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2E7D32&color=fff`}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-light-green">{user.name.split(' ')[0]}</span>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-48 glass rounded-2xl p-2 shadow-xl shadow-black/30 border border-forest/20"
                      >
                        <Link to={`/profile/${user._id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-gray-200 transition-colors" onClick={() => setProfileOpen(false)}>
                          <FiUser size={14} /> My Profile
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-gray-200 transition-colors" onClick={() => setProfileOpen(false)}>
                          📊 Dashboard
                        </Link>
                        <Link to="/diary" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-gray-200 transition-colors" onClick={() => setProfileOpen(false)}>
                          🌿 My Diary
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-amber-400 transition-colors" onClick={() => setProfileOpen(false)}>
                            ⚙️ Admin Panel
                          </Link>
                        )}
                        <hr className="border-white/10 my-1" />
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 text-sm text-red-400 transition-colors w-full text-left">
                          <FiLogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-300 hover:text-light-green transition-colors px-3 py-1.5">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-5">
                  Join Free 🌱
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-light-green"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block px-4 py-2.5 rounded-xl text-gray-300 hover:text-light-green hover:bg-white/5 transition-colors"
                >
                  {label}
                </Link>
              ))}
              <hr className="border-white/10 my-2" />
              {user ? (
                <>
                  <Link to={`/profile/${user._id}`} className="block px-4 py-2.5 rounded-xl text-gray-300 hover:text-light-green hover:bg-white/5 transition-colors">
                    👤 Profile
                  </Link>
                  <Link to="/dashboard" className="block px-4 py-2.5 rounded-xl text-gray-300 hover:text-light-green hover:bg-white/5 transition-colors">
                    📊 Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" className="flex-1 btn-outline text-center text-sm">Login</Link>
                  <Link to="/register" className="flex-1 btn-primary text-center text-sm">Join Free</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
