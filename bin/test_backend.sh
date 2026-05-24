#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

uv run \
  --directory "$repo_root/backend" \
  --env-file "$repo_root/.env" \
  pytest "$@"