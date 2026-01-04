import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  tier: {
    name: string;
    price: number;
    originalPrice?: number;
    features: string[];
    isRecommended?: boolean;
  };
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, onSelect }) => {
  const isPro = tier.name === 'Pro';
  
  return (
    <div className={`relative bg-white p-8 rounded-xl shadow-lg border-2 flex flex-col h-full transition-transform hover:scale-[1.02] ${isPro ? 'border-oceanBlue shadow-xl' : 'border-iceBlue'}`}>
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 
                        bg-oceanBlue text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-sm">
          BETA PRICING
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-deepOcean">{tier.name}</h3>
      
      {isPro ? (
        <div className="mt-4 flex items-baseline gap-2">
          {tier.originalPrice && (
            <span className="text-2xl text-skyBlue line-through decoration-2 decoration-red-400/50">
              ${tier.originalPrice}
            </span>
          )}
          <div>
            <span className="text-5xl font-extrabold text-deepOcean">
              ${tier.price}
            </span>
            <span className="text-skyBlue ml-1 font-medium">/month</span>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-deepOcean">
            Free
          </span>
        </div>
      )}
      
      {isPro && (
        <p className="mt-2 text-sm text-oceanBlue font-medium">
          Lock in this price forever. Beta users keep $7/month.
        </p>
      )}

      <ul className="mt-8 space-y-4 flex-1">
        {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className={`mt-0.5 p-0.5 rounded-full ${isPro ? 'bg-oceanBlue/10 text-oceanBlue' : 'bg-gray-100 text-gray-400'}`}>
                    <Check size={14} strokeWidth={3} />
                </div>
                {feature}
            </li>
        ))}
      </ul>
      
      <button
        onClick={onSelect}
        className={`mt-8 w-full py-3 rounded-lg font-bold text-sm transition-all shadow-sm ${
            isPro 
            ? 'bg-oceanBlue text-white hover:bg-deepOcean hover:shadow-md' 
            : 'bg-white border-2 border-iceBlue text-deepOcean hover:bg-iceBlue/20'
        }`}
      >
        {isPro ? 'Upgrade Now' : 'Current Plan'}
      </button>
    </div>
  );
};

export default PricingCard;