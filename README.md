# Personal Dashboard

A lightweight, single-page personal dashboard built with vanilla HTML, CSS, and JavaScript — no build step, no dependencies.

## Features

- **Greeting Widget** — displays the current time, date, and a time-aware greeting (Good morning / afternoon / evening / night). Supports a custom display name that persists across sessions.
- **Focus Timer** — a Pomodoro-style countdown timer with Start, Stop, and Reset controls. Duration is configurable (1–99 minutes) and persists across sessions. The duration input is disabled while the timer is running.
- **To-Do List** — add, edit, complete, and delete tasks. Prevents duplicate entries (case-insensitive) and supports sorting by insertion order, A→Z, or Z→A.
- **Quick Links** — save and manage frequently visited URLs with custom labels.
- **Dark / Light Theme** — toggle between dark (default) and light colour schemes via the button in the top-right corner. Preference persists across sessions with no flash on load.

## Getting Started

No installation required. Just open `index.html` in a browser.

```
open index.html
```

Or serve it locally with any static file server:

```bash
npx serve .
# or
python -m http.server
```

## Project Structure

```
├── index.html        # App shell and widget mount points
├── css/
│   └── styles.css    # All styles, CSS custom properties, theme overrides
└── js/
    └── app.js        # All widget logic (themeManager, greetingWidget, timerWidget, todoWidget, linksWidget)
```

## localStorage Keys

| Key | Description | Default |
|---|---|---|
| `dashboard_theme` | Active colour scheme (`"dark"` or `"light"`) | `"dark"` |
| `dashboard_name` | Display name shown in the greeting | `""` |
| `dashboard_timer_duration` | Timer duration in minutes | `25` |
| `dashboard_todos` | Serialised task list (JSON) | `[]` |
| `dashboard_sort_order` | Task sort order (`"added"`, `"alpha-asc"`, `"alpha-desc"`) | `"added"` |
| `dashboard_links` | Serialised quick links (JSON) | `[]` |

## Browser Support

Any modern browser with support for `localStorage`, `CSS custom properties`, and `crypto.randomUUID()`.
