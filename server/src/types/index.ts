import { Socket } from 'socket.io';

export interface CharacterData {
  id?: string;
  name: string;
  health: number;
  fatigue: number;
  water: number;
  earth: number;
  fire: number;
  air: number;
  void: number;
  defaultInitiative: number;
  stress: number;
  initiative: number;
  skills?: Record<string, number>;
}

export interface BattleCharacter extends CharacterData {
  isVisible: boolean;
  conditions: string[];
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
