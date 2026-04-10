# skill-security-scanner

> Static security scanner and linter for OpenClaw skill directories. Free tier. No config needed.

[![npm version](https://img.shields.io/npm/v/skill-security-scanner)](https://www.npmjs.com/package/skill-security-scanner)

## Commands

| Command | Description |
|---|---|
| `scan <skill>` | Security scan a single skill (default) |
| `scan-all` | Security scan every skill in the project |
| `lint <skill>` | Validate SKILL.md frontmatter schema |
| `lint --all` | Validate every skill in the project |
| `info <skill>` | Pretty-print parsed frontmatter for debugging |

---

## `scan` — Security Scanner

```bash
# By skill name — auto-discovered from anywhere in the project
npx skill-security-scanner frontend-design
npx skill-security-scanner clean-code

# Or a full/relative path
npx skill-security-scanner .agent/skills/frontend-design
```

The CLI walks up the directory tree to find `.agent/skills/<name>` automatically.

### What It Scans

| Check | Description | Risk |
|---|---|---|
| **Permissions** | `file_system:write`, `network:outbound`, `shell:execute` in YAML frontmatter | Med/High |
| **Dangerous bins** | `curl`, `wget`, `ssh`, `bash`, etc. in `requires.bin` | High |
| **Sensitive env vars** | Env vars with `key`, `secret`, `token`, `password` in name | Med |
| **Code patterns** | `eval`, `exec`, `execSync`, network calls in source files | Med/High |
| **Secret leaks** | OpenAI `sk-`, GitHub `ghp_`, AWS `AKIA`, hardcoded passwords | High |
| **npm vulns** | `npm audit` for known CVEs (if `package.json` present) | Med/High |

### Risk Scoring

| Score | Meaning |
|---|---|
| 🟢 LOW | No significant risks detected |
| 🟡 MED | Some concerns — review recommended |
| 🔴 HIGH | Critical risks — block before deploy |

### Scan Flags

| Flag | Description |
|---|---|
| `--badge` | Print a Markdown shield badge (paste into your README) |
| `--json` | JSON output for CI pipelines |

```bash
npx skill-security-scanner frontend-design --badge
npx skill-security-scanner frontend-design --json
```

### Scan Output Example

```
🔍 Skill Security Scanner — voiceover-bot
──────────────────────────────────────────────────
Risk Score: 🚨 HIGH

🚨 HIGH RISK (2)
  • Requires dangerous binary: curl (network/exfil risk)
  • eval/exec found in scripts/run.ts — remote code execution risk

⚠️  MEDIUM RISK (1)
  • Sensitive env var required: OPENAI_API_KEY
```

---

## `scan-all` — Scan Every Skill

```bash
npx skill-security-scanner scan-all
npx skill-security-scanner scan-all --json
npx skill-security-scanner scan-all --fail-on med
```

### scan-all Flags

| Flag | Description |
|---|---|
| `--json` | JSON array output |
| `--fail-on <level>` | Exit 1 if any skill hits `low`/`med`/`high` (default: `high`) |
| `--skip-audit` | Skip npm audit (auto-enabled when >5 skills found) |

### scan-all Output Example

```
🔍 Skill Security Scanner — Project Scan (37 skills)
────────────────────────────────────────────────────────────
  🚨 HIGH   voiceover-bot
          → [HIGH] eval/exec found in scripts/run.ts — remote code execution risk
          → [MED]  Sensitive env var required: OPENAI_API_KEY

  ✅ LOW    frontend-design
  ✅ LOW    clean-code
  ... (34 more)
────────────────────────────────────────────────────────────
  🚨 1 HIGH  ⚠️  0 MED  ✅ 36 LOW
```

---

## `lint` — Schema Validator

Validates SKILL.md frontmatter against the OpenClaw schema.

```bash
# Single skill
npx skill-security-scanner lint frontend-design

# All skills in the project
npx skill-security-scanner lint --all

# Fail on warnings too (strict CI mode)
npx skill-security-scanner lint --all --strict
```

### What It Validates

| Field | Rule |
|---|---|
| `name` | Required, string, ≥3 chars |
| `description` | Required, string, ≥10 chars recommended |
| `version` | Required, valid semver (`x.y.z`) |
| `permissions` | Array of known OpenClaw permission scopes |
| `requires.env/config/bin` | Must be arrays if present |
| Body content | Warns if <50 chars |

### Lint Flags

| Flag | Description |
|---|---|
| `--all` | Lint every skill in the project |
| `--strict` | Treat warnings as errors (exit 1) |
| `--json` | JSON output |

### Lint Output Example

```
🔎 Lint — voiceover-bot
──────────────────────────────────────────────────
Status: ❌ FAIL

Errors (2)
  • [description] Missing required field
  • [version] Missing required field

Warnings (1)
  • [SKILL.md body] Skill body is very short — consider adding usage examples
```

---

## `info` — Frontmatter Inspector

Pretty-prints everything the scanner sees when it parses a skill's `SKILL.md`. Useful for debugging mismatches between what you wrote and what the tool reads.

```bash
npx skill-security-scanner info frontend-design
npx skill-security-scanner info .agent/skills/voiceover-bot

# Machine-readable output
npx skill-security-scanner info frontend-design --json
```

### What It Shows

| Section | Details |
|---|---|
| **📦 Identity** | `name`, `description`, `version`, resolved path |
| **🔐 Permissions** | Each scope color-coded by risk — 🚨 high, ⚠️ med, ✅ low |
| **🗂️ Requires** | `bin` (flags dangerous entries), `env` (flags sensitive names), `config` |
| **⚡ Command Dispatch** | Registered command → handler mappings |

### Info Flags

| Flag | Description |
|---|---|
| `--json` | Output `{ path, frontmatter }` as JSON |

### Info Output Example

```
📦 Skill Info — voiceover-bot
──────────────────────────────────────────────────────
  Name         voiceover-bot
  Description  Converts text to speech using ElevenLabs
  Version      1.2.0
  Path         /project/.agent/skills/voiceover-bot

🔐 Permissions
  🚨 shell:execute
  ⚠️  network:outbound
  ✅ file_system:read

🗂️  Requires
  bin:
    ⚠  curl  (dangerous)
    •  ffmpeg
  env:
    🔑 ELEVENLABS_API_KEY  (sensitive)
    •  VOICE_ID

⚡ Command Dispatch
  speak      →  scripts/speak.sh
  list-voices  →  scripts/list.py
```

---

## Install Globally

```bash
npm install -g skill-security-scanner

# Then from anywhere in your project:
skill-security-scanner frontend-design
skill-security-scanner lint --all
skill-security-scanner scan-all
skill-security-scanner info frontend-design
```

## CI / GitHub Actions

```yaml
- name: Lint skills
  run: npx skill-security-scanner lint --all

- name: Security scan all skills
  run: npx skill-security-scanner scan-all --fail-on high --json
```

## Upgrade

Free tier covers static analysis + linting. For **dynamic sandboxing**, **GitHub org scans**, and **CI dashboards**: → skill-security.com
