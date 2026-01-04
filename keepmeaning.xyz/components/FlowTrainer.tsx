import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FlowMetrics } from '../types';
import { TrendingUp, Activity, Award } from 'lucide-react';

interface FlowTrainerProps {
    data: FlowMetrics;
    onClose: () => void;
}

const FlowTrainer: React.FC<FlowTrainerProps> = ({ data, onClose }) => {
    const chartData = [
        { name: 'Variety', value: data.metrics.sentenceVariety * 20, full: 100 }, // Normalize rough scales
        { name: 'Transitions', value: data.metrics.transitionDensity * 10, full: 100 },
        { name: 'Active Voice', value: (1 - data.metrics.passiveVoiceRatio) * 100, full: 100 },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Activity className="text-indigo-500" />
                                Flow Trainer
                            </h2>
                            <p className="text-gray-500 mt-1">Fluency analysis & long-term skill improvement</p>
                        </div>
                        <div className="text-right">
                             <div className="text-5xl font-black text-indigo-600 tracking-tighter">{data.flowScore}</div>
                             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Flow Score</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <div className="text-sm text-gray-500 mb-1">Reading Grade Level</div>
                             <div className="text-2xl font-bold text-gray-800">{data.metrics.fleschKincaidGrade}</div>
                             <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{width: `${(data.metrics.fleschKincaidGrade / 12) * 100}%`}}></div>
                             </div>
                        </div>
                         <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <div className="text-sm text-gray-500 mb-1">Sentence Variety</div>
                             <div className="text-2xl font-bold text-gray-800">{data.metrics.sentenceVariety.toFixed(1)}</div>
                             <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <TrendingUp size={12} /> Optimal range
                             </div>
                        </div>
                         <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <div className="text-sm text-gray-500 mb-1">Trend</div>
                             <div className="text-2xl font-bold text-gray-800 capitalize">{data.trend}</div>
                             <div className="text-xs text-gray-400 mt-2">Based on last 5 sessions</div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-h-[250px]">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Metric Breakdown</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData} layout="vertical">
                                    <XAxis type="number" hide domain={[0, 100]} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899'][index]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Personalized Recommendations</h3>
                            <div className="space-y-3">
                                {data.recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`mt-1 p-2 rounded-lg h-fit ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <Award size={18} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {rec.priority} Priority
                                                </span>
                                            </div>
                                            <p className="text-gray-800 font-medium text-sm">{rec.tip}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors">
                        Return to Editor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlowTrainer;
