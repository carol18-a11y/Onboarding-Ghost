import React, { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import './SlideCommit.css';

export default function SlideCommit({
  label = 'Start AI Tour',
  doneLabel = 'Tour Started!',
  errorLabel = 'Try Again',
  onConfirm,
  width = 195,
  height = 48,
  disabled = false,
  className = ''
}) {
  const [phase, setPhase] = useState('idle');
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    if (disabled || phase === 'pending') return;
    setPhase('pending');
    try {
      if (onConfirm) {
        await onConfirm();
      }
      setPhase('done');
      setTimeout(() => setPhase('idle'), 2000);
    } catch (err) {
      setPhase('error');
      setTimeout(() => setPhase('idle'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={{
        '--pill-width': `${width}px`,
        '--pill-height': `${height}px`,
        width: `${width}px`,
        height: `${height}px`
      }}
      className={`start-tour-pill ${isHovered ? 'hovered' : ''} ${className}`}
    >
      {/* Sliding White Circular Element with Black Arrow */}
      <div className="tour-circle-handle">
        {phase === 'pending' ? (
          <Loader2 className="w-4 h-4 text-black animate-spin" />
        ) : phase === 'done' ? (
          <Check className="w-4 h-4 text-black stroke-[3]" />
        ) : (
          <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
        )}
      </div>

      {/* Button Label Text */}
      <span className="tour-label-text">
        {phase === 'done' ? doneLabel : phase === 'error' ? errorLabel : label}
      </span>
    </button>
  );
}
