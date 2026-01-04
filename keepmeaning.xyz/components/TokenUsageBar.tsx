import React from 'react';
import { Zap } from 'lucide-react';

interface TokenUsageBarProps {
  usage: number;
  limit: number;
  isPro: boolean;
  onUpgrade: () => void;
}

const TokenUsageBar: React.FC<TokenUsageBarProps> = ({ usage, limit, isPro, onUpgrade }) => {
  const percentage = Math.min((usage / limit) * 100, 100);
  const isWarning = percentage > 80;
  
  return (
    <div className="px-6 py-2 bg-white border-b border-iceBlue flex flex-col justify-center">
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-skyBlue mb-1.5">
        <span className="flex items-center gap-1"><Zap size={10} /> Monthly Token Usage</span>
        <span className={isWarning ? 'text-red-500' : ''}>{usage.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div className="w-full bg-iceBlue/30 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isWarning ? 'bg-red-500' : 'bg-oceanBlue'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isWarning && !isPro && (
        <button 
          onClick={onUpgrade}
          className="text-xs text-oceanBlue font-bold hover:underline mt-1.5 text-left"
        >
          Running low? Upgrade to Pro to remove limits.
        </button>
      )}
    </div>
  );
};

export default TokenUsageBar;