$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..\backend")
npx -y @google/clasp push
