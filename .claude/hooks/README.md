# Hooks

Folder này chứa các hook cho Claude Code, dùng để tự động hoá việc lưu hội thoại trước khi `/compact` xoá context.

## Files

- **`setup-compact-hook.py`** — installer script. Chạy 1 lần để cài hook + đăng ký vào `~/.claude/settings.json`.
- **`save-before-compact.py`** — code thực tế của PreCompact hook. Mỗi lần `/compact` được gọi, hook đọc transcript hiện tại và append vào `~/.claude/hooks/conversation-log.txt`.

## Cách cài đặt

```bash
python setup-compact-hook.py
```

Sau đó **restart Claude Code** để kích hoạt hook.

## Cách hoạt động

```
User gõ /compact
       ↓
Claude Code trigger PreCompact event
       ↓
Hook save-before-compact.py chạy
       ↓
Đọc session JSONL → extract user + assistant messages
       ↓
Append vào ~/.claude/hooks/conversation-log.txt
       ↓
/compact tiếp tục xoá context (an toàn vì đã lưu)
```

## File log

`~/.claude/hooks/conversation-log.txt` — chứa toàn bộ lịch sử các lần compact, mỗi lần có dòng phân cách + timestamp.

## Skill liên quan

Installer script cũng tạo skill `/export-log` cho phép xuất log ra Desktop dưới dạng `.txt`.
