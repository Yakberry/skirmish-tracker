export interface CharacterData {
  id?: string;
  name: string;
  strife: number;
  maxStrife: number;
  stance: string;
  water: number;
  earth: number;
  fire: number;
  air: number;
  void: number;
  initiative: number;
  defaultInitiative: number;
  conditions: string[];
  notes: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BattleCharacter extends CharacterData {
  isVisible: boolean;
}

export interface SessionData {
  id: string;
  initiativeOrder: string[];
  charactersInBattle: BattleCharacter[];
  masterSocketId: string;
}

export interface UpdateCharacterRequest {
  characterId: string;
  updates: Partial<CharacterData>;
}

export interface SocketSession {
  sessionId: string | null;
  isConnected: boolean;
  players: string[];
  playerName?: string;
  isMaster?: boolean;
}

export interface CreateCharacterRequest {
  name: string;
  health: number;
  fatigue: number;
  water: number;
  earth: number;
  fire: number;
  air: number;
  void: number;
  skills?: Record<string, number>;
}

/* eslint-disable no-unused-vars */
export enum Ring {
  Water,
  Earth,
  Fire,
  Air,
  Void
}
