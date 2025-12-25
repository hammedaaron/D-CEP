
import React, { useMemo } from 'react';
import { Card, EngagementLog, User, Tier } from '../types';

interface AdminScoreboardProps {
  cards: Card[];
  logs: EngagementLog[];
  members: User[];
  isPoweredUp: boolean;
  powerHourTimeLeft: string | null;
  onStartPowerHour: () => void;
  onManualWarning?: () => void;
}

export const AdminScoreboard: React.FC<AdminScoreboardProps> = ({ 
  cards, 
  logs, 
  members, 
  isPoweredUp, 
  powerHourTimeLeft,
  onStartPowerHour,
  onManualWarning
}) => {
  const stats = useMemo(() => {
    return members.map(member => {
      const memberCards = cards.filter(c => c.userId === member.id);
      const postsCreated = memberCards.length > 0;
      
      const engagementsDone = logs.filter(l => l.viewerId === member.id && l.status === 'DONE').length;
      const targetCount = cards.filter(c => c.userId !== member.id).length;
      
      const points = logs
        .filter(l => l.viewerId === member.id)
        .reduce((sum, l) => sum + (l.pointsEarned || 0), 0);

      // Simple tier calculation logic for the dashboard
      let currentTier = Tier.SILVER;
      if (member.id === 'dev-master-root') currentTier = Tier.PLATINUM;
      else if (engagementsDone > 25) currentTier = Tier.PLATINUM;
      else if (engagementsDone > 10) currentTier = Tier.GOLD;

      const isDefaulter = targetCount > 0 && engagementsDone < targetCount;

      return {
        id: member.id,
        name: member.name,
        posted: postsCreated,
        score: `${engagementsDone}/${targetCount}`,
        points,
        tier: currentTier,
        isDefaulter,
        ratio: targetCount > 0 ? (engagementsDone / targetCount) * 100 : 0
      };
    });
  }, [cards, logs, members]);

  const downloadCSV = () => {
    const headers = ["Member", "Posted", "Engagement Score", "Points", "Tier", "Status"];
    const rows = stats.map(s => [
      s.name, 
      s.posted ? "YES" : "NO", 
      s.score, 
      s.points, 
      s.tier, 
      s.isDefaulter ? "DEFAULTER" : "COMPLIANT"
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `D-CEP_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center bg-slate-900/50">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Accountability Dashboard</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Pod Monitoring & Enforcement</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {onManualWarning && (
            <button 
              onClick={onManualWarning}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
            >
              Broadcast Warnings
            </button>
          )}
          <button 
            disabled={isPoweredUp}
            onClick={onStartPowerHour}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              isPoweredUp 
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20'
            }`}
          >
            {isPoweredUp ? `Power Hour: ${powerHourTimeLeft}` : 'Trigger Power Hour'}
          </button>
          <button 
            onClick={downloadCSV}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Member</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Daily Post</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reciprocity</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Points</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tier</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {stats.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{row.name}</span>
                    {row.id === 'dev-master-root' && (
                      <span className="bg-emerald-600 text-white text-[6px] px-1 py-0.5 rounded font-black uppercase">Root</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5">
                  {row.posted ? (
                    <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">ACTIVE</span>
                  ) : (
                    <span className="bg-red-500/10 text-red-500 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">MISSING</span>
                  )}
                </td>
                <td className="px-8 py-5 font-mono text-amber-500 font-bold">
                  {row.score}
                </td>
                <td className="px-8 py-5 font-mono text-indigo-400 font-bold">
                  {row.points}
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    row.id === 'dev-master-root' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    row.tier === Tier.PLATINUM ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                    row.tier === Tier.GOLD ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/30'
                  }`}>
                    {row.id === 'dev-master-root' ? 'Architect' : row.tier}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {row.isDefaulter ? (
                    <span className="text-red-500 text-[8px] font-black uppercase tracking-widest animate-pulse">DEFAULTER</span>
                  ) : (
                    <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest">COMPLIANT</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
