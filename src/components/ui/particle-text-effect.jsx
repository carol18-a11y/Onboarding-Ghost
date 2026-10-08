"use client";

import React, { useEffect, useRef, useState } from "react";

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.closeEnoughTarget = 30;
    this.maxSpeed = 9.0;
    this.maxForce = 0.45;
    this.particleSize = 3.5;
    this.isKilled = false;
  }

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    );

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    );
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx, drawAsPoints, color) {
    const r = color ? color.r : 0;
    const g = color ? color.g : 0;
    const b = color ? color.b : 0;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 3, 3);
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;
      this.isKilled = true;
    }
  }

  generateRandomPos(x, y, mag) {
    const randomX = Math.random() * 1200;
    const randomY = Math.random() * 600;
    const direction = {
      x: randomX - x,
      y: randomY - y,
    };
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }
    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

export function ParticleTextEffect({
  words = ["Bridging the Gap Between", "Code & Historical Context"],
  lines = null,
  pixelSteps = 2,
  drawAsPoints = true,
  theme = "light",
  particleColor = null,
  once = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const hasAnimatedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  const isDark = theme === "dark";
  const defaultColor = isDark ? { r: 241, g: 245, b: 249 } : { r: 0, g: 0, b: 0 };
  const targetParticleColor = particleColor || defaultColor;

  const textLines = lines || (Array.isArray(words) ? words : [words]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [once]);

  const generateRandomPos = (x, y, mag) => {
    const randomX = Math.random() * 1200;
    const randomY = Math.random() * 600;
    const direction = {
      x: randomX - x,
      y: randomY - y,
    };
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }
    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  };

  const createTextParticles = (canvas) => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    offscreenCtx.fillStyle = "white";

    // Extra large, ultra-bold font for max legibility
    const calculatedFontSize = Math.min(Math.floor(canvas.width / 13), 64);
    offscreenCtx.font = `900 ${calculatedFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";

    const lineHeight = calculatedFontSize * 1.22;
    const totalHeight = textLines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    textLines.forEach((line, idx) => {
      offscreenCtx.fillText(line, canvas.width / 2, startY + idx * lineHeight);
    });

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    // Shuffle for fluid assembly
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex;
      const alpha = pixels[pixelIndex + 3];

      if (alpha > 100) {
        const x = (pixelIndex / 4) % canvas.width;
        const y = Math.floor(pixelIndex / 4 / canvas.width);

        let particle;
        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const randomPos = generateRandomPos(
            canvas.width / 2,
            canvas.height / 2,
            (canvas.width + canvas.height) / 2
          );
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;
          particle.maxSpeed = Math.random() * 8 + 5;
          particle.maxForce = particle.maxSpeed * 0.07;
          particle.particleSize = Math.random() * 3 + 3;
          particles.push(particle);
        }

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];

      // Interactive mouse repulsion
      if (mouseRef.current.isHovering) {
        const dx = particle.pos.x - mouseRef.current.x;
        const dy = particle.pos.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 45) {
          const angle = Math.atan2(dy, dx);
          const force = (45 - dist) * 0.2;
          particle.pos.x += Math.cos(angle) * force;
          particle.pos.y += Math.sin(angle) * force;
        }
      }

      particle.move();
      particle.draw(ctx, drawAsPoints, targetParticleColor);

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1);
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!isVisible || (once && hasAnimatedRef.current)) return;
    hasAnimatedRef.current = true;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.min(rect.width || 1000, 1100);
    const height = textLines.length > 1 ? 190 : 110;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    createTextParticles({ width, height });
    animate();

    const handleMouseMove = (e) => {
      const canvasRect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - canvasRect.left),
        y: (e.clientY - canvasRect.top),
        isHovering: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} className={`w-full flex justify-center items-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="block cursor-pointer select-none"
        style={{ width: "100%", maxWidth: "1100px", height: "auto" }}
      />
    </div>
  );
}

export default ParticleTextEffect;
