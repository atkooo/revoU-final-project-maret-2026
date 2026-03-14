# Design Document: Dashboard Enhancements

## Overview

Five incremental enhancements to the existing personal dashboard. All changes are confined to the three existing files (`index.html`, `css/styles.css`, `js/app.js`) — no new files, no build step, no dependencies.

| Enhancement | Touches |
|---|---|
| Light/Dark theme toggle | CSS (custom properties), JS (themeManager), HTML (toggle button) |
| Custom greeting name | JS (greetingWidget), HTML (name input) |
| Configurable timer duration | JS (timerWidget), HTML (duration input) |
| Prevent duplicate tasks | JS (todoWidget.addTask, todoWidget.editTask) |
| Sort tasks | JS (todoWidget), HTML (sort select) |

---

## Architecture

The existing widget-per-module pattern is preserved. Two additions:

- A new `themeManager` module handles theme state independently of any widget.
- Each widget that gains new persistent state gets a new `localStorage` key.

### New localStorage Keys

| Key | Type | Default | Owner |
|---|---|---|---|
| `"dashboard_theme"` | `"dark"` \| `"light"` | `"dark"` | themeManager |
| `"dashboard_name"` | string | `""` | greetingWidget |
| `"dashboard_timer_duration"` | number (minutes) | `25` | timerWidget |
| `"dashboard_sort_order"` | `"added"` \| `"alpha-asc"` \| `"alpha-desc"` | `"added"` | todoWidget |

---

## Component Designs

### 1. themeManager (new)

Applies the theme by toggling a `data-theme` attribute on `<body>`. CSS custom properties are scoped to `[data-theme="light"]` to override the dark defaults.

```js
const themeManager = {
  _theme: 'dark',

  init() { /* read localStorage, apply, wire toggle button */ },
  toggle() { /* flip theme, persist, apply */ },
  _apply(theme) { document.body.dataset.theme = theme; /* update toggle icon */ },
};
```

HTML addition — a single button in the page header/top bar:
```html
<button id="theme-toggle" aria-label="Switch to light mode">🌙</button>
```

CSS addition — light theme overrides via attribute selector:
```css
[data-theme="light"] {
  --bg:      #f1f5f9;
  --surface: #ffffff;
  --surface2: #e2e8f0;
  --border:  #cbd5e1;
  --text:    #0f172a;
  --muted:   #64748b;
}
```

No flash on load: `themeManager.init()` is called before `DOMContentLoaded` renders widgets, or the `<body>` tag sets `data-theme` synchronously via an inline script.

### 2. greetingWidget — Display Name

New state: `_name: string` (loaded from `localStorage`).

The widget renders a small inline form below the greeting text:

```html
<form class="name-form">
  <input class="name-input" type="text" placeholder="Your name…" aria-label="Display name" />
  <button class="name-save-btn" type="submit">Save</button>
</form>
```

`render()` change: if `_name` is non-empty, greeting becomes `"Good morning, ${_name}"`.

New methods:
```js
greetingWidget.setName(value)  // trim, persist, re-render
```

### 3. timerWidget — Configurable Duration

New state: `_duration: number` (minutes, loaded from `localStorage`, default 25).

`_state.remaining` is initialised to `_duration * 60` instead of the hard-coded `1500`.

`reset()` restores to `_duration * 60` (not always 1500).

The widget renders a duration input row below the controls:

```html
<div class="timer-duration-row">
  <input class="timer-duration-input" type="number" min="1" max="99"
         aria-label="Timer duration in minutes" />
  <button class="timer-set-btn">Set</button>
  <span class="timer-duration-error" role="alert" aria-live="polite"></span>
</div>
```

The input and button are `disabled` while `_state.running === true`.

New method:
```js
timerWidget.setDuration(value)  // validate 1–99, persist, reset countdown
```

### 4. todoWidget — Duplicate Prevention

`addTask(title)` gains a duplicate check before pushing:

```js
const isDuplicate = this._tasks.some(
  t => t.title.toLowerCase() === trimmed.toLowerCase()
);
if (isDuplicate) { /* show inline error, return */ }
```

`editTask(id, title)` gains the same check, excluding the task being edited:

```js
const isDuplicate = this._tasks.some(
  t => t.id !== id && t.title.toLowerCase() === trimmed.toLowerCase()
);
```

Error display: a `<p class="todo-error">` element rendered inside the widget, cleared on any input change.

### 5. todoWidget — Sort Tasks

New state: `_sortOrder: 'added' | 'alpha-asc' | 'alpha-desc'` (loaded from `localStorage`, default `'added'`).

The underlying `_tasks` array always stores tasks in insertion order. Sorting is applied only at render time via a derived array:

```js
_getSortedTasks() {
  const tasks = [...this._tasks];
  if (this._sortOrder === 'alpha-asc')
    return tasks.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  if (this._sortOrder === 'alpha-desc')
    return tasks.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
  return tasks; // 'added' — insertion order
}
```

A `<select>` control is rendered above the task list:

```html
<select class="todo-sort-select" aria-label="Sort tasks">
  <option value="added">Order added</option>
  <option value="alpha-asc">A → Z</option>
  <option value="alpha-desc">Z → A</option>
</select>
```

`render()` calls `_getSortedTasks()` instead of `this._tasks` directly when building the list HTML.

---

## Data Models

No new data models. Additions to existing models:

- `Task` — no schema change; sort is a view-layer concern.
- `timerWidget._state` gains `_duration` (persisted separately, not part of the runtime state object).

---

## Correctness Properties

### Theme Toggle
- Toggling twice returns to the original theme (idempotence / round-trip).
- After a page reload, the applied theme matches the value in `localStorage`.

### Display Name
- `setName("")` clears the name; greeting renders without a suffix.
- After a page reload, the greeting includes the previously saved name.
- `setName(name)` followed by reload produces the same greeting as `setName(name)` alone (round-trip).

### Timer Duration
- `setDuration(n)` where `n` is in [1, 99] sets `remaining` to `n * 60`.
- `setDuration(n)` where `n` is outside [1, 99] leaves `remaining` unchanged.
- After a page reload, the timer initialises to the persisted duration.

### Duplicate Prevention
- For all task lists and all titles `t`, `addTask(t)` when `t` already exists (case-insensitive) leaves the task count unchanged.
- `editTask(id, t)` when `t` matches another task (case-insensitive) leaves that task's title unchanged.

### Sort Tasks
- Sorting does not change the number of tasks rendered.
- Sorting does not change the insertion order stored in `localStorage`.
- `alpha-asc` followed by `alpha-desc` renders tasks in reverse order of `alpha-asc`.
- After a page reload, the active sort order matches the value in `localStorage`.
