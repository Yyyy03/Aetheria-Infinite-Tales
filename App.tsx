import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StartScreen from './components/StartScreen';
import GameInterface from './components/GameInterface';
import GameManual from './components/GameManual';
import { GameState, CharacterProfile, TurnData } from './types';
import { generateNextTurn } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    inventory: [],
    quests: [],
    history: [],
    character: null,
    isPlaying: false,
    isLoading: false,
    error: null,
    combat: null,
    apiKey: null,
    provider: 'gemini',
    baseUrl: '',
    customModel: ''
  });

  const [currentTurn, setCurrentTurn] = useState<TurnData | null>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleStartGame = async (
      character: CharacterProfile, 
      apiKey: string, 
      provider: 'gemini' | 'openai', 
      baseUrl: string, 
      customModel: string
  ) => {
    setGameState(prev => ({ 
        ...prev, 
        character, 
        apiKey,
        provider,
        baseUrl,
        customModel,
        isPlaying: true, 
        isLoading: true 
    }));
    
    // Initial prompt to start the game
    const initialPrompt = `开始冒险。角色：${character.name}，职业：${character.role}，外貌：${character.appearance}。请从一个适合 1 级冒险者的场景开始。`;
    
    await processTurn(
        initialPrompt, 
        character, 
        [], 
        [], 
        null, 
        apiKey,
        provider,
        baseUrl,
        customModel
    );
  };

  const handleChoice = async (choice: string) => {
    if (!gameState.character || !gameState.apiKey) return;
    
    // If user has 0 HP, this click resets the game (simple implementation for now)
    if (gameState.character.stats.hp <= 0) {
        window.location.reload(); 
        return;
    }

    await processTurn(
        choice, 
        gameState.character, 
        gameState.inventory, 
        gameState.quests,
        gameState.combat,
        gameState.apiKey,
        gameState.provider,
        gameState.baseUrl,
        gameState.customModel
    );
  };

  const processTurn = async (
      input: string, 
      character: CharacterProfile,
      inventory: string[],
      quests: string[],
      currentCombatState: GameState['combat'],
      apiKey: string,
      provider: 'gemini' | 'openai',
      baseUrl: string,
      customModel: string
  ) => {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
        const apiHistory = gameState.history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const data = await generateNextTurn(
            apiKey,
            apiHistory, 
            input, 
            inventory, 
            quests, 
            character,
            currentCombatState,
            provider,
            baseUrl,
            customModel
        );

        // --- 1. Handle Stats & Combat Updates ---
        let updatedCharacter = { ...character };
        let newCombatState = null;
        let isDead = false;

        const combatUpdate = data.combatUpdate;

        if (combatUpdate) {
            // Apply damage to player
            if (combatUpdate.playerDamageTaken > 0) {
                updatedCharacter.stats.hp = Math.max(0, updatedCharacter.stats.hp - combatUpdate.playerDamageTaken);
            }

            // Check Player Death
            if (updatedCharacter.stats.hp <= 0) {
                isDead = true;
                data.narrative += "\n\n【你已战死沙场... 点击选项重新开始】";
                data.choices = ["重新开始冒险"];
            }

            // Handle Combat State logic
            if (combatUpdate.isActive && !isDead) {
                newCombatState = {
                    enemyName: combatUpdate.enemyName || "Unknown Enemy",
                    enemyHp: combatUpdate.enemyHp || 0,
                    enemyMaxHp: combatUpdate.enemyMaxHp || 100,
                    enemyRarity: combatUpdate.enemyRarity || 'normal' // Preserve or set rarity
                };
            } else {
                newCombatState = null; // Combat ended or wasn't active
            }
        }

        // --- 2. Handle Inventory/Quest Updates ---
        const newInventory = [...inventory];
        data.inventoryUpdates.add.forEach(i => { if(!newInventory.includes(i)) newInventory.push(i); });
        data.inventoryUpdates.remove.forEach(i => {
             const idx = newInventory.indexOf(i);
             if (idx > -1) newInventory.splice(idx, 1);
        });

        const newQuests = [...quests];
        data.questUpdates.add.forEach(q => { if(!newQuests.includes(q)) newQuests.push(q); });
        data.questUpdates.complete.forEach(q => {
             const idx = newQuests.indexOf(q);
             if (idx > -1) newQuests.splice(idx, 1);
        });
        data.questUpdates.remove.forEach(q => {
             const idx = newQuests.indexOf(q);
             if (idx > -1) newQuests.splice(idx, 1);
        });

        // --- 3. Update State ---
        setCurrentTurn(data); // data now already contains resolved imageUrl
        setGameState(prev => ({
            ...prev,
            character: updatedCharacter,
            inventory: newInventory,
            quests: newQuests,
            combat: newCombatState,
            history: [
                ...prev.history,
                { role: 'user', text: input },
                { role: 'model', text: data.narrative } 
            ]
        }));

    } catch (err: any) {
        console.error(err);
        let errorMsg = "迷雾重重... (API调用失败，请检查设置)";
        
        if (err.message && err.message.includes("429")) {
            errorMsg = "请求过多 (429) - 免费模型繁忙。正在尝试重连，如果持续失败，请更换模型或稍后再试。";
        }
        
        setGameState(prev => ({ ...prev, error: errorMsg }));
    } finally {
        setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (!gameState.isPlaying) {
    return (
      <>
        <StartScreen onStart={handleStartGame} />
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-200">
      
      <div className="hidden md:flex flex-shrink-0">
         <Sidebar 
            inventory={gameState.inventory} 
            quests={gameState.quests} 
            character={gameState.character} 
            onOpenManual={() => setIsManualOpen(true)}
         />
      </div>

      <GameInterface 
        turnData={currentTurn} 
        isLoading={gameState.isLoading} 
        onChoice={handleChoice} 
      />

      <GameManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
};

export default App;