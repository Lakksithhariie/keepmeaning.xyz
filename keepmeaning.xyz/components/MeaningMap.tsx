import React, { useState } from 'react';
import { MeaningFragment } from '../types';
import { AlertTriangle, Info, HelpCircle, XCircle } from 'lucide-react';

interface MeaningMapProps {
  fragments: MeaningFragment[];
  onDismiss: () => void;
}

const MeaningMap: React.FC<MeaningMapProps> = ({ fragments, onDismiss }) => {
  const [activeFragment, setActiveFragment] = useState<MeaningFragment | null>(null);

  if (fragments.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
        case 'ambiguous-claim': return <HelpCircle size={16} />;
        case 'unsupported-assertion': return <AlertTriangle size={16} />;
        case 'vague-pronoun': return <Info size={16} />;
        case 'logical-gap': return <XCircle size={16} />;
        default: return <Info size={16} />;
    }
  };

  const getSeverityColor = (severity: string) => {
      switch(severity) {
          case 'high': return 'text-deepOcean bg-iceBlue border-deepOcean';
          case 'medium': return 'text-oceanBlue bg-iceBlue border-oceanBlue';
          case 'low': return 'text-skyBlue bg-white border-skyBlue';
          default: return 'text-gray-500';
      }
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-iceBlue z-40 transform transition-transform overflow-y-auto">
        <div className="p-4 border-b border-iceBlue bg-white flex justify-between items-center sticky top-0 z-10">
            <h3 className="font-bold text-deepOcean text-base flex items-center gap-2">
                Meaning Map
            </h3>
            <button onClick={onDismiss} className="text-skyBlue hover:text-deepOcean">
                Close
            </button>
        </div>
        
        <div className="p-4 space-y-3">
            <div className="text-xs uppercase tracking-wide text-skyBlue font-bold mb-1">Logical Fragility Detected</div>
            {fragments.map((frag) => (
                <div 
                    key={frag.id}
                    onClick={() => setActiveFragment(frag)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors duration-150 
                    ${activeFragment?.id === frag.id ? 'bg-iceBlue border-oceanBlue' : 'border-iceBlue hover:bg-iceBlue/30'}
                    `}
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 uppercase ${getSeverityColor(frag.severity)}`}>
                            {getIcon(frag.type)}
                            {frag.severity}
                        </div>
                    </div>
                    <p className="text-sm text-deepOcean font-normal mb-1 leading-snug">"{frag.reasoning}"</p>
                    <p className="text-xs text-oceanBlue opacity-80 mt-2 font-normal">Suggestion: {frag.suggestion}</p>
                </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MeaningMap;