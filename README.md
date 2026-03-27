# f-linkedin

A Chrome/Chromium browser extension that fixes LinkedIn feed annoyances.

## Features

- **Space key fix** — Prevents LinkedIn from hijacking the Space key when using it to navigate down your Feed.
- **Notification hover preview** — Hover over the Notifications nav icon to see a dropdown preview of your notifications without navigating away from your Feed.

## Installation

1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome (or the Chromium browser equivelent)
3. Enable **Developer mode** (toggle in the top-right)
4. Click **Load unpacked** and select the project folder

## How it works

- `fix.js` — Intercepts `keydown` events for the Space key and stops propagation when focus is not on an editable element.
- `notifications.js` — Renders a hover-activated dropdown that loads `/notifications/` in a styled iframe, hiding LinkedIn's chrome so only the notification list is visible.

Both content scripts run at `document_start` in the `MAIN` world on `linkedin.com/feed*`.
