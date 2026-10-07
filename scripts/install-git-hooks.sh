#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
current=$(git config --get core.hooksPath || true)
if [[ -n "$current" && "$current" != .githooks ]]; then
  printf 'Existing hooksPath is %s; refusing to replace it.\n' "$current" >&2
  exit 1
fi
if [[ -z "$current" && -f "$(git rev-parse --git-path hooks/pre-commit)" ]]; then
  printf 'An existing pre-commit hook must be integrated before installation.\n' >&2
  exit 1
fi

git config --local core.hooksPath .githooks
printf 'Enabled Biome formatting on commit for this checkout.\n'
