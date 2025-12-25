
import React from 'react';
import { UserRole, Tier } from '../types';
import { Icons } from '../constants';

interface RulebookProps {
  role: UserRole;
  onClose: () => void;
}

export const Rulebook: React.FC<RulebookProps> = ({ role, onClose }) => {
  const isAdminOrDev = role === UserRole.ADMIN || role === UserRole.DEV;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8">
      <div className="glass-card max-w-4xl w-full h-[90vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1">
              <Icons.Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />
              <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter">Operating Protocol</h2>
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Access: {role} AUTHORIZED</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 md:space-y-16">
          
          {/* Section 1: The Hierarchy */}
          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Icons.Trophy className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">01. Rankings</h3>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 mb-6 font-medium leading-relaxed">
              Your rank is determined by verified engagements. Each "Connect" action earns you reputation points.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-slate-900/50 border border-slate-800">
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{Tier.SILVER} Entry</span>
                <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed">Standard clearance. Granted to all verified operatives. Provides standard feed visibility.</p>
              </div>
              <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-2">{Tier.GOLD} Elite</span>
                <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed">Unlocked after 10 full pod cycles. Cards are prioritized above Silver.</p>
              </div>
              <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-indigo-500/5 border border-indigo-500/20">
                <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">{Tier.PLATINUM} Architect</span>
                <p className="text-[10px] md:text-[11px] text-slate-300 leading-relaxed font-bold">The top 1%. Platinum operatives are pinned to the top of all views. Maximum authority.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Interaction */}
          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <Icons.Check className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">02. Interaction</h3>
            </div>
            <div className="space-y-4 md:space-y-6">
              <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-slate-900/30 border border-white/5">
                <h4 className="text-white font-black text-xs md:text-sm uppercase mb-3">Protocol Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed">
                      <span className="text-indigo-400 font-black">Step 01: Verify.</span> You must click <span className="text-white">"Open Profile"</span> first.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed">
                      <span className="text-indigo-400 font-black">Step 02: Connect.</span> Visit links then trigger "Connect Now" to claim your points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-8 md:pt-12 text-center opacity-30 pb-10">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-500">Document End // D-CEP Operative Directive</p>
          </div>
        </div>
      </div>
    </div>
  );
};
