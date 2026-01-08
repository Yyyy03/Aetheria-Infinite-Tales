# ⚔️ Aetheria: Infinite Tales (无尽传说)

![Aetheria Banner](https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop)

> 一个基于 Google Gemini AI 驱动的无限文本冒险 RPG 引擎。每一次选择都将书写新的历史，每一场战斗都独一无二。

## 📖 项目简介

**Aetheria** 是一个完全由 AI 生成内容的文字冒险游戏。它不像传统的 RPG 那样使用预设剧本，而是利用大语言模型（LLM）实时生成剧情、战斗逻辑、任务线以及场景插画。

![Adventure Vibes](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2468&auto=format&fit=crop)

### 核心特色
*   **自带 Key (BYOK)**: 这是一个纯前端项目，你只需要在网页上输入你的 API Key 即可游玩，无需复杂的后台配置。
*   **无限剧情**：没有固定的结局，你的选择真正改变故事走向。
*   **实时插画**：根据当前场景描述，AI 实时生成沉浸式背景图。
*   **动态战斗系统**：回合制战斗，包含普通、精英、BOSS 三种敌人稀有度，数值与描述由 AI 动态计算。
*   **技能视觉特效**：释放技能时会触发炫酷的视觉反馈（火焰、冰霜、剑气等）。
*   **状态追踪**：侧边栏实时更新你的生命值、背包物品和当前任务。

![Combat System](https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=2069&auto=format&fit=crop)

---

## 🛠️ 环境要求与依赖

在 Node.js 生态中，我们使用 `package.json` 来管理依赖（相当于 Python 的 `requirements.txt`）。在本地运行此项目之前，请确保你的环境满足以下条件：

### 1. 基础环境
*   **Node.js**: 版本需 >= 18.0.0 (推荐使用 LTS 版本)。[下载地址](https://nodejs.org/)
*   **API Key**: Google Gemini API Key 或兼容 OpenAI 格式的 API Key (如 SEU 校内接口)。

### 2. 项目依赖库 (Dependencies)
这些库将在你运行 `npm install` 时自动安装：

| 库名称 | 用途 |
| :--- | :--- |
| `react` / `react-dom` | 核心 UI 框架 (v19.0.0+) |
| `@google/genai` | Google 官方新版 Gemini SDK，用于与 AI 对话 |
| `lucide-react` | 一套精美的开源图标库 |

### 3. 开发依赖 (Dev Dependencies)
| 库名称 | 用途 |
| :--- | :--- |
| `vite` | 极速的前端构建与开发服务器 |
| `typescript` | 提供类型安全的代码支持 |
| `tailwindcss` | 用于快速编写样式 (本项目主要通过 CDN 加载，但本地配置也已包含) |

---

## 🚀 详细安装与启动指南

请按照以下步骤在你的本地电脑上启动项目：

### 第一步：获取代码
打开终端 (Terminal / CMD / PowerShell)，运行以下命令：

```bash
# 1. 克隆项目到本地
git clone https://github.com/your-username/aetheria-rpg.git

# 2. 进入项目文件夹
cd aetheria-rpg
```

### 第二步：安装依赖
在项目文件夹内，运行安装命令。这会读取 `package.json` 并下载所有需要的库。

```bash
npm install
# 或者如果你喜欢使用 yarn
# yarn install
```

### 第三步：启动本地服务器
安装完成后，启动开发服务器：

```bash
npm run dev
```

终端应该会显示类似以下的输出：
```text
  VITE v5.0.12  ready in 140 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 第四步：开始游戏
1.  按住 `Ctrl` (Mac 上是 `Cmd`) 并点击终端里的链接 `http://localhost:5173/`，或者手动复制到浏览器打开。
2.  在游戏启动界面：
    *   如果你是 SEU 学生，点击 **"SEU (东南大学)"** 预设按钮，输入你的 API Key。
    *   如果你使用官方 Gemini，选择 **"官方 Google Gemini"** 并输入 Key。
3.  设定角色外貌，点击 **"开始冒险"**！

---

## 📂 文件结构说明

```text
/
├── index.html              # 项目入口 HTML
├── package.json            # 项目依赖配置文件 (相当于 requirements.txt)
├── index.tsx               # React 入口文件，挂载 App
├── App.tsx                 # 核心逻辑控制器 (状态管理、回合处理流程)
├── types.ts                # TypeScript 类型定义 (数据结构都在这里)
├── constants.ts            # 系统提示词 (System Prompt) 和常量配置
│
├── components/             # UI 组件库
│   ├── StartScreen.tsx     # 角色创建与 API Key 输入界面 (包含 SEU 配置)
│   ├── GameInterface.tsx   # 主要游戏界面 (显示剧情、战斗、特效)
│   ├── Sidebar.tsx         # 左侧边栏 (显示属性、背包、任务)
│   └── GameManual.tsx      # 游戏帮助手册弹窗
│
└── services/
    └── geminiService.ts    # 【核心大脑】负责与 AI (Gemini/OpenAI) 通信
```

## 🤝 贡献指南

欢迎提交 Pull Request 来改进这个项目！无论是修复 Bug、增加新的职业预设，还是优化 Prompt，都非常欢迎。

![Join the Adventure](https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2670&auto=format&fit=crop)

## 📄 许可证

MIT License