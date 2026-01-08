import { GoogleGenAI, Type } from "@google/genai";
import { TurnData, CharacterProfile, CombatState } from "../types";
import { ART_STYLE_PROMPT, INITIAL_SYSTEM_INSTRUCTION } from "../constants";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNextTurn = async (
  history: { role: string; parts: { text: string }[] }[],
  lastChoice: string,
  currentInventory: string[],
  currentQuests: string[],
  character: CharacterProfile,
  combatState: CombatState | null
): Promise<TurnData> => {
  
  const model = "gemini-3-flash-preview";

  const inventoryStr = currentInventory.join(", ");
  const questStr = currentQuests.join(", ");
  
  let combatStr = "NO ACTIVE COMBAT";
  let rarityInstruction = "";

  if (combatState) {
    combatStr = `COMBAT ACTIVE vs ${combatState.enemyName} [${combatState.enemyRarity.toUpperCase()}] (HP: ${combatState.enemyHp}/${combatState.enemyMaxHp})`;
  } else {
    // If no combat is active, roll for potential rarity IF a fight starts this turn.
    const roll = Math.random();
    let potentialRarity = "normal";
    
    if (roll > 0.90) { // 10% chance for Boss
        potentialRarity = "boss";
    } else if (roll > 0.70) { // 20% chance for Elite
        potentialRarity = "elite";
    }

    if (potentialRarity !== "normal") {
        rarityInstruction = `\n    SYSTEM NOTE: If a NEW combat encounter is triggered in this turn, it MUST be a '${potentialRarity.toUpperCase()}' enemy. Scale HP and stats accordingly (Elite=2x, Boss=4x). Make the description epic.`;
    }
  }
  
  const contextPrompt = `
    Current Status:
    - Character: ${character.name} (HP: ${character.stats.hp}/${character.stats.maxHp})
    - Class: ${character.role}
    - Attack Power: ${character.stats.attack}
    - Inventory: [${inventoryStr}]
    - Active Quests: [${questStr}]
    - Combat Status: ${combatStr}
    ${rarityInstruction}
    
    User Action: ${lastChoice}
    
    Task: Generate the next segment of the adventure in Chinese (Simplified).
    - If 'Combat Status' is active, simulate one turn of battle.
    - If user action initiates a fight, start combat.
    - Calculate damage based on stats/items.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      narrative: { type: Type.STRING, description: "The story text for this turn in Chinese." },
      choices: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3-4 options for the player to choose next in Chinese."
      },
      inventoryUpdates: {
        type: Type.OBJECT,
        properties: {
          add: { type: Type.ARRAY, items: { type: Type.STRING } },
          remove: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["add", "remove"]
      },
      questUpdates: {
        type: Type.OBJECT,
        properties: {
          add: { type: Type.ARRAY, items: { type: Type.STRING } },
          complete: { type: Type.ARRAY, items: { type: Type.STRING } },
          remove: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["add", "complete", "remove"]
      },
      combatUpdate: {
        type: Type.OBJECT,
        properties: {
            isActive: { type: Type.BOOLEAN },
            enemyName: { type: Type.STRING, description: "Name of the enemy if combat is starting/active" },
            enemyHp: { type: Type.NUMBER, description: "Current HP of enemy" },
            enemyMaxHp: { type: Type.NUMBER, description: "Max HP of enemy" },
            enemyRarity: { type: Type.STRING, enum: ["normal", "elite", "boss"], description: "Rarity of the enemy" },
            playerDamageTaken: { type: Type.NUMBER, description: "Damage taken by player this turn" },
            enemyDamageTaken: { type: Type.NUMBER, description: "Damage dealt to enemy this turn" },
            combatLog: { type: Type.STRING, description: "Short summary of damage numbers (e.g. 'You dealt 12 dmg, took 5 dmg')" }
        },
        required: ["isActive", "playerDamageTaken", "enemyDamageTaken", "combatLog"]
      },
      visualDescription: { 
        type: Type.STRING, 
        description: "A detailed visual description of the current scene for image generation in ENGLISH. Include character appearance. Focus on action and atmosphere." 
      }
    },
    required: ["narrative", "choices", "inventoryUpdates", "questUpdates", "combatUpdate", "visualDescription"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: h.parts
        })),
        { role: 'user', parts: [{ text: contextPrompt }] }
      ],
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from Gemini");
    
    const data = JSON.parse(jsonText) as TurnData;
    return data;

  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    throw error;
  }
};

export const generateSceneImage = async (visualDescription: string): Promise<string | undefined> => {
  const model = "gemini-2.5-flash-image"; 
  
  const prompt = `${visualDescription}. ${ART_STYLE_PROMPT}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
            aspectRatio: "16:9"
        }
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
       for (const part of candidates[0].content.parts) {
         if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
         }
       }
    }
    return undefined;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return undefined;
  }
};