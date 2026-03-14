# Requirements Document

## Introduction

A personal dashboard web app built with HTML, CSS, and Vanilla JavaScript. It runs entirely in the browser with no backend, using Local Storage for persistence. The dashboard provides a greeting with current time/date, a 25-minute focus (Pomodoro) timer, a to-do list, and a quick links panel — all in a single-page layout.

## Glossary

- **Dashboard**: The single-page web application containing all widgets.
- **Greeting_Widget**: The component that displays the current time, date, and a time-based greeting.
- **Timer**: The focus countdown timer component (25-minute Pomodoro-style).
- **Todo_List**: The component that manages the user's task list.
- **Task**: A single to-do item with a title, completion state, and unique identifier.
- **Quick_Links**: The component that displays and manages user-defined shortcut links.
- **Link**: A saved shortcut entry containing a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.

---

## Requirements

### Requirement 1: Greeting Widget

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open the dashboard, so that I have an at-a-glance overview of the moment.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, July 14, 2025").
3. WHEN the local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good morning".
4. WHEN the local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting "Good afternoon".
5. WHEN the local time is between 18:00 and 21:59, THE Greeting_Widget SHALL display the greeting "Good evening".
6. WHEN the local time is between 22:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can manage focused work sessions.

#### Acceptance Criteria

1. THE Timer SHALL initialise with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the start control, THE Timer SHALL begin counting down one second per second.
3. WHILE the Timer is counting down, THE Timer SHALL display the remaining time in MM:SS format.
4. WHEN the user activates the stop control, THE Timer SHALL pause the countdown at the current remaining time.
5. WHEN the user activates the reset control, THE Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Timer SHALL stop automatically.
7. IF the start control is activated while the Timer is already counting down, THEN THE Timer SHALL ignore the activation.

---

### Requirement 3: To-Do List — Add and Display Tasks

**User Story:** As a user, I want to add tasks to a list and see them displayed, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field and a submit control for entering new tasks.
2. WHEN the user submits a non-empty task title, THE Todo_List SHALL append a new Task to the list with a unique identifier and a default completion state of false.
3. IF the user submits an empty or whitespace-only task title, THEN THE Todo_List SHALL not create a Task and SHALL retain focus on the input field.
4. THE Todo_List SHALL display each Task showing its title and current completion state.

---

### Requirement 4: To-Do List — Edit, Complete, and Delete Tasks

**User Story:** As a user, I want to edit, mark as done, and delete tasks, so that I can keep my list accurate and up to date.

#### Acceptance Criteria

1. WHEN the user activates the edit control on a Task, THE Todo_List SHALL allow the user to modify the Task's title inline.
2. WHEN the user confirms an edit with a non-empty title, THE Todo_List SHALL update the Task's title to the new value.
3. IF the user confirms an edit with an empty or whitespace-only title, THEN THE Todo_List SHALL discard the edit and restore the original title.
4. WHEN the user activates the completion toggle on a Task, THE Todo_List SHALL invert the Task's completion state.
5. WHILE a Task has a completion state of true, THE Todo_List SHALL render the Task with a visual distinction (e.g., strikethrough text).
6. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove that Task from the list permanently.

---

### Requirement 5: To-Do List — Persistence

**User Story:** As a user, I want my tasks to be saved automatically, so that they are still available after I close or refresh the browser.

#### Acceptance Criteria

1. WHEN a Task is created, edited, completed, or deleted, THE Todo_List SHALL write the current task collection to Local_Storage.
2. WHEN the Dashboard loads, THE Todo_List SHALL read the task collection from Local_Storage and render all previously saved Tasks.
3. IF no task data exists in Local_Storage, THEN THE Todo_List SHALL render an empty list.

---

### Requirement 6: Quick Links — Display and Open

**User Story:** As a user, I want to see my saved website shortcuts and open them with one click, so that I can navigate to favourite sites quickly.

#### Acceptance Criteria

1. THE Quick_Links SHALL display each saved Link as a labelled button or anchor.
2. WHEN the user activates a Link, THE Quick_Links SHALL open the associated URL in a new browser tab.

---

### Requirement 7: Quick Links — Add and Delete

**User Story:** As a user, I want to add and remove quick links, so that I can customise my shortcut panel.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide input fields for a link label and a URL, and a submit control.
2. WHEN the user submits a non-empty label and a valid URL, THE Quick_Links SHALL add a new Link to the panel.
3. IF the user submits an empty label or an invalid URL, THEN THE Quick_Links SHALL not create a Link and SHALL display an inline validation message.
4. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove that Link from the panel permanently.

---

### Requirement 8: Quick Links — Persistence

**User Story:** As a user, I want my quick links to be saved automatically, so that they persist across browser sessions.

#### Acceptance Criteria

1. WHEN a Link is added or deleted, THE Quick_Links SHALL write the current link collection to Local_Storage.
2. WHEN the Dashboard loads, THE Quick_Links SHALL read the link collection from Local_Storage and render all previously saved Links.
3. IF no link data exists in Local_Storage, THEN THE Quick_Links SHALL render an empty panel.

---

### Requirement 9: File Structure

**User Story:** As a developer, I want the project to follow a strict single-file-per-type structure, so that the codebase stays clean and maintainable.

#### Acceptance Criteria

1. THE Dashboard SHALL be structured with exactly one HTML file at the project root.
2. THE Dashboard SHALL contain exactly one CSS file located inside a `css/` directory.
3. THE Dashboard SHALL contain exactly one JavaScript file located inside a `js/` directory.
