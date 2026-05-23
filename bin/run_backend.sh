#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

uv run --directory "$repo_root/backend" fastapi dev globe_ai/main.py --reload
