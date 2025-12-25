
export enum UserRole {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN',
  DEV = 'DEV'
}

export enum Tier {
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum'
}

export enum NotificationType {
  ENGAGEMENT_RECEIVED = 'ENGAGEMENT_RECEIVED',
  SYSTEM_WARNING = 'SYSTEM_WARNING',
  POWER_HOUR_START = 'POWER_HOUR_START',
  RECIPROCATION_DUE = 'RECIPROCATION_DUE'
}

// Fixed missing EngagementLog interface used for tracking cross-operative interactions
export interface EngagementLog {
  id: string;
  viewerId: string;
  cardId: string;
  postId: string;
  status: 'DONE' | 'PENDING';
  pointsEarned?: number;
  timestamp: number;
}

export interface Party {
  id: string;
  name: string;
  adminPassword?: string;
  createdAt: number;
}

export interface Folder {
  id: string;
  partyId: string;
  name: string;
  description?: string;
  icon?: string;
  createdBy: string;
}

export interface Post {
  id: string;
  cardId: string;
  url: string;
  sn: number;
}

export interface Card {
  id: string;
  userId: string;
  partyId: string;
  folderId: string;
  displayName: string;
  timestamp: number;
  tier: Tier;
  posts: Post[];
  engagementPoints: number;
  x?: number; // For Dev Drag-and-Drop
  y?: number;
}

export interface InstructionBox {
  id: string;
  partyId: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'MISSION';
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tier: Tier;
  partyId: string;
  avatar?: string;
  // adminId added to resolve property missing error in storageService authentication
  adminId?: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface AppState {
  currentUser: User | null;
  activeParty: Party | null;
  folders: Folder[];
  cards: Card[];
  notifications: Notification[];
  instructions: InstructionBox[];
  isLoading: boolean;
}
