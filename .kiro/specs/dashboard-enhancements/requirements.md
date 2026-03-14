# Requirements Document

## Introduction

Five enhancements to the existing personal dashboard web app (vanilla HTML/CSS/JS, no build step). The enhancements cover: a light/dark mode toggle, a user-configurable display name in the greeting, a configurable Pomodoro timer duration, duplicate-task prevention in the to-do list, and task sorting. All new state is persisted to `localStorage` following the same patterns as the existing app.

## Glossary

- **Dashboard**: The single-page web application containing all widgets.
- **Theme**: The active colour scheme — either `"dark"` (default) or `"light"`.
- **Theme_Toggle**: The UI control that switches between dark and light themes.
- **Greeting_Widget**: The existing component that displays time, date, and a greeting.
- **Display_Name**: The user-supplied name shown in the greeting (e.g., "Good morning, Alex").
- **Name_Setting**: The UI control that lets the user set or clear their Display_Name.
- **Timer**: The existing focus countdown timer component.
- **Timer_Duration**: The configurable number of minutes the Timer counts down from (default 25).
- **Duration_Setting**: The UI control that lets the user change the Timer_Duration.
- **Todo_List**: The existing component that manages the user's task list.
- **Task**: A single to-do item with a title, completion state, and unique identifier.
- **Sort_Order**: The active ordering applied to the task list — one of `"added"` (insertion order), `"alpha-asc"` (A→Z), or `"alpha-desc"` (Z→A).
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.

---

## Requirements

### Requirement 1: Light / Dark Mode Toggle

**User Story:** As a user, I want to switch between a dark and a light colour scheme, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a Theme_Toggle control visible on every page load.
2. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL switch the active Theme from `"dark"` to `"light"`, or from `"light"` to `"dark"`.
3. WHEN the Theme is `"light"`, THE Dashboard SHALL apply a light colour palette to all widgets and the page background.
4. WHEN the Theme is `"dark"`, THE Dashboard SHALL apply the existing dark colour palette to all widgets and the page background.
5. WHEN the Theme changes, THE Dashboard SHALL persist the new Theme value to Local_Storage under the key `"dashboard_theme"`.
6. WHEN the Dashboard loads, THE Dashboard SHALL read the Theme value from Local_Storage and apply it before first render, so no flash of the wrong theme occurs.
7. IF no Theme value exists in Local_Storage, THEN THE Dashboard SHALL default to the `"dark"` Theme.
8. THE Theme_Toggle SHALL display a label or icon that reflects the currently active Theme (e.g., a sun icon for light mode, a moon icon for dark mode).

---

### Requirement 2: Custom Name in Greeting

**User Story:** As a user, I want to set my name so that the greeting addresses me personally, so that the dashboard feels more welcoming.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide a Name_Setting control that allows the user to enter a Display_Name.
2. WHEN the user submits a non-empty Display_Name, THE Greeting_Widget SHALL append the Display_Name to the greeting text (e.g., "Good morning, Alex").
3. IF the user submits an empty or whitespace-only value via the Name_Setting, THEN THE Greeting_Widget SHALL clear the Display_Name and display the greeting without a name.
4. WHEN the Display_Name is set or cleared, THE Greeting_Widget SHALL persist the value to Local_Storage under the key `"dashboard_name"`.
5. WHEN the Dashboard loads, THE Greeting_Widget SHALL read the Display_Name from Local_Storage and include it in the greeting if present.
6. IF no Display_Name exists in Local_Storage, THEN THE Greeting_Widget SHALL display the greeting without a name suffix.

---

### Requirement 3: Configurable Pomodoro Duration

**User Story:** As a user, I want to change the timer duration from the default 25 minutes, so that I can adapt focus sessions to my preferred working style.

#### Acceptance Criteria

1. THE Timer SHALL provide a Duration_Setting control that accepts a whole number of minutes.
2. WHEN the user submits a valid duration (a whole number between 1 and 99 inclusive), THE Timer SHALL update the Timer_Duration to the submitted value and reset the countdown display to `MM:00` for the new duration.
3. IF the user submits a value outside the range 1–99 or a non-numeric value, THEN THE Timer SHALL not change the Timer_Duration and SHALL display an inline validation message.
4. WHEN the Timer_Duration is changed, THE Timer SHALL persist the new value to Local_Storage under the key `"dashboard_timer_duration"`.
5. WHEN the Dashboard loads, THE Timer SHALL read the Timer_Duration from Local_Storage and initialise the countdown to that duration.
6. IF no Timer_Duration exists in Local_Storage, THEN THE Timer SHALL default to 25 minutes.
7. WHILE the Timer is counting down, THE Duration_Setting control SHALL be disabled to prevent mid-session changes.

---

### Requirement 4: Prevent Duplicate Tasks

**User Story:** As a user, I want the to-do list to reject tasks with the same title as an existing one, so that I don't accidentally add the same task twice.

#### Acceptance Criteria

1. WHEN the user submits a new task title, THE Todo_List SHALL compare the trimmed, case-insensitive title against all existing Task titles.
2. IF the submitted title matches an existing Task title (case-insensitive), THEN THE Todo_List SHALL not create a new Task and SHALL display an inline duplicate warning message.
3. WHEN the user modifies the input after a duplicate warning, THE Todo_List SHALL clear the duplicate warning message.
4. WHEN the user confirms an inline edit of a Task, THE Todo_List SHALL apply the same duplicate check against all other Tasks (excluding the Task being edited).
5. IF an edited title matches another existing Task title (case-insensitive), THEN THE Todo_List SHALL discard the edit and display an inline duplicate warning message.

---

### Requirement 5: Sort Tasks

**User Story:** As a user, I want to sort my to-do list, so that I can view tasks in the order most useful to me.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a sort control offering at least the following Sort_Order options: `"added"` (default insertion order), `"alpha-asc"` (A→Z by title), and `"alpha-desc"` (Z→A by title).
2. WHEN the user selects a Sort_Order, THE Todo_List SHALL re-render the task list in the chosen order without modifying the underlying insertion order of Tasks in storage.
3. WHEN the Sort_Order is `"alpha-asc"`, THE Todo_List SHALL render Tasks sorted alphabetically by title, case-insensitive, ascending.
4. WHEN the Sort_Order is `"alpha-desc"`, THE Todo_List SHALL render Tasks sorted alphabetically by title, case-insensitive, descending.
5. WHEN the Sort_Order is `"added"`, THE Todo_List SHALL render Tasks in their original insertion order.
6. WHEN the user adds, edits, or deletes a Task, THE Todo_List SHALL re-render the list maintaining the currently active Sort_Order.
7. WHEN the Sort_Order changes, THE Todo_List SHALL persist the new value to Local_Storage under the key `"dashboard_sort_order"`.
8. WHEN the Dashboard loads, THE Todo_List SHALL read the Sort_Order from Local_Storage and apply it on initial render.
9. IF no Sort_Order exists in Local_Storage, THEN THE Todo_List SHALL default to the `"added"` Sort_Order.
