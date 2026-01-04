import React from 'react';
import { Check, X } from 'lucide-react';
import Logo from './Logo';

interface UpgradeModalProps {
  trigger: 'token-limit' | 'feature-lock';
  onClose: () => void;
  onConfirm: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ trigger, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-deepOcean/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
        </button>

        <div className="flex justify-center mb-6">
             <Logo state="complete" size="medium" />
        </div>
        
        {trigger === 'token-limit' && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-deepOcean mb-2">
              You've hit your free limit
            </h2>
            <p className="text-oceanBlue/80 text-sm">
              You've used 50,000 tokens this month. Upgrade to keep writing without limits.
            </p>
          </div>
        )}
        
        {trigger === 'feature-lock' && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-deepOcean mb-2">
              Unlock Pro Features
            </h2>
            <p className="text-oceanBlue/80 text-sm">
              Get Live Meaning Map & Flow Trainer for clearer, more impactful writing.
            </p>
          </div>
        )}
        
        {/* Pricing Display */}
        <div className="bg-iceBlue/30 p-4 rounded-xl mb-6 border border-iceBlue text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-xl text-skyBlue line-through decoration-red-400/50 decoration-2">$19</span>
            <span className="text-4xl font-extrabold text-deepOcean">$7</span>
            <span className="text-oceanBlue font-medium">/month</span>
          </div>
          <p className="text-xs text-center text-skyBlue mt-2 font-medium uppercase tracking-wide">
            Beta pricing locked in forever
          </p>
        </div>
        
        {/* Benefits */}
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-0.5 bg-green-100 text-green-600 rounded-full"><Check size={12} strokeWidth={3} /></div>
            <span>10x more tokens (500K/month)</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-0.5 bg-green-100 text-green-600 rounded-full"><Check size={12} strokeWidth={3} /></div>
            <span>Live Meaning Map Analysis</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-0.5 bg-green-100 text-green-600 rounded-full"><Check size={12} strokeWidth={3} /></div>
            <span>Advanced Flow Trainer Analytics</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-0.5 bg-green-100 text-green-600 rounded-full"><Check size={12} strokeWidth={3} /></div>
            <span>Unlimited History Storage</span>
          </li>
        </ul>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full py-3.5 bg-oceanBlue text-white rounded-xl font-bold text-base hover:bg-deepOcean transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Upgrade to Pro
          </button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 font-medium">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;