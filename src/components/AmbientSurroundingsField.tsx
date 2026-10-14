import { useEffect, useState } from 'react';
import { ScreenId } from '../types';

interface AmbientSurroundingsFieldProps {
  currentScreen: ScreenId;
}

export function AmbientSurroundingsField({ currentScreen }: AmbientSurroundingsFieldProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Atmospheric colors that shift with active screen
  const getAmbientColors = () => {
    switch (currentScreen) {
      case 'showcase':
        return {
          primary: 'rgba(230, 200, 160, 0.14)', // Warm architectural light
          secondary: 'rgba(96, 165, 250, 0.12)', // Atmospheric skylight
          accent: 'rgba(244, 244, 245, 0.1)',
        };
      case 'gallery':
        return {
          primary: 'rgba(255, 255, 255, 0.12)', // High-key studio light
          secondary: 'rgba(167, 139, 250, 0.13)', // Creative ultraviolet
          accent: 'rgba(56, 189, 248, 0.12)',
        };
      case 'case-study':
        return {
          primary: 'rgba(14, 165, 233, 0.18)', // Cyan avionics HUD glow
          secondary: 'rgba(99, 102, 241, 0.15)', // Deep horizon telemetry
          accent: 'rgba(16, 185, 129, 0.12)',
        };
      case 'device-studio':
        return {
          primary: 'rgba(224, 231, 255, 0.15)', // Titanium silver specular
          secondary: 'rgba(59, 130, 246, 0.14)', // Sapphire display reflection
          accent: 'rgba(236, 72, 153, 0.08)',
        };
      case 'html-importer':
        return {
          primary: 'rgba(16, 185, 129, 0.15)', // Compiler emerald caustics
          secondary: 'rgba(139, 92, 246, 0.15)', // Prismatic purple
          accent: 'rgba(245, 158, 11, 0.1)',
        };
    }
  };

  const colors = getAmbientColors();

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-700">
      {/* 1. Interactive Cursor Light Caustic (follows mouse movement across surroundings) */}
      <div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-70 transition-transform duration-100 ease-out"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 45%, transparent 75%)`,
        }}
      />

      {/* 2. Top-Right Atmospheric Glow (behind header and upper viewport) */}
      <div
        className="absolute -top-32 right-1/4 w-[700px] h-[480px] rounded-full blur-[150px] opacity-60 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
        }}
      />

      {/* 3. Bottom Atmospheric Reflection (behind bottom floating tabs dock) */}
      <div
        className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-65 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.accent} 50%, transparent 75%)`,
        }}
      />

      {/* 4. Subtle Optical Horizon Grid Floor */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
