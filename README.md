# f-linkedin

A Chrome extension that fixes LinkedIn feed annoyances.

## Features

- **Space key fix** — Prevents LinkedIn from hijacking the Space key when you're not typing in an input field. No more accidentally scrolling or triggering actions while browsing.
- **Notification hover preview** — Hover over the Notifications nav icon to see a dropdown preview of your notifications without navigating away from the feed.

## Installation

1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (toggle in the top-right)
4. Click **Load unpacked** and select the project folder

## How it works

- `fix.js` — Intercepts `keydown` events for the Space key and stops propagation when focus is not on an editable element.
- `notifications.js` — Renders a hover-activated dropdown that loads `/notifications/` in a styled iframe, hiding LinkedIn's chrome so only the notification list is visible.

Both content scripts run at `document_start` in the `MAIN` world on `linkedin.com/feed*`.
