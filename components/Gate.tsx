
import React, { useState } from 'react';
import { useApp } from '../App';

interface GateProps {
  mode: 'OPERATIVE' | 'AUTHORITY';
  onBack: () => void;
}

export const Gate: React.FC<GateProps> = ({ mode, onBack }) => {
  const { login, establish } = useApp();
  const [form, setForm] = useState({ 
    name: '', 
    party: '', 
    password: '',
    adminName: '',
    communityName: '' 
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIntelligence, setShowIntelligence] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(form.name, form.party, form.password);
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Check Sector ID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEstablish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await establish(form.communityName, form.adminName, form.password);
    } catch (err: any) {
      setError(err.message || 'Sector instantiation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuthority = mode === 'AUTHORITY';

  return (
    <div className={`fixed inset-0 z-[300] flex flex-col items-center justify-start md:justify-center p-4 md:p-8 overflow-y-auto transition-colors duration-1000 ${isAuthority ? 'bg-[#0a0500]' : 'bg-[#020617]'}`}>
      <div className={`hero-glow opacity-30 ${isAuthority ? 'bg-orange-500' : 'bg-indigo-500'}`} />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch animate-in fade-in zoom-in duration-500 my-auto pt-10 md:pt-0">
        
        {/* Portal Info Side */}
        <div className={`flex flex-col justify-center p-8 md:p-12 glass-card rounded-3xl md:rounded-[3.5rem] border bg-slate-900/40 relative overflow-hidden ${isAuthority ? 'border-orange-500/20' : 'border-indigo-500/20'}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-20 rounded-full -mr-20 -mt-20 ${isAuthority ? 'bg-orange-600' : 'bg-indigo-600'}`} />
          
          <div className="mb-8 md:mb-12 relative z-10">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 shadow-2xl ${isAuthority ? 'bg-orange-600 shadow-orange-500/40' : 'bg-indigo-600 shadow-indigo-500/40'}`}>
              {isAuthority ? (
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              ) : (
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">
              {isAuthority ? 'Sector Authority' : 'Operative Deployment'}
            </h2>
            <div className={`h-1.5 w-20 md:w-24 rounded-full ${isAuthority ? 'bg-orange-500' : 'bg-indigo-500'}`} />
          </div>

          <div className="space-y-6 md:space-y-10 relative z-10">
            {isAuthority ? (
              <>
                <div className="space-y-2 md:space-y-3">
                  <h4 className="text-[9px] md:text-[11px] font-black text-orange-400 uppercase tracking-widest">Protocol: Establishment</h4>
                  <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                    Initializing an Authority Node creates a <span className="text-white font-bold">private database partition</span>. This is required for creating custom engagement folders.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 md:space-y-3">
                  <h4 className="text-[9px] md:text-[11px] font-black text-indigo-400 uppercase tracking-widest">Protocol: Authorization</h4>
                  <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                    Access is restricted to active pods. You must enter the <span className="text-white font-bold">Sector ID</span> provided by your Authority Lead.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 md:mt-auto pt-6 md:pt-12 relative z-10">
             <button onClick={onBack} className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em] hover:text-white transition-all flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
               Back to Clearance
             </button>
          </div>
        </div>

        {/* Form Side */}
        <div className={`glass-card p-8 md:p-14 rounded-3xl md:rounded-[3.5rem] border bg-slate-900/60 backdrop-blur-2xl relative shadow-3xl ${isAuthority ? 'border-orange-500/10' : 'border-indigo-500/10'}`}>
          <div className="mb-8 md:mb-12">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Portal Access Locked</h3>
            <p className={`text-base md:text-lg font-bold uppercase tracking-widest ${isAuthority ? 'text-orange-500' : 'text-indigo-500'}`}>
              {isAuthority ? 'Establish New Sector' : 'Join Existing Session'}
            </p>
          </div>

          {error && (
            <div className="mb-6 md:mb-8 p-4 md:p-5 bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center animate-shake">
              [CRITICAL ERROR] {error}
            </div>
          )}

          <form onSubmit={isAuthority ? handleEstablish : handleJoin} className="space-y-6 md:space-y-8">
            {isAuthority ? (
              <>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Community Identifier (Sector ID)</label>
                  <input required value={form.communityName} onChange={e => setForm({...form, communityName: e.target.value})} placeholder="e.g. Alpha-Pod" className="input-field" disabled={isSubmitting} />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Authority Alias</label>
                  <input required value={form.adminName} onChange={e => setForm({...form, adminName: e.target.value})} placeholder="Admin" className="input-field" disabled={isSubmitting} />
                </div>
                <div className="space-y-2 md:space-y-3 relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Master Access Key</label>
                    <button 
                      type="button"
                      onClick={() => setShowIntelligence(true)}
                      className="text-[7px] md:text-[8px] font-black text-orange-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                    >
                      How to use?
                    </button>
                  </div>
                  <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Hamstarxxy" className="input-field" disabled={isSubmitting} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Sector ID</label>
                  <input required value={form.party} onChange={e => setForm({...form, party: e.target.value})} placeholder="Enter Sector Code" className="input-field" disabled={isSubmitting} />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operative Alias</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Assigned Alias" className="input-field" disabled={isSubmitting} />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Session Key (If Applicable)</label>
                  <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Sector Password" className="input-field" disabled={isSubmitting} />
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-5 md:py-7 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] rounded-xl md:rounded-2xl transition-all shadow-2xl active:scale-95 mt-4 md:mt-8 disabled:opacity-50 disabled:cursor-not-allowed ${isAuthority ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'}`}
            >
              {isSubmitting ? 'Processing Hash...' : isAuthority ? 'Instantiate Authority' : 'Authorize Deployment'}
            </button>
          </form>

          <div className="mt-8 md:mt-12 flex items-center gap-4 opacity-40">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] md:tracking-[0.3em]">Encrypted Session</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Access Intelligence "Backend" Modal */}
      {showIntelligence && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-6 animate-in fade-in duration-300">
          <div className="glass-card max-w-2xl w-full p-8 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowIntelligence(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white text-xl">✕</button>
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="w-1.5 h-8 md:h-10 bg-orange-600 rounded-full" />
              <div>
                <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">Credential Intelligence</h3>
                <p className="text-[8px] md:text-[10px] font-black text-orange-500 uppercase tracking-widest">Protocol Architecture: Authority Branch</p>
              </div>
            </div>

            <div className="space-y-8 md:space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-500 text-[9px] md:text-[10px] font-black">A</div>
                  <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-widest">The Admin Protocol (HamstarXXY)</h4>
                </div>
                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                    To instantiate or access a sector as an Admin, your Master Key must follow the <span className="text-white">Hamstar</span> logic:
                  </p>
                  <div className="mt-4 font-mono text-[10px] md:text-xs bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                    <p className="text-orange-500"><span className="text-slate-500">FORMAT:</span> Hamstar[XX][Y]</p>
                    <p className="text-slate-300">XX = 2-digit Party Code (11-99)</p>
                    <p className="text-slate-300">Y = 1-digit Admin Rank (1-9)</p>
                  </div>
                </div>
              </section>
            </div>

            <button 
              onClick={() => setShowIntelligence(false)}
              className="w-full py-5 md:py-6 bg-orange-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors mt-8 md:mt-12 shadow-xl shadow-orange-500/20"
            >
              Close Intelligence Terminal
            </button>
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        @media (min-width: 768px) {
          .input-field {
            border-radius: 1.25rem;
            padding: 1.25rem 1.5rem;
          }
        }
        .input-field:focus {
          border-color: ${isAuthority ? '#f97316' : '#6366f1'};
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 0 20px ${isAuthority ? 'rgba(249, 115, 22, 0.1)' : 'rgba(99, 102, 241, 0.1)'};
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
