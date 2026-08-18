# Product Spec — Daily Status Report Automation

## Problem

The user manually edits the same Gmail draft every day: open Gmail, open the
draft, update today's date, update tomorrow's date, replace today's work,
replace planned work, press send. This project automates that.

## Workflow

### First-time setup

The user opens the app and:

- Selects one Gmail draft
- Enters TO recipients
- Enters CC recipients

Clicking **Save Configuration** stores this via Apps Script `UserProperties`.
This happens once.

### Daily usage

The user opens the app and enters:

- Today's Activities
- Planned Steps (optional)

Then either:

- **Preview Email**
- **Send Email**

The app loads the saved Gmail draft, replaces placeholders, preserves all
HTML formatting and the signature, and sends the email.

## Email template

The Gmail draft contains placeholders. Only these are replaced — everything
else (HTML tables, signature, images, fonts, colors, formatting) stays
exactly as-is:

- `{{TODAY_DATE}}`
- `{{TOMORROW_DATE}}`
- `{{TASK_LIST}}`
- `{{PLANNED_TASK}}`

## Version 1 scope

**Backend:** `healthCheck`, `getDrafts`, `getConfig`, `saveConfig`, `previewEmail`, `sendEmail`, `scheduleEmail`, `getScheduledEmail`, `cancelScheduledEmail`

**Frontend:** Setup Screen, Daily Report Screen, Preview Dialog, Email Scheduler, Success Notification

**Success criteria:** a user can configure the app once, enter today's work, preview the email, send it immediately, or schedule it for automated delivery.

## Explicitly out of scope for Version 1

Dark mode, authentication, multiple templates, multiple report types, settings page, analytics, logging dashboard, request IDs, API versioning, mobile app, GitHub Pages deployment, Cloudflare Worker, Netlify, React, Tailwind build pipeline.

These are candidates for Version 2, not Version 1.

## Tech stack

- **Backend:** Google Apps Script
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Storage:** Apps Script `UserProperties` (no database, no Firebase)
- **Mail:** native `GmailApp` (no external APIs)

## Coding standards

Clean, readable code; single responsibility; small functions; meaningful
names; no duplicated logic; no magic strings (use constants); try-catch
around backend operations; validate user input; return structured
responses.
