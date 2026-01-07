import React, { useState } from 'react';
import { CharacterProfile, CharacterStats } from '../types';
import { Sword, Wand, Crown, Shield, Music, Skull, Zap, Target, Sparkles, UserPen } from 'lucide-react';

interface StartScreenProps {
  onStart: (profile: CharacterProfile) => void;
}

const APPEARANCE_PRESETS: Record<string, string[]> = {
  '战士': [
    '身穿重型板甲，手持双手巨剑，满脸伤疤，眼神坚毅的久经沙场的老兵。',
    '身披轻便链甲，背负鸢盾与单手剑，充满朝气的年轻卫士。',
    '穿着粗犷的皮毛护具，肌肉虬结，手持双刃战斧的野蛮人战士。'
  ],
  '法师': [
    '身着绣有奥术符文的深蓝色长袍，手持水晶法杖，周身环绕微光。',
    '神秘的兜帽法师，面容隐藏在阴影中，指尖跳动着不稳定的火焰能量。',
    '穿着丝绸长袍，佩戴着各种魔法饰品，显得博学而优雅的学者。'
  ],
  '潜行者': [
    '一身黑色紧身皮甲，腰间别着两把淬毒匕首，面容冷峻。',
    '穿着朴素的灰色斗篷，混在人群中毫不起眼，眼神却锐利如刀。',
    '戴着半遮面具，行动无声无息，手中把玩着一枚金币。'
  ],
  '游侠': [
    '身披森林迷彩斗篷，背着一把巨大的紫杉长弓，身旁跟着一只忠诚的猎鹰。',
    '穿着轻便皮甲，手持双刀，眼神如鹰般锐利，身上带着荒野的气息。'
  ],
  '圣骑士': [
    '身穿闪耀的金色全身铠甲，手持战锤与圣徽，散发着令人安心的神圣光辉。',
    '身着银白盔甲，红色披风猎猎作响，手按长剑，眼神充满慈悲与坚定。'
  ],
  '吟游诗人': [
    '衣着华丽多彩，帽子上插着鲜艳的羽毛，背着一把精致的鲁特琴，笑容迷人。',
    '穿着流浪艺人的旧衣服，手持长笛，眼神沧桑，仿佛藏着无数故事。'
  ],
  '死灵法师': [
    '面色苍白如纸，身穿破旧的黑色长袍，周围隐约有幽灵低语。',
    '身着骨饰皮甲，手持顶端镶嵌骷髅的法杖，眼神冰冷无情。'
  ],
  '武僧': [
    '身穿简朴的练功服，肌肉线条分明，双手缠着绷带，站姿如松。',
    '身披橙色袈裟，脖子上挂着粗大的念珠，神态祥和但气场强大。'
  ]
};

const BASE_STATS: Record<string, CharacterStats> = {
  '战士': { hp: 120, maxHp: 120, attack: 15, defense: 10 },
  '法师': { hp: 80, maxHp: 80, attack: 20, defense: 5 },
  '潜行者': { hp: 90, maxHp: 90, attack: 18, defense: 6 },
  '游侠': { hp: 100, maxHp: 100, attack: 16, defense: 7 },
  '圣骑士': { hp: 130, maxHp: 130, attack: 12, defense: 12 },
  '吟游诗人': { hp: 90, maxHp: 90, attack: 10, defense: 8 },
  '死灵法师': { hp: 85, maxHp: 85, attack: 19, defense: 5 },
  '武僧': { hp: 110, maxHp: 110, attack: 14, defense: 9 },
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('战士');
  const [appearance, setAppearance] = useState('');

  const handleStart = () => {
    if (!name.trim() || !appearance.trim()) return;
    const stats = BASE_STATS[role] || { hp: 100, maxHp: 100, attack: 10, defense: 10 };
    onStart({ name, role, appearance, stats });
  };

  const handleRoleSelect = (newRole: string) => {
    setRole(newRole);
  };

  const classes = [
    { name: '战士', icon: Sword, desc: '近战专家，坚韧不拔 (HP: High, DEF: High)' },
    { name: '法师', icon: Wand, desc: '奥术大师，毁天灭地 (HP: Low, ATK: High)' },
    { name: '潜行者', icon: Crown, desc: '阴影行者，致命一击 (HP: Med, ATK: High)' },
    { name: '游侠', icon: Target, desc: '百步穿杨，野外生存 (HP: Med, Balanced)' },
    { name: '圣骑士', icon: Shield, desc: '圣光护体，守护弱小 (HP: Max, DEF: Max)' },
    { name: '吟游诗人', icon: Music, desc: '魅力无穷，万事通晓 (Balanced, Social)' },
    { name: '死灵法师', icon: Skull, desc: '操纵亡者，禁忌知识 (HP: Low, Magic)' },
    { name: '武僧', icon: Zap, desc: '身法灵动，气劲护体 (HP: High, Evasion)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-3xl p-8 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <h1 className="text-4xl font-bold text-center text-amber-500 mb-2 font-cinzel">Aetheria</h1>
        <p className="text-center text-slate-400 mb-8 font-light">开启你的无限冒险之旅。</p>

        <div className="space-y-6">
          {/* Name Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">角色名称</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="例如：林克"
            />
          </div>

          {/* Class Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">选择职业</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {classes.map((c) => (
                 <button
                   key={c.name}
                   onClick={() => handleRoleSelect(c.name)}
                   className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all h-24 relative group ${role === c.name ? 'bg-amber-600/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                 >
                    <c.icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">{c.name}</span>
                 </button>
               ))}
            </div>
            <p className="text-xs text-amber-500/80 mt-2 text-center h-4 font-serif">
              {classes.find(c => c.name === role)?.desc}
            </p>
          </div>

          {/* Appearance Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              外貌设定
            </label>
            
            {/* Presets */}
            <div className="mb-4 grid gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">快速选择（点击应用）:</span>
              <div className="grid grid-cols-1 gap-2">
                {APPEARANCE_PRESETS[role]?.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAppearance(preset)}
                    className="text-left text-xs p-3 rounded bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-white transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Area */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                 <UserPen className="w-3 h-3 text-slate-500" />
                 <span className="text-xs text-slate-500 uppercase tracking-wider">自定义描述:</span>
              </div>
              <textarea 
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none h-20 text-sm"
                placeholder="选择上方预设，或在此输入自定义描述..."
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">这有助于 AI 生成一致的角色图像。</p>
          </div>

          <button 
            onClick={handleStart}
            disabled={!name || !appearance}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors shadow-lg mt-4 font-cinzel tracking-wider flex items-center justify-center gap-2"
          >
            <Sword className="w-5 h-5" />
            进入世界
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;