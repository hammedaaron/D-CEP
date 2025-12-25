
import { Card, EngagementLog, Notification, User, Tier, UserRole } from '../types';

const STORAGE_KEYS = {
  USER: 'dcep_user',
  CARDS: 'dcep_cards',
  LOGS: 'dcep_logs',
  NOTIFICATIONS: 'dcep_notifications'
};

export const SYSTEM_PARTY_ID = 'SYSTEM';

export const storageService = {
  // Parse specialized passwords according to strict architectural rules
  authenticate: (password: string, name: string): User | null => {
    // DEV Format: Dev[1-8]{2} (e.g., Dev11, Dev88)
    const devMatch = password.match(/^Dev([1-8]{2})$/);
    if (devMatch) {
      return {
        id: `dev-${devMatch[1]}`,
        name: `${name} (System Architect)`,
        role: UserRole.DEV,
        tier: Tier.PLATINUM,
        partyId: SYSTEM_PARTY_ID // DEVs are rooted in SYSTEM
      };
    }

    // ADMIN Format: Hamstar[XX][Y] (XX=2-digit party 1-9, Y=1-digit admin 1-9)
    // Regex: Hamstar followed by 2 digits (1-9) then 1 digit (1-9)
    const adminMatch = password.match(/^Hamstar([1-9]{2})([1-9])$/);
    if (adminMatch) {
      return {
        id: `admin-${adminMatch[1]}-${adminMatch[2]}`,
        name: `${name} (Admin)`,
        role: UserRole.ADMIN,
        tier: Tier.PLATINUM,
        partyId: adminMatch[1],
        adminId: adminMatch[2]
      };
    }

    // REGULAR User Logic (Generic credentials result in Party 01)
    if (password.length >= 4) {
      return {
        id: `user-${Date.now()}`,
        name: name || 'Operative',
        role: UserRole.REGULAR,
        tier: Tier.SILVER,
        partyId: '01'
      };
    }

    return null;
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCards: (): Card[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CARDS);
    return stored ? JSON.parse(stored) : [];
  },

  getLogs: (): EngagementLog[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    return stored ? JSON.parse(stored) : [];
  },

  getNotifications: (): Notification[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  saveCards: (cards: Card[]) => localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards)),
  saveLogs: (logs: EngagementLog[]) => localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs)),
  saveNotifications: (notifs: Notification[]) => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
  
  clearAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
