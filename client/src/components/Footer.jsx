import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const fireflies = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60 + 20,
  delay: Math.random() * 4,
  duration: Math.random() * 2 + 3,
  size: Math.random() * 4 + 2,
}));

const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 80,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 1.5,
}));

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #050f05 0%, #0a1a0a 40%, #020805 100%)', minHeight: '400px' }}>
      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size + 'px',
            height: s.size + 'px',
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Moon */}
      <motion.div
        animate={{ x: ['-10px', '10px', '-10px'], y: ['0px', '-5px', '0px'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-16 text-5xl"
      >
        🌙
      </motion.div>

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size + 'px',
            height: f.size + 'px',
            background: 'radial-gradient(circle, #CCFF90, #69F0AE)',
            boxShadow: `0 0 ${f.size * 2}px #69F0AE, 0 0 ${f.size * 4}px #CCFF90`,
            animation: `firefly ${f.duration}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}

      {/* Silhouette trees */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around pointer-events-none opacity-30">
        {[60, 90, 70, 110, 80, 100, 65].map((h, i) => (
          <svg key={i} width="40" height={h} viewBox={`0 0 40 ${h}`}>
            <rect x="16" y={h * 0.65} width="8" height={h * 0.35} fill="#1a2e1a"/>
            <ellipse cx="20" cy={h * 0.45} rx="20" ry={h * 0.45} fill="#0d1f0d"/>
          </svg>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌱</span>
              <span className="font-display font-bold text-2xl text-gradient">GreenRoots</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A community dedicated to making the Earth breathe again, one tree at a time.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: <FiGithub />, href: '#' },
                { icon: <FiTwitter />, href: '#' },
                { icon: <FiInstagram />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-light-green hover:border-forest transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Explore',
              links: [
                { to: '/feed', label: '🌿 Community Feed' },
                { to: '/gallery', label: '📷 Gallery' },
              ],
            },
            {
              title: 'Grow',
              links: [
                { to: '/diary', label: '📖 Tree Diary' },
                { to: '/dashboard', label: '📊 Dashboard' },
                { to: '/register', label: '🌱 Join Community' },
              ],
            },
            {
              title: 'Company',
              links: [
                { to: '/about', label: '🌍 About Us' },
                { to: '/contact', label: '✉️ Contact' },
                { to: '#', label: '🔒 Privacy Policy' },
                { to: '#', label: '📜 Terms of Service' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-light-green font-semibold text-sm uppercase tracking-wider mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-400 hover:text-light-green text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} GreenRoots. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Made with <FiHeart className="text-red-400 animate-pulse" /> for our planet 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}
