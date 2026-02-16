
import { UserSettings, SessionResult } from '../types';

export type SessionProgressSnapshot = {
  wpm: number;
  accuracy: number;
  errors: number;
};

export type AppEventMap = {
  'app/ready': { timestamp: number };
  'settings/changed': { changedKeys: string[]; settings: UserSettings };
  'network/status': { online: boolean; timestamp: number };
  'session/started': { 
    modeId: string; 
    sessionLocalId: string; 
    startedAtMs: number;
  };
  'session/progress': { 
    modeId: string; 
    sessionLocalId: string; 
    elapsedMs: number; 
    snapshot: SessionProgressSnapshot;
  };
  'session/ended': { 
    modeId: string; 
    sessionLocalId: string; 
    stats: SessionResult; 
    endedAtMs: number;
  };
  'sync/pending': { pendingCount: number };
  'sync/success': { sessionLocalId: string; serverSessionId: string };
  'sync/failure': { sessionLocalId: string; reason: string };
  'recommendation/updated': { text: string; actionHash: string };
  'data/reset': { keepGuestId: boolean };
  'data/imported': { version: string; timestamp: number };
};
