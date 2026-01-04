import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Brain, Zap, BarChart2, BookOpen, Command, CheckCircle2 } from 'lucide-react';
import ToneDial from './ToneDial';
import MeaningMap from './MeaningMap';
import Simplifier from './Simplifier';
import FlowTrainer from './FlowTrainer';
import ContextMenu from './ContextMenu';
import GhostModeIndicator from './GhostModeIndicator';
import UpgradeModal from './UpgradeModal';
import FeatureLock from './FeatureLock';
import { localCheckErrors, calculateFlowMetricsLocal } from '../services/localEngine';
import { analyzeMeaningMap } from '../services/geminiService';
import { WritingError, MeaningFragment, FlowMetrics, EditorMode, UserPlan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface WritingInterfaceProps {
    userPlan: UserPlan;
    onUpgrade: () => void;
    tokenUsage: number;
    setTokenUsage: React.Dispatch<React.SetStateAction<number>>;
}

const WritingInterface: React.FC<WritingInterfaceProps> = ({ userPlan, onUpgrade, tokenUsage, setTokenUsage }) => {
  const [text, setText] = useState<string>("KeepMeaning.xyz aims to restore user agency in the age of AI. Writing assistants often erode our unique voice by over-polishing text into generic corporate speak. We believe technology should teach, not replace. By offering pedagogical feedback instead of silent corrections, we empower writers to improve their craft long-term.");
  const [activeMode, setActiveMode] = useState<EditorMode>('write');
  const [errors, setErrors] = useState<WritingError[]>([]);
  const [meaningFragments, setMeaningFragments] = useState<MeaningFragment[]>([]);
  const [flowData, setFlowData] = useState<FlowMetrics | null>(null);
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // UI States
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showToneDial, setShowToneDial] = useState(false);
  const [showSimplifier, setShowSimplifier] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Billing States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<'token-limit' | 'feature-lock'>('token-limit');
  
  const isPro = userPlan === 'pro';
  const tokenLimit = isPro ? 500000 : 50000;

  // Refs for Scroll Syncing
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Inactivity Timer for Ghost Mode
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setIsGhostMode(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsGhostMode(true), 5000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowContextMenu(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowContextMenu(false);
        setActiveMode('write');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate token usage
  const consumeTokens = (amount: number) => {
      if (tokenUsage + amount > tokenLimit) {
          setUpgradeTrigger('token-limit');
          setShowUpgradeModal(true);
          return false;
      }
      setTokenUsage(prev => prev + amount);
      return true;
  };

  const handleMenuAction = (actionId: string) => {
    setShowContextMenu(false);
    switch (actionId) {
      case 'check':
        runLocalCheck();
        break;
      case 'tone':
        setShowToneDial(true);
        break;
      case 'simplify':
        if (consumeTokens(500)) {
            setShowSimplifier(true);
        }
        break;
      case 'analyze':
        // Pro Check for Meaning Map
        if (!isPro) {
            setUpgradeTrigger('feature-lock');
            setShowUpgradeModal(true);
        } else if (consumeTokens(1000)) {
            handleMeaningAnalysis();
        }
        break;
    }
  };

  const runLocalCheck = () => {
    const foundErrors = localCheckErrors(text);
    setErrors(foundErrors);
    setActiveMode('write');
  };

  const handleMeaningAnalysis = async () => {
    setIsAnalyzing(true);
    setActiveMode('analyze-meaning');
    const fragments = await analyzeMeaningMap(text);
    setMeaningFragments(fragments);
    setIsAnalyzing(false);
  };

  const handleFlowAnalysis = () => {
      if (!isPro) {
          setUpgradeTrigger('feature-lock');
          setShowUpgradeModal(true);
          return;
      }
      const data = calculateFlowMetricsLocal(text);
      setFlowData(data);
  };

  const applyTextUpdate = (newText: string) => {
    setText(newText);
    setShowToneDial(false);
    setShowSimplifier(false);
    setMeaningFragments([]);
    setErrors([]); 
    setActiveMode('write');
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const renderBackdrop = () => {
    if (activeMode !== 'analyze-meaning' || meaningFragments.length === 0) return null;

    let lastIndex = 0;
    const elements = [];
    const sortedFragments = [...meaningFragments].sort((a, b) => a.location.start - b.location.start);

    sortedFragments.forEach((frag, idx) => {
      if (frag.location.start > lastIndex) {
        elements.push(<span key={`text-${idx}`}>{text.slice(lastIndex, frag.location.start)}</span>);
      }

      let classes = '';
      if (frag.severity === 'high') {
          classes = 'border-b-2 border-dashed border-deepOcean bg-deepOcean/10';
      } else if (frag.severity === 'medium') {
          classes = 'border-b-2 border-dashed border-oceanBlue bg-oceanBlue/10';
      } else {
          classes = 'border-b-2 border-dashed border-skyBlue bg-skyBlue/10';
      }

      elements.push(
        <span key={`frag-${frag.id}`} className={`${classes} cursor-help hover:bg-opacity-25 transition-colors duration-150 rounded-sm`}>
          {text.slice(frag.location.start, frag.location.end)}
        </span>
      );

      lastIndex = frag.location.end;
    });

    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }
    if (text.endsWith('\n')) {
        elements.push(<br key="br-end"/>);
    }

    return elements;
  };

  // Donut Chart Data
  const remaining = Math.max(0, tokenLimit - tokenUsage);
  const data = [
      { name: 'Used', value: tokenUsage },
      { name: 'Remaining', value: remaining },
  ];
  const COLORS = ['#1C4D8D', '#BDE8F5'];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 pt-4 pb-8 relative flex flex-col h-full animate-fade-in">
        
        {/* Token Usage Donut Widget */}
        <div className="fixed bottom-6 right-6 z-40 group">
             <div className="bg-white p-2 rounded-full shadow-lg border border-iceBlue hover:scale-105 transition-transform cursor-pointer relative">
                 <div className="w-16 h-16">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={20}
                                outerRadius={30}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => value.toLocaleString()} 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} 
                            />
                        </PieChart>
                     </ResponsiveContainer>
                 </div>
                 {/* Mini Label on Hover */}
                 <div className="absolute bottom-full right-0 mb-2 w-32 bg-deepOcean text-white text-xs p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <div className="flex justify-between mb-1">
                         <span>Used:</span>
                         <span className="font-bold">{Math.round((tokenUsage/tokenLimit)*100)}%</span>
                     </div>
                     <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                         <div className="bg-white h-full" style={{width: `${(tokenUsage/tokenLimit)*100}%`}}></div>
                     </div>
                     <div className="mt-1 text-[10px] text-skyBlue text-right">
                         {tokenUsage.toLocaleString()} / {tokenLimit.toLocaleString()}
                     </div>
                 </div>
             </div>
        </div>

        {/* Local Toolbar */}
        <div className="flex justify-between items-center mb-6 mt-6">
            <h1 className="text-xl font-serif text-gray-400 italic">Untitled Draft</h1>
            <div className="flex gap-3">
                 <button 
                  onClick={() => setShowContextMenu(true)}
                  className="px-3 py-1.5 text-sm font-medium text-oceanBlue hover:bg-iceBlue rounded-lg flex items-center gap-2 transition-colors duration-150 border border-transparent hover:border-iceBlue"
                >
                    <Command size={14} /> Actions
                </button>
                <button 
                    onClick={handleFlowAnalysis}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-iceBlue text-deepOcean text-sm font-medium rounded-lg hover:border-oceanBlue transition-colors duration-150 relative"
                >
                    <BarChart2 size={16} />
                    <span>Flow</span>
                </button>
            </div>
        </div>

        {/* Editor Container */}
        <div className="relative group flex-1 min-h-[60vh] text-lg leading-relaxed font-serif">
            
            <div 
                ref={backdropRef}
                className="absolute inset-0 z-0 p-0 whitespace-pre-wrap break-words pointer-events-none text-transparent overflow-hidden"
                aria-hidden="true"
            >
                {renderBackdrop()}
            </div>

            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onScroll={handleScroll}
                className={`relative z-10 w-full h-full min-h-[60vh] resize-none outline-none bg-transparent placeholder:text-skyBlue/50 transition-colors duration-200 ${activeMode === 'analyze-meaning' ? 'text-deepOcean' : 'text-deepOcean'}`}
                placeholder="Start writing..."
                spellCheck={false}
            />

            {isAnalyzing && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                   <div className="flex flex-col items-center gap-4">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oceanBlue"></div>
                       <p className="text-oceanBlue font-medium text-sm animate-pulse">Analyzing...</p>
                   </div>
               </div>
            )}

            {/* Error Highlights */}
            {errors.length > 0 && activeMode === 'write' && (
                <div className="absolute top-0 right-[-200px] w-56 space-y-3 pt-2">
                    {errors.map((err) => (
                        <div key={err.id} className="bg-white border border-iceBlue shadow-lg p-4 rounded-lg text-sm animate-fade-in">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-deepOcean capitalize">{err.type}</span>
                            </div>
                            <div className="text-oceanBlue mb-3 leading-relaxed">{err.explanation}</div>
                            {err.suggestion && (
                                <button 
                                    onClick={() => {
                                        const before = text.substring(0, err.startIndex);
                                        const after = text.substring(err.endIndex);
                                        setText(before + err.suggestion + after);
                                        setErrors(prev => prev.filter(e => e.id !== err.id));
                                    }}
                                    className="w-full py-1.5 bg-oceanBlue text-white rounded-md text-xs font-medium hover:bg-deepOcean transition-colors"
                                >
                                    Accept: {err.suggestion}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

      {showContextMenu && (
        <ContextMenu 
            onSelect={handleMenuAction} 
            onClose={() => setShowContextMenu(false)}
            textLength={text.length}
            isPro={isPro}
        />
      )}

      {showToneDial && (
        <ToneDial 
            originalText={text} 
            onApply={applyTextUpdate} 
            onClose={() => setShowToneDial(false)} 
        />
      )}

      {showSimplifier && (
          <Simplifier 
            originalText={text}
            onApply={applyTextUpdate}
            onClose={() => setShowSimplifier(false)}
          />
      )}

      {flowData && isPro && (
          <FlowTrainer 
            data={flowData} 
            onClose={() => setFlowData(null)} 
          />
      )}

      {activeMode === 'analyze-meaning' && !isAnalyzing && isPro && (
          <MeaningMap 
            fragments={meaningFragments} 
            onDismiss={() => {
                setActiveMode('write');
                setMeaningFragments([]);
            }} 
          />
      )}
      
      {/* Show Feature Lock overlay if user tried to access MeaningMap without Pro (fallback if not handled by upgrade modal) */}
      {activeMode === 'analyze-meaning' && !isPro && !isAnalyzing && (
         <div className="absolute top-20 right-10 z-30">
             <FeatureLock featureName="Meaning Map" onUpgrade={() => {
                 setUpgradeTrigger('feature-lock');
                 setShowUpgradeModal(true);
             }} />
         </div>
      )}

      {showUpgradeModal && (
          <UpgradeModal 
            trigger={upgradeTrigger} 
            onClose={() => setShowUpgradeModal(false)}
            onConfirm={() => {
                setShowUpgradeModal(false);
                onUpgrade();
            }}
          />
      )}

      <GhostModeIndicator visible={isGhostMode} />
    </div>
  );
};

export default WritingInterface;