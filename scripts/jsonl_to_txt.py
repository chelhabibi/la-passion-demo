"""Convert Claude Code JSONL session log to a readable .txt transcript.

Filters to user prompts + assistant text responses; condenses tool calls into
single-line summaries so the result stays human-readable.

Usage:
    python jsonl_to_txt.py <input1.jsonl> [<input2.jsonl> ...] -o output.txt
"""
import json
import sys
from pathlib import Path


def extract_text(content):
    """Extract human-readable text from a message content block."""
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    parts = []
    for block in content:
        if not isinstance(block, dict):
            continue
        btype = block.get("type")
        if btype == "text":
            parts.append(block.get("text", ""))
        elif btype == "tool_use":
            name = block.get("name", "tool")
            inp = block.get("input", {})
            desc = ""
            if isinstance(inp, dict):
                desc = inp.get("description") or inp.get("file_path") or inp.get("command") or inp.get("pattern") or ""
                if isinstance(desc, str) and len(desc) > 120:
                    desc = desc[:120] + "..."
            parts.append(f"[TOOL: {name}] {desc}")
        elif btype == "tool_result":
            result = block.get("content", "")
            if isinstance(result, list):
                result = " ".join(
                    b.get("text", "") for b in result if isinstance(b, dict)
                )
            if isinstance(result, str):
                snippet = result.replace("\n", " ")
                if len(snippet) > 200:
                    snippet = snippet[:200] + "..."
                parts.append(f"[TOOL RESULT] {snippet}")
    return "\n".join(p for p in parts if p)


def process_file(path, out_lines):
    """Read one JSONL file and append formatted lines to out_lines."""
    out_lines.append(f"\n\n{'=' * 70}")
    out_lines.append(f"SESSION FILE: {path.name}")
    out_lines.append(f"{'=' * 70}\n")
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            mtype = d.get("type")
            if mtype not in {"user", "assistant"}:
                continue
            msg = d.get("message", {})
            if not isinstance(msg, dict):
                continue
            role = msg.get("role", mtype)
            content = msg.get("content", "")
            text = extract_text(content)
            if not text.strip():
                continue
            ts = d.get("timestamp", "")
            header = f"\n--- {role.upper()}"
            if ts:
                header += f" [{ts}]"
            header += " ---"
            out_lines.append(header)
            out_lines.append(text)


def main():
    args = sys.argv[1:]
    if "-o" not in args:
        print("Usage: jsonl_to_txt.py <in1.jsonl> [<in2.jsonl>] -o <out.txt>")
        sys.exit(1)
    o_idx = args.index("-o")
    inputs = [Path(p) for p in args[:o_idx]]
    out_path = Path(args[o_idx + 1])
    out_lines = []
    out_lines.append("La Passion — Conversation Transcript")
    out_lines.append("From skills/agents creation through GitHub push and /export")
    for inp in inputs:
        if not inp.exists():
            print(f"WARN: {inp} not found", file=sys.stderr)
            continue
        process_file(inp, out_lines)
    out_path.write_text("\n".join(out_lines), encoding="utf-8")
    print(f"Wrote {out_path} ({out_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
