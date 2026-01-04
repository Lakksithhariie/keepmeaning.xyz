import React, { useState } from 'react';
import { UserPlan } from '../types';
import TokenUsageBar from './TokenUsageBar';

interface SettingsPageProps {
  userPlan: UserPlan;
  tokenUsage: number;
  tokenLimit: number;
  onUpgrade: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ userPlan, tokenUsage, tokenLimit, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState('usage');

  const tabs = [
      { id: 'usage', label: 'Monthly Token Usage' },
      { id: 'account', label: 'Account' },
      { id: 'general', label: 'General' },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 animate-fade-in flex flex-col h-full">
        <h1 className="text-3xl font-bold text-deepOcean mb-8">Settings</h1>
        
        <div className="flex border-b border-iceBlue mb-8">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id 
                        ? 'border-oceanBlue text-deepOcean' 
                        : 'border-transparent text-gray-500 hover:text-oceanBlue'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1">
            {activeTab === 'usage' ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-iceBlue">
                     <div className="mb-6">
                        <h2 className="text-xl font-bold text-deepOcean">Usage Overview</h2>
                        <p className="text-gray-500 text-sm mt-1">Track your consumption against your plan limits.</p>
                     </div>
                    <TokenUsageBar 
                        usage={tokenUsage} 
                        limit={tokenLimit} 
                        isPro={userPlan === 'pro'} 
                        onUpgrade={onUpgrade} 
                    />
                </div>
            ) : (
                 <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p>Configuration options for {activeTab} will appear here.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default SettingsPage;