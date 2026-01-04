import React, { useEffect, useRef } from 'react';
import { Check, Sliders, Zap, BookOpen, X, Command, Lock } from 'lucide-react';

interface ContextMenuProps {
  onSelect: (action: string) => void;
  onClose: () => void;
  textLength: number;
  isPro: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ onSelect, onClose, textLength, isPro }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Updated to include Pro locking logic
  const actions = [
    { 
      id: 'check', 
      label: 'Check Errors', 
      icon: Check, 
      enabled: textLength <= 2000, 
      desc: "Local grammar & style check",
      proOnly: false
    },
    { 
      id: 'tone', 
      label: 'Adjust Tone', 
      icon: Sliders, 
      enabled: textLength <= 1000, 
      desc: "Formality & audience dial",
      proOnly: false
    },
    { 
      id: 'simplify', 
      label: 'Simplify', 
      icon: BookOpen, 
      enabled: textLength <= 2000, 
      desc: "ELI5 & analogies",
      proOnly: false
    },
    { 
      id: 'analyze', 
      label: 'Analyze Logic', 
      icon: Zap, 
      enabled: textLength <= 4000, 
      desc: "Find logical gaps (Cloud)",
      proOnly: true
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deepOcean/10 backdrop-blur-[1px] animate-fade-in">
      <div 
        ref={menuRef}
        className="w-full max-w-[280px] bg-white rounded-lg shadow-lg border border-iceBlue overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-iceBlue flex justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-skyBlue">
            <Command size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Actions</span>
          </div>
          <button onClick={onClose} className="text-skyBlue hover:text-deepOcean transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="py-1">
          {actions.map((action) => {
            const isLocked = action.proOnly && !isPro;
            return (
              <button
                key={action.id}
                onClick={() => (action.enabled || isLocked) && onSelect(action.id)}
                disabled={!action.enabled && !isLocked}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150 relative group
                  ${(action.enabled || isLocked)
                    ? 'hover:bg-iceBlue cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed bg-white'
                  }`}
              >
                <action.icon size={16} className={isLocked ? "text-gray-400" : "text-oceanBlue"} />
                <div className="flex-1">
                  <div className={`text-sm font-normal ${isLocked ? "text-gray-500" : "text-deepOcean"}`}>{action.label}</div>
                </div>
                {!action.enabled && !isLocked && (
                   <span className="text-[10px] text-skyBlue">Limit</span>
                )}
                {isLocked && (
                    <Lock size={12} className="text-oceanBlue" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;