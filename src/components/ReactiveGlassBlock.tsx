import React, { useRef, useState, useEffect } from 'react';

interface ReactiveGlassBlockProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'ultra' | 'standard' | 'tab-strip' | 'translucent';
  glowColor?: string;
}

export function ReactiveGlassBlock({
  children,
  className = '',
  variant = 'standard',
  glowColor,
}: ReactiveGlassBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [distanceFactor, setDistanceFactor] = useState(0.2);

  // Resolved default glow color: for translucent it's pure neutral white reflection
  const effectiveGlow =
    glowColor ||
    (variant === 'translucent'
      ? 'rgba(255, 255, 255, 0.16)'
      : 'rgba(180, 210, 255, 0.25)');

  // Track mouse even when nearby in surroundings
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const maxDist = 600; // Radius of ambient sensitivity
      
      if (dist < maxDist) {
        // Calculate relative position inside or surrounding the element
        const xPercent = Math.max(-20, Math.min(120, ((e.clientX - rect.left) / rect.width) * 100));
        const yPercent = Math.max(-20, Math.min(120, ((e.clientY - rect.top) / rect.height) * 100));
        setCoords({ x: xPercent, y: yPercent });
        
        // Intensity smoothly falls off as mouse moves away into surroundings
        const proximity = Math.max(0.15, 1 - dist / maxDist);
        setDistanceFactor(proximity);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const baseGlassClass =
    variant === 'ultra'
      ? 'ultra-frosty-glass'
      : variant === 'translucent'
      ? 'glassy-translucent'
      : 'frosty-glass-container';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          '--mouse-x': `${coords.x}%`,
          '--mouse-y': `${coords.y}%`,
          '--glow-intensity': isHovered ? 1 : distanceFactor,
          '--custom-glow': effectiveGlow,
        } as React.CSSProperties
      }
      className={`group/reactive relative isolate ${baseGlassClass} ${className} transition-all duration-300`}
    >
      {/* 1. Surrounding Ambient Caustic Reflection (blooms outside the block) */}
      <div
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] opacity-75 blur-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 380px at var(--mouse-x) var(--mouse-y), ${effectiveGlow}, transparent 75%)`,
          opacity: isHovered ? 0.9 : Math.max(0.25, distanceFactor * 0.75),
        }}
      />

      {/* 2. Reactive Chamfer Rim Reflection (lights up the physical edge where light hits) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-200"
        style={{
          padding: '1.5px',
          background: `radial-gradient(circle 320px at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 35%, transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          opacity: isHovered ? 1 : Math.max(0.35, distanceFactor),
        }}
      />

      {/* 3. Surface Light Glare / Specular Sheet (glides across interior glass surface) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] overflow-hidden mix-blend-overlay transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle 340px at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 40%, transparent 75%)`,
          opacity: isHovered ? 0.85 : Math.max(0.2, distanceFactor * 0.5),
        }}
      />

      {/* Actual Content */}
      <div className="relative z-30 w-full h-full">
        {children}
      </div>
    </div>
  );
}
