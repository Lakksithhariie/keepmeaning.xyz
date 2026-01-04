import React, { useState } from 'react';
import { simplifyText } from '../services/geminiService';
import { SimplificationResult } from '../types';
import { BookOpen, ArrowRight, Check } from 'lucide-react';

interface SimplifierProps {
    originalText: string;
    onApply: (text: string) => void;
    onClose: () => void;
}

const Simplifier: React.FC<SimplifierProps> = ({ originalText, onApply, onClose }) => {
    const [persona, setPersona] = useState('5-year-old');
    const [result, setResult] = useState<SimplificationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSimplify = async () => {
        setLoading(true);
        const res = await simplifyText(originalText, persona);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BookOpen size={24} />
                            Explain Like I'm...
                        </h2>
                        <p className="text-emerald-100 text-sm mt-1">Simulate a persona to simplify complex concepts.</p>
                    </div>
                    <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">Close</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!result ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Persona</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['5-year-old', 'High School Student', 'Non-Technical Manager', 'Grandmother'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPersona(p)}
                                            className={`p-3 rounded-lg border text-left transition-all ${persona === p ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}
                                        >
                                            <span className="block font-medium text-gray-800">{p}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSimplify}
                                disabled={loading}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Simplifying...' : 'Simplify Text'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h3 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Simplified Version</h3>
                                <p className="text-lg text-gray-800 leading-relaxed font-serif">{result.simplified}</p>
                            </div>

                            {result.analogies.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <span className="text-xl">💡</span> Useful Analogies
                                    </h3>
                                    <div className="grid gap-3">
                                        {result.analogies.map((a, i) => (
                                            <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                                <span className="font-semibold text-amber-800 text-sm block mb-1">{a.concept}</span>
                                                <p className="text-gray-700 text-sm">{a.analogy}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {result.jargonMap.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-3">Jargon Buster</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.jargonMap.map((j, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 border border-gray-200">
                                                <span className="line-through opacity-50 mr-2">{j.term}</span>
                                                <span className="font-medium text-emerald-600">{j.simplified}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button onClick={() => setResult(null)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Back</button>
                                <button onClick={() => onApply(result.simplified)} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2">
                                    <Check size={18} /> Use This Version
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Simplifier;
