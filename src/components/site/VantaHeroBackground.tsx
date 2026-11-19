'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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
        // Dynamic import to avoid SSR evaluation
        // @ts-expect-error - vanta lacks official types
        const vantaModule = await import('vanta/dist/vanta.waves.min');
        const WAVES = vantaModule.default || vantaModule;

        if (vantaRef.current && !effect) {
          effect = WAVES({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.2,
            color: 0x093822, // Rich agricultural emerald green
            shininess: 35.0,
            waveHeight: 18.0,
            waveSpeed: 0.7,
            zoom: 0.88,
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
