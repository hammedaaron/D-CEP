
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Party, Folder, Card, InstructionBox, Notification, AppState, UserRole, EngagementLog } from './types';
import { db, SYSTEM_PARTY_ID } from './db';
import { supabase } from './supabase';
import { Gate } from './components/Gate';
import { Layout } from './components/Layout';
import { Rulebook } from './components/Rulebook';
import { LandingPage } from './components/LandingPage';

interface AppContextType extends AppState {
  logs: EngagementLog[];
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  login: (name: string, party: string, pass?: string) => Promise<void>;
  establish: (pName: string, aName: string, pass: string) => Promise<void>;
  logout: () => void;
  syncData: () => Promise<void>;
  showRulebook: boolean;
  setShowRulebook: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { logs: EngagementLog[], activeFolderId: string | null }>({
    currentUser: null,
    activeParty: null,
    folders: [],
    cards: [],
    notifications: [],
    instructions: [],
    logs: [],
    activeFolderId: null,
    isLoading: true,
  });
  const [showRulebook, setShowRulebook] = useState(false);
  const [gateMode, setGateMode] = useState<'OPERATIVE' | 'AUTHORITY' | null>(null);

  const syncData = useCallback(async () => {
    if (!state.currentUser) return;
    const data = await db.getPartyData(
      state.currentUser.partyId, 
      state.currentUser.role, 
      state.activeFolderId || undefined
    );
    setState(prev => ({ 
      ...prev, 
      ...data, 
      activeFolderId: prev.activeFolderId || (data.folders[0]?.id || null),
      isLoading: false 
    }));
  }, [state.currentUser, state.activeFolderId]);

  useEffect(() => {
    const saved = localStorage.getItem('dcep_session');
    if (saved) {
      const user = JSON.parse(saved);
      setState(prev => ({ ...prev, currentUser: user }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (!state.currentUser) return;
    syncData();
    const channel = supabase.channel('sector_sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => syncData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [state.currentUser, syncData]);

  const login = async (name: string, party: string, pass?: string) => {
    const user = await db.loginUser(name, party, pass);
    if (user) {
      localStorage.setItem('dcep_session', JSON.stringify(user));
      setState(prev => ({ ...prev, currentUser: user }));
    }
  };

  const establish = async (pName: string, aName: string, pass: string) => {
    const user = await db.createParty(pName, aName, pass);
    if (user) {
      localStorage.setItem('dcep_session', JSON.stringify(user));
      setState(prev => ({ ...prev, currentUser: user }));
    }
  };

  const logout = () => {
    localStorage.removeItem('dcep_session');
    setGateMode(null);
    setState({
      currentUser: null,
      activeParty: null,
      folders: [],
      cards: [],
      notifications: [],
      instructions: [],
      logs: [],
      activeFolderId: null,
      isLoading: false,
    });
  };

  const contextValue: AppContextType = {
    ...state,
    setActiveFolderId: (id) => setState(p => ({ ...p, activeFolderId: id })),
    login,
    establish,
    logout,
    syncData,
    showRulebook,
    setShowRulebook
  };

  if (state.isLoading) return <div className="h-screen bg-black flex items-center justify-center text-indigo-500 font-black tracking-widest uppercase animate-pulse">Establishing Connection...</div>;

  return (
    <AppContext.Provider value={contextValue}>
      {!state.currentUser ? (
        gateMode ? (
          <Gate mode={gateMode} onBack={() => setGateMode(null)} />
        ) : (
          <LandingPage onEnter={(mode) => setGateMode(mode)} />
        )
      ) : (
        <>
          <Layout />
          {showRulebook && <Rulebook role={state.currentUser.role} onClose={() => setShowRulebook(false)} />}
        </>
      )}
    </AppContext.Provider>
  );
};

export default App;
