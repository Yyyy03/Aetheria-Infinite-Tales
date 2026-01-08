import React, { useState, useEffect } from 'react';
import { CharacterProfile, CharacterStats, Skill } from '../types';
import { Sword, Wand, Crown, Shield, Music, Skull, Zap, Target, Sparkles, UserPen, Info, AlertTriangle, Swords, Heart, Key, Settings, Globe, Server, Cpu, School } from 'lucide-react';

interface StartScreenProps {
  onStart: (profile: CharacterProfile, apiKey: string, provider: 'gemini' | 'openai', baseUrl: string, customModel: string) => void;
}

const APPEARANCE_PRESETS: Record<string, string[]> = {
  '战士': [
    '身穿重型板甲，手持双手巨剑，满脸伤疤，眼神坚毅的久经沙场的老兵。',
    '身披轻便链甲，背负鸢盾与单手剑，充满朝气的年轻卫士。',
    '穿着粗犷的皮毛护具，肌肉虬结，手持双刃战斧的野蛮人战士。',
    '穿着破旧的生锈铠甲，眼神空洞，仿佛刚从死人堆里爬出来的流浪雇佣兵。',
    '身着闪亮的仪式铠甲，披着丝绸披风，举止优雅的皇家护卫。'
  ],
  '法师': [
    '身着绣有奥术符文的深蓝色长袍，手持水晶法杖，周身环绕微光。',
    '神秘的兜帽法师，面容隐藏在阴影中，指尖跳动着不稳定的火焰能量。',
    '穿着丝绸长袍，佩戴着各种魔法饰品，显得博学而优雅的学者。',
    '衣衫褴褛，头发蓬乱，眼中闪烁着疯狂光芒的野路子术士。',
    '身穿战斗法袍，一手持剑一手持杖，在战场上穿梭的战斗法师。'
  ],
  '潜行者': [
    '一身黑色紧身皮甲，腰间别着两把淬毒匕首，面容冷峻。',
    '穿着朴素的灰色斗篷，混在人群中毫不起眼，眼神却锐利如刀。',
    '戴着半遮面具，行动无声无息，手中把玩着一枚金币。',
    '穿着夜行衣，身上挂满了各种开锁工具和暗器的飞贼。',
    '衣着华贵但袖中藏刀，游走于上流社会的致命刺客。'
  ],
  '游侠': [
    '身披森林迷彩斗篷，背着一把巨大的紫杉长弓，身旁跟着一只忠诚的猎鹰。',
    '穿着轻便皮甲，手持双刀，眼神如鹰般锐利，身上带着荒野的气息。',
    '头戴宽檐帽，披着防雨斗篷，腰间挂着捕兽夹的赏金猎人。',
    '身着树叶编织的伪装服，几乎与森林融为一体的精灵射手。'
  ],
  '圣骑士': [
    '身穿闪耀的金色全身铠甲，手持战锤与圣徽，散发着令人安心的神圣光辉。',
    '身着银白盔甲，红色披风猎猎作响，手按长剑，眼神充满慈悲与坚定。',
    '穿着黑色与金色交织的铠甲，手持巨盾，为了正义不惜一切的审判官。',
    '饱经风霜，铠甲上布满凹痕，依然屹立不倒的守护者。'
  ],
  '吟游诗人': [
    '衣着华丽多彩，帽子上插着鲜艳的羽毛，背着一把精致的鲁特琴，笑容迷人。',
    '穿着流浪艺人的旧衣服，手持长笛，眼神沧桑，仿佛藏着无数故事。',
    '打扮滑稽，脸上涂着油彩，用笑话和杂耍隐藏杀机的宫廷弄臣。',
    '身背战鼓，声音洪亮，能够用歌声激起战士热血的战地诗人。'
  ],
  '死灵法师': [
    '面色苍白如纸，身穿破旧的黑色长袍，周围隐约有幽灵低语。',
    '身着骨饰皮甲，手持顶端镶嵌骷髅的法杖，眼神冰冷无情。',
    '看起来像是个普通的医生，但随身携带的手术包里装着可疑的防腐剂。',
    '被诅咒的贵族，皮肤上刻满了封印亡灵的符文，痛苦而强大。'
  ],
  '武僧': [
    '身穿简朴的练功服，肌肉线条分明，双手缠着绷带，站姿如松。',
    '身披橙色袈裟，脖子上挂着粗大的念珠，神态祥和但气场强大。',
    '看似醉醺醺的酒鬼，脚步虚浮，但眼神清明，身法诡异莫测。',
    '蒙着双眼，依靠感知行动，动作精准如机械的苦行僧。'
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

const CLASS_SKILLS: Record<string, Skill[]> = {
  '战士': [
    { name: '顺劈斩', description: '强力挥动武器，对面前的敌人造成重创。', type: 'combat' },
    { name: '战吼', description: '发出震慑的怒吼，提升防御并惊吓敌人。', type: 'combat' }
  ],
  '法师': [
    { name: '火球术', description: '召唤一团爆裂的火焰轰击敌人。', type: 'combat' },
    { name: '奥术护盾', description: '用纯粹的能量抵挡即将到来的伤害。', type: 'combat' }
  ],
  '潜行者': [
    { name: '背刺', description: '从阴影中发动突袭，造成致命一击。', type: 'combat' },
    { name: '消失', description: '利用烟雾弹瞬间进入潜行状态。', type: 'utility' }
  ],
  '游侠': [
    { name: '多重射击', description: '同时射出三支箭矢，攻击多个目标。', type: 'combat' },
    { name: '自然感知', description: '感知周围的陷阱、足迹或隐藏的敌人。', type: 'utility' }
  ],
  '圣骑士': [
    { name: '神圣打击', description: '为武器注入圣光，对邪恶生物造成额外伤害。', type: 'combat' },
    { name: '圣疗术', description: '呼唤圣光，瞬间治愈自己或盟友的伤势。', type: 'combat' }
  ],
  '吟游诗人': [
    { name: '英勇赞美诗', description: '弹奏激昂的乐曲，鼓舞士气。', type: 'combat' },
    { name: '迷魂曲', description: '用音乐迷惑敌人，使其暂时失去敌意。', type: 'utility' }
  ],
  '死灵法师': [
    { name: '生命汲取', description: '吸取敌人的生命力来回复自己。', type: 'combat' },
    { name: '亡者复生', description: '暂时唤起阵亡的敌人为你作战。', type: 'combat' }
  ],
  '武僧': [
    { name: '百裂拳', description: '极速打出无数拳影，令敌人无法招架。', type: 'combat' },
    { name: '冥想', description: '在这纷乱的战场中平复心境，恢复微量体力。', type: 'utility' }
  ],
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  // Updated default values for SEU
  const [baseUrl, setBaseUrl] = useState('https://openapi.seu.edu.cn/v1');
  const [customModel, setCustomModel] = useState('qwen2.5-72b');
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('战士');
  const [appearance, setAppearance] = useState('');

  // Load settings on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('rpg_api_key');
    const storedProvider = localStorage.getItem('rpg_provider') as 'gemini' | 'openai';
    const storedUrl = localStorage.getItem('rpg_base_url');
    const storedModel = localStorage.getItem('rpg_model');

    if (storedKey) setApiKey(storedKey);
    if (storedProvider) {
        setProvider(storedProvider);
    }
    // Only load stored URL/Model if they exist, otherwise use the new SEU defaults
    if (storedUrl) setBaseUrl(storedUrl);
    if (storedModel) setCustomModel(storedModel);
  }, []);

  const handleStart = () => {
    if (!name.trim() || !appearance.trim()) return;
    
    // Allow empty key only for local providers (user must know what they are doing)
    if (!apiKey.trim() && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')) {
         if(provider === 'gemini') return;
         // Warning for empty key on remote
    }
    
    // Save Settings
    localStorage.setItem('rpg_api_key', apiKey);
    localStorage.setItem('rpg_provider', provider);
    localStorage.setItem('rpg_base_url', baseUrl);
    localStorage.setItem('rpg_model', customModel);
    
    const stats = BASE_STATS[role] || { hp: 100, maxHp: 100, attack: 10, defense: 10 };
    const skills = CLASS_SKILLS[role] || [];
    onStart({ name, role, appearance, stats, skills }, apiKey, provider, baseUrl, customModel);
  };

  const handleRoleSelect = (newRole: string) => {
    setRole(newRole);
    setAppearance('');
  };

  const applyPreset = (type: 'seu' | 'openrouter' | 'local') => {
      setProvider('openai');
      if (type === 'seu') {
          setBaseUrl('https://openapi.seu.edu.cn/v1');
          setCustomModel('qwen2.5-72b');
      } else if (type === 'openrouter') {
          setBaseUrl('https://openrouter.ai/api/v1');
          setCustomModel('google/gemini-2.0-flash-exp:free');
      } else if (type === 'local') {
          setBaseUrl('http://127.0.0.1:11434/v1');
          setCustomModel('llama3');
          setApiKey('ollama'); // Dummy key
      }
  };

  const classes = [
    { 
      name: '战士', 
      icon: Sword, 
      tag: '近战 / 坦克',
      stats: 'HP: S | ATK: B | DEF: A',
      desc: '擅长近身肉搏，拥有极高的生存能力。无论是承受伤害还是挥舞重武器粉碎敌人，战士都是队伍中坚实的壁垒。',
      weakness: '缺乏远程攻击手段，对魔法抗性较弱，容易被风筝。'
    },
    { 
      name: '法师', 
      icon: Wand, 
      tag: '输出 / 爆发',
      stats: 'HP: C | ATK: S | DEF: C',
      desc: '掌控元素之力的奥术大师。能够释放毁灭性的法术瞬间消灭大量敌人，拥有最强的范围伤害能力。',
      weakness: '身体极其脆弱，施法可能需要时间，被近身后非常危险。'
    },
    { 
      name: '潜行者', 
      icon: Crown, 
      tag: '爆发 / 机动',
      stats: 'HP: B | ATK: A | DEF: B',
      desc: '阴影中的舞者。擅长利用潜行接近敌人发动致命一击，或利用高机动性在战场上游走，寻找弱点。',
      weakness: '正面硬碰硬能力较弱，依赖先手优势，持久战不利。'
    },
    { 
      name: '游侠', 
      icon: Target, 
      tag: '远程 / 持续',
      stats: 'HP: B | ATK: A | DEF: B',
      desc: '荒野的生存专家。精通弓箭与陷阱，能在敌人近身前将其射杀，同时拥有敏锐的感知能力来规避危险。',
      weakness: '在狭窄地形或被包围时难以发挥优势，缺乏强力防御。'
    },
    { 
      name: '圣骑士', 
      icon: Shield, 
      tag: '辅助 / 坦克',
      stats: 'HP: S | ATK: B | DEF: S',
      desc: '圣光的勇士。拥有最强的防御力和恢复能力，不仅能保护自己，还能治愈盟友，是对抗亡灵与恶魔的首选。',
      weakness: '攻击速度较慢，机动性差，缺乏远程和爆发性伤害。'
    },
    { 
      name: '吟游诗人', 
      icon: Music, 
      tag: '辅助 / 控制',
      stats: 'HP: B | ATK: C | DEF: B',
      desc: '万金油般的角色。虽然战斗力不突出，但能通过音乐强化自身状态或削弱敌人，拥有极高的社交魅力，常能避免战斗。',
      weakness: '单挑能力较弱，直接伤害手段有限，依赖队友或环境。'
    },
    { 
      name: '死灵法师', 
      icon: Skull, 
      tag: '召唤 / 削弱',
      stats: 'HP: C | ATK: A | DEF: C',
      desc: '玩弄生死的禁忌法师。通过吸取生命维持自身，并能唤起亡灵仆从作战，擅长以多打少的持续消耗战。',
      weakness: '被神圣力量严重克制，本体脆弱，需要时间来建立亡灵大军。'
    },
    { 
      name: '武僧', 
      icon: Zap, 
      tag: '连击 / 闪避',
      stats: 'HP: A | ATK: B | DEF: A',
      desc: '赤手空拳的格斗家。依靠极高的闪避率和连绵不绝的拳脚攻击压制敌人，内力深厚，擅长单体控制。',
      weakness: '缺乏防具保护，一旦被控制或无法闪避则很脆弱，攻击距离短。'
    },
  ];

  const selectedClass = classes.find(c => c.name === role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-4xl p-8 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <h1 className="text-4xl font-bold text-center text-amber-500 mb-2 font-cinzel">Aetheria</h1>
        <p className="text-center text-slate-400 mb-6 font-light">书写你的无限传奇。</p>

        <div className="space-y-8">
           {/* API Settings Section */}
           <div className="bg-slate-800/80 p-5 rounded-xl border border-amber-900/50 shadow-lg">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                    <Server className="w-5 h-5 text-amber-500" />
                    <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">游戏引擎配置 (AI Backend)</h2>
                </div>

                {/* Provider Tabs */}
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg mb-4">
                    <button 
                        onClick={() => setProvider('gemini')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded transition-all ${provider === 'gemini' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Sparkles className="w-3 h-3" />
                        官方 Google Gemini
                    </button>
                    <button 
                        onClick={() => setProvider('openai')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded transition-all ${provider === 'openai' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Settings className="w-3 h-3" />
                        自定义 / 极客模式
                    </button>
                </div>

                {/* Gemini Config */}
                {provider === 'gemini' && (
                    <div className="space-y-3 animate-fade-in">
                         <div className="relative">
                            <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input 
                                type="password" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-mono"
                                placeholder="在此输入 Google Gemini API Key"
                            />
                        </div>
                        <p className="text-xs text-slate-500 pl-1">
                            推荐使用。速度快，完全免费。 <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-amber-500 hover:underline">点击获取 Key</a>
                        </p>
                    </div>
                )}

                {/* Custom Config */}
                {provider === 'openai' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Quick Presets */}
                        <div className="flex gap-2 flex-wrap">
                             <button onClick={() => applyPreset('seu')} className="flex items-center gap-1 text-[10px] bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-700/50 px-2 py-1.5 rounded transition-all">
                                <School className="w-3 h-3" />
                                SEU (东南大学)
                             </button>
                             <button onClick={() => applyPreset('openrouter')} className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1.5 rounded border border-slate-600 transition-all">
                                OpenRouter
                             </button>
                             <button onClick={() => applyPreset('local')} className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1.5 rounded border border-slate-600 transition-all">
                                本地 Ollama
                             </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> Base URL (API 端点)</label>
                                <input 
                                    type="text" 
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                                    placeholder="https://api.openai.com/v1"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3"/> Model Name (模型名称)</label>
                                <input 
                                    type="text" 
                                    value={customModel}
                                    onChange={(e) => setCustomModel(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                                    placeholder="gpt-4o, deepseek-chat, qwen-plus..."
                                />
                            </div>
                        </div>
                        
                        <div className="relative">
                            <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input 
                                type="password" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-mono"
                                placeholder="API Key (SEU 接口需要填写)"
                            />
                        </div>
                        
                        <div className="bg-amber-900/20 border border-amber-900/30 p-2 rounded text-xs text-amber-500/80">
                            <strong>提示：</strong> 支持任何兼容 OpenAI 格式的接口 (DeepSeek, Moonshot, LocalAI, vLLM 等)。
                        </div>
                    </div>
                )}
            </div>

          {/* Name Section */}
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-slate-300 mb-2 text-center">你的尊姓大名</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-center font-cinzel text-lg"
              placeholder="例如：林克"
            />
          </div>

          <div className="border-t border-slate-800 my-6"></div>

          {/* Class Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-500" />
                选择你的职业
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
               {classes.map((c) => (
                 <button
                   key={c.name}
                   onClick={() => handleRoleSelect(c.name)}
                   className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all h-20 relative group ${role === c.name ? 'bg-amber-600/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                 >
                    <c.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">{c.name}</span>
                 </button>
               ))}
            </div>
            
            {/* Class Details Panel */}
            {selectedClass && (
                <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 backdrop-blur-sm grid md:grid-cols-2 gap-6 animate-fade-in">
                    
                    {/* Left Col: Stats & Desc */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                             <h3 className="text-xl font-bold text-amber-500 font-cinzel">{selectedClass.name}</h3>
                             <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 font-mono uppercase">{selectedClass.tag}</span>
                        </div>
                        
                        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-2 rounded">
                            {selectedClass.stats}
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-300 leading-relaxed">{selectedClass.desc}</p>
                            </div>
                            <div className="flex gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-400 leading-relaxed italic">{selectedClass.weakness}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Skills */}
                    <div className="space-y-3">
                        <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">核心技能</span>
                        <div className="space-y-2">
                            {CLASS_SKILLS[role]?.map((skill, idx) => (
                                <div key={idx} className="bg-slate-900/80 p-3 rounded border border-slate-700/80 flex items-start gap-3">
                                    <div className={`mt-1 p-1 rounded-full ${skill.type === 'combat' ? 'bg-red-900/30' : 'bg-blue-900/30'}`}>
                                        {skill.type === 'combat' ? <Swords className="w-3 h-3 text-red-400" /> : <Heart className="w-3 h-3 text-blue-400" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-200">{skill.name}</span>
                                            <span className={`text-[10px] px-1.5 rounded ${skill.type === 'combat' ? 'text-red-400 bg-red-950/30' : 'text-blue-400 bg-blue-950/30'}`}>
                                                {skill.type === 'combat' ? '战斗' : '辅助'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{skill.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Appearance Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              外貌设定
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">推荐预设</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {APPEARANCE_PRESETS[role]?.map((preset, idx) => (
                        <button
                            key={idx}
                            onClick={() => setAppearance(preset)}
                            className={`w-full text-left text-xs p-3 rounded border transition-all ${appearance === preset ? 'bg-amber-900/20 border-amber-500/50 text-amber-100' : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/30 text-slate-400 hover:text-slate-200'}`}
                        >
                            {preset}
                        </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                        <UserPen className="w-3 h-3" /> 自定义描述
                    </span>
                    <textarea 
                        value={appearance}
                        onChange={(e) => setAppearance(e.target.value)}
                        className="flex-1 w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm leading-relaxed"
                        placeholder="选择左侧预设，或在此输入你独特的角色描述..."
                    />
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">AI 将根据此描述生成你的角色图像。</p>
          </div>

          <button 
            onClick={handleStart}
            disabled={(!apiKey && provider === 'gemini') || !name || !appearance}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-900/20 mt-4 font-cinzel tracking-wider flex items-center justify-center gap-2 text-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sword className="w-6 h-6" />
            开始冒险
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;