import React, { useEffect, useRef, useState } from 'react';

/**
 * MouseDrawingTrail
 * Renders a thin, organic, continuous hand-drawn line following the mouse path.
 * Older portions of the path smoothly fade out.
 * Scoped strictly to target containerRef (Architecture section).
 */
export default function MouseDrawingTrail({ containerRef, theme = 'light' }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const lastMousePosRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    // Check touch device
    const checkTouch = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0 && !window.matchMedia('(pointer: fine)').matches);
    };
    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const targetElement = containerRef?.current || canvas.parentElement;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      if (!targetElement) return;
      const rect = targetElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (targetElement) resizeObserver.observe(targetElement);

    const handlePointerMove = (e) => {
      if (!targetElement) return;
      const rect = targetElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lastMousePosRef.current = null;
        return;
      }

      const now = Date.now();
      pointsRef.current.push({ x, y, time: now });
      lastMousePosRef.current = { x, y };
    };

    const handlePointerLeave = () => {
      lastMousePosRef.current = null;
    };

    const target = targetElement || window;
    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerleave', handlePointerLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const points = pointsRef.current;
      const now = Date.now();
      const maxAge = 1200; // 1.2s trail lifespan

      // Remove points older than maxAge
      while (points.length > 0 && now - points[0].time > maxAge) {
        points.shift();
      }

      if (points.length > 1) {
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw path with progressive segment opacity fading from newest to oldest
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];

          const age = now - p2.time;
          const lifeProgress = Math.max(0, 1 - age / maxAge); // 1.0 -> 0.0

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          const alpha = lifeProgress * 0.75;
          if (isDark) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha * 0.85})`;
          }

          ctx.stroke();
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (targetElement) resizeObserver.unobserve(targetElement);
      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, theme, isDark]);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
