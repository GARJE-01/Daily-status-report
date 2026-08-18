# API

The frontend and backend share one Apps Script project, so the frontend
calls the backend via `google.script.run` rather than HTTP. Every call goes
through a single entry point:

```js
google.script.run
  .withSuccessHandler(onSuccess)
  .withFailureHandler(onFailure)
  .runAction('<action>', payload);
```

`runAction` dispatches to the matching controller (see `Router.gs`). A
successful call resolves with the response object; a thrown error (e.g.
setup incomplete) is delivered to `withFailureHandler` instead.

Every successful response is JSON shaped as either:

```json
{ "success": true, "data": { }, "message": "..." }
```

or

```json
{ "success": false, "error": { "code": "...", "message": "..." } }
```

`{ success: false }` is for expected, recoverable failures (validation).
Unexpected failures (e.g. no saved config yet) throw and surface via
`withFailureHandler` instead.

## Actions

### getDrafts

Payload: none. Returns the *accessing user's own* Gmail drafts (the app runs
`executeAs: USER_ACCESSING`, so this is always the caller's Gmail, not the
developer's).

```json
{ "success": true, "data": { "drafts": [{ "id": "...", "subject": "..." }] }, "message": "Drafts fetched successfully." }
```

### getConfig

Payload: none. `data` is `null` if setup hasn't been completed yet. Config is
per-user (`PropertiesService.getUserProperties()`), so each Google account
that uses the app has its own independent draft/recipients.

```json
{ "success": true, "data": { "draftId": "...", "to": "...", "cc": "..." }, "message": "Configuration loaded successfully." }
```

### saveConfig

Payload:

```json
{ "draftId": "...", "to": "a@example.com, b@example.com", "cc": "" }
```

`draftId` and `to` are required. Returns `VALIDATION_ERROR` if missing. The
Gmail draft itself never stores recipients — `to`/`cc` are injected at send
time from this saved config.

### previewEmail

Payload:

```json
{ "todayDate": "04-08-2026", "tomorrowDate": "05-08-2026", "taskList": "Monitor Email\nConfigured VLAN", "plannedTask": "" }
```

`taskList` is required; `plannedTask` is optional. `todayDate`/`tomorrowDate`
are also optional — if omitted, the backend defaults to today and the next
working day (Saturday/Sunday roll forward to Monday), both in `DD-MM-YYYY`.
The frontend always sends them, pre-filled but editable, since "tomorrow"
isn't always the literal next calendar day (weekends, holidays, etc.).
Throws if setup hasn't been completed (surfaces via `withFailureHandler`).

```json
{ "success": true, "data": { "subject": "Daily Status Report - 04-08-2026", "body": "<html>...</html>" }, "message": "Preview generated successfully." }
```

### sendEmail

Two payload shapes:

- Same as `previewEmail` (`taskList`/`plannedTask`/optional dates) — renders
  from the saved draft, same as a preview would, then sends it.
- `{ "subject": "...", "body": "<html>...</html>" }` — sends this content
  exactly as given, no template rendering. This is what the frontend uses
  when sending from the Preview modal, since its subject/body are directly
  editable there before sending.

Sends to the saved `to`/`cc` recipients via `GmailApp`.

```json
{ "success": true, "data": { "sentTo": "...", "sentAt": "2026-08-04T12:00:00.000Z" }, "message": "Email sent successfully." }
```

### scheduleEmail

Payload: Same as `sendEmail` plus `"scheduledAt": "2026-08-18T17:00:00.000Z"`.
Sets an Apps Script time-driven trigger to automatically send the rendered report at the specified timestamp.

```json
{ "success": true, "data": { "scheduledAt": "2026-08-18T17:00:00.000Z" }, "message": "Email scheduled successfully for 18-08-2026." }
```

### getScheduledEmail

Payload: none. Returns the active schedule details if one is currently pending.

```json
{ "success": true, "data": { "scheduledAt": "2026-08-18T17:00:00.000Z", "subject": "..." }, "message": "Scheduled email found." }
```

### cancelScheduledEmail

Payload: none. Deletes the active Apps Script time-driven trigger and clears the saved schedule.

```json
{ "success": true, "data": null, "message": "Scheduled email canceled successfully." }
```

## Template placeholders

The Gmail draft is loaded and only these placeholders are replaced — the
draft's table, formatting, signature, images, fonts, and colors are never
touched or regenerated:

| Placeholder | Replacement |
|---|---|
| `{{TODAY_DATE}}` | Today's date, `DD-MM-YYYY` (e.g. `04-08-2026`) |
| `{{TOMORROW_DATE}}` | Tomorrow's date, `DD-MM-YYYY` (defaults to the next working day) |
| `{{TASK_LIST}}` | `taskList`, converted to a numbered list: `Monitor Email\nConfigured VLAN` → `1) Monitor Email<br><br>2) Configured VLAN` |
| `{{PLANNED_TASK}}` | `plannedTask` as-is, or `"Continue pending activities."` if left empty |

The subject line goes through the same replacement (e.g. a draft subject of
`Daily Status Report - {{TODAY_DATE}}` becomes `Daily Status Report -
04-08-2026`), so `{{TODAY_DATE}}` can be used in either the subject or body.
