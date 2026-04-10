#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
// ──────────────────────────────────────────────
// Risk Checks
// ──────────────────────────────────────────────
const DANGEROUS_BINS = ['curl', 'wget', 'nc', 'ncat', 'ssh', 'scp', 'rsync', 'python', 'python3', 'bash', 'sh'];
const SECRET_PATTERNS = [
    /api[_-]?key\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i,
    /secret\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i,
    /token\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i,
    /password\s*[:=]\s*["']?[A-Za-z0-9@#$!%^&*_\-]{8,}/i,
    /sk-[A-Za-z0-9]{32,}/, // OpenAI key
    /ghp_[A-Za-z0-9]{36}/, // GitHub PAT
    /AKIA[0-9A-Z]{16}/, // AWS Access Key
];
const EXEC_PATTERNS = /\b(eval|exec|execSync|spawn|spawnSync|child_process)\s*\(/g;
const NETWORK_PATTERNS = /\b(fetch|axios|http\.get|http\.request|https\.get|https\.request|got\(|request\()\s*\(/g;
function checkPermissions(fm) {
    const findings = [];
    const perms = fm.permissions ?? [];
    if (perms.some(p => p.includes('file_system:*') || p === 'file_system:write')) {
        findings.push({ level: 'med', message: 'Broad file_system write permission — verify scope is intentional' });
    }
    if (perms.some(p => p.includes('network:*') || p === 'network:outbound')) {
        findings.push({ level: 'med', message: 'Outbound network permission detected — review data exfiltration risk' });
    }
    if (perms.some(p => p.includes('shell:execute') || p.includes('process:spawn'))) {
        findings.push({ level: 'high', message: 'Shell/process execution permission — high privilege escalation risk' });
    }
    return findings;
}
function checkDangerousBins(fm) {
    const bins = fm.requires?.bin ?? [];
    return bins
        .filter(b => DANGEROUS_BINS.includes(b.toLowerCase()))
        .map(b => ({ level: 'high', message: `Requires dangerous binary: ${b} (network/exfil risk)` }));
}
function checkExposedEnv(fm) {
    const envVars = fm.requires?.env ?? [];
    const sensitivePatterns = /key|secret|token|password|credential|api/i;
    return envVars
        .filter(e => sensitivePatterns.test(e))
        .map(e => ({ level: 'med', message: `Sensitive env var required: ${e}` }));
}
function collectSourceFiles(dir) {
    const exts = ['.ts', '.js', '.py', '.sh', '.bash'];
    const results = [];
    function walk(current) {
        for (const entry of fs_1.default.readdirSync(current, { withFileTypes: true })) {
            const full = path_1.default.join(current, entry.name);
            if (entry.isDirectory() && !['node_modules', '.git', 'dist'].includes(entry.name)) {
                walk(full);
            }
            else if (entry.isFile() && exts.includes(path_1.default.extname(entry.name))) {
                results.push(full);
            }
        }
    }
    walk(dir);
    return results;
}
function checkCodeRisks(dir) {
    const findings = [];
    const files = collectSourceFiles(dir);
    for (const file of files) {
        const content = fs_1.default.readFileSync(file, 'utf8');
        const rel = path_1.default.relative(dir, file);
        if (EXEC_PATTERNS.test(content)) {
            findings.push({ level: 'high', message: `eval/exec found in ${rel} — remote code execution risk` });
        }
        if (NETWORK_PATTERNS.test(content)) {
            findings.push({ level: 'med', message: `Network call found in ${rel} — verify destination is safe` });
        }
        for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(content)) {
                findings.push({ level: 'high', message: `Possible hardcoded secret in ${rel}` });
                break;
            }
        }
        // Reset stateful regexes
        EXEC_PATTERNS.lastIndex = 0;
        NETWORK_PATTERNS.lastIndex = 0;
    }
    return findings;
}
function checkDependencyVulns(dir, skipAudit = false) {
    const findings = [];
    const pkgPath = path_1.default.join(dir, 'package.json');
    if (!fs_1.default.existsSync(pkgPath) || skipAudit)
        return findings;
    try {
        const auditOutput = (0, child_process_1.execSync)('npm audit --json', { cwd: dir, timeout: 5_000, stdio: ['pipe', 'pipe', 'pipe'] }).toString();
        const audit = JSON.parse(auditOutput);
        const vulnCount = audit?.metadata?.vulnerabilities?.total ?? 0;
        const high = (audit?.metadata?.vulnerabilities?.high ?? 0) + (audit?.metadata?.vulnerabilities?.critical ?? 0);
        if (high > 0)
            findings.push({ level: 'high', message: `${high} high/critical npm vulnerabilities found — run npm audit fix` });
        else if (vulnCount > 0)
            findings.push({ level: 'med', message: `${vulnCount} moderate npm vulnerabilities found` });
    }
    catch {
        // npm not available, no lock file, or timed out — skip silently
    }
    return findings;
}
// ──────────────────────────────────────────────
// Score Calculation
// ──────────────────────────────────────────────
function calculateScore(findings) {
    if (findings.some(f => f.level === 'high'))
        return 'high';
    if (findings.some(f => f.level === 'med'))
        return 'med';
    return 'low';
}
// ──────────────────────────────────────────────
// Path Resolution
// ──────────────────────────────────────────────
/** Walk up from `startDir` looking for a directory named `folderName`. */
function findAncestorDir(startDir, folderName) {
    let current = startDir;
    for (let i = 0; i < 8; i++) {
        const candidate = path_1.default.join(current, folderName);
        if (fs_1.default.existsSync(candidate) && fs_1.default.statSync(candidate).isDirectory())
            return candidate;
        const parent = path_1.default.dirname(current);
        if (parent === current)
            break;
        current = parent;
    }
    return null;
}
/**
 * Resolve the skill directory from user input.
 * Priority:
 *   1. Exact path (absolute or relative) → use as-is
 *   2. Walk up looking for `.agent/skills/<input>` or `agent/skills/<input>`
 *   3. Walk up looking for any `skills/<input>` folder
 */
function resolveSkillDir(input) {
    const exact = path_1.default.resolve(input);
    if (fs_1.default.existsSync(exact))
        return exact;
    const name = path_1.default.basename(input); // support "frontend-design" or "skills/frontend-design"
    const agentFolders = ['.agent', 'agent', '_agent', '_agents'];
    for (const agentFolder of agentFolders) {
        const agentDir = findAncestorDir(process.cwd(), agentFolder);
        if (!agentDir)
            continue;
        const candidate = path_1.default.join(agentDir, 'skills', name);
        if (fs_1.default.existsSync(candidate))
            return candidate;
        // also try the input as a sub-path inside agentDir
        const subCandidate = path_1.default.join(agentDir, input);
        if (fs_1.default.existsSync(subCandidate))
            return subCandidate;
    }
    return null;
}
function scanSkill(skillDir, skipAudit = false) {
    const skillPath = path_1.default.join(skillDir, 'SKILL.md');
    const content = fs_1.default.existsSync(skillPath) ? fs_1.default.readFileSync(skillPath, 'utf8') : '';
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/m);
    let frontmatter = {};
    try {
        frontmatter = (js_yaml_1.default.load(fmMatch?.[1] ?? '') ?? {});
    }
    catch {
        // malformed YAML — treat as unparseable, flag it
    }
    const findings = [
        ...checkPermissions(frontmatter),
        ...checkDangerousBins(frontmatter),
        ...checkExposedEnv(frontmatter),
        ...checkCodeRisks(skillDir),
        ...checkDependencyVulns(skillDir, skipAudit),
    ];
    if (!fmMatch) {
        findings.push({ level: 'low', message: 'No YAML frontmatter found in SKILL.md' });
    }
    return {
        name: frontmatter.name ?? path_1.default.basename(skillDir),
        dir: skillDir,
        score: calculateScore(findings),
        findings,
    };
}
/** Find all immediate subdirectories of `skillsDir` that contain a SKILL.md */
function discoverSkillDirs(skillsDir) {
    if (!fs_1.default.existsSync(skillsDir))
        return [];
    return fs_1.default.readdirSync(skillsDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => path_1.default.join(skillsDir, e.name))
        .filter(d => fs_1.default.existsSync(path_1.default.join(d, 'SKILL.md')));
}
// ──────────────────────────────────────────────
// Lint
// ──────────────────────────────────────────────
const SEMVER_RE = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;
const PERMISSION_SCOPES = [
    'file_system:read', 'file_system:write', 'file_system:*',
    'network:inbound', 'network:outbound', 'network:*',
    'shell:execute', 'process:spawn', 'memory:read', 'memory:write',
];
function lintSkill(skillDir) {
    const skillPath = path_1.default.join(skillDir, 'SKILL.md');
    const issues = [];
    const skillName = path_1.default.basename(skillDir);
    // ── File existence ──
    if (!fs_1.default.existsSync(skillPath)) {
        return { skill: skillName, passed: false, issues: [{ severity: 'error', field: 'SKILL.md', message: 'File not found' }] };
    }
    const content = fs_1.default.readFileSync(skillPath, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/m);
    if (!fmMatch) {
        return { skill: skillName, passed: false, issues: [{ severity: 'error', field: 'frontmatter', message: 'No YAML frontmatter block found (expected --- ... ---)' }] };
    }
    let fm = {};
    try {
        fm = (js_yaml_1.default.load(fmMatch[1]) ?? {});
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { skill: skillName, passed: false, issues: [{ severity: 'error', field: 'frontmatter', message: `YAML parse error: ${msg}` }] };
    }
    // ── Required fields ──
    if (!fm.name) {
        issues.push({ severity: 'error', field: 'name', message: 'Missing required field' });
    }
    else if (typeof fm.name !== 'string') {
        issues.push({ severity: 'error', field: 'name', message: 'Must be a string' });
    }
    else if (fm.name.trim().length < 3) {
        issues.push({ severity: 'error', field: 'name', message: 'Too short (min 3 chars)' });
    }
    if (!fm.description) {
        issues.push({ severity: 'error', field: 'description', message: 'Missing required field' });
    }
    else if (typeof fm.description !== 'string') {
        issues.push({ severity: 'error', field: 'description', message: 'Must be a string' });
    }
    else if (fm.description.trim().length < 10) {
        issues.push({ severity: 'warn', field: 'description', message: 'Very short description (min 10 chars recommended)' });
    }
    if (!fm.version) {
        issues.push({ severity: 'error', field: 'version', message: 'Missing required field' });
    }
    else if (!SEMVER_RE.test(String(fm.version))) {
        issues.push({ severity: 'error', field: 'version', message: `"${fm.version}" is not valid semver (expected x.y.z)` });
    }
    // ── Optional field validation ──
    if (fm.permissions !== undefined) {
        if (!Array.isArray(fm.permissions)) {
            issues.push({ severity: 'error', field: 'permissions', message: 'Must be an array of strings' });
        }
        else {
            fm.permissions.forEach((p, i) => {
                if (typeof p !== 'string') {
                    issues.push({ severity: 'error', field: `permissions[${i}]`, message: 'Each permission must be a string' });
                }
                else if (!PERMISSION_SCOPES.includes(p)) {
                    issues.push({ severity: 'warn', field: `permissions[${i}]`, message: `Unknown permission scope "${p}" — check OpenClaw docs` });
                }
            });
        }
    }
    if (fm.requires !== undefined) {
        if (typeof fm.requires !== 'object' || Array.isArray(fm.requires)) {
            issues.push({ severity: 'error', field: 'requires', message: 'Must be an object with optional env/config/bin arrays' });
        }
        else {
            for (const key of ['env', 'config', 'bin']) {
                const val = fm.requires[key];
                if (val !== undefined && !Array.isArray(val)) {
                    issues.push({ severity: 'error', field: `requires.${key}`, message: 'Must be an array of strings' });
                }
            }
        }
    }
    // ── Description quality hints ──
    const body = content.slice(content.indexOf('---', 3) + 3).trim();
    if (body.length < 50) {
        issues.push({ severity: 'warn', field: 'SKILL.md body', message: 'Skill body is very short — consider adding usage examples or detailed instructions' });
    }
    const errors = issues.filter(i => i.severity === 'error');
    return { skill: fm.name ?? skillName, passed: errors.length === 0, issues };
}
// ──────────────────────────────────────────────
// CLI
// ──────────────────────────────────────────────
const program = new commander_1.Command();
program
    .name('skill-security-scanner')
    .description('Static security scanner for OpenClaw skill directories')
    .version('0.1.0');
// ── Command: scan (single skill) ──────────────
program
    .command('scan [dir]', { isDefault: true })
    .description('Scan a single skill directory (default command)')
    .option('--json', 'Output results as JSON (for CI pipelines)')
    .option('--badge', 'Print Markdown badge to stdout')
    .action(async (dir, opts) => {
    if (!dir) {
        console.error(chalk_1.default.red('❌ Missing skill name or path.'));
        console.error(chalk_1.default.gray('   Usage: skill-security-scanner <name>'));
        console.error(chalk_1.default.gray('   Example: skill-security-scanner frontend-design'));
        console.error(chalk_1.default.gray('   Scan all:  skill-security-scanner scan-all'));
        process.exit(1);
    }
    const resolvedDir = resolveSkillDir(dir);
    if (!resolvedDir) {
        console.error(chalk_1.default.red(`❌ Skill not found: "${dir}"`));
        console.error(chalk_1.default.gray('   Try: skill-security-scanner frontend-design'));
        console.error(chalk_1.default.gray('   Or:  skill-security-scanner .agent/skills/frontend-design'));
        process.exit(1);
    }
    if (!fs_1.default.existsSync(path_1.default.join(resolvedDir, 'SKILL.md'))) {
        console.error(chalk_1.default.red('❌ No SKILL.md found — is this an OpenClaw skill directory?'));
        process.exit(1);
    }
    const spinner = (0, ora_1.default)('Scanning skill...').start();
    const result = scanSkill(resolvedDir);
    spinner.stop();
    const BADGE_COLOR_MAP = { low: 'brightgreen', med: 'yellow', high: 'red' };
    const badgeLabel = result.score.toUpperCase();
    const badge = `![Skill Security: ${badgeLabel}](https://img.shields.io/badge/Skill%20Security-${badgeLabel}-${BADGE_COLOR_MAP[result.score]}?style=flat-square&logo=shield)`;
    const upgrade = 'Full dynamic analysis, GitHub Action & CI dashboards → skill-security.com (7-day free trial)';
    const report = {
        skill: result.name, score: result.score, findings: result.findings, badge,
        upgrade: ''
    };
    if (opts.json) {
        console.log(JSON.stringify(report, null, 2));
        return;
    }
    const scoreColor = { low: chalk_1.default.green, med: chalk_1.default.yellow, high: chalk_1.default.red }[result.score];
    const icon = { low: '✅', med: '⚠️', high: '🚨' }[result.score];
    const printGroup = (level, label, color) => {
        const group = result.findings.filter(f => f.level === level);
        if (!group.length)
            return;
        console.log(color.bold(`${label} (${group.length})`));
        group.forEach(f => console.log(color(`  • ${f.message}`)));
        console.log('');
    };
    console.log('');
    console.log(chalk_1.default.bold.white(`🔍 Skill Security Scanner — ${result.name}`));
    console.log(chalk_1.default.gray('─'.repeat(50)));
    console.log(`Risk Score: ${scoreColor(`${icon} ${result.score.toUpperCase()}`)}`);
    console.log('');
    if (!result.findings.length) {
        console.log(chalk_1.default.green('✅ No issues found. Skill looks clean.'));
    }
    else {
        printGroup('high', '🚨 HIGH RISK', chalk_1.default.red);
        printGroup('med', '⚠️  MEDIUM RISK', chalk_1.default.yellow);
        printGroup('low', '💡 LOW RISK', chalk_1.default.gray);
    }
    if (opts.badge) {
        console.log(chalk_1.default.gray('Badge:\n'));
        console.log(badge);
        console.log('');
    }
    console.log(chalk_1.default.blueBright(`💡 ${upgrade}`));
    console.log('');
    if (result.score === 'high')
        process.exit(1);
});
// ── Command: lint ────────────────────────────
program
    .command('lint [dir]')
    .description('Validate SKILL.md frontmatter against the OpenClaw schema')
    .option('--json', 'Output results as JSON')
    .option('--strict', 'Treat warnings as errors (exit 1)')
    .option('--all', 'Lint every skill in the project')
    .action((dir, opts) => {
    // ── lint --all shortcut ──
    if (opts.all || !dir) {
        const agentFolders = ['.agent', 'agent', '_agent', '_agents'];
        let skillsDir = null;
        for (const folder of agentFolders) {
            const agentDir = findAncestorDir(process.cwd(), folder);
            if (agentDir) {
                const c = path_1.default.join(agentDir, 'skills');
                if (fs_1.default.existsSync(c)) {
                    skillsDir = c;
                    break;
                }
            }
        }
        if (!skillsDir) {
            console.error(chalk_1.default.red('❌ No .agent/skills directory found.'));
            process.exit(1);
        }
        const dirs = discoverSkillDirs(skillsDir);
        const results = dirs.map(d => lintSkill(d));
        if (opts.json) {
            console.log(JSON.stringify(results, null, 2));
        }
        else {
            const passed = results.filter(r => r.passed && !(opts.strict && r.issues.some(i => i.severity === 'warn')));
            const failed = results.filter(r => !r.passed || (opts.strict && r.issues.some(i => i.severity === 'warn')));
            console.log('');
            console.log(chalk_1.default.bold.white(`🔎 Lint — ${results.length} skills`));
            console.log(chalk_1.default.gray('─'.repeat(60)));
            for (const r of [...failed, ...passed]) {
                const ok = !failed.includes(r);
                console.log(ok ? chalk_1.default.green(`  ✅ ${r.skill}`) : chalk_1.default.red(`  ❌ ${r.skill}`));
                r.issues.forEach(issue => {
                    const c = issue.severity === 'error' ? chalk_1.default.red : chalk_1.default.yellow;
                    console.log(c(`       [${issue.severity.toUpperCase()}] ${issue.field}: ${issue.message}`));
                });
            }
            console.log(chalk_1.default.gray('─'.repeat(60)));
            console.log(`  ${chalk_1.default.green(`✅ ${passed.length} passed`)}  ${chalk_1.default.red(`❌ ${failed.length} failed`)}`);
            console.log('');
        }
        const anyFailed = results.some(r => !r.passed || (opts.strict && r.issues.some(i => i.severity === 'warn')));
        if (anyFailed)
            process.exit(1);
        return;
    }
    // ── single skill ──
    const resolvedDir = resolveSkillDir(dir);
    if (!resolvedDir) {
        console.error(chalk_1.default.red(`❌ Skill not found: "${dir}"`));
        process.exit(1);
    }
    const result = lintSkill(resolvedDir);
    const hasFail = !result.passed || (opts.strict && result.issues.some(i => i.severity === 'warn'));
    if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
    }
    else {
        const errors = result.issues.filter(i => i.severity === 'error');
        const warns = result.issues.filter(i => i.severity === 'warn');
        const statusIcon = hasFail ? '❌' : '✅';
        const statusText = hasFail ? chalk_1.default.red('FAIL') : chalk_1.default.green('PASS');
        console.log('');
        console.log(chalk_1.default.bold.white(`🔎 Lint — ${result.skill}`));
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(`Status: ${statusIcon} ${statusText}`);
        console.log('');
        if (!result.issues.length) {
            console.log(chalk_1.default.green('✅ All fields valid. Skill looks well-formed.'));
        }
        else {
            if (errors.length) {
                console.log(chalk_1.default.red.bold(`Errors (${errors.length})`));
                errors.forEach(i => console.log(chalk_1.default.red(`  • [${i.field}] ${i.message}`)));
                console.log('');
            }
            if (warns.length) {
                console.log(chalk_1.default.yellow.bold(`Warnings (${warns.length})`));
                warns.forEach(i => console.log(chalk_1.default.yellow(`  • [${i.field}] ${i.message}`)));
                console.log('');
            }
        }
    }
    if (hasFail)
        process.exit(1);
});
// ── Command: info ────────────────────────────
program
    .command('info <skill>')
    .description('Pretty-print parsed frontmatter for a skill (permissions, bins, env vars, command-dispatch)')
    .option('--json', 'Output as JSON')
    .action((skill, opts) => {
    const resolvedDir = resolveSkillDir(skill);
    if (!resolvedDir) {
        console.error(chalk_1.default.red(`❌ Skill not found: "${skill}"`));
        console.error(chalk_1.default.gray('   Try: skill-security-scanner info frontend-design'));
        process.exit(1);
    }
    const skillPath = path_1.default.join(resolvedDir, 'SKILL.md');
    if (!fs_1.default.existsSync(skillPath)) {
        console.error(chalk_1.default.red('❌ No SKILL.md found — is this an OpenClaw skill directory?'));
        process.exit(1);
    }
    const content = fs_1.default.readFileSync(skillPath, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/m);
    if (!fmMatch) {
        console.error(chalk_1.default.red('❌ No YAML frontmatter block found in SKILL.md.'));
        console.error(chalk_1.default.gray('   Expected a --- ... --- block at the top of the file.'));
        process.exit(1);
    }
    let fm = {};
    try {
        fm = (js_yaml_1.default.load(fmMatch[1]) ?? {});
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(chalk_1.default.red(`❌ YAML parse error: ${msg}`));
        process.exit(1);
    }
    if (opts.json) {
        console.log(JSON.stringify({ path: resolvedDir, frontmatter: fm }, null, 2));
        return;
    }
    // ── Identity ──
    console.log('');
    console.log(chalk_1.default.bold.white(`📦 Skill Info — ${fm.name ?? path_1.default.basename(resolvedDir)}`));
    console.log(chalk_1.default.gray('─'.repeat(54)));
    console.log(`  ${chalk_1.default.bold('Name')}         ${fm.name ? chalk_1.default.cyan(fm.name) : chalk_1.default.gray('(not set)')}`);
    console.log(`  ${chalk_1.default.bold('Description')}  ${fm.description ? chalk_1.default.white(fm.description) : chalk_1.default.gray('(not set)')}`);
    console.log(`  ${chalk_1.default.bold('Version')}      ${fm.version ? chalk_1.default.cyan(fm.version) : chalk_1.default.gray('(not set)')}`);
    console.log(`  ${chalk_1.default.bold('Path')}         ${chalk_1.default.gray(resolvedDir)}`);
    console.log('');
    // ── Permissions ──
    const perms = fm.permissions ?? [];
    console.log(chalk_1.default.bold.white('🔐 Permissions'));
    if (!perms.length) {
        console.log(chalk_1.default.gray('  (none declared)'));
    }
    else {
        const PERM_RISK = {
            'shell:execute': 'high',
            'process:spawn': 'high',
            'file_system:*': 'med',
            'file_system:write': 'med',
            'network:outbound': 'med',
            'network:*': 'med',
            'file_system:read': 'low',
            'network:inbound': 'low',
            'memory:read': 'low',
            'memory:write': 'low',
        };
        const RISK_COLOR = { high: chalk_1.default.red, med: chalk_1.default.yellow, low: chalk_1.default.green };
        const RISK_ICON = { high: '🚨', med: '⚠️ ', low: '✅' };
        for (const p of perms) {
            const risk = PERM_RISK[p] ?? 'low';
            const color = RISK_COLOR[risk];
            const icon = RISK_ICON[risk];
            console.log(`  ${icon} ${color(p)}`);
        }
    }
    console.log('');
    // ── Requires ──
    const bins = fm.requires?.bin ?? [];
    const envs = fm.requires?.env ?? [];
    const configs = fm.requires?.config ?? [];
    console.log(chalk_1.default.bold.white('🗂️  Requires'));
    if (!bins.length && !envs.length && !configs.length) {
        console.log(chalk_1.default.gray('  (none declared)'));
    }
    else {
        if (bins.length) {
            console.log(chalk_1.default.bold('  bin:'));
            for (const b of bins) {
                const isDangerous = DANGEROUS_BINS.includes(b.toLowerCase());
                console.log(`    ${isDangerous ? chalk_1.default.red(`⚠  ${b}  ${chalk_1.default.italic('(dangerous)')}`) : chalk_1.default.white(`•  ${b}`)}`);
            }
        }
        if (envs.length) {
            console.log(chalk_1.default.bold('  env:'));
            const SENSITIVE_RE = /key|secret|token|password|credential|api/i;
            for (const e of envs) {
                const isSensitive = SENSITIVE_RE.test(e);
                console.log(`    ${isSensitive ? chalk_1.default.yellow(`🔑 ${e}  ${chalk_1.default.italic('(sensitive)')}`) : chalk_1.default.white(`•  ${e}`)}`);
            }
        }
        if (configs.length) {
            console.log(chalk_1.default.bold('  config:'));
            configs.forEach(c => console.log(chalk_1.default.white(`    •  ${c}`)));
        }
    }
    console.log('');
    // ── Command-dispatch ──
    const dispatch = fm['command-dispatch'] ?? {};
    const dispatchEntries = Object.entries(dispatch);
    console.log(chalk_1.default.bold.white('⚡ Command Dispatch'));
    if (!dispatchEntries.length) {
        console.log(chalk_1.default.gray('  (none declared)'));
    }
    else {
        const maxKey = Math.max(...dispatchEntries.map(([k]) => k.length));
        for (const [cmd, handler] of dispatchEntries) {
            console.log(`  ${chalk_1.default.cyan(cmd.padEnd(maxKey))}  →  ${chalk_1.default.white(handler)}`);
        }
    }
    console.log('');
});
// ── Command: scan-all ─────────────────────────
program
    .command('scan-all')
    .description('Scan every skill in the project and show a summary table')
    .option('--json', 'Output results as JSON array')
    .option('--fail-on <level>', 'Exit code 1 if any skill reaches this level (low|med|high)', 'high')
    .option('--skip-audit', 'Skip npm audit (much faster for large projects)')
    .action(async (opts) => {
    const agentFolders = ['.agent', 'agent', '_agent', '_agents'];
    let skillsDir = null;
    for (const folder of agentFolders) {
        const agentDir = findAncestorDir(process.cwd(), folder);
        if (agentDir) {
            const candidate = path_1.default.join(agentDir, 'skills');
            if (fs_1.default.existsSync(candidate)) {
                skillsDir = candidate;
                break;
            }
        }
    }
    if (!skillsDir) {
        console.error(chalk_1.default.red('❌ No .agent/skills directory found from the current location.'));
        process.exit(1);
    }
    const skillDirs = discoverSkillDirs(skillsDir);
    if (!skillDirs.length) {
        console.error(chalk_1.default.yellow('⚠️  No skill directories with SKILL.md found.'));
        process.exit(0);
    }
    // Auto-skip audit for large projects unless explicitly requested
    const skipAudit = opts.skipAudit ?? skillDirs.length > 5;
    const spinner = (0, ora_1.default)(`Scanning ${skillDirs.length} skills${skipAudit ? ' (audit skipped)' : ''}...`).start();
    const results = skillDirs.map(d => scanSkill(d, skipAudit));
    spinner.stop();
    if (opts.json) {
        console.log(JSON.stringify(results.map(r => ({
            skill: r.name, score: r.score, findingCount: r.findings.length, findings: r.findings,
        })), null, 2));
        const hasFailure = results.some(r => r.score === opts.failOn || (opts.failOn === 'low' && true) || (opts.failOn === 'med' && r.score !== 'low'));
        if (hasFailure)
            process.exit(1);
        return;
    }
    // ── Summary table ──
    const counts = { high: 0, med: 0, low: 0 };
    results.forEach(r => counts[r.score]++);
    const SCORE_COLOR = { low: chalk_1.default.green, med: chalk_1.default.yellow, high: chalk_1.default.red };
    const SCORE_ICON = { low: '✅', med: '⚠️ ', high: '🚨' };
    const FIND_COLOR = { low: chalk_1.default.gray, med: chalk_1.default.yellow, high: chalk_1.default.red };
    // Sort: high first, then med, then low
    const sorted = [...results].sort((a, b) => {
        const order = { high: 0, med: 1, low: 2 };
        return order[a.score] - order[b.score];
    });
    console.log('');
    console.log(chalk_1.default.bold.white(`🔍 Skill Security Scanner — Project Scan (${results.length} skills)`));
    console.log(chalk_1.default.gray('─'.repeat(60)));
    for (const r of sorted) {
        const color = SCORE_COLOR[r.score];
        const icon = SCORE_ICON[r.score];
        if (!r.findings.length) {
            console.log(`  ${icon} ${color(r.score.toUpperCase().padEnd(5))}  ${r.name}`);
        }
        else {
            // Header row for this skill
            console.log(`  ${icon} ${color(r.score.toUpperCase().padEnd(5))}  ${chalk_1.default.bold(r.name)}`);
            // Print findings grouped by severity
            for (const level of ['high', 'med', 'low']) {
                const group = r.findings.filter(f => f.level === level);
                group.forEach(f => {
                    console.log(`          ${FIND_COLOR[level](`→ [${f.level.toUpperCase()}] ${f.message}`)}`);
                });
            }
            console.log('');
        }
    }
    console.log(chalk_1.default.gray('─'.repeat(60)));
    console.log(`  ${chalk_1.default.red(`🚨 ${counts.high} HIGH`)}  ` +
        `${chalk_1.default.yellow(`⚠️  ${counts.med} MED`)}  ` +
        `${chalk_1.default.green(`✅ ${counts.low} LOW`)}`);
    console.log('');
    // console.log(chalk.blueBright('Full dynamic analysis, GitHub Action & CI dashboards → skill-security.com (7-day free trial)'));
    console.log('');
    const LEVEL_ORDER = { low: 0, med: 1, high: 2 };
    const shouldFail = results.some(r => LEVEL_ORDER[r.score] >= LEVEL_ORDER[opts.failOn]);
    if (shouldFail)
        process.exit(1);
});
program.parse();
//# sourceMappingURL=index.js.map