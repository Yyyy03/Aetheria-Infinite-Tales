# ⚔️ Aetheria: Infinite Tales (无尽传说)

> 一个基于 Google Gemini AI 驱动的无限文本冒险 RPG 引擎。每一次选择都将书写新的历史，每一场战斗都独一无二。

![封面图占位符 - 建议放一张游戏主界面截图](docs/images/banner_placeholder.png)

## 📖 项目简介

**Aetheria** 是一个完全由 AI 生成内容的文字冒险游戏。它不像传统的 RPG 那样使用预设剧本，而是利用大语言模型（LLM）实时生成剧情、战斗逻辑、任务线以及场景插画。

核心特色：
*   **无限剧情**：没有固定的结局，你的选择真正改变故事走向。
*   **实时插画**：根据当前场景描述，AI 实时生成沉浸式背景图。
*   **动态战斗系统**：回合制战斗，包含普通、精英、BOSS 三种敌人稀有度，数值与描述由 AI 动态计算。
*   **状态追踪**：侧边栏实时更新你的生命值、背包物品和当前任务。

---

## 📸 游戏截图

| 角色创建 | 探索与叙事 | 战斗界面 |
| :---: | :---: | :---: |
| ![角色创建截图](docs/images/screenshot_start.png) | ![叙事界面截图](docs/images/screenshot_narrative.png) | ![Boss战截图](docs/images/screenshot_combat.png) |

*(注意：请将你的实际运行截图放入 `docs/images/` 文件夹中并替换上述链接)*

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
下载项目所需的库（如 React, Lucide 图标, Google GenAI SDK 等）：

```bash
npm install
# 或者如果你使用 yarn
yarn install
```

### 3. 配置环境变量 (关键步骤)
项目需要读取你的 API Key 才能与 Google AI 通信。

1.  在项目根目录下创建一个名为 `.env` 的文件。
2.  在文件中添加以下内容：

```env
API_KEY=你的_GOOGLE_GEMINI_API_KEY_粘贴在这里
```

> **注意**: 请确保不要将包含真实 Key 的 `.env` 文件提交到 GitHub (通常 .gitignore 会包含它)。

### 4. 启动本地服务器
一切准备就绪，运行启动命令：

```bash
npm start
# 或者根据你的构建工具 (如 Vite)
npm run dev
```

### 5. 访问游戏
终端会显示访问地址，通常是：
*   **http://localhost:3000** 
*   或者 **http://localhost:5173**

打开浏览器访问该地址即可开始冒险！

---

## 📂 文件结构说明

为了方便你理解和修改代码，以下是主要核心文件的说明：

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
│   ├── StartScreen.tsx     # 角色创建与职业选择界面
│   ├── GameInterface.tsx   # 主要游戏界面 (显示剧情、战斗、选项)
│   ├── Sidebar.tsx         # 左侧边栏 (显示属性、背包、任务)
│   └── GameManual.tsx      # 游戏帮助手册弹窗
│
└── services/
    └── geminiService.ts    # 【核心大脑】负责与 Google Gemini API 通信
                            # 包含 narrative (剧情) 和 image (图片) 的生成逻辑
```

## 🧠 如何修改游戏设定？

如果你想调整游戏平衡性或风格，可以关注以下文件：

*   **修改职业属性**: 打开 `components/StartScreen.tsx`，找到 `BASE_STATS` 对象修改 HP、攻击力等数值。
*   **修改 AI 性格/规则**: 打开 `constants.ts`，编辑 `INITIAL_SYSTEM_INSTRUCTION`。你可以调整战斗计算公式、叙事风格（比如让它变得更幽默或更黑暗）。
*   **调整敌人出现概率**: 打开 `services/geminiService.ts`，搜索 `potentialRarity`，你可以调整 Boss 或精英怪出现的概率。

---

## 🤝 贡献指南

欢迎提交 Pull Request 来改进这个项目！无论是修复 Bug、增加新的职业预设，还是优化 Prompt，都非常欢迎。

## 📄 许可证

MIT License
