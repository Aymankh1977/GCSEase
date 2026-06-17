#!/usr/bin/env bash
# Helper to push this project to your GitHub repo.
# Run from inside the project folder on YOUR machine (where your git credentials live).
set -e

REPO="https://github.com/Aymankh1977/GCSEase.git"

if [ ! -d .git ]; then
  git init
  git branch -M main
  git remote add origin "$REPO"
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REPO"
fi

git add .
git commit -m "GCSEase — multi-board, multi-subject GCSE revision platform"
echo
echo "About to push to: $REPO"
echo "You will be prompted for your GitHub credentials / token."
git push -u origin main
