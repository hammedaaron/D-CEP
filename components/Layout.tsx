
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { Icons, APP_NAME } from '../constants';
import { NotificationPanel } from './NotificationPanel';
import { UserRole, Tier, Card, NotificationType, Folder } from '../types';
import { UserCard } from './UserCard';
import { db } from '../db';

export const Layout: React.FC = () => {
  const { currentUser, logout, setShowRulebook, cards, notifications, logs, folders, activeFolderId, setActiveFolderId, syncData } = useApp();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [payloadUrls, setPayloadUrls] = useState(['', '']);
  const [newFolderName, setNewFolderName] = useState('');

  const myCard = useMemo(() => cards.find(c => c.userId === currentUser?.id), [cards, currentUser]);
  const otherCards = useMemo(() => cards.filter(c => c.userId !== currentUser?.id), [cards, currentUser]);
  const activeFolder = useMemo(() => folders.find(f => f.id === activeFolderId), [folders, activeFolderId]);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activeFolderId) return;

    const newCard: any = {
      userId: currentUser.id,
      partyId: currentUser.partyId,
      folderId: activeFolderId,
      displayName: currentUser.name,
      tier: currentUser.tier,
      posts: payloadUrls.filter(u => u.trim() !== '').map((url, i) => ({
        id: `post-${Date.now()}-${i}`,
        url,
        sn: i + 1
      })),
      engagementPoints: 0,
      timestamp: Date.now()
    };

    await db.upsertCard(newCard);
    await syncData();
    setShowDeployModal(false);
    setPayloadUrls(['', '']);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newFolderName) return;

    const newFolder: Partial<Folder> = {
      id: `folder-${Date.now()}`,
      partyId: currentUser.partyId,
      name: newFolderName,
      createdBy: currentUser.id
    };

    await db.createFolder(newFolder);
    await syncData();
    setShowFolderModal(false);
    setNewFolderName('');
  };

  const handleEngagementAction = async (card: Card, postId: string) => {
    if (!currentUser) return;
    await db.logEngagement({ viewerId: currentUser.id, cardId: card.id, postId: postId });
  };

  const handleEngagementDone = async (card: Card) => {
    if (!currentUser) return;
    await db.addNotification({
      recipientId: card.userId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: NotificationType.ENGAGEMENT_RECEIVED,
      message: `${currentUser.name} has completed engagement.`
    });
    await syncData();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 px-4 md:px-8 py-3 md:py-5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icons.Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-xl font-black tracking-tighter uppercase leading-none">{APP_NAME}</h1>
              <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
                Sector: {currentUser?.partyId}
              </p>
            </div>
          </div>

          {/* Folder Tabs - Mobile Scrollable */}
          <div className="flex-1 flex items-center gap-1 md:gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
            {folders.map(folder => (
              <button 
                key={folder.id} 
                onClick={() => setActiveFolderId(folder.id)}
                className={`flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${activeFolderId === folder.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {folder.name}
              </button>
            ))}
            {currentUser?.role === UserRole.ADMIN && (
              <button onClick={() => setShowFolderModal(true)} className="p-1.5 md:p-2 text-indigo-400 hover:text-white transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3 bg-slate-900 border border-slate-800 p-1 md:p-1.5 md:pr-4 rounded-lg md:rounded-xl">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center font-black text-[10px] md:text-xs ${currentUser?.role === UserRole.ADMIN ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {currentUser?.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{currentUser?.name}</span>
                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-tighter mt-0.5">{currentUser?.tier}</span>
              </div>
            </div>
            <button onClick={logout} className="p-1.5 md:p-2 text-slate-500 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto pt-20 md:pt-28 px-4 md:px-8 pb-10 md:pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
          
          <div className="xl:col-span-8 order-2 xl:order-1">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">{activeFolder?.name || 'Workshop'} Stream</h2>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Operatives Active: {otherCards.length}
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeployModal(true)}
                  disabled={!activeFolderId}
                  className="w-full md:w-auto px-6 md:px-8 py-4 bg-indigo-600 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                  Deploy Payload
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               {otherCards.length === 0 ? (
                 <div className="col-span-1 md:col-span-2 py-20 md:py-32 text-center border-2 border-dashed border-slate-800 rounded-2xl md:rounded-[3rem] bg-slate-900/10">
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">No activity in this platform node yet</p>
                 </div>
               ) : (
                 otherCards.map((card) => (
                   <UserCard 
                      key={card.id}
                      card={card}
                      viewerId={currentUser?.id || ''}
                      logs={logs}
                      onAction={(postId) => handleEngagementAction(card, postId)} 
                      onDone={() => handleEngagementDone(card)} 
                      isReciprocated={logs.some(l => l.viewerId === card.userId && l.cardId === myCard?.id)}
                      theyEngagedMe={logs.some(l => l.viewerId === card.userId && l.cardId === myCard?.id)}
                      isPoweredUp={false}
                      tier={card.tier}
                      role={currentUser?.role || UserRole.REGULAR}
                   />
                 ))
               )}
             </div>
          </div>

          <div className="xl:col-span-4 order-1 xl:order-2 space-y-6 md:space-y-8">
            <div className="glass-card rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-indigo-500/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4 md:mb-6">Personal Node</h3>
              {myCard ? (
                <div className="scale-95 md:scale-100 origin-top">
                  <UserCard card={myCard} viewerId={currentUser?.id || ''} logs={logs} onAction={() => {}} onDone={() => {}} isReciprocated={false} theyEngagedMe={false} isPoweredUp={true} tier={myCard.tier} role={currentUser?.role || UserRole.REGULAR} />
                </div>
              ) : (
                <div className="py-8 md:py-12 text-center border border-dashed border-indigo-500/20 rounded-2xl">
                  <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest">No Active Payload</p>
                </div>
              )}
            </div>
            <div className="glass-card rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 md:sticky md:top-28">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 md:mb-8">Intelligence Trace</h3>
              <NotificationPanel notifications={notifications.filter(n => n.recipientId === currentUser?.id || n.recipientId === 'all')} onClear={() => {}} />
            </div>
          </div>
        </div>
      </main>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8">
          <div className="glass-card w-full max-w-xl rounded-2xl md:rounded-[3.5rem] p-8 md:p-12 border border-white/10 shadow-3xl">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase mb-6">Deploy to {activeFolder?.name}</h2>
            <form onSubmit={handleDeploy} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Target Link</label>
                <input required value={payloadUrls[0]} onChange={e => { const next = [...payloadUrls]; next[0] = e.target.value; setPayloadUrls(next); }} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 text-white text-sm" />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setShowDeployModal(false)} className="py-4 text-[10px] font-black uppercase text-slate-500 flex-1">Cancel</button>
                <button type="submit" className="py-4 md:py-5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl md:rounded-2xl flex-[2]">Confirm Deployment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8">
          <div className="glass-card w-full max-w-md rounded-2xl md:rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-3xl">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase mb-6">Establish Platform Node</h2>
            <form onSubmit={handleCreateFolder} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Node Name (e.g. Farcaster)</label>
                <input required value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Enter platform name" className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 text-white text-sm" />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setShowFolderModal(false)} className="py-4 text-[10px] font-black uppercase text-slate-500 flex-1">Abort</button>
                <button type="submit" className="py-4 md:py-5 bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl md:rounded-2xl flex-[2]">Create Node</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
