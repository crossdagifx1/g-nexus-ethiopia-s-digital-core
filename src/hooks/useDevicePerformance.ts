import { useState, useEffect } from 'react';

interface DevicePerformance {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  isLowEnd: boolean;
  particleScale: number;
  dpr: [number, number];
}

export function useDevicePerformance(): DevicePerformance {
  const [perf, setPerf] = useState<DevicePerformance>(() => compute());
  
  useEffect(() => {
    const update = () => setPerf(compute());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return perf;
}

function compute(): DevicePerformance {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;
  const isTouch = typeof navigator !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
  const isLowEnd = cores <= 4;

  let particleScale = 1;
  let dpr: [number, number] = [1, 2];

  if (isMobile) {
    particleScale = isLowEnd ? 0.3 : 0.4;
    dpr = [1, 1];
  } else if (isTablet) {
    particleScale = isLowEnd ? 0.5 : 0.6;
    dpr = [1, 1.5];
  }

  return { isMobile, isTablet, isTouch, isLowEnd, particleScale, dpr };
}
