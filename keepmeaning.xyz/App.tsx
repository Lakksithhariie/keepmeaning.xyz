import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import WritingInterface from './components/WritingInterface';
import SettingsPage from './components/SettingsPage';
import NavBar from './components/NavBar';
import { UserPlan } from './types';

type ViewState = 'landing' | 'login' | 'signup' | 'app';

const App = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [currentPage, setCurrentPage] = useState('write');
  
  // Lifted Billing State
  const [tokenUsage, setTokenUsage] = useState(42000);
  const tokenLimit = userPlan === 'pro' ? 500000 : 50000;

  const handleLogin = (email: string) => {
    setUser({ email });
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setUserPlan('free');
    setView('landing');
  };

  const handleUpgrade = () => {
      // Simulate upgrade success
      setUserPlan('pro');
  };

  // Router Logic
  if (view === 'landing') {
    return (
      <LandingPage 
        onCtaClick={() => setView('signup')} 
        onLoginClick={() => setView('login')} 
      />
    );
  }

  if (view === 'login' || view === 'signup') {
    return (
      <AuthPage 
        mode={view} 
        onLogin={handleLogin} 
        onSwitchMode={(mode) => setView(mode)} 
      />
    );
  }

  // Protected App View
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <NavBar 
        onLogout={handleLogout} 
        userEmail={user?.email} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userPlan={userPlan}
      />
      {currentPage === 'write' ? (
        <WritingInterface 
            userPlan={userPlan} 
            onUpgrade={handleUpgrade}
            tokenUsage={tokenUsage}
            setTokenUsage={setTokenUsage}
        />
      ) : currentPage === 'settings' ? (
        <SettingsPage 
            userPlan={userPlan}
            tokenUsage={tokenUsage}
            tokenLimit={tokenLimit}
            onUpgrade={handleUpgrade}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 capitalize">{currentPage}</h2>
                <p>Coming soon in MVP v2.1</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;