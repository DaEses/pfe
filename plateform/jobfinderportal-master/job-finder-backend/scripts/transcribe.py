#!/usr/bin/env python3
"""
transcribe.py — Whisper transcription helper script.

Usage:
    python3 transcribe.py <audio_file_path>

Outputs a JSON object to stdout:
    {"text": "<transcribed text>"}

On error outputs:
    {"error": "<error message>", "text": ""}
"""
import sys
import json
import os


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file path provided", "text": ""}))
        sys.exit(1)

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        print(json.dumps({"error": f"File not found: {audio_path}", "text": ""}))
        sys.exit(1)

    try:
        import whisper  # type: ignore
    except ImportError:
        print(json.dumps({"error": "whisper not installed. Run: pip install openai-whisper", "text": ""}))
        sys.exit(1)

    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path, language="en")
        text = result.get("text", "").strip()
        print(json.dumps({"text": text}))
    except Exception as exc:
        print(json.dumps({"error": str(exc), "text": ""}))
        sys.exit(1)


if __name__ == "__main__":
    main()
