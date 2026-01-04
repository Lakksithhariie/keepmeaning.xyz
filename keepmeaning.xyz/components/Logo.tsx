import React from 'react';

interface LogoProps {
  state?: 'idle' | 'processing' | 'complete';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ state = 'idle', size = 'medium', className = '' }) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64
  };

  const pxSize = sizeMap[size];

  // Using the Static Fallback SVG from PRD 2.3 with CSS animation
  return (
    <div className={`relative ${className}`} style={{ width: pxSize, height: pxSize }}>
      <svg width={pxSize} height={pxSize} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base Bar */}
        <rect x="8" y="20" width="32" height="8" rx="4" fill="#1C4D8D" opacity="0.3"/>
        
        {/* Cursor / Indicator */}
        {state === 'idle' && (
          <rect x="12" y="16" width="4" height="16" fill="#4988C4" className="animate-pulse">
             <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
          </rect>
        )}
        
        {state === 'processing' && (
          <g>
            <rect x="12" y="16" width="4" height="16" fill="#4988C4">
              <animate attributeName="x" values="12;32;12" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;1" dur="0.2s" repeatCount="indefinite" />
            </rect>
          </g>
        )}

        {state === 'complete' && (
           <path d="M14 24L20 30L34 16" stroke="#1C4D8D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};

export default Logo;