<div align="center">

# 🔥 Awesome OpenClaw Skills

**最全面的 OpenClaw Agent Skills 精选合集 | 116 技能包**

[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-116-orange)](./skills)

**[English](./README_EN.md)** | 简体中文

</div>

---

## 📖 简介

这是最全面的 **OpenClaw Agent Skills** 合集，收录了官方和社区的所有热门技能包。每个 Skill 都经过测试，可立即用于增强你的 AI Agent 能力。

### 什么是 OpenClaw Skill？

OpenClaw Skill 是一种标准化的能力扩展包，让你的 AI Agent 能够：
- 🛠️ 执行特定任务（代码生成、文件处理）
- 🔌 集成第三方服务（GitHub、Notion、Slack）
- 🎯 提供专业能力（天气查询、语音通话、股票分析）

---

## 🚀 快速开始

### 安装 Skill

```bash
# 方式一：使用 ClawHub 安装（推荐）
npx clawhub@latest install github

# 方式二：手动复制
# 将 skills/ 目录下的任意 skill 文件夹复制到：
# ~/.openclaw/skills/
```

### 验证安装

重启 OpenClaw 后，Agent 会自动加载新安装的 Skills。

---

## 📦 完整 Skills 列表

### 🖥️ 开发工具类 (13)

| Skill | 描述 | 难度 |
|-------|------|------|
| [coding-agent](./skills/coding-agent) | 编程代理，自动化代码编写、重构和 PR 审查 | ⭐⭐⭐ |
| [github](./skills/github) | GitHub 集成，管理仓库、Issues、PRs | ⭐⭐ |
| [gh-issues](./skills/gh-issues) | GitHub Issues 自动化处理 | ⭐⭐⭐ |
| [openclaw-github-assistant](./skills/openclaw-github-assistant) | OpenClaw GitHub 助手 | ⭐⭐ |
| [skill-creator](./skills/skill-creator) | Skill 创建工具，快速生成新的 Agent Skill | ⭐⭐ |
| [agent-browser](./skills/agent-browser) | 浏览器自动化，网页抓取和操作 | ⭐⭐⭐ |
| [node-connect](./skills/node-connect) | OpenClaw 节点连接诊断 | ⭐⭐ |
| [session-logs](./skills/session-logs) | 会话日志管理 | ⭐ |
| [model-usage](./skills/model-usage) | 模型使用统计 | ⭐ |
| [blucli](./skills/blucli) | BluCLI 命令行工具 | ⭐⭐ |
| [eightctl](./skills/eightctl) | 8ctl 工具集成 | ⭐⭐ |
| [ordercli](./skills/ordercli) | 订单命令行工具 | ⭐⭐ |
| [xurl](./skills/xurl) | URL 处理工具 | ⭐ |

### 📝 生产力工具 (14)

| Skill | 描述 | 难度 |
|-------|------|------|
| [notion](./skills/notion) | Notion 集成，管理笔记和数据库 | ⭐⭐ |
| [obsidian](./skills/obsidian) | Obsidian 笔记集成 | ⭐ |
| [apple-notes](./skills/apple-notes) | Apple 备忘录集成 | ⭐ |
| [apple-reminders](./skills/apple-reminders) | Apple 提醒事项 | ⭐ |
| [things-mac](./skills/things-mac) | Things 3 任务管理 | ⭐⭐ |
| [trello](./skills/trello) | Trello 看板集成 | ⭐⭐ |
| [bear-notes](./skills/bear-notes) | Bear 笔记集成 | ⭐ |
| [self-improving-agent](./skills/self-improving-agent) | 自我改进代理，持续学习 | ⭐⭐ |
| [ontology](./skills/ontology) | 知识图谱，结构化记忆 | ⭐⭐⭐ |
| [find-skills](./skills/find-skills) | 发现和安装新 Skills | ⭐ |
| [blogwatcher](./skills/blogwatcher) | 博客监控 | ⭐⭐ |
| [summarize](./skills/summarize) | 智能内容总结工具 | ⭐ |
| [oracle](./skills/oracle) | Oracle 预测工具 | ⭐⭐ |
| [peekaboo](./skills/peekaboo) | Peekaboo 工具 | ⭐ |

