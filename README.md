# ⚔️ Aetheria: Infinite Tales (无尽传说)

> 一个基于 Google Gemini AI 驱动的无限文本冒险 RPG 引擎。每一次选择都将书写新的历史，每一场战斗都独一无二。

## 📖 项目简介

**Aetheria** 是一个完全由 AI 生成内容的文字冒险游戏。它不像传统的 RPG 那样使用预设剧本，而是利用大语言模型（LLM）实时生成剧情、战斗逻辑、任务线以及场景插画。

核心特色：
*   **自带 Key (BYOK)**: 这是一个纯前端项目，你只需要在网页上输入你的 API Key 即可游玩，无需复杂的后台配置。
*   **无限剧情**：没有固定的结局，你的选择真正改变故事走向。
*   **实时插画**：根据当前场景描述，AI 实时生成沉浸式背景图。
*   **动态战斗系统**：回合制战斗，包含普通、精英、BOSS 三种敌人稀有度，数值与描述由 AI 动态计算。
*   **技能视觉特效**：释放技能时会触发炫酷的视觉反馈（火焰、冰霜、剑气等）。
*   **状态追踪**：侧边栏实时更新你的生命值、背包物品和当前任务。

---

## 🛠️ 环境要求

在本地运行此项目之前，请确保你的环境满足以下条件：

1.  **Node.js**: 版本需 >= 18.0.0 (推荐使用 LTS 版本)。
2.  **包管理器**: npm 或 yarn。
3.  **Google Gemini API Key**: 你需要一个有效的 Google Cloud 项目并开通 Gemini API 权限。
    *   [点击这里获取免费 API Key](https://aistudio.google.com/app/apikey)

---

## 🚀 快速开始 (如何运行)

请按照以下步骤在你的本地电脑上启动项目：

### 1. 克隆项目
打开终端 (Terminal) 或 Git Bash，运行以下命令将项目下载到本地：

```bash
git clone https://github.com/your-username/aetheria-rpg.git
cd aetheria-rpg
```

### 2. 安装依赖
下载项目所需的库：

```bash
npm install
# 或者如果你使用 yarn
yarn install
```

### 3. 启动本地服务器
直接运行启动命令：

```bash
npm start
# 或者根据你的构建工具 (如 Vite)
npm run dev
```

### 4. 开始冒险
1.  打开浏览器访问显示的地址 (通常是 `http://localhost:3000`)。
2.  在游戏启动界面的 **"设置 Google Gemini API Key"** 输入框中粘贴你的 Key。
3.  创建你的角色，开始旅程！

> **安全提示**: 你的 API Key 仅保存在你的浏览器本地存储 (LocalStorage) 中，用于直接请求 Google 接口，不会发送给任何第三方服务器。

---

## 📂 文件结构说明

```text
/
├── index.html              # 项目入口 HTML
├── index.tsx               # React 入口文件，挂载 App
├── App.tsx                 # 核心逻辑控制器 (状态管理、回合处理流程)
├── types.ts                # TypeScript 类型定义 (数据结构都在这里)
├── constants.ts            # 系统提示词 (System Prompt) 和常量配置
├── metadata.json           # 项目元数据
│
├── components/             # UI 组件库
│   ├── StartScreen.tsx     # 角色创建与 API Key 输入界面
│   ├── GameInterface.tsx   # 主要游戏界面 (显示剧情、战斗、特效)
│   ├── Sidebar.tsx         # 左侧边栏 (显示属性、背包、任务)
│   └── GameManual.tsx      # 游戏帮助手册弹窗
│
└── services/
    └── geminiService.ts    # 【核心大脑】负责与 Google Gemini API 通信
```

## 🤝 贡献指南

欢迎提交 Pull Request 来改进这个项目！无论是修复 Bug、增加新的职业预设，还是优化 Prompt，都非常欢迎。

## 📄 许可证

MIT License
