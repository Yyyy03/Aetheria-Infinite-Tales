import React from 'react';
import { Backpack, ScrollText, User, HelpCircle, Heart, Shield, Swords, Zap } from 'lucide-react';
import { CharacterProfile } from '../types';

interface SidebarProps {
  inventory: string[];
  quests: string[];
  character: CharacterProfile | null;
  onOpenManual: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ inventory, quests, character, onOpenManual }) => {
  
  // Calculate HP Percentage
  const hpPercent = character ? Math.max(0, Math.min(100, (character.stats.hp / character.stats.maxHp) * 100)) : 100;
  
  return (
    <div className="w-full md:w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full overflow-y-auto text-slate-200 shadow-2xl z-20">
      
      {/* Character Header */}
      <div className="p-6 border-b border-slate-700 bg-slate-800/50 relative group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-600 rounded-lg">
             <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
             <h2 className="font-bold text-lg text-amber-500 font-cinzel truncate">{character ? character.name : "未知英雄"}</h2>
             <p className="text-xs text-slate-400 uppercase tracking-widest">{character ? character.role : "无职业"}</p>
          </div>
        </div>

        {/* Stats Section */}
        {character && (
            <div className="space-y-3">
                {/* Health Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-red-400 font-bold"><Heart className="w-3 h-3 fill-current" /> HP</span>
                        <span className="text-slate-300">{character.stats.hp} / {character.stats.maxHp}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-red-600 transition-all duration-500" 
                            style={{ width: `${hpPercent}%` }}
                        ></div>
                    </div>
                </div>

                {/* Atk / Def */}
                <div className="flex justify-between gap-2">
                    <div className="bg-slate-900/50 px-3 py-1.5 rounded flex items-center gap-2 flex-1 border border-slate-700/50">
                        <Swords className="w-4 h-4 text-amber-500" />
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 block">攻击力</span>
                            <span className="text-sm font-bold text-slate-200">{character.stats.attack}</span>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 px-3 py-1.5 rounded flex items-center gap-2 flex-1 border border-slate-700/50">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 block">防御力</span>
                            <span className="text-sm font-bold text-slate-200">{character.stats.defense}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Skills Section */}
      {character && character.skills && character.skills.length > 0 && (
          <div className="p-6 border-b border-slate-700 bg-slate-900">
             <div className="flex items-center gap-2 mb-4 text-amber-500">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm font-cinzel">职业技能</h3>
             </div>
             <div className="space-y-2">
                {character.skills.map((skill, idx) => (
                    <div key={idx} className="bg-slate-800 p-2.5 rounded border border-slate-700/50 hover:border-amber-500/30 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-200">{skill.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${skill.type === 'combat' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                {skill.type === 'combat' ? '战斗' : '辅助'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">{skill.description}</p>
                    </div>
                ))}
             </div>
          </div>
      )}

      {/* Quests */}
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-4 text-amber-500">
          <ScrollText className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm font-cinzel">当前任务</h3>
        </div>
        
        <ul className="space-y-3">
          {quests.length === 0 ? (
            <li className="text-slate-600 italic text-sm">暂无活跃任务。</li>
          ) : (
            quests.map((quest, index) => (
              <li key={index} className="bg-slate-800/50 p-3 rounded border border-slate-700 text-sm shadow-sm animate-fade-in">
                <span className="block text-slate-300">{quest}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Inventory */}
      <div className="p-6 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2 mb-4 text-amber-500">
          <Backpack className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm font-cinzel">背包物品</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
           {inventory.length === 0 ? (
             <p className="col-span-2 text-slate-600 italic text-sm">背包是空的。</p>
           ) : (
             inventory.map((item, index) => (
                <div key={index} className="bg-slate-800 p-2 rounded text-xs text-center border border-slate-700 text-slate-300 truncate shadow-sm animate-fade-in" title={item}>
                  {item}
                </div>
             ))
           )}
        </div>
      </div>

      {/* Help Button Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <button 
          onClick={onOpenManual}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-sm py-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span>游戏指南</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;