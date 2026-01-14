---
description: Set Sisyphus as your default operating mode
---

$ARGUMENTS

## Task: Configure Sisyphus (MANDATORY STEPS - DO NOT SKIP)

You MUST complete ALL of the following steps. Do NOT skip any step. Do NOT say "already configured" - ALWAYS perform the full installation.

### Step 1: Fetch and Write CLAUDE.md

1. Use WebFetch to get the latest CLAUDE.md:
```
WebFetch(url: "https://raw.githubusercontent.com/Yeachan-Heo/oh-my-claude-sisyphus/main/docs/CLAUDE.md", prompt: "Return the complete raw markdown content exactly as-is")
```

2. Use the Write tool to write the fetched content to `~/.claude/CLAUDE.md` (ALWAYS overwrite, do not skip)

**FALLBACK** if WebFetch fails:
Tell user to visit https://raw.githubusercontent.com/Yeachan-Heo/oh-my-claude-sisyphus/main/docs/CLAUDE.md and copy the content manually.

### Step 2: Create Hooks Directory

Run:
```bash
mkdir -p ~/.claude/hooks
```

### Step 3: Install Hook Scripts

You MUST install ALL 4 hook scripts. For each script:
1. Find the plugin directory (use Glob to find hooks/keyword-detector.sh in the installed plugin)
2. Read the script from the plugin's hooks/ directory
3. Write it to ~/.claude/hooks/

Scripts to install:
- `keyword-detector.sh` → `~/.claude/hooks/keyword-detector.sh`
- `stop-continuation.sh` → `~/.claude/hooks/stop-continuation.sh`
- `persistent-mode.sh` → `~/.claude/hooks/persistent-mode.sh`
- `session-start.sh` → `~/.claude/hooks/session-start.sh`

### Step 4: Make Scripts Executable

Run:
```bash
chmod +x ~/.claude/hooks/*.sh
```

### Step 5: Confirm Success

After completing ALL steps, report:

✅ **Sisyphus Configuration Complete**
- CLAUDE.md: Updated with latest configuration
- Hook scripts: 4 scripts installed to ~/.claude/hooks/
- Agents: 19 available (11 base + 8 tiered variants)
- Model routing: Haiku/Sonnet/Opus based on task complexity

**IMPORTANT**: If you skipped any step or said "already configured" without performing the installations, you have FAILED this task. Go back and complete all steps.
