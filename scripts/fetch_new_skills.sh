#!/bin/bash

# 自动拉取新的热门 OpenClaw Skills
# 每天9点运行，添加10个新skill

set -e

REPO_DIR="/Users/zrt/code/awesome-skills"
SKILLS_DIR="$REPO_DIR/skills"
TEMP_DIR="/tmp/openclaw-skills-$$"
GITHUB_USER="zrtch"
GITHUB_EMAIL="zrtch@users.noreply.github.com"

# 所有可用的官方 skills（按热度排序）
ALL_SKILLS=(
    "coding-agent" "github" "weather" "notion" "obsidian"
    "summarize" "skill-creator" "healthcheck" "voice-call" "slack"
    "discord" "spotify-player" "sonoscli" "sag" "apple-notes"
    "apple-reminders" "things-mac" "trello" "1password" "bear-notes"
    "bluebubbles" "canvas" "clawhub" "gemini" "gh-issues"
    "gifgrep" "gog" "goplaces" "himalaya" "imsg"
    "mcporter" "model-usage" "nano-pdf" "node-connect" "openhue"
    "oracle" "ordercli" "peekaboo" "session-logs" "sherpa-onnx-tts"
    "songsee" "tmux" "video-frames" "wacli" "xurl"
    "blucli" "eightctl" "blogwatcher" "camsnap"
)

echo "🔍 正在检查现有 skills..."
cd "$REPO_DIR"

# 获取已存在的 skills
EXISTING_SKILLS=($(ls "$SKILLS_DIR" 2>/dev/null || echo ""))
echo "📦 已有 ${#EXISTING_SKILLS[@]} 个 skills"

# 找出新 skills
NEW_SKILLS=()
for skill in "${ALL_SKILLS[@]}"; do
    skip=false
    for existing in "${EXISTING_SKILLS[@]}"; do
        if [[ "$skill" == "$existing" ]]; then
            skip=true
            break
        fi
    done
    if [[ "$skip" == false ]]; then
        NEW_SKILLS+=("$skill")
    fi
done

echo "✨ 发现 ${#NEW_SKILLS[@]} 个新 skills 可添加"

# 如果没有新 skill，退出
if [[ ${#NEW_SKILLS[@]} -eq 0 ]]; then
    echo "✅ 所有 skills 都已添加，无需更新"
    exit 0
fi

# 选择前10个新 skill
SKILLS_TO_ADD=("${NEW_SKILLS[@]:0:10}")
echo "📥 将添加以下 ${#SKILLS_TO_ADD[@]} 个 skills:"
printf '  - %s\n' "${SKILLS_TO_ADD[@]}"

# 克隆 OpenClaw 仓库获取 skills
echo "⬇️  正在获取 OpenClaw 官方 skills..."
git clone --depth 1 https://github.com/openclaw/openclaw.git "$TEMP_DIR" 2>/dev/null

# 复制新 skills
for skill in "${SKILLS_TO_ADD[@]}"; do
    if [[ -d "$TEMP_DIR/skills/$skill" ]]; then
        cp -r "$TEMP_DIR/skills/$skill" "$SKILLS_DIR/"
        echo "  ✓ 已添加: $skill"
    else
        echo "  ✗ 未找到: $skill"
    fi
done

# 清理临时目录
rm -rf "$TEMP_DIR"

# Git 提交
cd "$REPO_DIR"
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_EMAIL"
git add -A

# 获取今天日期
TODAY=$(date +%Y-%m-%d)
COMMIT_MSG="🔥 Add ${#SKILLS_TO_ADD[@]} new skills ($TODAY)

Added skills: ${SKILLS_TO_ADD[*]}"

git commit -m "$COMMIT_MSG" 2>/dev/null || echo "⚠️  没有需要提交的更改"

# 推送到远程
echo "🚀 正在推送到远程仓库..."
git push origin master

# 统计
TOTAL_SKILLS=$(ls "$SKILLS_DIR" | wc -l | tr -d ' ')
echo ""
echo "✅ 完成！仓库现共有 $TOTAL_SKILLS 个 skills"
echo "📅 下次运行时间: 明天上午 9:00"
