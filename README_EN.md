<div align="center">

# 🔥 Hot Skills for OpenClaw

**A Curated Collection of the Most Popular OpenClaw Agent Skills**

[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-30-orange)](./skills)

English | **[简体中文](./README.md)**

</div>

---

## 📖 Overview

This is a carefully curated collection of **OpenClaw Agent Skills**, featuring the most popular and useful skill packages from the community. Each Skill is tested and ready to enhance your AI Agent's capabilities.

### What is an OpenClaw Skill?

An OpenClaw Skill is a standardized capability extension that enables your AI Agent to:
- 🛠️ Execute specific tasks (code generation, file processing)
- 🔌 Integrate third-party services (GitHub, Notion, Slack)
- 🎯 Provide specialized abilities (weather lookup, voice calls)

---

## 🚀 Quick Start

### Install a Skill

```bash
# Option 1: Install via ClawHub (Recommended)
npx clawhub@latest install github

# Option 2: Manual Installation
# Copy any skill folder from skills/ directory to:
# ~/.openclaw/skills/
```

### Verify Installation

Restart OpenClaw, and your Agent will automatically load the newly installed Skills.

---

## 📦 Included Skills

### 🖥️ Development Tools

| Skill | Description | Level |
|-------|-------------|-------|
| [**coding-agent**](./skills/coding-agent) | Programming agent for automated coding, refactoring, and PR reviews | ⭐⭐⭐ |
| [**github**](./skills/github) | GitHub integration for repo management, Issues, and PRs | ⭐⭐ |
| [**skill-creator**](./skills/skill-creator) | Skill creation tool to quickly generate new Agent Skills | ⭐⭐ |
| [**gh-issues**](./skills/gh-issues) | GitHub Issues automation and PR workflow | ⭐⭐ |

### 📝 Productivity Tools

| Skill | Description | Level |
|-------|-------------|-------|
| [**notion**](./skills/notion) | Notion integration for notes and database management | ⭐⭐ |
| [**obsidian**](./skills/obsidian) | Obsidian note-taking integration | ⭐ |
| [**summarize**](./skills/summarize) | Intelligent content summarization tool | ⭐ |
| [**apple-notes**](./skills/apple-notes) | Apple Notes integration | ⭐ |
| [**apple-reminders**](./skills/apple-reminders) | Apple Reminders integration | ⭐ |
| [**things-mac**](./skills/things-mac) | Things 3 task management | ⭐⭐ |
| [**trello**](./skills/trello) | Trello board integration | ⭐⭐ |
| [**bear-notes**](./skills/bear-notes) | Bear notes integration | ⭐ |

### 🌐 Communication & Collaboration

| Skill | Description | Level |
|-------|-------------|-------|
| [**slack**](./skills/slack) | Slack team collaboration integration | ⭐⭐ |
| [**discord**](./skills/discord) | Discord integration | ⭐⭐ |
| [**voice-call**](./skills/voice-call) | Voice calling capabilities | ⭐⭐ |
| [**imsg**](./skills/imsg) | iMessage integration | ⭐⭐ |
| [**bluebubbles**](./skills/bluebubbles) | BlueBubbles iMessage integration | ⭐⭐ |
| [**himalaya**](./skills/himalaya) | Himalaya email client | ⭐⭐ |

### 🤖 AI & Multimedia

| Skill | Description | Level |
|-------|-------------|-------|
| [**gemini**](./skills/gemini) | Google Gemini AI integration | ⭐⭐ |
| [**sag**](./skills/sag) | ElevenLabs TTS voice synthesis | ⭐⭐ |
| [**gifgrep**](./skills/gifgrep) | GIF search tool | ⭐ |
| [**spotify-player**](./skills/spotify-player) | Spotify music player | ⭐⭐ |
| [**sonoscli**](./skills/sonoscli) | Sonos speaker control | ⭐⭐ |

### 🔧 System Utilities

| Skill | Description | Level |
|-------|-------------|-------|
| [**weather**](./skills/weather) | Weather lookup and forecasts | ⭐ |
| [**healthcheck**](./skills/healthcheck) | System health checks and security auditing | ⭐⭐ |
| [**1password**](./skills/1password) | 1Password password manager | ⭐⭐ |
| [**canvas**](./skills/canvas) | OpenClaw Canvas operations | ⭐⭐ |
| [**clawhub**](./skills/clawhub) | ClawHub Skills marketplace integration | ⭐ |
| [**goplaces**](./skills/goplaces) | Location search and navigation | ⭐ |
| [**gog**](./skills/gog) | GoG gaming platform integration | ⭐ |

---

## 🎯 Use Cases

### Use Case 1: Automated Code Review
```
User: Review this PR for me
Agent: [Using github skill] Analyzing PR #42...
```

### Use Case 2: Smart Note Management
```
User: Save this idea to Notion
Agent: [Using notion skill] Created new note...
```

### Use Case 3: Daily Information Summary
```
User: What's the weather today? Any unread messages?
Agent: [Using weather skill] Today in Hangzhou: Sunny, 18°C...
       [Using slack skill] You have 3 unread messages...
```

---

## 🔍 How to Choose a Skill?

| Your Needs | Recommended Skills |
|------------|-------------------|
| Boost development efficiency | coding-agent, github, gh-issues, skill-creator |
| Manage daily tasks | notion, obsidian, apple-notes, things-mac, weather |
| Team collaboration | slack, discord, voice-call, imsg |
| System maintenance | healthcheck, 1password |
| AI & Multimedia | gemini, sag, spotify-player |

---

## 📚 Learn More

- [OpenClaw Official Site](https://openclaw.ai)
- [Skill Development Docs](https://docs.openclaw.ai/skills)
- [ClawHub Skill Marketplace](https://clawhub.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)

---

## 🤝 Contributing

Contributions for new Skills or improvements to existing ones are welcome!

1. Fork this repository
2. Add your Skill to the `skills/` directory
3. Ensure it includes a complete `SKILL.md` documentation
4. Submit a Pull Request

### Skill Structure Requirements

```
your-skill/
├── SKILL.md          # Required: Skill definition file
├── package.json      # Optional: Dependency configuration
├── scripts/          # Optional: Script files
└── references/       # Optional: Reference documents
```

---

## 📄 License

All Skills in this repository are licensed under the [MIT License](LICENSE).

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ❤️ for the OpenClaw Community

</div>
