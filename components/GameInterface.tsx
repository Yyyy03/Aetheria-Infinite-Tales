import React, { useEffect, useRef } from 'react';
import { TurnData, CombatUpdate } from '../types';
import { Loader2, Skull, Star } from 'lucide-react';

interface GameInterfaceProps {
  turnData: TurnData | null;
  isLoading: boolean;
  onChoice: (choice: string) => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ turnData, isLoading, onChoice }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new turn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turnData]);

  const combat = turnData?.combatUpdate;
  const isCombatActive = combat?.isActive;

  // Determine effects
  const shouldShake = combat && combat.playerDamageTaken > 0;
  const shouldFlashEnemy = combat && combat.enemyDamageTaken > 0;

  // Rarity Styling
  const getRarityStyles = () => {
    const rarity = combat?.enemyRarity || 'normal';
    switch (rarity) {
        case 'boss':
            return {
                border: 'border-amber-400',
                bg: 'bg-slate-900/90',
                text: 'text-amber-400',
                shadow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]',
                icon: <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
            };
        case 'elite':
            return {
                border: 'border-slate-300',
                bg: 'bg-slate-900/80',
                text: 'text-slate-200',
                shadow: 'shadow-[0_0_20px_rgba(203,213,225,0.3)]',
                icon: <Skull className="w-5 h-5 text-slate-200" />
            };
        default:
            return {
                border: 'border-red-900/50',
                bg: 'bg-slate-900/80',
                text: 'text-red-500',
                shadow: 'shadow-[0_0_15px_rgba(220,38,38,0.3)]',
                icon: <Skull className="w-5 h-5" />
            };
    }
  };

  const rarityStyle = getRarityStyles();

  if (!turnData && isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-8">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse font-cinzel">正在召唤世界...</p>
      </div>
    );
  }

  if (!turnData) return null;

  return (
    <div className={`flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative ${shouldShake ? 'animate-shake' : ''}`}>
      
      {/* Background/Image Layer */}
      <div className="h-2/5 md:h-1/2 w-full relative bg-slate-900 border-b border-amber-900/30 group">
        {turnData.imageUrl ? (
            <img 
              src={turnData.imageUrl} 
              alt="Scene" 
              className={`w-full h-full object-cover animate-fade-in shadow-[inset_0_-20px_50px_rgba(0,0,0,0.8)] ${isCombatActive ? 'sepia-[.3] saturate-150' : ''}`}
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
               {isLoading ? (
                   <div className="text-center">
                       <Loader2 className="w-8 h-8 text-amber-600/50 animate-spin mx-auto mb-2" />
                       <span className="text-slate-600 text-sm">正在绘制景象...</span>
                   </div>
               ) : (
                   <span className="text-slate-700 italic">暂无图像</span>
               )}
            </div>
        )}

        {/* Enemy Hit Flash Overlay */}
        {shouldFlashEnemy && (
             <div className="absolute inset-0 mix-blend-overlay z-10 animate-hit-flash pointer-events-none"></div>
        )}
        
        {/* Combat Overlay UI */}
        {isCombatActive && combat && combat.enemyName && (
            <div className="absolute top-4 left-0 right-0 px-4 md:px-12 flex justify-center animate-fade-in z-20">
                <div className={`${rarityStyle.bg} backdrop-blur-md border ${rarityStyle.border} p-4 rounded-xl w-full max-w-lg ${rarityStyle.shadow} ${shouldFlashEnemy ? 'border-white/50' : ''}`}>
                    <div className="flex justify-between items-center mb-2">
                        <div className={`flex items-center gap-2 font-bold font-cinzel ${rarityStyle.text}`}>
                             {rarityStyle.icon}
                             <div className="flex flex-col">
                                <span>{combat.enemyName}</span>
                                {combat.enemyRarity !== 'normal' && (
                                    <span className="text-[10px] uppercase tracking-widest opacity-80">{combat.enemyRarity}</span>
                                )}
                             </div>
                        </div>
                        <span className="text-slate-300 text-sm">{combat.enemyHp} / {combat.enemyMaxHp}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                         {/* White flash bar behind the red bar for hit impact */}
                         <div className={`absolute top-0 left-0 h-full bg-white transition-opacity duration-200 ${shouldFlashEnemy ? 'opacity-100' : 'opacity-0'}`} style={{ width: `${Math.max(0, Math.min(100, ((combat.enemyHp || 0) / (combat.enemyMaxHp || 1)) * 100))}%` }}></div>
                         <div 
                             className="h-full bg-red-600 transition-all duration-300 relative z-10 mix-blend-multiply" 
                             style={{ width: `${Math.max(0, Math.min(100, ((combat.enemyHp || 0) / (combat.enemyMaxHp || 1)) * 100))}%` }}
                         ></div>
                    </div>
                    {combat.combatLog && (
                        <div className="mt-2 text-xs text-center text-amber-400 font-mono">
                            {combat.combatLog}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Player Damage Red Overlay */}
        {shouldShake && (
            <div className="absolute inset-0 bg-red-600/30 pointer-events-none animate-pulse z-30"></div>
        )}

        {/* Gradient Overlay for Text Readability transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      {/* Narrative Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full z-10" ref={scrollRef}>
         <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-serif animate-fade-in">
                {turnData.narrative}
            </p>
         </div>
      </div>

      {/* Choices Area (Sticky Bottom) */}
      <div className="p-6 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
             {isLoading ? (
                <div className="flex items-center justify-center gap-3 py-4">
                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                    <span className="text-slate-400 font-cinzel">
                        {isCombatActive ? "战斗进行中..." : "故事正在编织..."}
                    </span>
                </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {turnData.choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => onChoice(choice)}
                            className={`text-left px-6 py-4 rounded-lg transition-all duration-300 group shadow-lg border
                                ${isCombatActive 
                                    ? 'bg-red-950/30 border-red-900/30 hover:bg-red-900/40 hover:border-red-600/50' 
                                    : 'bg-slate-800 border-slate-700 hover:bg-amber-900/40 hover:border-amber-600/50'
                                }
                            `}
                        >
                            <span className={`font-bold mr-2 group-hover:text-amber-400 ${isCombatActive ? 'text-red-500' : 'text-amber-500'}`}>{idx + 1}.</span>
                            <span className="text-slate-200 group-hover:text-white">{choice}</span>
                        </button>
                    ))}
                 </div>
             )}
        </div>
      </div>

    </div>
  );
};

export default GameInterface;