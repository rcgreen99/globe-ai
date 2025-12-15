#!/usr/bin/env bash

source .venv/bin/activate

uv run fastapi dev backend/main.py --reload
