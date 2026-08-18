# Deployment

## Prerequisites

- [clasp](https://github.com/google/clasp) installed and logged in (`clasp login`)
- Access to the target Apps Script project (`backend/.clasp.json` → `scriptId`)

## Push the backend

```bash
cd backend
clasp push
```

Or from the repo root, use the helper scripts:

```bash
scripts/deploy.sh      # macOS/Linux
scripts/deploy.ps1     # Windows PowerShell
```

Both scripts `cd` into `backend/` and run `clasp push`.

## Frontend

Version 1 ships the frontend as Apps Script HTML files. Copy the contents of
`frontend/` (HTML/CSS/JS inlined as needed) into the Apps Script project's
HTML service files, then `clasp push` from `backend/`.
