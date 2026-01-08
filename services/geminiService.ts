import { GoogleGenAI, Type } from "@google/genai";
import { TurnData, CharacterProfile, CombatState } from "../types";
import { INITIAL_SYSTEM_INSTRUCTION } from "../constants";
import { getRandomImage } from "../assets/images";

// --- Schema Definition ---
// Updated to include expanded 'sceneType' enum matching types.ts
const turnDataSchemaObj = {
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
          combatLog: { type: Type.STRING, description: "Short summary of damage numbers (e.g. 'You dealt 12 dmg, took 5 dmg')" },
          skillUsed: { type: Type.STRING, description: "Name of skill used by player this turn, if any" },
          visualEffect: { type: Type.STRING, enum: ["fire", "ice", "lightning", "heal", "physical", "dark"], description: "Visual effect type" }
      },
      required: ["isActive", "playerDamageTaken", "enemyDamageTaken", "combatLog"]
    },
    sceneType: {
        type: Type.STRING,
        enum: ['forest', 'dungeon', 'town', 'tavern', 'castle', 'cave', 'mountain', 'desert', 'ruins', 'swamp', 'sea', 'combat', 'boss_fight', 'mystery', 'shop', 'camp', 'snow', 'volcano', 'library', 'heaven'],
        description: "The general environment type of the current story segment."
    },
    visualDescription: { 
      type: Type.STRING, 
      description: "Short visual description (unused for generation now, but good for context)." 
    }
  },
  required: ["narrative", "choices", "inventoryUpdates", "questUpdates", "combatUpdate", "sceneType"]
};

// Helper for Gemini SDK
const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

// Helper for OpenAI Compatible Fetch with Retry Logic
const callOpenAICompatibleApi = async (
    baseUrl: string,
    apiKey: string,
    model: string,
    systemPrompt: string,
    messages: { role: string; content: string }[]
): Promise<TurnData> => {
    
    // Append Schema to System Prompt for OpenRouter models
    const systemWithSchema = `${systemPrompt}\n\nIMPORTANT: You must respond with valid JSON matching this schema:\n${JSON.stringify(turnDataSchemaObj, null, 2)}`;

    const payload = {
        model: model,
        messages: [
            { role: "system", content: systemWithSchema },
            ...messages
        ],
        response_format: { type: "json_object" } // Enforce JSON mode where supported
    };

    // Prepare Headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    // IMPORTANT: Only add OpenRouter specific headers if the URL actually points to OpenRouter.
    if (baseUrl.includes('openrouter.ai')) {
        headers['HTTP-Referer'] = 'https://aetheria.rpg';
        headers['X-Title'] = 'Aetheria RPG';
    }

    const maxRetries = 3;
    let attempt = 0;
    let lastError = "";

    // Normalize URL: remove trailing slash if present, then append endpoint
    const normalizedBaseUrl = baseUrl.replace(/\/$/, ""); 
    const endpoint = `${normalizedBaseUrl}/chat/completions`;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                const delayMs = 2000 * Math.pow(2, attempt); 
                console.warn(`Attempt ${attempt + 1}: Rate limit (429) hit. Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                attempt++;
                lastError = "429 Rate Limit";
                continue;
            }

            if (!response.ok) {
                const errText = await response.text();
                lastError = `${response.status} - ${errText.slice(0, 200)}`; 
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            
            if (!content) throw new Error("No content received from API");

            try {
                const cleanContent = content.replace(/```json\n?|```/g, "").trim();
                return JSON.parse(cleanContent) as TurnData;
            } catch (e) {
                console.error("Failed to parse JSON from API:", content);
                throw new Error("Invalid JSON response from model");
            }

        } catch (error: any) {
            lastError = error.message || "Network Error";
            if (attempt < maxRetries - 1) {
                const delayMs = 2000 * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                attempt++;
            } else {
                throw new Error(`Connection failed after ${maxRetries} attempts. Last error: ${lastError}`);
            }
        }
    }

    throw new Error(`Failed to connect to API: ${lastError}`);
};


export const generateNextTurn = async (
  apiKey: string,
  history: { role: string; parts: { text: string }[] }[],
  lastChoice: string,
  currentInventory: string[],
  currentQuests: string[],
  character: CharacterProfile,
  combatState: CombatState | null,
  provider: 'gemini' | 'openai' = 'gemini',
  baseUrl: string = '',
  customModel: string = ''
): Promise<TurnData> => {
  
  const inventoryStr = currentInventory.join(", ");
  const questStr = currentQuests.join(", ");
  const skillsStr = character.skills ? character.skills.map(s => `[${s.name}]: ${s.description}`).join(", ") : "None";
  
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
    - Skills/Abilities: ${skillsStr}
    - Inventory: [${inventoryStr}]
    - Active Quests: [${questStr}]
    - Combat Status: ${combatStr}
    ${rarityInstruction}
    
    User Action: ${lastChoice}
    
    Task: Generate the next segment of the adventure in Chinese (Simplified).
    - If 'Combat Status' is active, simulate one turn of battle.
    - If user action initiates a fight, start combat.
    - Select the most appropriate 'sceneType' from the list provided in System Prompt.
  `;

  try {
    let result: TurnData;

    if (provider === 'gemini') {
        // --- GOOGLE GEMINI SDK PATH ---
        const model = "gemini-3-flash-preview"; 
        const ai = getAI(apiKey);
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
            responseSchema: turnDataSchemaObj,
          }
        });

        const jsonText = response.text;
        if (!jsonText) throw new Error("No text returned from Gemini");
        result = JSON.parse(jsonText) as TurnData;

    } else {
        // --- OPENAI COMPATIBLE (OPENROUTER / CUSTOM) PATH ---
        const messages = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'assistant', 
            content: h.parts[0].text
        }));
        messages.push({ role: 'user', content: contextPrompt });

        const targetModel = customModel || "gpt-3.5-turbo";

        result = await callOpenAICompatibleApi(baseUrl, apiKey, targetModel, INITIAL_SYSTEM_INSTRUCTION, messages);
    }

    // --- RANDOMIZED IMAGE SELECTION ---
    // Instead of a static map, we pick a random variant from the library
    result.imageUrl = getRandomImage(result.sceneType);

    return result;

  } catch (error) {
    console.error("Text Generation Error:", error);
    throw error;
  }
};