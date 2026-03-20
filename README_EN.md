<div align="center">

# 🔥 Hot Skills for OpenClaw

**A Curated Collection of the Most Popular OpenClaw Agent Skills**

[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-10-orange)](./skills)

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

### 📝 Productivity Tools

| Skill | Description | Level |
|-------|-------------|-------|
| [**notion**](./skills/notion) | Notion integration for notes and database management | ⭐⭐ |
| [**obsidian**](./skills/obsidian) | Obsidian note-taking integration | ⭐ |
| [**summarize**](./skills/summarize) | Intelligent content summarization tool | ⭐ |

### 🌐 Communication & Collaboration

| Skill | Description | Level |
|-------|-------------|-------|
| [**slack**](./skills/slack) | Slack team collaboration integration | ⭐⭐ |
| [**voice-call**](./skills/voice-call) | Voice calling capabilities | ⭐⭐ |

### 🔧 System Utilities

| Skill | Description | Level |
|-------|-------------|-------|
| [**weather**](./skills/weather) | Weather lookup and forecasts | ⭐ |
| [**healthcheck**](./skills/healthcheck) | System health checks and security auditing | ⭐⭐ |

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
| Boost development efficiency | coding-agent, github, skill-creator |
| Manage daily tasks | notion, obsidian, weather |
| Team collaboration | slack, voice-call |
| System maintenance | healthcheck |

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
