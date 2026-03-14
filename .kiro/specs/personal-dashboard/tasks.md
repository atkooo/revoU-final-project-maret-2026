# Implementation Plan: Personal Dashboard

## Overview

Build a zero-dependency, single-page dashboard from three files: `index.html`, `css/styles.css`, and `js/app.js`. Each widget follows an `init(containerEl)` / `render()` pattern. No build step required — open `index.html` directly in a browser.

## Tasks

- [x] 1. Scaffold project structure and HTML shell
  - Create `index.html` at the project root with four widget container elements
  - Create `css/styles.css` and `js/app.js` as empty files linked from the HTML
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Implement Greeting Widget
  - [x] 2.1 Write `greetingWidget.init(containerEl)` and `greetingWidget.render()` in `js/app.js`
    - Read `new Date()` on init and every 60 s via `setInterval`
    - Display time in HH:MM, date in human-readable format, and greeting based on hour ranges
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 3. Implement Focus Timer
  - [x] 3.1 Write `timerWidget` with internal state `{ remaining, running, intervalId }` in `js/app.js`
    - Implement `init`, `start`, `stop`, `reset`, and `render`
    - `start` is a no-op when already running; auto-stop at 0; display in MM:SS
    - Timer state is NOT persisted to localStorage
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 4. Implement To-Do List
  - [x] 4.1 Write `todoWidget` with `Task[]` state in `js/app.js`
    - Implement `init`, `addTask`, `toggleTask`, `editTask`, `deleteTask`, and `render`
    - `addTask`: validate non-empty title, generate id via `crypto.randomUUID()`, default `done: false`
    - `editTask`: validate non-empty title; discard edit and restore original on empty input
    - `toggleTask`: invert `done`; render completed tasks with visual distinction (strikethrough)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 4.2 Add localStorage persistence to `todoWidget`
    - On every mutation (`addTask`, `toggleTask`, `editTask`, `deleteTask`) write `JSON.stringify(tasks)` to key `"dashboard_todos"`
    - On `init`, read and parse from `"dashboard_todos"`; fall back to empty array if absent
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 5. Implement Quick Links
  - [x] 5.1 Write `linksWidget` with `Link[]` state in `js/app.js`
    - Implement `init`, `addLink`, `deleteLink`, and `render`
    - `addLink`: validate non-empty label and valid URL; show inline validation message on failure
    - Each link renders as an anchor that opens in a new tab
    - _Requirements: 6.1, 6.2, 7.1, 7.2, 7.3, 7.4_
  - [x] 5.2 Add localStorage persistence to `linksWidget`
    - On every mutation write `JSON.stringify(links)` to key `"dashboard_links"`
    - On `init`, read and parse from `"dashboard_links"`; fall back to empty array if absent
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 6. Wire widgets and style the dashboard
  - [x] 6.1 Call `init()` for all four widgets inside a `DOMContentLoaded` listener in `js/app.js`
    - Pass each widget its corresponding container element from `index.html`
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 6.2 Write layout and widget styles in `css/styles.css`
    - Grid or flexbox layout for the four-widget dashboard
    - Completed task strikethrough, link button/anchor styles, timer display

- [x] 7. Final checkpoint
  - Open `index.html` in a browser and verify all four widgets render, interact, and persist correctly across a page refresh.
  - Ensure all requirements are met, ask the user if questions arise.
