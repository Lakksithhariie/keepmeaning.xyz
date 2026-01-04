import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { adjustToneStream } from '../services/geminiService';
import Logo from './Logo';

interface ToneDialProps {
  originalText: string;
  onApply: (newText: string) => void;
  onClose: () => void;
}

const ToneDial: React.FC<ToneDialProps> = ({ originalText, onApply, onClose }) => {
  const [formality, setFormality] = useState(0.5);
  const [previewText, setPreviewText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!originalText) return;
      
      setIsStreaming(true);
      setPreviewText('');
      
      adjustToneStream(originalText, formality, (chunk) => {
        setPreviewText(prev => prev + chunk);
      }).finally(() => {
        setIsStreaming(false);
      });

    }, 300);

    return () => clearTimeout(timer);
  }, [formality, originalText]);

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-xl border border-iceBlue p-6 z-50 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-deepOcean font-bold text-base">Tone Dial</h3>
        <button onClick={onClose} className="text-skyBlue hover:text-oceanBlue transition-colors">
            <X size={18} />
        </button>
      </div>

      {/* Slider Control */}
      <div className="relative mb-6">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={formality}
          onChange={(e) => setFormality(parseFloat(e.target.value))}
          className="w-full h-2 bg-iceBlue rounded-lg appearance-none cursor-pointer accent-oceanBlue focus:outline-none"
        />
        <div className="flex justify-between text-xs text-skyBlue mt-2 font-normal">
          <span>Casual</span>
          <span>Neutral</span>
          <span>Formal</span>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-lg border border-iceBlue p-3 min-h-[100px] text-sm text-deepOcean leading-relaxed relative mb-4">
        {previewText || <span className="text-skyBlue/60 italic">Adjust slider to generate preview...</span>}
        {isStreaming && (
            <div className="absolute top-2 right-2">
                 <Logo state="processing" size="small" />
            </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
          <button 
              onClick={() => onApply(previewText)}
              disabled={!previewText || isStreaming}
              className="flex-1 py-1.5 bg-oceanBlue text-white rounded-md text-sm font-medium hover:bg-deepOcean transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Accept
          </button>
          <button 
              onClick={onClose}
              className="px-3 py-1.5 bg-transparent text-skyBlue border border-skyBlue rounded-md text-sm font-medium hover:bg-iceBlue transition-colors"
          >
              Cancel
          </button>
      </div>
    </div>
  );
};

export default ToneDial;