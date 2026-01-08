export interface GameState {
  inventory: string[];
  quests: string[];
  history: ChatMessage[];
  character: CharacterProfile | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  combat: CombatState | null; // Track active combat
}

export interface CharacterStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface CharacterProfile {
  name: string;
  role: string;
  appearance: string;
  stats: CharacterStats;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type EnemyRarity = 'normal' | 'elite' | 'boss';

export interface CombatUpdate {
  isActive: boolean;
  enemyName?: string;
  enemyHp?: number;
  enemyMaxHp?: number;
  enemyRarity?: EnemyRarity;
  playerDamageTaken: number;
  enemyDamageTaken: number;
  combatLog: string; // A short summary like "You hit Goblin for 10 dmg"
}

export interface TurnData {
  narrative: string;
  choices: string[];
  inventoryUpdates: {
    add: string[];
    remove: string[];
  };
  questUpdates: {
    add: string[];
    complete: string[];
    remove: string[];
  };
  combatUpdate: CombatUpdate;
  visualDescription: string;
  imageUrl?: string;
}

export interface CombatState {
  enemyName: string;
  enemyHp: number;
  enemyMaxHp: number;
  enemyRarity: EnemyRarity;
}

export interface ApiResponse {
  turnData: TurnData;
}