export interface GameState {
  inventory: string[];
  quests: string[];
  history: ChatMessage[];
  character: CharacterProfile | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  combat: CombatState | null; // Track active combat
  apiKey: string | null; // Store user provided API Key for TEXT (Qwen/OpenAI/Gemini)
  provider: 'gemini' | 'openai'; // gemini = Official Google SDK, openai = OpenRouter/OpenAI compatible
  baseUrl: string; // Used for OpenAI compatible providers
  customModel: string; // Allow user to specify model for OpenRouter
}

export interface CharacterStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface Skill {
  name: string;
  description: string;
  type: 'combat' | 'utility';
}

export interface CharacterProfile {
  name: string;
  role: string;
  appearance: string;
  stats: CharacterStats;
  skills: Skill[];
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
  combatLog: string;
  skillUsed?: string; // Name of the skill used this turn (by player)
  visualEffect?: 'fire' | 'ice' | 'lightning' | 'heal' | 'physical' | 'dark' | null; // Visual cue
}

// Expanded Scene Types for better variety
export type SceneType = 
  | 'forest' | 'dungeon' | 'town' | 'tavern' | 'castle' 
  | 'cave' | 'mountain' | 'desert' | 'ruins' | 'swamp' 
  | 'sea' | 'combat' | 'boss_fight' | 'mystery' | 'shop' | 'camp'
  | 'snow' | 'volcano' | 'library' | 'heaven';

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
  sceneType: SceneType; // AI decides the type of scene
  visualDescription: string; // Kept for context if needed
  imageUrl?: string; // Resolved path based on sceneType
}

export interface CombatState {
  enemyName: string;
  enemyHp: number;
  enemyMaxHp: number;
  enemymaxHp: number;
  enemyRarity: EnemyRarity;
}

export interface ApiResponse {
  turnData: TurnData;
}