export interface Character {
  id: string;
  name: string;
  health: number;
  fatigue: number;
  // Другие характеристики персонажа L5R
  water?: number;
  earth?: number;
  fire?: number;
  air?: number;
  void?: number;
}

export interface BattleCharacter extends Character {
  initiative: number;
  isVisible: boolean;
  conditions: string[];
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  // Другие свойства состояний
}

export interface SocketSession {
  sessionId: string | null;
  isConnected: boolean;
  players: string[];
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
