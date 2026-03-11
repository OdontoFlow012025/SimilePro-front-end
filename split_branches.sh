#!/bin/bash
set -e

# Stash everything
git add .
git stash push -m "all_frontend_changes"

# Make sure we have latest main
git checkout main
git pull origin main || true

# Helper to process a branch
process_branch() {
  local branch=$1
  local msg=$2
  shift 2
  local files=("$@")

  echo "Processing branch: $branch"
  git checkout main
  git checkout -B "$branch"
  
  # Checkout specific files from the stash
  for file in "${files[@]}"; do
    git checkout stash@{0} -- "$file" || echo "Warning: could not checkout $file"
  done
  
  # Commit and push
  git add .
  git commit -m "$msg" || echo "Nothing to commit for $branch"
  git push -u origin "$branch" --force || echo "Failed to push $branch"
}

# 1. Homepage Updates
process_branch "feature/homepage-updates" "feat: update homepage components" \
  "src/components/Features.tsx" \
  "src/components/Hero.tsx" \
  "src/components/Stats.tsx"

# 2. Financial & Inventory Updates
process_branch "feature/financial-inventory" "feat: update financial tabs and inventory stock UI" \
  "src/app/[locale]/(private)/financeiro/page.tsx" \
  "src/components/dashboard/financial/FinanceiroTabs.tsx" \
  "src/components/dashboard/financial/InventoryStock.tsx"

# 3. Translations
process_branch "feature/i18n-updates" "i18n: add new translations for BI reports" \
  "src/dictionaries/en.json" \
  "src/dictionaries/es.json" \
  "src/dictionaries/pt-BR.json"

# 4. API Client Updates
process_branch "feature/api-client-updates" "feat: add bi-metrics and network endpoints to api client" \
  "src/services/api.ts"

# 5. BI Reports Dashboard
process_branch "feature/bi-reports-dashboard" "feat: implement BI Reports Dashboard UI" \
  "src/app/[locale]/(private)/relatorios/page.tsx" \
  "src/components/dashboard/PlaceholderPage.tsx" \
  "src/components/dashboard/reports/"

echo "All branches processed."
git checkout main
