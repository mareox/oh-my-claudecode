#!/bin/bash
# OMC Stop Continuation Hook
# Checks for incomplete todos and injects continuation prompt
# Ported from oh-my-opencode's todo-continuation-enforcer

# Validate session ID to prevent path traversal attacks
is_valid_session_id() {
  local id="$1"
  if [ -z "$id" ]; then
    return 1
  fi
  if echo "$id" | grep -qE '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,255}$'; then
    return 0
  fi
  return 1
}

# Read stdin
INPUT=$(cat)

# Get session ID if available
SESSION_ID=""
if command -v jq &> /dev/null; then
  SESSION_ID=$(echo "$INPUT" | jq -r '.sessionId // .session_id // ""' 2>/dev/null)
fi

# Check for incomplete tasks in new Task system
TASKS_DIR="$HOME/.claude/tasks"
TASK_COUNT=0
JQ_AVAILABLE=false
if command -v jq &> /dev/null; then
  JQ_AVAILABLE=true
fi

if [ -n "$SESSION_ID" ] && is_valid_session_id "$SESSION_ID" && [ -d "$TASKS_DIR/$SESSION_ID" ]; then
  for task_file in "$TASKS_DIR/$SESSION_ID"/*.json; do
    if [ -f "$task_file" ] && [ "$(basename "$task_file")" != ".lock" ]; then
      if [ "$JQ_AVAILABLE" = "true" ]; then
        STATUS=$(jq -r '.status // "pending"' "$task_file" 2>/dev/null)
        if [ "$STATUS" != "completed" ]; then
          TASK_COUNT=$((TASK_COUNT + 1))
        fi
      else
        # Fallback: grep for status field
        if ! grep -q '"status"[[:space:]]*:[[:space:]]*"completed"' "$task_file" 2>/dev/null; then
          TASK_COUNT=$((TASK_COUNT + 1))
        fi
      fi
    fi
  done

  if [ "$JQ_AVAILABLE" = "false" ] && [ "$TASK_COUNT" -gt 0 ]; then
    echo "[OMC WARNING] jq not installed - Task counting may be less accurate." >&2
  fi
fi

# Check for incomplete todos in the Claude todos directory
TODOS_DIR="$HOME/.claude/todos"
if [ -d "$TODOS_DIR" ]; then
  # Look for any todo files with incomplete items
  INCOMPLETE_COUNT=0
  for todo_file in "$TODOS_DIR"/*.json; do
    if [ -f "$todo_file" ]; then
      if command -v jq &> /dev/null; then
        COUNT=$(jq '[.[] | select(.status != "completed" and .status != "cancelled")] | length' "$todo_file" 2>/dev/null || echo "0")
        INCOMPLETE_COUNT=$((INCOMPLETE_COUNT + COUNT))
      fi
    fi
  done

  # Combine task and todo counts
  TOTAL_INCOMPLETE=$((TASK_COUNT + INCOMPLETE_COUNT))

  if [ "$TOTAL_INCOMPLETE" -gt 0 ]; then
    # Use Task terminology if we have tasks, otherwise todos
    if [ "$TASK_COUNT" -gt 0 ]; then
      cat << EOF
{"continue": false, "reason": "[SYSTEM REMINDER - TASK CONTINUATION]\\n\\nIncomplete Tasks remain ($TOTAL_INCOMPLETE remaining). Continue working on the next pending Task.\\n\\n- Proceed without asking for permission\\n- Mark each Task complete when finished\\n- Do not stop until all Tasks are done"}
EOF
    else
      cat << EOF
{"continue": false, "reason": "[SYSTEM REMINDER - TODO CONTINUATION]\\n\\nIncomplete tasks remain in your todo list ($TOTAL_INCOMPLETE remaining). Continue working on the next pending task.\\n\\n- Proceed without asking for permission\\n- Mark each task complete when finished\\n- Do not stop until all tasks are done"}
EOF
    fi
    exit 0
  fi
fi

# No incomplete todos - allow stop
echo '{"continue": true}'
exit 0
