import { useEffect, useRef } from 'react';

export default function GlowCursor() {
  const glowRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (el) {
        el.style.left = pos.current.x - 10 + 'px';
        el.style.top = pos.current.y - 10 + 'px';
      }
      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow hidden md:block"
      style={{
        width: '40px',
        height: '40px',
        background: 'radial-gradient(circle, rgba(165,214,167,0.4) 0%, rgba(46,125,50,0.2) 50%, transparent 70%)',
      }}
    />
  );
}
