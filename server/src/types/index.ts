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
  skills?: Record<string, number>;
}

export interface BattleCharacter extends CharacterData {
  initiative: number;
  isVisible: boolean;
  conditions: string[];
}

export interface SessionData {
  id: string;
  initiativeOrder: string[];
  charactersInBattle: BattleCharacter[];
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
  skills?: Record<string, number>;
}
