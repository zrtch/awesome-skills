<div align="center">

# 🔥 Hot Skills for OpenClaw

**最受欢迎的 OpenClaw Agent Skills 精选合集**

[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-30-orange)](./skills)

**[English](./README_EN.md)** | 简体中文

</div>

---

## 📖 简介

这是一个精心策划的 **OpenClaw Agent Skills** 合集，收录了社区中最受欢迎、最实用的技能包。每个 Skill 都经过测试，可立即用于增强你的 AI Agent 能力。

### 什么是 OpenClaw Skill？

OpenClaw Skill 是一种标准化的能力扩展包，让你的 AI Agent 能够：
- 🛠️ 执行特定任务（代码生成、文件处理）
- 🔌 集成第三方服务（GitHub、Notion、Slack）
- 🎯 提供专业能力（天气查询、语音通话）

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

## 📦 包含的 Skills

### 🖥️ 开发工具类

| Skill | 描述 | 难度 |
|-------|------|------|
| [**coding-agent**](./skills/coding-agent) | 编程代理，自动化代码编写、重构和 PR 审查 | ⭐⭐⭐ |
| [**github**](./skills/github) | GitHub 集成，管理仓库、Issues、PRs | ⭐⭐ |
| [**skill-creator**](./skills/skill-creator) | Skill 创建工具，快速生成新的 Agent Skill | ⭐⭐ |
| [**gh-issues**](./skills/gh-issues) | GitHub Issues 自动化处理 | ⭐⭐ |

### 📝 生产力工具

| Skill | 描述 | 难度 |
|-------|------|------|
| [**notion**](./skills/notion) | Notion 集成，管理笔记和数据库 | ⭐⭐ |
| [**obsidian**](./skills/obsidian) | Obsidian 笔记集成 | ⭐ |
| [**summarize**](./skills/summarize) | 智能内容总结工具 | ⭐ |
| [**apple-notes**](./skills/apple-notes) | Apple 备忘录集成 | ⭐ |
| [**apple-reminders**](./skills/apple-reminders) | Apple 提醒事项 | ⭐ |
| [**things-mac**](./skills/things-mac) | Things 3 任务管理 | ⭐⭐ |
| [**trello**](./skills/trello) | Trello 看板集成 | ⭐⭐ |
| [**bear-notes**](./skills/bear-notes) | Bear 笔记集成 | ⭐ |

### 🌐 通讯与协作

| Skill | 描述 | 难度 |
|-------|------|------|
| [**slack**](./skills/slack) | Slack 团队协作集成 | ⭐⭐ |
| [**discord**](./skills/discord) | Discord 集成 | ⭐⭐ |
| [**voice-call**](./skills/voice-call) | 语音通话能力 | ⭐⭐ |
| [**imsg**](./skills/imsg) | iMessage 集成 | ⭐⭐ |
| [**bluebubbles**](./skills/bluebubbles) | BlueBubbles iMessage 集成 | ⭐⭐ |
| [**himalaya**](./skills/himalaya) | Himalaya 邮件客户端 | ⭐⭐ |

### 🤖 AI 与多媒体

| Skill | 描述 | 难度 |
|-------|------|------|
| [**gemini**](./skills/gemini) | Google Gemini AI 集成 | ⭐⭐ |
| [**sag**](./skills/sag) | ElevenLabs TTS 语音合成 | ⭐⭐ |
| [**gifgrep**](./skills/gifgrep) | GIF 搜索工具 | ⭐ |
| [**spotify-player**](./skills/spotify-player) | Spotify 音乐播放 | ⭐⭐ |
| [**sonoscli**](./skills/sonoscli) | Sonos 音响控制 | ⭐⭐ |

### 🔧 系统工具

| Skill | 描述 | 难度 |
|-------|------|------|
| [**weather**](./skills/weather) | 天气查询和预报 | ⭐ |
| [**healthcheck**](./skills/healthcheck) | 系统健康检查和安全审计 | ⭐⭐ |
| [**1password**](./skills/1password) | 1Password 密码管理 | ⭐⭐ |
| [**canvas**](./skills/canvas) | OpenClaw Canvas 画布操作 | ⭐⭐ |
| [**clawhub**](./skills/clawhub) | ClawHub Skills 市场集成 | ⭐ |
| [**goplaces**](./skills/goplaces) | 地点搜索与导航 | ⭐ |
| [**gog**](./skills/gog) | GoG 游戏平台集成 | ⭐ |

---

## 🎯 使用场景

### 场景一：自动化代码审查
```
用户：帮我审查这个 PR
Agent：[使用 github skill] 正在分析 PR #42...
```

### 场景二：智能笔记管理
```
用户：把这个想法保存到 Notion
Agent：[使用 notion skill] 已创建新笔记...
```

### 场景三：每日信息汇总
```
用户：今天天气怎么样？有什么未读消息？
Agent：[使用 weather skill] 今天杭州晴，18°C...
       [使用 slack skill] 你有 3 条未读消息...
```

---

## 🔍 如何选择 Skill？

| 你的需求 | 推荐的 Skills |
|---------|--------------|
| 提高开发效率 | coding-agent, github, gh-issues, skill-creator |
| 管理日常事务 | notion, obsidian, apple-notes, things-mac, weather |
| 团队协作 | slack, discord, voice-call, imsg |
| 系统维护 | healthcheck, 1password |
| AI 与多媒体 | gemini, sag, spotify-player |

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
