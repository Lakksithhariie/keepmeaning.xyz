import React from 'react';
import { Lock } from 'lucide-react';

interface FeatureLockProps {
  featureName: string;
  onUpgrade: () => void;
}

const FeatureLock: React.FC<FeatureLockProps> = ({ featureName, onUpgrade }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-iceBlue/30 rounded-lg border border-iceBlue/50 animate-fade-in">
      <div className="p-2 bg-iceBlue rounded-full text-skyBlue">
         <Lock className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-deepOcean">
          {featureName} is locked
        </p>
        <p className="text-xs text-oceanBlue">
          Available in Pro Plan
        </p>
      </div>
      <button 
        onClick={onUpgrade}
        className="px-4 py-1.5 bg-oceanBlue text-white text-xs font-bold rounded-md hover:bg-deepOcean transition-colors shadow-sm"
      >
        Upgrade
      </button>
    </div>
  );
};

export default FeatureLock;