import React from 'react';
import Logo from './Logo';
import PricingCard from './PricingCard';
import { ArrowRight, Check, Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onCtaClick: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCtaClick, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-deepOcean">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <Logo state="idle" size="small" />
            <span className="font-bold text-lg">KeepMeaning</span>
        </div>
        <div className="flex items-center gap-6">
            <button onClick={onLoginClick} className="text-sm font-medium text-oceanBlue hover:text-deepOcean">Log in</button>
            <button 
                onClick={onCtaClick}
                className="px-5 py-2.5 bg-oceanBlue text-white rounded-lg text-sm font-semibold hover:bg-deepOcean transition-colors shadow-sm"
            >
                Start Writing Free
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-iceBlue/30 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iceBlue/50 text-oceanBlue text-xs font-semibold mb-8 animate-fade-in border border-iceBlue">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-skyBlue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-oceanBlue"></span>
            </span>
            v2.1 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-deepOcean mb-6 leading-tight tracking-tight max-w-4xl mx-auto">
            Write Clearly. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-oceanBlue to-skyBlue">Keep Your Voice.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The AI writing assistant that respects your workflow and privacy. 
            Zero data retention, local-first processing, and pedagogical feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={onCtaClick}
              className="px-8 py-4 bg-oceanBlue text-white rounded-xl text-lg font-bold hover:bg-deepOcean transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              Start Writing Free <ArrowRight size={20} />
            </button>
            
            <button className="px-8 py-4 bg-white text-deepOcean border border-iceBlue rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
               Watch Demo <span className="text-skyBlue text-sm font-normal">(1 min)</span>
            </button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
             {['Acme Corp', 'Linear', 'Vercel', 'Stripe'].map((brand, i) => (
                 <span key={i} className="text-xl font-bold text-gray-400">{brand}</span>
             ))}
          </div>

        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-iceBlue rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-skyBlue rounded-full filter blur-[120px]"></div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { icon: Zap, title: "Speed > Features", desc: "Local-first engine checks 500 words in <50ms. No cloud latency for basic edits." },
                      { icon: Shield, title: "Zero Data Retention", desc: "We don't train on your data. What you write stays on your device by default." },
                      { icon: Check, title: "Pedagogical Mode", desc: "Don't just fix errors. Learn why they happened and improve your craft." }
                  ].map((feature, i) => (
                      <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-iceBlue transition-colors group">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <feature.icon className="text-oceanBlue" size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-deepOcean mb-3">{feature.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Beta Pricing Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-deepOcean mb-4">Simple Beta Pricing</h2>
                  <p className="text-gray-600 max-w-xl mx-auto">
                      Join early to lock in our beta rate forever. We're optimizing for learning, not revenue.
                  </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <PricingCard 
                    tier={{
                        name: 'Free',
                        price: 0,
                        features: ['50,000 Tokens / month', 'Basic Tone Adjustments', 'Standard Error Check', 'Local-First Privacy']
                    }}
                    onSelect={onCtaClick}
                  />
                  <PricingCard 
                    tier={{
                        name: 'Pro',
                        price: 7,
                        originalPrice: 19,
                        features: ['500,000 Tokens / month', 'Live Meaning Map Analysis', 'Advanced Flow Trainer', 'Priority Support', 'Unlimited History'],
                    }}
                    onSelect={onCtaClick}
                  />
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
              <div>© 2025 KeepMeaning Inc. YC W25.</div>
              <div className="flex gap-6">
                  <a href="#" className="hover:text-deepOcean">Privacy</a>
                  <a href="#" className="hover:text-deepOcean">Terms</a>
                  <a href="#" className="hover:text-deepOcean">Twitter</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;