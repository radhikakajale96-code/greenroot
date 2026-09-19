import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const seedRef = useRef(null);
  const sproutRef = useRef(null);
  const treeRef = useRef(null);
  const dropsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete });

    // Water drops fall
    dropsRef.current.forEach((drop, i) => {
      tl.fromTo(drop,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.in' },
        i * 0.3
      );
      tl.to(drop, { y: 20, opacity: 0, duration: 0.3 }, `>-0.1`);
    });

    // Seed appears
    tl.fromTo(seedRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
      0.2
    );

    // Seed transforms to sprout
    tl.to(seedRef.current, { scale: 0, opacity: 0, duration: 0.3 }, 1.2);
    tl.fromTo(sproutRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'bottom' },
      1.4
    );

    // Sprout grows to tree
    tl.to(sproutRef.current, { scale: 0, opacity: 0, duration: 0.3 }, 2.0);
    tl.fromTo(treeRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'bottom' },
      2.2
    );

    // Fade out loading screen
    tl.to(containerRef.current, { opacity: 0, duration: 0.5 }, 3.0);

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className="loading-screen">
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 60 + '%',
            left: Math.random() * 100 + '%',
            animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}

      {/* Water drops */}
      <div className="absolute top-16 flex gap-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (dropsRef.current[i] = el)}
            className="text-2xl opacity-0"
          >
            💧
          </div>
        ))}
      </div>

      {/* Soil */}
      <div className="relative flex flex-col items-center justify-end" style={{ height: '200px', width: '200px' }}>
        {/* Seed */}
        <div ref={seedRef} className="absolute bottom-8 text-4xl opacity-0">🌰</div>

        {/* Sprout */}
        <div ref={sproutRef} className="absolute bottom-8 opacity-0 origin-bottom">
          <svg width="60" height="80" viewBox="0 0 60 80">
            <line x1="30" y1="80" x2="30" y2="20" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round"/>
            <ellipse cx="20" cy="35" rx="15" ry="10" fill="#66BB6A" transform="rotate(-30 20 35)"/>
            <ellipse cx="40" cy="28" rx="15" ry="10" fill="#4CAF50" transform="rotate(30 40 28)"/>
          </svg>
        </div>

        {/* Tree */}
        <div ref={treeRef} className="absolute bottom-8 opacity-0 origin-bottom">
          <svg width="100" height="130" viewBox="0 0 100 130">
            {/* Trunk */}
            <rect x="42" y="90" width="16" height="40" fill="#6D4C41" rx="3"/>
            {/* Bottom foliage */}
            <ellipse cx="50" cy="90" rx="40" ry="30" fill="#2E7D32"/>
            {/* Middle foliage */}
            <ellipse cx="50" cy="65" rx="32" ry="25" fill="#388E3C"/>
            {/* Top foliage */}
            <ellipse cx="50" cy="42" rx="22" ry="20" fill="#43A047"/>
            {/* Highlights */}
            <ellipse cx="40" cy="55" rx="8" ry="6" fill="#66BB6A" opacity="0.5"/>
          </svg>
        </div>

        {/* Soil line */}
        <div className="absolute bottom-0 w-40 h-4 rounded-full" style={{ background: 'linear-gradient(90deg, #4E342E, #6D4C41, #4E342E)' }}/>
      </div>

      {/* Text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="text-gradient text-3xl font-bold font-display">GreenRoots</h1>
        <p className="text-light-green text-sm mt-2 opacity-70">Plant Today, Protect Tomorrow</p>
        <div className="flex gap-1 justify-center mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-forest"
              style={{ animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
