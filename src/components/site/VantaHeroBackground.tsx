'use client';

import { useEffect, useRef, useState } from 'react';

interface VantaEffect {
  destroy: () => void;
  setOptions?: (options: Record<string, unknown>) => void;
}

export function VantaHeroBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let effect: VantaEffect | null = null;

    async function initVanta() {
      try {
        // Skip heavy WebGL on reduced-motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }

        // Dynamically import Three.js and Vanta Waves in parallel without blocking initial render
        const [THREE, vantaModule] = await Promise.all([
          import('three'),
          // @ts-expect-error - vanta lacks official types
          import('vanta/dist/vanta.waves.min'),
        ]);
        const WAVES = vantaModule.default || vantaModule;

        if (vantaRef.current && !effect) {
          effect = WAVES({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: false, // Prevents scroll hijacking on mobile touchscreens
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x093822, // Rich agricultural emerald green
            shininess: 30.0,
            waveHeight: 16.0,
            waveSpeed: 0.6,
            zoom: 0.9,
          });
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn('Vanta initialization skipped (using CSS fallback):', err);
      }
    }

    initVanta();

    return () => {
      if (effect) {
        try {
          effect.destroy();
        } catch {
          // ignore cleanup errors on fast route switch
        }
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
      aria-hidden="true"
    >
      {/* Fallback ambient glow before Vanta loads or on devices without WebGL */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-40' : 'opacity-100'
        } bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-ink-950/80 to-ink-950`}
      />
      {/* Readability gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/80 to-ink-950 pointer-events-none" />
    </div>
  );
}
