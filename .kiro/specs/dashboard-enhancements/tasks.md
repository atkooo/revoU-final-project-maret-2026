# Implementation Plan

## Tasks

- [x] 1. Add light/dark theme toggle
  - [x] 1.1 Add CSS custom-property overrides for `[data-theme="light"]` in `css/styles.css`
  - [x] 1.2 Add `#theme-toggle` button to `index.html` (header/top bar area)
  - [x] 1.3 Implement `themeManager` module in `js/app.js` with `init()`, `toggle()`, and `_apply()` methods
  - [x] 1.4 Call `themeManager.init()` synchronously on page load (before widget bootstrap) to avoid theme flash
  - [x] 1.5 Wire the toggle button to `themeManager.toggle()` and update its aria-label / icon on each switch

- [x] 2. Custom name in greeting
  - [x] 2.1 Add a name input form inside `#greeting-widget` in `index.html`
  - [x] 2.2 Add `_name` state and `setName(value)` method to `greetingWidget` in `js/app.js`
  - [x] 2.3 Update `greetingWidget.render()` to append the name to the greeting text when `_name` is non-empty
  - [x] 2.4 Persist and load `_name` via `localStorage` key `"dashboard_name"` in `init()` and `setName()`

- [x] 3. Configurable Pomodoro duration
  - [x] 3.1 Add a duration input row (number input + Set button + error span) to the timer widget's `render()` output in `js/app.js`
  - [x] 3.2 Implement `timerWidget.setDuration(value)` — validate 1–99, persist to `"dashboard_timer_duration"`, reset countdown
  - [x] 3.3 Update `timerWidget.init()` to read `"dashboard_timer_duration"` from `localStorage` and initialise `_state.remaining` accordingly
  - [x] 3.4 Update `timerWidget.reset()` to restore to `_duration * 60` instead of the hard-coded `1500`
  - [x] 3.5 Disable the duration input and Set button while `_state.running === true`

- [x] 4. Prevent duplicate tasks
  - [x] 4.1 Add a `<p class="todo-error">` element to `todoWidget.render()` in `js/app.js`
  - [x] 4.2 Add duplicate check (case-insensitive) to `todoWidget.addTask()` — show error and return early on match
  - [x] 4.3 Add duplicate check (case-insensitive, excluding self) to `todoWidget.editTask()` — discard edit and show error on match
  - [x] 4.4 Clear the error message when the user modifies the task input field

- [x] 5. Sort tasks
  - [x] 5.1 Add a `<select class="todo-sort-select">` control with options `added`, `alpha-asc`, `alpha-desc` to `todoWidget.render()`
  - [x] 5.2 Implement `todoWidget._getSortedTasks()` — returns a sorted copy of `_tasks` based on `_sortOrder`
  - [x] 5.3 Update `todoWidget.render()` to call `_getSortedTasks()` when building the task list HTML
  - [x] 5.4 Persist and load `_sortOrder` via `localStorage` key `"dashboard_sort_order"` in `init()` and when the select changes
  - [x] 5.5 Wire the sort select's `change` event to update `_sortOrder`, persist, and re-render
