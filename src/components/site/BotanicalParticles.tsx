'use client';

import { useId } from 'react';

/**
 * Ambient botanical spore / bio-luminescent particles.
 * Pure lightweight CSS animations with minimal CPU/GPU overhead.
 */
export function BotanicalParticles() {
  const particles = [
    { top: '15%', left: '8%', size: 3, delay: '0s', duration: '7s' },
    { top: '28%', left: '88%', size: 4, delay: '1.5s', duration: '9s' },
    { top: '45%', left: '18%', size: 2.5, delay: '3s', duration: '8s' },
    { top: '62%', left: '82%', size: 3.5, delay: '0.8s', duration: '10s' },
    { top: '78%', left: '12%', size: 2, delay: '2.2s', duration: '7.5s' },
    { top: '88%', left: '72%', size: 4, delay: '4s', duration: '8.5s' },
    { top: '35%', left: '94%', size: 3, delay: '2.7s', duration: '11s' },
    { top: '55%', left: '6%', size: 2, delay: '1.2s', duration: '9.5s' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="ambient-spore"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
