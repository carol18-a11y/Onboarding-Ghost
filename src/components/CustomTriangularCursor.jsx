import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomTriangularCursor
 * Renders a larger, solid black filled triangular cursor with inertia & direction rotation.
 * Scoped strictly to target containerRef (Features & Live Demo sections).
 */
export default function CustomTriangularCursor({ containerRef }) {
  const cursorRef = useRef(null);
  const [isInside, setIsInside] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const currentAngle = useRef(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    // Check if device is touch-only
    const checkTouch = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0 && !window.matchMedia('(pointer: fine)').matches);
    };
    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const container = containerRef?.current;
    if (!container) return;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        if (isInside) {
          setIsInside(false);
          container.style.cursor = 'auto';
        }
        return;
      }

      if (!isInside) {
        setIsInside(true);
        container.style.cursor = 'none';
      }

      if (!hasMoved) {
        setHasMoved(true);
        currentPos.current = { x, y };
      }

      mousePos.current = { x, y };
    };

    const handlePointerLeave = () => {
      setIsInside(false);
      container.style.cursor = 'auto';
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    const render = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      const dx = targetX - currentPos.current.x;
      const dy = targetY - currentPos.current.y;

      // 100-200ms inertia smoothing
      const lerp = 0.18;
      currentPos.current.x += dx * lerp;
      currentPos.current.y += dy * lerp;

      // Directional rotation based on cursor trajectory
      const dist = Math.hypot(dx, dy);
      if (dist > 0.8) {
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        let diff = angle - currentAngle.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        currentAngle.current += diff * 0.2;
      }

      if (cursorRef.current) {
        const x = currentPos.current.x;
        const y = currentPos.current.y;
        const deg = (currentAngle.current * 180) / Math.PI;
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${deg}deg)`;
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.style.cursor = 'auto';
    };
  }, [containerRef, isInside, hasMoved]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-300 ${
        isInside ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* Larger, solid black filled triangular custom cursor */}
      <svg
        width="26"
        height="32"
        viewBox="0 0 26 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <path
          d="M13 2L23 27L13 22L3 27L13 2Z"
          fill="#000000"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
