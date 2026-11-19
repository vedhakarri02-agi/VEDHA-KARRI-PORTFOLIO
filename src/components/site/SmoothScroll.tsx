'use client';

import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12, // Snappy, direct response to scrolling while maintaining silky momentum
        anchors: true,
        smoothWheel: true,
        syncTouch: false, // Preserves native touch response on mobile
      }}
    >
      {children}
    </ReactLenis>
  );
}
