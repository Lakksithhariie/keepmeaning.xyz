import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface GhostModeIndicatorProps {
  visible: boolean;
}

const GhostModeIndicator: React.FC<GhostModeIndicatorProps> = ({ visible }) => {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) setShouldRender(true);
    // Keep it rendered while fading out, actual unmount could be handled if needed, 
    // but opacity control is sufficient for this visual requirement.
  }, [visible]);

  return (
    <div 
      className={`fixed bottom-6 right-6 flex items-center gap-2 
                 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm
                 border border-iceBlue
                 transition-opacity duration-200 pointer-events-none z-50
                 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <Logo state="idle" size="small" />
      <span className="text-sm text-deepOcean font-medium">
        KeepMeaning is ready. Press <kbd className="px-1 py-0.5 bg-iceBlue rounded font-sans ml-1 text-xs">Ctrl+K</kbd>
      </span>
    </div>
  );
};

export default GhostModeIndicator;