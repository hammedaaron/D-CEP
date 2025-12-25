
import { supabase } from './supabase';
import { User, UserRole, Tier, Party, Folder, Card, InstructionBox, Notification, EngagementLog } from './types';

export const SYSTEM_PARTY_ID = 'SYSTEM';

export const db = {
  // Authentication Logic
  validateAdminPassword: (password: string) => {
    // DEV Format: Dev[1-8]{2}
    const devMatch = password.match(/^Dev([1-8]{2})$/);
    if (devMatch) return { role: UserRole.DEV, partyId: SYSTEM_PARTY_ID };
    
    // Legacy Admin Format: Hamstar[XX][Y]
    const adminMatch = password.match(/^Hamstar([1-9]{2})([1-9])$/);
    if (adminMatch) return { role: UserRole.ADMIN, partyId: adminMatch[1] };
    
    return null;
  },

  async createParty(name: string, adminName: string, adminPass: string): Promise<User | null> {
    // Generate a clean ID from the name
    const partyId = name.toLowerCase().trim().replace(/\s+/g, '-');
    
    // Check if sector already exists
    const { data: existing } = await supabase.from('parties').select('id').eq('id', partyId).single();
    if (existing) throw new Error("A Sector with this identifier already exists.");

    const { error: pError } = await supabase.from('parties').insert({
      id: partyId,
      name: name,
      admin_password: adminPass
    });

    if (pError) throw new Error("Sector instantiation failed at database level.");

    // Return the new Admin user
    return {
      id: `admin-${Date.now()}`,
      name: adminName,
      role: UserRole.ADMIN,
      tier: Tier.PLATINUM,
      partyId: partyId
    };
  },

  async loginUser(name: string, partyId: string, password?: string): Promise<User | null> {
    // Master DEV check
    const devCheck = password ? this.validateAdminPassword(password) : null;
    if (devCheck && devCheck.role === UserRole.DEV) {
      return {
        id: `dev-${Date.now()}`,
        name: name,
        role: UserRole.DEV,
        tier: Tier.PLATINUM,
        partyId: SYSTEM_PARTY_ID
      };
    }

    // Dynamic Party Check for isolation
    const cleanPartyId = partyId.toLowerCase().trim().replace(/\s+/g, '-');
    const { data: party, error } = await supabase.from('parties').select('*').eq('id', cleanPartyId).single();
    
    if (!party || error) throw new Error("Target Sector not found. Ensure ID is accurate.");

    // Admin login using sector password
    const isSectorAdmin = password === party.admin_password;

    return {
      id: isSectorAdmin ? `admin-${Date.now()}` : `user-${Date.now()}`,
      name: name,
      role: isSectorAdmin ? UserRole.ADMIN : UserRole.REGULAR,
      tier: isSectorAdmin ? Tier.PLATINUM : Tier.SILVER,
      partyId: party.id
    };
  },

  async getFolders(partyId: string) {
    const { data } = await supabase.from('folders').select('*').eq('partyId', partyId);
    return data || [];
  },

  async createFolder(folder: Partial<Folder>) {
    return supabase.from('folders').insert(folder);
  },

  async getPartyData(partyId: string, role: UserRole, activeFolderId?: string) {
    // Scoped queries: Users only see cards in their specific party
    const cardQuery = supabase.from('cards').select('*').eq('partyId', partyId);
    if (activeFolderId) cardQuery.eq('folderId', activeFolderId);

    // DEVs see everything
    if (role === UserRole.DEV) {
      const { data: allCards } = await supabase.from('cards').select('*');
      const { data: allFolders } = await supabase.from('folders').select('*');
      const { data: allNotifs } = await supabase.from('notifications').select('*');
      const { data: allLogs } = await supabase.from('engagement_logs').select('*');
      
      return {
        folders: allFolders || [],
        cards: allCards || [],
        notifications: (allNotifs || []).sort((a, b) => b.timestamp - a.timestamp),
        logs: allLogs || []
      };
    }

    const [folders, cards, notifications, logs] = await Promise.all([
      supabase.from('folders').select('*').eq('partyId', partyId),
      cardQuery,
      supabase.from('notifications').select('*').or(`recipientId.eq.all,recipientId.eq.${partyId}`),
      supabase.from('engagement_logs').select('*') // Logs are used for cross-checking reciprocity
    ]);

    return {
      folders: folders.data || [],
      cards: cards.data || [],
      notifications: (notifications.data || []).sort((a, b) => b.timestamp - a.timestamp),
      logs: logs.data || []
    };
  },

  async upsertCard(card: Card) {
    return supabase.from('cards').upsert(card);
  },

  async logEngagement(log: Partial<EngagementLog>) {
    return supabase.from('engagement_logs').insert({
      ...log,
      timestamp: Date.now(),
      status: 'DONE'
    });
  },

  async addNotification(notif: Partial<Notification>) {
    return supabase.from('notifications').insert({
      ...notif,
      timestamp: Date.now(),
      read: false
    });
  }
};