### 🌐 通讯与协作 (9)

| Skill | 描述 | 难度 |
|-------|------|------|
| [slack](./skills/slack) | Slack 团队协作集成 | ⭐⭐ |
| [discord](./skills/discord) | Discord 集成 | ⭐⭐ |
| [voice-call](./skills/voice-call) | 语音通话能力 | ⭐⭐ |
| [imsg](./skills/imsg) | iMessage 集成 | ⭐⭐ |
| [bluebubbles](./skills/bluebubbles) | BlueBubbles iMessage 集成 | ⭐⭐ |
| [himalaya](./skills/himalaya) | Himalaya 邮件客户端 | ⭐⭐ |
| [wacli](./skills/wacli) | WhatsApp CLI | ⭐⭐ |
| [songsee](./skills/songsee) | 音乐发现工具 | ⭐ |
| [mcporter](./skills/mcporter) | Minecraft 服务器工具 | ⭐⭐ |

### 🤖 AI 与多媒体 (14)

| Skill | 描述 | 难度 |
|-------|------|------|
| [gemini](./skills/gemini) | Google Gemini AI 集成 | ⭐⭐ |
| [nano-banana-pro](./skills/nano-banana-pro) | Gemini 图像生成 | ⭐⭐ |
| [openai-image-gen](./skills/openai-image-gen) | OpenAI 图像生成 | ⭐⭐ |
| [openai-whisper](./skills/openai-whisper) | OpenAI Whisper 本地语音识别 | ⭐⭐ |
| [openai-whisper-api](./skills/openai-whisper-api) | OpenAI Whisper API 语音识别 | ⭐⭐ |
| [sag](./skills/sag) | ElevenLabs TTS 语音合成 | ⭐⭐ |
| [sherpa-onnx-tts](./skills/sherpa-onnx-tts) | Sherpa ONNX 本地 TTS | ⭐⭐⭐ |
| [gifgrep](./skills/gifgrep) | GIF 搜索工具 | ⭐ |
| [spotify-player](./skills/spotify-player) | Spotify 音乐播放 | ⭐⭐ |
| [sonoscli](./skills/sonoscli) | Sonos 音响控制 | ⭐⭐ |
| [openhue](./skills/openhue) | Philips Hue 智能灯光 | ⭐⭐ |
| [camsnap](./skills/camsnap) | 摄像头快照 | ⭐ |
| [video-frames](./skills/video-frames) | 视频帧提取 | ⭐⭐ |
| [canvas](./skills/canvas) | OpenClaw Canvas 画布操作 | ⭐⭐ |

### 📄 文档处理 (5)

| Skill | 描述 | 难度 |
|-------|------|------|
| [docx](./skills/docx) | Word 文档读写 | ⭐⭐ |
| [pdf](./skills/pdf) | PDF 文档处理 | ⭐⭐ |
| [pptx](./skills/pptx) | PowerPoint 演示文稿 | ⭐⭐ |
| [xlsx](./skills/xlsx) | Excel 电子表格 | ⭐⭐ |
| [nano-pdf](./skills/nano-pdf) | Nano PDF 处理 | ⭐⭐ |

### 📊 数据与搜索 (9)

| Skill | 描述 | 难度 |
|-------|------|------|
| [a-stock-analysis](./skills/a-stock-analysis) | A股数据分析 | ⭐⭐⭐ |
| [akshare-stock](./skills/akshare-stock) | AKShare 股票数据 | ⭐⭐ |
| [tavily-search](./skills/tavily-search) | Tavily AI 搜索 | ⭐ |
| [brave-web-search](./skills/brave-web-search) | Brave 网页搜索 | ⭐ |
| [agent-reach](./skills/agent-reach) | 社交平台接入工具 | ⭐⭐ |
| [goplaces](./skills/goplaces) | 地点搜索与导航 | ⭐ |
| [weather](./skills/weather) | 天气查询和预报 | ⭐ |
| [polymarket-trade](./skills/polymarket-trade) | Polymarket 预测市场查询 | ⭐⭐ |
| [prismfy-search](./skills/prismfy-search) | Prismfy 多引擎网页搜索 | ⭐ |

