import React from 'react';
import './shiny-button.css';

export interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ShinyButton({ children, onClick, className = '' }: ShinyButtonProps) {
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

export default ShinyButton;
