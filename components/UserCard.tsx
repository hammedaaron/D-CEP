
import React, { useState, useMemo } from 'react';
import { Card, EngagementLog, Tier, UserRole } from '../types';
import { Icons } from '../constants';

interface UserCardProps {
  card: Card;
  viewerId: string;
  logs: EngagementLog[];
  onAction: (postId: string) => void;
  onDone: () => void;
  isReciprocated: boolean;
  theyEngagedMe: boolean;
  isPoweredUp: boolean;
  tier: Tier;
  role: UserRole;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  card, 
  viewerId, 
  logs, 
  onAction, 
  onDone, 
  isReciprocated, 
  theyEngagedMe,
  isPoweredUp,
  tier,
  role
}) => {
  const isOwnCard = card.userId === viewerId;
  const isDev = role === UserRole.DEV;
  const isAdmin = role === UserRole.ADMIN;
  
  const cardLogs = logs.filter(l => l.cardId === card.id && l.viewerId === viewerId);
  const clickedPostIds = cardLogs.map(l => l.postId);
  
  // Verification Step Constraint: Must open profile before connecting
  const [profileOpened, setProfileOpened] = useState(false);
  
  const hasCompletedAllPosts = card.posts.length > 0 && card.posts.every(p => clickedPostIds.includes(p.id));
  const isDone = cardLogs.some(l => l.status === 'DONE');

  const stats = useMemo(() => {
    return {
      received: logs.filter(l => l.cardId === card.id && l.status === 'DONE').length,
      given: logs.filter(l => l.viewerId === card.userId && l.status === 'DONE').length
    };
  }, [logs, card.id, card.userId]);

  const handlePostClick = (p: { id: string, url: string }) => {
    window.open(p.url, '_blank');
    if (!clickedPostIds.includes(p.id)) {
      onAction(p.id);
    }
  };

  const verifyProfile = () => {
    if (card.posts.length > 0) {
      window.open(card.posts[0].url, '_blank');
      setProfileOpened(true);
    }
  };

  const roleStyles = useMemo(() => {
    if (isDev) return {
      container: 'border-emerald-500/40 shadow-emerald-500/10 bg-emerald-950/20 ring-1 ring-emerald-500/20',
      badge: 'bg-emerald-500 text-white',
      text: 'text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
    };
    if (isAdmin) return {
      container: 'border-orange-500/40 shadow-orange-500/10 bg-orange-950/20 ring-1 ring-orange-500/20',
      badge: 'bg-orange-500 text-white',
      text: 'text-orange-400',
      button: 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20'
    };
    return {
      container: tier === Tier.PLATINUM ? 'border-indigo-500/30 shadow-indigo-500/10' : 'border-white/5',
      badge: tier === Tier.PLATINUM ? 'bg-indigo-600 text-white' : tier === Tier.GOLD ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300',
      text: tier === Tier.PLATINUM ? 'text-indigo-400' : tier === Tier.GOLD ? 'text-amber-500' : 'text-slate-400',
      button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
    };
  }, [isDev, isAdmin, tier]);

  return (
    <div id={`card-${card.userId}`} className={`relative rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 flex flex-col h-full border z-10 overflow-hidden ${
      isDone ? 'opacity-60 grayscale-[0.3]' : ''
    } ${isReciprocated ? 'reciprocated-glow bg-amber-500/5' : 'glass-card'} ${isPoweredUp ? 'premium-shimmer' : ''} ${roleStyles.container}`}>
      
      {(isDev || isAdmin) && (
        <div className={`absolute top-0 right-6 md:right-10 ${roleStyles.badge} text-[6px] md:text-[7px] font-black px-2 md:px-3 py-1 rounded-b-lg md:rounded-b-xl uppercase tracking-widest z-20`}>
          {isDev ? 'System Architect' : `Pod Admin`}
        </div>
      )}

      <div className="flex items-start justify-between mb-5 md:mb-6 pt-1 md:pt-2">
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-xl border-2 ${
            isDev ? 'bg-emerald-500 text-white border-emerald-400' : isAdmin ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {card.displayName.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-base md:text-lg text-white leading-tight">{card.displayName}</h3>
            <div className="flex flex-wrap gap-1 md:gap-1.5 mt-1 md:mt-1.5">
              <span className={`${roleStyles.badge} text-[6px] md:text-[7px] font-black px-2 md:px-2.5 py-0.5 rounded-full uppercase tracking-widest`}>
                {isDev ? 'DEV' : isAdmin ? 'ADMIN' : tier}
              </span>
              {isReciprocated && (
                <span className="bg-emerald-500/20 text-emerald-500 text-[6px] md:text-[7px] font-black px-2 md:px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Icons.Check className="w-2 h-2" /> Reciprocated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-slate-950/50 border border-slate-800/50">
        <div className="text-center border-r border-slate-800">
          <p className={`text-lg md:text-xl font-black ${roleStyles.text}`}>{stats.received}</p>
          <p className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-slate-500 mt-1">Received</p>
        </div>
        <div className="text-center">
          <p className={`text-lg md:text-xl font-black ${roleStyles.text}`}>{stats.given}</p>
          <p className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-slate-500 mt-1">Given</p>
        </div>
      </div>

      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
        <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Verification Queue</p>
        
        <button
          onClick={verifyProfile}
          disabled={isDone || isOwnCard}
          className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all ${
            profileOpened 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
              : 'bg-slate-900 border-slate-800 text-white hover:border-white/20'
          }`}
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight">01. Open Profile</span>
            <span className="text-[6px] md:text-[7px] opacity-50 uppercase font-bold tracking-tight">Verifies External Identity</span>
          </div>
          {profileOpened ? <Icons.Check className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" /> : <Icons.ExternalLink className="w-4 h-4 md:w-5 md:h-5 opacity-40 flex-shrink-0" />}
        </button>

        {card.posts.map((post) => (
          <button
            key={post.id}
            disabled={isOwnCard || isDone || !profileOpened}
            onClick={() => handlePostClick(post)}
            className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all ${
              clickedPostIds.includes(post.id) 
                ? 'bg-slate-800/50 border-slate-700 text-slate-500' 
                : !profileOpened 
                  ? 'opacity-30 cursor-not-allowed bg-slate-950 border-transparent' 
                  : 'bg-slate-900 border-slate-800 text-white hover:border-indigo-500'
            }`}
          >
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight">02. Verify Interaction {post.sn}</span>
            {clickedPostIds.includes(post.id) ? <Icons.Check className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" /> : <Icons.ExternalLink className="w-4 h-4 md:w-5 md:h-5 opacity-40 flex-shrink-0" />}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-2">
        {isOwnCard ? (
          <div className="w-full text-center py-4 md:py-5 text-[9px] md:text-[10px] font-black rounded-xl md:rounded-2xl uppercase tracking-widest border border-dashed border-slate-800 text-slate-600">
            PAYLOAD ACTIVE
          </div>
        ) : isDone ? (
          <div className="w-full text-center py-4 md:py-5 text-[9px] md:text-[10px] font-black rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            CONNECTION SECURED
          </div>
        ) : (hasCompletedAllPosts && profileOpened) ? (
          <button
            onClick={onDone}
            className={`w-full py-4 md:py-5 text-[9px] md:text-[10px] font-black rounded-xl md:rounded-2xl uppercase tracking-widest transition-all shadow-xl animate-pulse text-white ${roleStyles.button}`}
          >
            Connect Now
          </button>
        ) : (
          <div className="w-full text-center py-4 md:py-5 bg-slate-800/50 text-slate-500 text-[9px] md:text-[10px] font-black rounded-xl md:rounded-2xl uppercase tracking-widest border border-slate-800/50">
            {!profileOpened ? "Step 01 Required" : "Step 02 Incomplete"}
          </div>
        )}
      </div>
    </div>
  );
};
