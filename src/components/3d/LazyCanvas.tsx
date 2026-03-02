import { useState, useEffect, useRef, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

interface LazyCanvasProps {
  children: ReactNode;
  camera?: any;
  dpr?: [number, number];
  className?: string;
  style?: React.CSSProperties;
  fallback?: ReactNode;
}

/**
 * LazyCanvas mounts the R3F Canvas only when the container is near the viewport.
 * This prevents exceeding the browser's WebGL context limit (typically 8–16).
 * When the section scrolls far away, the Canvas is unmounted to free the context.
 */
export const LazyCanvas = ({ children, camera, dpr, className, style, fallback }: LazyCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldRender(entry.isIntersecting);
      },
      { rootMargin: '200px 0px' } // Start loading 200px before visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ ...style, position: 'relative' }}>
      {shouldRender ? (
        <Canvas camera={camera} dpr={dpr} gl={{ alpha: true }} style={{ width: '100%', height: '100%', background: 'transparent' }}>
          {children}
        </Canvas>
      ) : (
        fallback || (
          <div className="w-full h-full flex items-center justify-center bg-card/20 rounded-3xl">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        )
      )}
    </div>
  );
};
