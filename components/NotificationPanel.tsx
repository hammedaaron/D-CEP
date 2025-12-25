
import React from 'react';
import { Notification, NotificationType } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onClear: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClear }) => {
  const scrollToUser = (userId: string) => {
    const el = document.getElementById(`card-${userId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('reciprocated-glow');
      setTimeout(() => el.classList.remove('reciprocated-glow'), 2000);
    }
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
          <p className="text-[10px] uppercase font-black tracking-widest">No active traces</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div 
            key={notif.id}
            className="p-4 glass-card rounded-2xl border border-slate-800/50 hover:border-amber-500/30 transition-all group relative"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                notif.type === NotificationType.SYSTEM_WARNING ? 'bg-red-500 text-white' : 
                notif.type === NotificationType.POWER_HOUR_START ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
              }`}>
                {notif.senderName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">
                  <span className="font-black text-amber-500">{notif.senderName}</span>
                  {notif.type === NotificationType.ENGAGEMENT_RECEIVED 
                    ? " just engaged with your posts." 
                    : notif.type === NotificationType.RECIPROCATION_DUE 
                    ? " is waiting for your return engagement."
                    : notif.type === NotificationType.POWER_HOUR_START
                    ? " triggered a community Power Hour!"
                    : " sent a system warning."}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-tighter">
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </p>
                {(notif.type === NotificationType.ENGAGEMENT_RECEIVED || notif.type === NotificationType.RECIPROCATION_DUE) && (
                  <button 
                    onClick={() => scrollToUser(notif.senderId)}
                    className="inline-block mt-2 text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    REDEEM DEBT
                  </button>
                )}
              </div>
              <button 
                onClick={() => onClear(notif.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
