import React from 'react';
import { X, BookOpen, MousePointer2, Backpack, Swords, Sparkles } from 'lucide-react';

interface GameManualProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameManual: React.FC<GameManualProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 border-b border-slate-700 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3 text-amber-500">
            <BookOpen className="w-8 h-8" />
            <h2 className="text-2xl font-bold font-cinzel">冒险指南</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 text-slate-300 font-serif leading-relaxed">
          
          <section>
            <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              游戏目标
            </h3>
            <p>
              欢迎来到 <strong className="text-white">Aetheria</strong>，这是一个无限可能的文本冒险世界。在这里，没有固定的结局。你的目标是探索世界，完成史诗任务，并尽可能长时间地生存下去。你是自己故事的作者。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5" />
              如何游玩
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">选择你的道路：</strong> 每一回合，你都会面临 3-4 个选择。点击你认为最合适的选项来推动剧情。
              </li>
              <li>
                <strong className="text-white">承担风险：</strong> 游戏通常会提供一个“高风险”选项。虽然危险，但往往伴随着丰厚的奖励或惊人的剧情转折。
              </li>
              <li>
                <strong className="text-white">利用职业优势：</strong> 注意那些与你的职业（如法师、盗贼）相关的选项，它们通常有更高的成功率。
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Backpack className="w-5 h-5" />
              物品与任务
            </h3>
            <p className="mb-2">
              侧边栏会实时跟踪你的状态：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">背包 (Inventory)：</strong> 你获得的道具会出现在这里。AI 会根据你拥有的物品解锁特殊的剧情选项（例如：拥有“古老钥匙”可能允许你打开一扇锁着的门）。
              </li>
              <li>
                <strong className="text-white">任务 (Quests)：</strong> 当你接受委托或发现秘密时，任务列表会自动更新。完成任务可能会获得强大的装备或称谓。
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Swords className="w-5 h-5" />
              战斗与死亡
            </h3>
            <p>
              这是一个危险的世界。错误的决定可能导致受伤甚至死亡。如果你的角色死亡，你必须重新开始一个新的冒险。请谨慎行事，但不要畏惧挑战！
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors shadow-lg"
          >
            明白了，开始冒险！
          </button>
        </div>

      </div>
    </div>
  );
};

export default GameManual;