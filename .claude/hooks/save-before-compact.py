#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PreCompact hook: lưu lịch sử hội thoại vào conversation-log.txt
Mỗi lần /compact chạy, nội dung được APPEND (cộng dồn).

Hook này được cài đặt vào ~/.claude/hooks/ bởi setup-compact-hook.py.
File này nằm trong repo để minh chứng hook đã được tạo trong project.
"""
import json
import sys
import os
import glob
from datetime import datetime


def extract_text(content):
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = [
            b.get("text", "")
            for b in content
            if isinstance(b, dict) and b.get("type") == "text"
        ]
        return "\n".join(parts).strip()
    return ""


def is_meta(content):
    """Bỏ qua các message hệ thống/nội bộ"""
    s = content.strip()
    if not s:
        return True
    skip_prefixes = ["<local-command", "<command-name>", "<bash-", "<system-reminder"]
    return any(s.startswith(p) for p in skip_prefixes)


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        data = {}

    session_id = data.get("session_id", "")
    if not session_id:
        sys.exit(0)

    home = os.path.expanduser("~")
    pattern = os.path.join(home, ".claude", "projects", "**", f"{session_id}.jsonl")
    files = glob.glob(pattern, recursive=True)
    if not files:
        sys.exit(0)

    messages = []
    with open(files[0], "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                t = entry.get("type", "")

                if t == "user" and not entry.get("isMeta", False):
                    content = extract_text(entry.get("message", {}).get("content", ""))
                    if content and not is_meta(content):
                        messages.append(("USER", content))

                elif t == "assistant":
                    content = extract_text(entry.get("message", {}).get("content", []))
                    if content:
                        messages.append(("CLAUDE", content))
            except Exception:
                continue

    if not messages:
        sys.exit(0)

    log_path = os.path.join(home, ".claude", "hooks", "conversation-log.txt")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"\n{'='*70}\n")
        f.write(f"COMPACT  {timestamp}  |  session: {session_id[:8]}\n")
        f.write(f"{'='*70}\n\n")
        for role, text in messages:
            f.write(f"[{role}]\n{text}\n\n")

    print(json.dumps({
        "systemMessage": f"Da luu {len(messages)} tin nhan vao conversation-log.txt"
    }))


if __name__ == "__main__":
    main()