### 🏢 企业协作 (4)

| Skill | 描述 | 难度 |
|-------|------|------|
| [feishu-doc](./skills/feishu-doc) | 飞书文档集成 | ⭐⭐ |
| [feishu-drive](./skills/feishu-drive) | 飞书云盘集成 | ⭐⭐ |
| [feishu-wiki](./skills/feishu-wiki) | 飞书知识库集成 | ⭐⭐ |
| [feishu-perm](./skills/feishu-perm) | 飞书权限管理 | ⭐⭐ |

### 🔧 系统工具 (9)

| Skill | 描述 | 难度 |
|-------|------|------|
| [healthcheck](./skills/healthcheck) | 系统健康检查和安全审计 | ⭐⭐ |
| [1password](./skills/1password) | 1Password 密码管理 | ⭐⭐ |
| [tmux](./skills/tmux) | Tmux 会话管理 | ⭐⭐ |
| [gog](./skills/gog) | GoG 游戏平台集成 | ⭐ |
| [clawhub](./skills/clawhub) | ClawHub Skills 市场集成 | ⭐ |
| [md2wechat](./skills/md2wechat) | Markdown 转微信公众号格式 | ⭐⭐ |
| [pollyreach](./skills/pollyreach) | AI 电话助手，自动拨号完成任务 | ⭐⭐⭐ |
| [free-ride](./skills/free-ride) | 免费 AI 模型管理（OpenRouter） | ⭐⭐ |
| [elite-longterm-memory](./skills/elite-longterm-memory) | 高级长期记忆系统（WAL+向量搜索） | ⭐⭐⭐ |

---

## 🎯 使用场景

### 场景一：自动化开发流程
```
用户：帮我审查这个 PR 并创建 issue
Agent：[使用 github skill] 正在分析 PR #42...
       [使用 gh-issues skill] 已创建关联 issue...
```

### 场景二：智能办公
```
用户：把这份报告转成 Word，然后发到飞书
Agent：[使用 docx skill] 正在生成 Word 文档...
       [使用 feishu-drive skill] 已上传到飞书云盘...
```

### 场景三：数据分析
```
用户：分析一下贵州茅台最近的走势
Agent：[使用 a-stock-analysis skill] 正在获取数据...
       [使用 akshare-stock skill] 技术指标分析完成...
```

### 场景四：多媒体创作
```
用户：生成一张图片，然后用我的声音读出这段文字
Agent：[使用 nano-banana-pro skill] 图片生成完成...
       [使用 sag skill] 语音合成完成...
```

---

## 🔍 如何选择 Skill？

| 你的需求 | 推荐的 Skills |
|---------|--------------|
| 提高开发效率 | coding-agent, github, gh-issues, agent-browser |
| 文档处理 | docx, pdf, pptx, xlsx, md2wechat |
| 数据分析 | a-stock-analysis, akshare-stock, tavily-search |
| 团队协作 | slack, discord, feishu-doc, feishu-drive |
| AI 创作 | gemini, nano-banana-pro, openai-image-gen, sag |
| 系统维护 | healthcheck, 1password, self-improving-agent |

---

## 📚 了解更多

- [OpenClaw 官网](https://openclaw.ai)
- [Skill 开发文档](https://docs.openclaw.ai/skills)
- [ClawHub Skill 市场](https://clawhub.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)

---

## 🤝 贡献

欢迎贡献新的 Skill 或改进现有 Skill！

1. Fork 本仓库
2. 添加你的 Skill 到 `skills/` 目录
3. 确保包含完整的 `SKILL.md` 文档
4. 提交 Pull Request

### Skill 结构要求

```
your-skill/
├── SKILL.md          # 必需：Skill 定义文件
├── package.json      # 可选：依赖配置
├── scripts/          # 可选：脚本文件
└── references/       # 可选：参考文档
```

---

## 📄 许可证

本仓库中的所有 Skills 均采用 [MIT License](LICENSE)。

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ for the OpenClaw Community

</div>
