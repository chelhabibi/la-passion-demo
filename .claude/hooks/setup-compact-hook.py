# -*- coding: utf-8 -*-
"""
Setup script: tạo PreCompact hook + update settings.json
"""
import json
import os

HOME = os.path.expanduser("~")
HOOKS_DIR = os.path.join(HOME, ".claude", "hooks")
SETTINGS_FILE = os.path.join(HOME, ".claude", "settings.json")
HOOK_SCRIPT = os.path.join(HOOKS_DIR, "save-before-compact.py")
LOG_FILE = os.path.join(HOOKS_DIR, "conversation-log.txt")

# ── 1. Viết hook script ──────────────────────────────────────────────────────
hook_code = r'''#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PreCompact hook: lưu lịch sử hội thoại vào conversation-log.txt
Mỗi lần /compact chạy, nội dung được APPEND (cộng dồn).
"""
import json, sys, os, glob
from datetime import datetime

def extract_text(content):
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = [b.get("text","") for b in content if isinstance(b,dict) and b.get("type")=="text"]
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

    # Tìm file transcript
    home = os.path.expanduser("~")
    pattern = os.path.join(home, ".claude", "projects", "**", f"{session_id}.jsonl")
    files = glob.glob(pattern, recursive=True)
    if not files:
        sys.exit(0)

    # Parse messages
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

    # Append vào log
    log_path = os.path.join(home, ".claude", "hooks", "conversation-log.txt")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"\n{'='*70}\n")
        f.write(f"COMPACT  {timestamp}  |  session: {session_id[:8]}\n")
        f.write(f"{'='*70}\n\n")
        for role, text in messages:
            f.write(f"[{role}]\n{text}\n\n")

    # Thông báo cho Claude Code biết
    print(json.dumps({
        "systemMessage": f"Da luu {len(messages)} tin nhan vao conversation-log.txt"
    }))

if __name__ == "__main__":
    main()
'''

os.makedirs(HOOKS_DIR, exist_ok=True)
with open(HOOK_SCRIPT, "w", encoding="utf-8") as f:
    f.write(hook_code)
print(f"[OK] Hook script: {HOOK_SCRIPT}")

# ── 2. Update settings.json ──────────────────────────────────────────────────
with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
    settings = json.load(f)

# Dùng dấu / để tránh escape trên Windows
hook_cmd = HOOK_SCRIPT.replace("\\", "/")

new_hook = {
    "matcher": "manual",
    "hooks": [{
        "type": "command",
        "command": f'python "{hook_cmd}"',
        "shell": "powershell",
        "statusMessage": "Dang luu lich su hoi thoai..."
    }]
}

if "hooks" not in settings:
    settings["hooks"] = {}
if "PreCompact" not in settings["hooks"]:
    settings["hooks"]["PreCompact"] = []

# Kiểm tra đã tồn tại chưa
existing = settings["hooks"]["PreCompact"]
already = any(
    h.get("matcher") == "manual" and
    any("save-before-compact" in str(hh) for hh in h.get("hooks", []))
    for h in existing
)
if not already:
    existing.append(new_hook)

with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
    json.dump(settings, f, ensure_ascii=False, indent=2)
print(f"[OK] settings.json updated with PreCompact hook")

# ── 3. Tạo /export skill ─────────────────────────────────────────────────────
export_dir = os.path.join(HOME, ".claude", "skills", "export-log")
os.makedirs(export_dir, exist_ok=True)

export_skill = f"""\
---
name: export-log
description: "Xuất toàn bộ lịch sử hội thoại đã tích lũy từ các lần /compact ra file .txt trên Desktop."
---

Thực hiện các bước sau:

1. Kiểm tra file log tại: `{LOG_FILE.replace(chr(92), "/")}`
   - Nếu không tồn tại: thông báo "Chưa có dữ liệu — hãy dùng /compact ít nhất 1 lần"
   - Nếu tồn tại: tiếp tục

2. Đọc toàn bộ nội dung file log bằng Read tool

3. Hiển thị tóm tắt:
   - Số lần compact đã lưu
   - Khoảng thời gian (từ ... đến ...)
   - Tổng số tin nhắn

4. Hỏi người dùng:
   > "Bạn muốn làm gì với log này?"
   > A) Xem toàn bộ nội dung
   > B) Copy sang Desktop (đặt tên theo ngày)
   > C) Xóa log và bắt đầu lại
   > D) Không làm gì
"""

with open(os.path.join(export_dir, "SKILL.md"), "w", encoding="utf-8") as f:
    f.write(export_skill)
print(f"[OK] /export-log skill: {export_dir}")

print("\n=== Done ===")
print(f"  Hook script : {HOOK_SCRIPT}")
print(f"  Log file    : {LOG_FILE} (tạo tự động sau /compact đầu tiên)")
print(f"  Export skill: /export-log")
print("\nRestart Claude Code de kich hoat hook.")
