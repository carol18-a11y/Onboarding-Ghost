'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './TrueFocus.css';

const TrueFocus = ({
  sentence = 'Blindly',
  separator = ' ',
  blurAmount = 5,
  borderColor = '#7c3aed',
  glowColor = 'rgba(124, 58, 237, 0.5)',
  animationDuration = 0.35,
}) => {
  const words = sentence.split(separator);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updateRect = () => {
    if (!wordRefs.current[0] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[0].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  };

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  const handleMouseEnter = () => {
    updateRect();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span 
      className="focus-container" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {words.map((word, index) => {
        return (
          <span
            key={index}
            ref={el => {
              wordRefs.current[index] = el;
            }}
            className="focus-word word-purple"
            style={{
              filter: isHovered ? 'blur(0px)' : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s cubic-bezier(0.16, 1, 0.3, 1)`,
              '--border-color': borderColor,
              '--glow-color': glowColor,
            }}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 1.1
        }}
        transition={{
          duration: animationDuration,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{
          '--border-color': borderColor,
          '--glow-color': glowColor
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </span>
  );
};

export default TrueFocus;
