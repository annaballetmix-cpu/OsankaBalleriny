import { useEffect, useState } from 'react';

export function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Layered Parallax Background Elements */}
      <div 
        className="absolute top-20 right-20 w-64 h-64 border border-[#E8C4B8]/20 rounded-full blur-sm transition-transform duration-300"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px) scale(1)`,
          opacity: Math.max(0.3, 1 - scrollY / 1000)
        }}
      />
      
      <div 
        className="absolute top-40 left-20 w-48 h-48 rounded-full transition-transform duration-300"
        style={{ 
          background: 'radial-gradient(circle, rgba(232, 196, 184, 0.15) 0%, rgba(232, 196, 184, 0) 70%)',
          transform: `translateY(${scrollY * 0.15}px)`,
          opacity: Math.max(0.4, 1 - scrollY / 800)
        }}
      />

      <div 
        className="absolute bottom-40 left-10 w-32 h-32 border-2 border-[#D4A59A]/20 rounded-full transition-transform duration-300"
        style={{ 
          transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.1}deg)`
        }}
      />

      <div 
        className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full blur-3xl transition-transform duration-300"
        style={{ 
          background: 'radial-gradient(circle, rgba(196, 147, 138, 0.1) 0%, rgba(196, 147, 138, 0) 70%)',
          transform: `translateY(${scrollY * 0.25}px)`,
          opacity: Math.max(0.2, 1 - scrollY / 1200)
        }}
      />

      {/* Small decorative dots */}
      <div 
        className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#C4938A]/40 rounded-full blur-sm transition-transform duration-300"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      
      <div 
        className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#E8C4B8]/50 rounded-full blur-sm transition-transform duration-300"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />

      <div 
        className="absolute bottom-1/3 right-1/5 w-2.5 h-2.5 bg-[#D4A59A]/30 rounded-full blur-sm transition-transform duration-300"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      />

      {/* Gradient overlays for depth */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ 
          background: 'radial-gradient(ellipse at top, rgba(242, 222, 214, 0.3) 0%, transparent 50%)',
          opacity: Math.max(0, 1 - scrollY / 500)
        }}
      />

      <div 
        className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none transition-opacity duration-300"
        style={{ 
          background: 'linear-gradient(to top, rgba(245, 241, 237, 0.4) 0%, transparent 100%)',
          opacity: Math.min(1, scrollY / 300)
        }}
      />
    </>
  );
}
