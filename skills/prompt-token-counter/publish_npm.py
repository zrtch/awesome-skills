#!/usr/bin/env python3
"""
Publish this project to npm.

Before publish:
1. Bumps patch version (x.y.z -> x.y.z+1)
2. Syncs version to package.json, SKILL.md frontmatter, and scripts/__init__.py
3. Runs npm publish

Prerequisites: npm login; enable 2FA or use granular access token with bypass 2fa.
"""
import json
import os
import re
import subprocess
import sys
from typing import Optional

ROOT = os.path.dirname(os.path.abspath(__file__))
PACKAGE_JSON = os.path.join(ROOT, "package.json")
SKILL_MD = os.path.join(ROOT, "SKILL.md")
INIT_PY = os.path.join(ROOT, "scripts", "__init__.py")


def bump_patch_version(version: str) -> str:
    """Bump patch (z) in x.y.z."""
    parts = version.strip().split(".")
    if len(parts) < 3:
        return f"{version}.1" if len(parts) == 1 else f"{version}.0"
    try:
        parts[2] = str(int(parts[2]) + 1)
        return ".".join(parts)
    except ValueError:
        return version


def get_npm_version(package_name: str) -> Optional[str]:
    """Get current version from npm, or None on failure."""
    try:
        result = subprocess.run(
            ["npm", "view", package_name, "version"],
            capture_output=True,
            text=True,
            cwd=ROOT,
            shell=(os.name == "nt"),
            timeout=15,
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    return None


def sync_skill_md(new_version: str) -> bool:
    """Update version in SKILL.md frontmatter. Returns True if updated."""
    if not os.path.isfile(SKILL_MD):
        return False
    with open(SKILL_MD, "r", encoding="utf-8") as f:
        content = f.read()
    new_content, n = re.subn(r"(version:\s*)[\d.]+", r"\g<1>" + new_version, content, count=1)
    if n == 0:
        new_content, m = re.subn(
            r"(name:\s*\S+\n)",
            r"\1version: " + new_version + "\n",
            content,
            count=1,
        )
        if m == 0:
            return False
    with open(SKILL_MD, "w", encoding="utf-8") as f:
        f.write(new_content)
    return True


def sync_init_py(new_version: str) -> bool:
    """Update __version__ in scripts/__init__.py. Returns True if updated."""
    if not os.path.isfile(INIT_PY):
        return False
    with open(INIT_PY, "r", encoding="utf-8") as f:
        content = f.read()
    new_content, n = re.subn(
        r'(__version__\s*=\s*")[\d.]+(")',
        r"\g<1>" + new_version + r"\2",
        content,
        count=1,
    )
    if n == 0:
        return False
    with open(INIT_PY, "w", encoding="utf-8") as f:
        f.write(new_content)
    return True


def main() -> None:
    if not os.path.isfile(SKILL_MD):
        print("SKILL.md not found in project root", file=sys.stderr)
        sys.exit(1)
    if not os.path.isfile(PACKAGE_JSON):
        print("package.json not found in project root", file=sys.stderr)
        sys.exit(1)

    with open(PACKAGE_JSON, "r", encoding="utf-8") as f:
        pkg = json.load(f)
    pkg_name = pkg.get("name", "")
    local_version = pkg.get("version", "1.0.0")
    npm_version = get_npm_version(pkg_name) if pkg_name else None

    if npm_version:
        print(f"npm current version: {npm_version}")

    base = npm_version if npm_version else local_version
    if npm_version and local_version != npm_version:
        pkg["version"] = npm_version
        with open(PACKAGE_JSON, "w", encoding="utf-8") as f:
            json.dump(pkg, f, indent=2, ensure_ascii=False)
        print(f"Local synced to npm version: {npm_version}")

    new_version = bump_patch_version(base)
    pkg["version"] = new_version
    with open(PACKAGE_JSON, "w", encoding="utf-8") as f:
        json.dump(pkg, f, indent=2, ensure_ascii=False)
    print(f"Version bumped: {base} -> {new_version}")

    if sync_skill_md(new_version):
        print(f"SKILL.md version synced: {new_version}")
    else:
        print("Warning: SKILL.md version not updated", file=sys.stderr)

    if sync_init_py(new_version):
        print(f"scripts/__init__.py version synced: {new_version}")
    else:
        print("Warning: scripts/__init__.py version not updated", file=sys.stderr)

    result = subprocess.run(
        ["npm", "publish"],
        cwd=ROOT,
        shell=(os.name == "nt"),
    )
    if result.returncode != 0:
        print(
            "Publish failed. 403: enable 2FA or use granular access token with bypass 2fa. Not logged in: npm login",
            file=sys.stderr,
        )
        sys.exit(result.returncode)
    print(f"Published to npm: {new_version}")


if __name__ == "__main__":
    main()
