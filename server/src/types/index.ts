import { Socket } from 'socket.io';

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

export interface AppSocket extends Socket {
  sessionId?: string;
  playerName?: string;
  isMaster?: boolean;
}

export interface UpdateCharacterRequest {
  characterId: string;
  updates: Partial<CharacterData>;
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
  initiative: number;
  defaultInitiative: number;
  stress: number;
  skills?: Record<string, number>;
}

type AtLeastOne<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type ReadyCharacter = AtLeastOne<CharacterData, 'name' | 'water' | 'earth' | 'fire' | 'air' | 'void' | 'initiative' | 'defaultInitiative'>;
