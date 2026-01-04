import React, { useState } from 'react';
import Logo from './Logo';
import { ArrowRight, Mail, Github, Chrome } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onLogin: (email: string) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onLogin, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call and Magic Link delay
    setTimeout(() => {
        setMagicLinkSent(true);
        // Simulate user clicking the link after a few seconds for demo purposes
        setTimeout(() => {
            onLogin(email);
        }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-iceBlue/30 p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md border border-white">
        
        <div className="text-center mb-8">
            <div className="inline-block mb-4">
                <Logo state={loading ? "processing" : "idle"} size="medium" />
            </div>
            <h1 className="text-2xl font-bold text-deepOcean mb-2">
                {magicLinkSent ? 'Check your email' : (mode === 'signup' ? 'Start Writing Better' : 'Welcome Back')}
            </h1>
            <p className="text-gray-500 text-sm">
                {magicLinkSent 
                    ? `We sent a magic link to ${email}` 
                    : 'Enter your email to continue to KeepMeaning'
                }
            </p>
        </div>

        {!magicLinkSent ? (
            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="writer@example.com"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanBlue/20 focus:border-oceanBlue transition-all text-deepOcean placeholder:text-gray-300"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-oceanBlue text-white rounded-lg font-semibold hover:bg-deepOcean transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Sending...' : (mode === 'signup' ? 'Sign up with Email' : 'Log in with Email')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative text-center text-sm">
                    <span className="px-2 bg-white text-gray-400">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                        <Chrome size={18} /> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                        <Github size={18} /> GitHub
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500 mt-6">
                    {mode === 'signup' ? (
                        <>Already have an account? <button onClick={() => onSwitchMode('login')} className="text-oceanBlue font-medium hover:underline">Log in</button></>
                    ) : (
                        <>New here? <button onClick={() => onSwitchMode('signup')} className="text-oceanBlue font-medium hover:underline">Sign up</button></>
                    )}
                </div>
            </div>
        ) : (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 animate-bounce">
                    <Mail size={32} />
                </div>
                <p className="text-sm text-gray-500">
                    Click the link in the email we just sent you.<br/>
                    <span className="text-xs text-gray-400">(Simulating redirect in 2s...)</span>
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;