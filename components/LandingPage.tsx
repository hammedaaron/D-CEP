
import React, { useState, useEffect } from 'react';
import { Icons, APP_NAME } from '../constants';

interface LandingPageProps {
  onEnter: (mode: 'OPERATIVE' | 'AUTHORITY') => void;
}

interface DetailSection {
  id: string;
  title: string;
  subtitle: string;
  points: { title: string; text: string; icon: React.ReactNode }[];
}

const DEEP_DIVES: Record<string, DetailSection> = {
  why: {
    id: 'why',
    title: "Why normal groups fail you",
    subtitle: "Telegram and WhatsApp groups are cemeteries for content. Here is why D-CEP wins.",
    points: [
      { 
        title: "The Ghosting Problem", 
        text: "In normal groups, 90% of people drop their link and leave. They never look at yours. We track every click to stop this.", 
        icon: <Icons.Alert className="w-6 h-6 text-red-500" /> 
      },
      { 
        title: "Link Burying", 
        text: "In chats, your link is gone in 5 minutes. In D-CEP, your link stays on its own card until everyone engages.", 
        icon: <Icons.Link className="w-6 h-6 text-indigo-500" /> 
      },
      { 
        title: "Manual Lies", 
        text: "People in chats lie and say 'Done' without clicking. Our engine verifies the click happened before they get points.", 
        icon: <Icons.Shield className="w-6 h-6 text-emerald-500" /> 
      }
    ]
  },
  how: {
    id: 'how',
    title: "The Simple Protocol",
    subtitle: "D-CEP is designed to be fast and fair. We don't do 'manual' bullshit.",
    points: [
      { 
        title: "Verified Entry", 
        text: "When you join, your identity is locked to your sector. You only engage with people who are actually in your pod.", 
        icon: <Icons.Check className="w-6 h-6 text-indigo-500" /> 
      },
      { 
        title: "Force-Click Action", 
        text: "To 'Connect' with someone, you MUST open their profile and post. The system won't let you finish without it.", 
        icon: <Icons.Eye className="w-6 h-6 text-amber-500" /> 
      },
      { 
        title: "Auto-Cleaning", 
        text: "Every 24 hours, the board wipes clean. Only fresh, high-value content is allowed in the stream.", 
        icon: <Icons.Sparkles className="w-6 h-6 text-emerald-500" /> 
      }
    ]
  },
  status: {
    id: 'status',
    title: "How Status Works",
    subtitle: "Stop being just another number. In D-CEP, your activity determines your rank.",
    points: [
      { 
        title: "Silver Level", 
        text: "Everyone starts here. It's the standard entry level for verified operatives.", 
        icon: <Icons.Check className="w-6 h-6 text-slate-400" /> 
      },
      { 
        title: "Gold Level", 
        text: "Active members who engage 10+ times get Gold status. Your posts are seen twice as fast.", 
        icon: <Icons.Trophy className="w-6 h-6 text-amber-500" /> 
      },
      { 
        title: "Platinum Architect", 
        text: "The top 1%. Your cards are pinned to the top of the feed forever. Total visibility.", 
        icon: <Icons.Sparkles className="w-6 h-6 text-indigo-500" /> 
      }
    ]
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [activeDeepDive, setActiveDeepDive] = useState<DetailSection | null>(null);

  useEffect(() => {
    if (activeDeepDive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeDeepDive]);

  return (
    <div className="w-full bg-[#020617] selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 py-4 md:py-6 border-b border-white/5 backdrop-blur-2xl bg-black/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icons.Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black text-white tracking-tighter uppercase">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => setActiveDeepDive(DEEP_DIVES.why)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">The Problem</button>
              <button onClick={() => setActiveDeepDive(DEEP_DIVES.how)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">How it works</button>
              <button onClick={() => setActiveDeepDive(DEEP_DIVES.status)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Status</button>
            </div>
            <button 
              onClick={() => onEnter('OPERATIVE')}
              className="px-5 md:px-8 py-2 md:py-3 bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95"
            >
              Access Pod
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 md:pt-48 pb-20 md:pb-32 px-6 md:px-8 flex flex-col justify-center items-center text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 md:mb-10">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Built for the 1%</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] md:leading-[0.85] mb-8 md:mb-10 uppercase">
            Stop Begging <br className="hidden md:block" />
            <span className="gold-text-gradient">For Views.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12 md:mb-16">
            WhatsApp and Telegram Pods are where links go to die. <span className="text-white font-bold">D-CEP</span> is the engine that forces people to engage back. No ghosting. No lying. Just real growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
             <button 
              onClick={() => onEnter('OPERATIVE')}
              className="px-8 md:px-12 py-5 md:py-7 bg-indigo-600 rounded-xl md:rounded-2xl text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/30"
            >
              Enter Portal
            </button>
            <button 
              onClick={() => onEnter('AUTHORITY')}
              className="px-8 md:px-12 py-5 md:py-7 bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs hover:border-amber-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              Create My Pod
            </button>
          </div>
        </div>

        {/* Hero Luxury Image */}
        <div className="absolute inset-0 z-0 opacity-10 md:opacity-20 pointer-events-none overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale" 
            alt="Luxury Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617] to-[#020617]" />
        </div>
      </section>

      {/* Problem Section */}
      <section id="why" className="relative py-20 md:py-32 px-6 md:px-8 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-6 md:-inset-10 bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-3xl overflow-hidden relative min-h-[350px] md:min-h-[500px] flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6 md:mb-8">
                    <Icons.Alert className="w-10 h-10 md:w-16 md:h-16 text-indigo-500" />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">No More Ghosting</h4>
                  <p className="text-slate-500 text-xs md:text-sm max-w-sm">We replaced generic chat groups with a protocol that makes ghosting impossible.</p>
                  <button onClick={() => setActiveDeepDive(DEEP_DIVES.why)} className="mt-6 md:mt-8 text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white flex items-center gap-2">
                    Deep Dive Problem <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Replaced Suit Guy with Status Icon Overlay */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-[#020617] shadow-2xl z-20">
                    <Icons.Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 md:mb-6">The Real Problem</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 md:mb-8">
                Why normal groups <br className="hidden md:block" /> <span className="text-slate-600">waste your time.</span>
              </h3>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-10 md:mb-12">
                In WhatsApp or Telegram, people drop a link and disappear. It's messy. D-CEP turns engagement into a <span className="text-white font-bold">rule</span>. You can't get views if you don't give them.
              </p>
              
              <ul className="space-y-4 md:space-y-6">
                {[
                  { title: "No More Ghosting", desc: "Our engine tracks every click. If they don't engage back, they are blocked." },
                  { title: "Clean & Organized", desc: "No more scrolling through 100 messages to find a link. Every post has its own card." },
                  { title: "Proof in the Pudding", desc: "You can see exactly who clicked your link and who is lying." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 md:gap-6 items-start">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Icons.Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-[10px] md:text-xs tracking-widest mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-xs md:text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Win */}
      <section id="how" className="py-20 md:py-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 md:mb-6">Simple as 1-2-3</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">The 3-Step Win.</h3>
          <button onClick={() => setActiveDeepDive(DEEP_DIVES.how)} className="mt-6 text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-white flex items-center gap-2 mx-auto">
             How we enforce rules <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { 
              step: "01", 
              title: "Drop Your Link", 
              desc: "Paste your post. The engine locks it in and shows it to everyone in your pod immediately.",
              icon: <Icons.Link className="w-10 h-10 md:w-12 md:h-12 text-indigo-500" />
            },
            { 
              step: "02", 
              title: "Check Others", 
              desc: "Click through the feed. Our system verifies each click so you can't fake it.",
              icon: <Icons.Eye className="w-10 h-10 md:w-12 md:h-12 text-amber-500" />
            },
            { 
              step: "03", 
              title: "Get Notified", 
              desc: "Watch your views climb. Your dashboard shows exactly who engaged and your growing status.",
              icon: <Icons.Shield className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
            }
          ].map((item, i) => (
            <div key={i} className="group relative">
               <div className="relative z-10 glass-card rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 p-8 md:p-12 transition-all hover:-translate-y-2 hover:border-indigo-500/30">
                  <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl w-max group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="absolute top-6 md:top-8 right-6 md:right-8 text-3xl md:text-4xl font-black text-slate-800 opacity-20">
                    {item.step}
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-4">{item.title}</h4>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Status is Everything */}
      <section id="status" className="py-20 md:py-32 px-6 md:px-8 bg-slate-950/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover grayscale" 
            alt="Status Symbol"
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
          <div className="lg:w-1/2">
             <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 md:mb-6">Climb the Ladder</h2>
             <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8 md:mb-10">
               Status is <br className="hidden md:block" /> <span className="gold-text-gradient">Everything.</span>
             </h3>
             <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-8 md:mb-12">
               D-CEP isn't for everyone. The more you help the community, the higher you climb. Higher levels mean <span className="text-white font-bold">your posts stay at the top</span> where everyone sees them first.
             </p>
             <button onClick={() => setActiveDeepDive(DEEP_DIVES.status)} className="mb-8 md:mb-10 text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white flex items-center gap-2">
                Full Status Hierarchy <Icons.ChevronRight className="w-4 h-4" />
             </button>
             <div className="flex flex-wrap gap-3 md:gap-4">
               <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-[8px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest">
                 Engagement Based Tiers
               </div>
               <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-[8px] md:text-[10px] font-black uppercase text-indigo-500 tracking-widest">
                 Verifiable Clicks
               </div>
             </div>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-1 gap-4">
            {[
              { level: "Platinum", perk: "Always at the top", color: "text-indigo-400", border: "border-indigo-500/20" },
              { level: "Gold", perk: "Priority view", color: "text-amber-500", border: "border-amber-500/20" },
              { level: "Silver", perk: "Standard access", color: "text-slate-400", border: "border-slate-800" }
            ].map((t, i) => (
              <div key={i} className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border bg-white/5 ${t.border} flex items-center justify-between transition-all hover:scale-[1.02]`}>
                <div>
                  <h4 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${t.color}`}>{t.level}</h4>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t.perk}</p>
                </div>
                <Icons.Trophy className={`w-8 h-8 md:w-10 md:h-10 ${t.color} opacity-40`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-48 px-6 md:px-8 text-center relative overflow-hidden bg-indigo-600/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none mb-10 md:mb-12 uppercase">
            Stop Ghosting. <br /> <span className="gold-text-gradient">Start Growing.</span>
          </h2>
          <button 
            onClick={() => onEnter('OPERATIVE')}
            className="px-10 md:px-16 py-6 md:py-8 bg-white text-black rounded-xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-sm hover:scale-110 active:scale-95 transition-all shadow-3xl shadow-white/10"
          >
            Access Pod
          </button>
          
          <div className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40 gap-6">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-slate-500">D-CEP // The Engagement Protocol</p>
            <div className="flex gap-6 md:gap-12">
               <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-slate-500">Reciprocity Engine 2.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive / Back Page Modal */}
      {activeDeepDive && (
        <div className="fixed inset-0 z-[200] flex items-start md:items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300 p-0 overflow-y-auto">
          <div className="max-w-4xl w-full p-8 md:p-16 relative">
            <button 
              onClick={() => setActiveDeepDive(null)} 
              className="fixed top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-14 md:h-14 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white hover:bg-slate-800 transition-colors z-50 border border-white/10"
            >
              ✕
            </button>
            
            <div className="mb-12 md:mb-16 mt-12 md:mt-0">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                 <div className="w-1.5 h-8 md:h-10 bg-indigo-600 rounded-full" />
                 <h2 className="text-[9px] md:text-xs font-black text-indigo-500 uppercase tracking-[0.4em] md:tracking-[0.5em]">Sector Intelligence Briefing</h2>
              </div>
              <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] md:leading-none mb-6">
                {activeDeepDive.title}
              </h3>
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                {activeDeepDive.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {activeDeepDive.points.map((point, idx) => (
                <div key={idx} className="glass-card p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/10 flex flex-col items-start h-full">
                  <div className="p-4 md:p-5 bg-white/5 rounded-xl md:rounded-2xl mb-6 md:mb-8">
                    {point.icon}
                  </div>
                  <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter mb-4">{point.title}</h4>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{point.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-white/5 flex justify-center pb-12">
              <button 
                onClick={() => onEnter('OPERATIVE')}
                className="w-full md:w-auto px-10 md:px-12 py-5 md:py-6 bg-indigo-600 rounded-xl md:rounded-2xl text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30"
              >
                Launch Sector Access
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        html { scroll-behavior: smooth; }
        .gold-text-gradient {
          background: linear-gradient(to right, #fbbf24, #d97706, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
        .shadow-3xl {
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};
