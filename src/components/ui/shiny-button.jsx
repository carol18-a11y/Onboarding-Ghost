import React from 'react';
import { ArrowRight } from 'lucide-react';
import './shiny-button.css';

export function ShinyButton({ children = 'View Demo', onClick, className = '' }) {
  return (
    <button type="button" className={`view-demo-btn ${className}`} onClick={onClick}>
      <span className="view-demo-content">
        <span>{children}</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300 stroke-[2.5]" />
      </span>
    </button>
  );
}

export default ShinyButton;
