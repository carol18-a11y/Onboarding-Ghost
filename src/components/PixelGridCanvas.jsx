import React, { useEffect, useRef } from 'react';

/**
 * PixelGridCanvas - Interactive pixel-grid cursor trail effect.
 * Renders a dark square grid background and paints an organic energy trail
 * of colored square cells following the mouse path inside its container.
 */
export default function PixelGridCanvas({ containerRef, theme = 'light' }) {
  const canvasRef = useRef(null);
  const activeCellsRef = useRef(new Map());
  const lastMousePosRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  const CELL_SIZE = 30; // 30px x 30px square cells on desktop

  // Color interpolation palette by cell age (0.0 newest -> 1.0 oldest)
  // Orange -> Red -> Pink -> Purple -> Blue -> Cyan
  const getTrailColor = (t) => {
    // Keyframes: [normalizedAge, [r, g, b]]
    const keyframes = [
      [0.0, [249, 115, 22]],   // Orange
      [0.2, [239, 68, 68]],    // Red
      [0.4, [236, 72, 153]],   // Pink
      [0.6, [168, 85, 247]],   // Purple
      [0.8, [59, 130, 246]],   // Blue
      [1.0, [6, 182, 212]],    // Cyan
    ];

    let lower = keyframes[0];
    let upper = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (t >= keyframes[i][0] && t <= keyframes[i + 1][0]) {
        lower = keyframes[i];
        upper = keyframes[i + 1];
        break;
      }
    }

    const range = upper[0] - lower[0];
    const factor = range === 0 ? 0 : (t - lower[0]) / range;

    const r = Math.round(lower[1][0] + factor * (upper[1][0] - lower[1][0]));
    const g = Math.round(lower[1][1] + factor * (upper[1][1] - lower[1][1]));
    const b = Math.round(lower[1][2] + factor * (upper[1][2] - lower[1][2]));

    return [r, g, b];
  };

  useEffect(() => {
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

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (targetElement) {
      resizeObserver.observe(targetElement);
    }

    // Helper to add or reset a grid cell in activeCells
    const addCell = (col, row, opacity) => {
      const key = `${col},${row}`;
      const maxAge = Math.floor(45 + Math.random() * 30); // ~0.75s - 1.25s lifespan at 60fps
      const existing = activeCellsRef.current.get(key);

      if (existing) {
        existing.age = 0; // reset age if mouse re-enters cell
        existing.initialOpacity = Math.max(existing.initialOpacity, opacity);
      } else {
        activeCellsRef.current.set(key, {
          col,
          row,
          age: 0,
          maxAge,
          initialOpacity: opacity,
        });
      }
    };

    // Activate cell and irregular neighbor pattern around a coordinate
    const activateAtPoint = (x, y) => {
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);

      // Primary cell
      addCell(col, row, 1.0);

      // Irregular neighboring cells
      const neighbors = [
        { dx: -1, dy: 0, prob: 0.65, opacity: 0.75 },
        { dx: 1, dy: 0, prob: 0.65, opacity: 0.75 },
        { dx: 0, dy: -1, prob: 0.65, opacity: 0.75 },
        { dx: 0, dy: 1, prob: 0.65, opacity: 0.75 },
        { dx: -1, dy: -1, prob: 0.35, opacity: 0.5 },
        { dx: 1, dy: -1, prob: 0.35, opacity: 0.5 },
        { dx: -1, dy: 1, prob: 0.35, opacity: 0.5 },
        { dx: 1, dy: 1, prob: 0.35, opacity: 0.5 },
      ];

      for (const n of neighbors) {
        if (Math.random() < n.prob) {
          addCell(col + n.dx, row + n.dy, n.opacity * (0.6 + Math.random() * 0.4));
        }
      }
    };

    // Handle mouse movement inside hero container
    const handlePointerMove = (e) => {
      if (!targetElement) return;
      const rect = targetElement.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // Check bounds
      if (currentX < 0 || currentY < 0 || currentX > rect.width || currentY > rect.height) {
        lastMousePosRef.current = null;
        return;
      }

      if (lastMousePosRef.current) {
        const dx = currentX - lastMousePosRef.current.x;
        const dy = currentY - lastMousePosRef.current.y;
        const dist = Math.hypot(dx, dy);

        // Interpolate points along fast mouse movements to keep trail continuous
        const steps = Math.max(1, Math.floor(dist / (CELL_SIZE / 2)));
        for (let i = 1; i <= steps; i++) {
          const interpX = lastMousePosRef.current.x + (dx * i) / steps;
          const interpY = lastMousePosRef.current.y + (dy * i) / steps;
          activateAtPoint(interpX, interpY);
        }
      } else {
        activateAtPoint(currentX, currentY);
      }

      lastMousePosRef.current = { x: currentX, y: currentY };
    };

    const handlePointerLeave = () => {
      lastMousePosRef.current = null;
    };

    const target = targetElement || window;
    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerleave', handlePointerLeave);

    // Animation render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw thin, subtle grid lines according to theme
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.08)';

      ctx.beginPath();
      for (let x = 0; x <= width; x += CELL_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += CELL_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Render & update active colored square cells
      const activeCells = activeCellsRef.current;
      const keysToDelete = [];

      activeCells.forEach((cell, key) => {
        cell.age += 1;

        if (cell.age >= cell.maxAge) {
          keysToDelete.push(key);
          return;
        }

        const t = cell.age / cell.maxAge; // 0.0 -> 1.0
        const alpha = Math.max(0, (1 - t) * cell.initialOpacity);
        const [r, g, b] = getTrailColor(t);

        const posX = cell.col * CELL_SIZE + 1;
        const posY = cell.row * CELL_SIZE + 1;
        const size = CELL_SIZE - 2; // Sharp square with 1px margin line separation

        // Draw solid colored square cell (No radial gradients / circles)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillRect(posX, posY, size, size);

        // Subtle inner glow overlay for vibrancy
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
        ctx.fillRect(posX + 2, posY + 2, size - 4, size - 4);
      });

      // Cleanup aged cells
      for (const key of keysToDelete) {
        activeCells.delete(key);
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (targetElement) {
        resizeObserver.unobserve(targetElement);
      }
      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
