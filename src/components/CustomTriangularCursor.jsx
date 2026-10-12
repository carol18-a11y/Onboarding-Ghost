import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomTriangularCursor
 * Renders a solid black filled triangular cursor with inertia & directional rotation.
 * Positioned fixed across the viewport so transitions between sections are 100% continuous
 * without jumps, handoff flickers, or scroll clipping.
 */
export default function CustomTriangularCursor({ containerRef }) {
  const cursorRef = useRef(null);
  const [isInside, setIsInside] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const currentAngle = useRef(0);
  const isHoveringInteractive = useRef(false);
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

    const checkBounds = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const handlePointerMove = (e) => {
      const inBounds = checkBounds(e.clientX, e.clientY);

      if (!inBounds) {
        if (isInside) {
          setIsInside(false);
          container.classList.remove('hide-system-cursor');
        }
        return;
      }

      if (!isInside) {
        setIsInside(true);
        container.classList.add('hide-system-cursor');
      }

      if (!hasMoved) {
        setHasMoved(true);
        currentPos.current = { x: e.clientX, y: e.clientY };
      }

      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = document.elementFromPoint(e.clientX, e.clientY);
      isHoveringInteractive.current = Boolean(
        target?.closest('button, a, input, select, textarea, [role="button"], [tabindex="0"]')
      );
    };

    const handlePointerLeave = () => {
      setIsInside(false);
      container.classList.remove('hide-system-cursor');
    };

    const handleScroll = () => {
      if (mousePos.current.x < 0) return;
      const inBounds = checkBounds(mousePos.current.x, mousePos.current.y);
      if (inBounds !== isInside) {
        setIsInside(inBounds);
        if (inBounds) {
          container.classList.add('hide-system-cursor');
        } else {
          container.classList.remove('hide-system-cursor');
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      const dx = targetX - currentPos.current.x;
      const dy = targetY - currentPos.current.y;

      // Smooth inertia lerp
      const lerp = 0.22;
      currentPos.current.x += dx * lerp;
      currentPos.current.y += dy * lerp;

      // Directional rotation based on cursor trajectory
      const dist = Math.hypot(dx, dy);
      if (dist > 0.8) {
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        let diff = angle - currentAngle.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        currentAngle.current += diff * 0.22;
      }

      if (cursorRef.current) {
        const x = currentPos.current.x;
        const y = currentPos.current.y;
        const deg = (currentAngle.current * 180) / Math.PI;
        const scale = isHoveringInteractive.current ? 1.15 : 1;
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${deg}deg) scale(${scale})`;
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      container.classList.remove('hide-system-cursor');
    };
  }, [containerRef, isInside, hasMoved]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-200 ${
        isInside ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* Solid black filled triangular custom cursor */}
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
