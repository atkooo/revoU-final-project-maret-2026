// ─── Theme Manager ───────────────────────────────────────────────────────────

const themeManager = {
  _theme: 'dark',

  init() {
    const stored = localStorage.getItem('dashboard_theme');
    this._theme = stored === 'light' ? 'light' : 'dark';
    this._apply(this._theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },

  toggle() {
    this._theme = this._theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('dashboard_theme', this._theme);
    this._apply(this._theme);
  },

  _apply(theme) {
    document.body.dataset.theme = theme;
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    if (theme === 'dark') {
      btn.textContent = '🌙';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.textContent = '☀️';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  },
};

// ─── Greeting Widget ────────────────────────────────────────────────────────

const greetingWidget = {
  _container: null,
  _name: '',

  init(containerEl) {
    this._container = containerEl;
    this._name = localStorage.getItem('dashboard_name') || '';
    this.render();
    setInterval(() => this.render(), 60_000);
  },

  setName(value) {
    const trimmed = value.trim();
    this._name = trimmed;
    localStorage.setItem('dashboard_name', this._name);
    this.render();
  },

  render() {
    const now = new Date();
    const hour = now.getHours();

    // HH:MM (Requirements 1.1)
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    // Human-readable date, e.g. "Monday, July 14, 2025" (Requirement 1.2)
    const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Greeting based on hour (Requirements 1.3–1.6)
    let greeting;
    if (hour >= 5 && hour <= 11) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour <= 17) {
      greeting = 'Good afternoon';
    } else if (hour >= 18 && hour <= 21) {
      greeting = 'Good evening';
    } else {
      greeting = 'Good night';
    }

    // Append name if set (Requirement 2.2)
    const greetingText = this._name ? `${greeting}, ${this._name}` : greeting;

    this._container.innerHTML = `
      <p class="greeting-text">${greetingText}</p>
      <p class="greeting-time">${time}</p>
      <p class="greeting-date">${date}</p>
      <form class="name-form">
        <input class="name-input" type="text" placeholder="Your name…" aria-label="Display name" value="${this._escHtml(this._name)}" />
        <button class="name-save-btn" type="submit">Save</button>
      </form>
    `;

    // Wire form submit
    const form = this._container.querySelector('.name-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.name-input');
      this.setName(input.value);
    });
  },

  _escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
};

// ─── Focus Timer Widget ──────────────────────────────────────────────────────

const timerWidget = {
  _container: null,
  _duration: 25, // minutes (Requirement 3.6 default)
  _state: { remaining: 1500, running: false, intervalId: null },

  init(containerEl) {
    this._container = containerEl;
    // Task 3.3: read persisted duration from localStorage
    const stored = localStorage.getItem('dashboard_timer_duration');
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 99) {
        this._duration = parsed;
      }
    }
    this._state.remaining = this._duration * 60;
    this.render();
  },

  start() {
    if (this._state.running) return; // no-op if already running (Requirement 2.3)
    this._state.running = true;
    this._state.intervalId = setInterval(() => {
      this._state.remaining -= 1;
      this.render();
      if (this._state.remaining <= 0) {
        this.stop(); // auto-stop at 0 (Requirement 2.5)
      }
    }, 1000);
    this.render();
  },

  stop() {
    clearInterval(this._state.intervalId);
    this._state.intervalId = null;
    this._state.running = false;
    this.render();
  },

  // Task 3.4: reset to _duration * 60 instead of hard-coded 1500
  reset() {
    this.stop();
    this._state.remaining = this._duration * 60;
    this.render();
  },

  // Task 3.2: validate 1–99, persist, reset countdown
  setDuration(value) {
    const parsed = parseInt(value, 10);
    const errorEl = this._container.querySelector('.timer-duration-error');
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99) {
      if (errorEl) errorEl.textContent = 'Please enter a whole number between 1 and 99.';
      return;
    }
    this._duration = parsed;
    localStorage.setItem('dashboard_timer_duration', this._duration);
    if (errorEl) errorEl.textContent = '';
    this.reset();
  },

  render() {
    const { remaining, running } = this._state;
    const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
    const seconds = (remaining % 60).toString().padStart(2, '0');
    const display = `${minutes}:${seconds}`; // MM:SS format (Requirement 2.2)
    // Task 3.5: disable input/button while running
    const disabledAttr = running ? ' disabled' : '';

    this._container.innerHTML = `
      <p class="timer-display">${display}</p>
      <div class="timer-controls">
        <button class="timer-btn" id="timer-start">Start</button>
        <button class="timer-btn" id="timer-stop">Stop</button>
        <button class="timer-btn" id="timer-reset">Reset</button>
      </div>
      <div class="timer-duration-row">
        <input class="timer-duration-input" type="number" min="1" max="99"
               aria-label="Timer duration in minutes" value="${this._duration}"${disabledAttr} />
        <button class="timer-set-btn"${disabledAttr}>Set</button>
        <span class="timer-duration-error" role="alert" aria-live="polite"></span>
      </div>
    `;

    this._container.querySelector('#timer-start').addEventListener('click', () => this.start());
    this._container.querySelector('#timer-stop').addEventListener('click', () => this.stop());
    this._container.querySelector('#timer-reset').addEventListener('click', () => this.reset());

    // Task 3.1: wire Set button
    const setBtn = this._container.querySelector('.timer-set-btn');
    const durationInput = this._container.querySelector('.timer-duration-input');
    setBtn.addEventListener('click', () => this.setDuration(durationInput.value));
    durationInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.setDuration(durationInput.value);
    });
  },
};


// ─── To-Do List Widget ───────────────────────────────────────────────────────

const todoWidget = {
  _container: null,
  _tasks: [], // Task[]
  _editingId: null, // id of task currently being edited
  _error: '',
  _sortOrder: 'added', // 'added' | 'alpha-asc' | 'alpha-desc'

  init(containerEl) {
    this._container = containerEl;
    try {
      const stored = localStorage.getItem('dashboard_todos');
      this._tasks = stored ? JSON.parse(stored) : [];
    } catch {
      this._tasks = [];
    }
    // Task 5.4: load persisted sort order
    const storedSort = localStorage.getItem('dashboard_sort_order');
    if (storedSort === 'alpha-asc' || storedSort === 'alpha-desc' || storedSort === 'added') {
      this._sortOrder = storedSort;
    }
    this.render();
  },

  _persist() {
    localStorage.setItem('dashboard_todos', JSON.stringify(this._tasks));
  },

  // Requirement 3.2, 3.3
  addTask(title) {
    const trimmed = title.trim();
    if (!trimmed) {
      // Retain focus on input (Requirement 3.3)
      const input = this._container.querySelector('.todo-input');
      if (input) input.focus();
      return;
    }
    // Task 4.2: duplicate check (case-insensitive)
    const isDuplicate = this._tasks.some(
      t => t.title.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      this._error = 'A task with that name already exists.';
      this.render();
      return;
    }
    this._tasks.push({ id: crypto.randomUUID(), title: trimmed, done: false });
    this._persist();
    this.render();
  },

  // Requirement 4.4, 4.5
  toggleTask(id) {
    const task = this._tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      this._persist();
      this.render();
    }
  },

  // Requirement 4.1, 4.2, 4.3
  editTask(id, title) {
    const trimmed = title.trim();
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;
    if (!trimmed) {
      // Discard edit, restore original (Requirement 4.3)
      this._editingId = null;
      this.render();
      return;
    }
    // Task 4.3: duplicate check excluding self (case-insensitive)
    const isDuplicate = this._tasks.some(
      t => t.id !== id && t.title.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      this._editingId = null;
      this._error = 'A task with that name already exists.';
      this.render();
      return;
    }
    task.title = trimmed;
    this._editingId = null;
    this._persist();
    this.render();
  },

  // Requirement 4.6
  deleteTask(id) {
    this._tasks = this._tasks.filter(t => t.id !== id);
    this._persist();
    this.render();
  },

  render() {
    this._container.innerHTML = `
      <div class="todo-add-row">
        <input class="todo-input" type="text" placeholder="New task…" aria-label="New task title" />
        <button class="todo-add-btn">Add</button>
      </div>
      <p class="todo-error" role="alert" aria-live="polite">${this._escHtml(this._error)}</p>
      <select class="todo-sort-select" aria-label="Sort tasks">
        <option value="added"${this._sortOrder === 'added' ? ' selected' : ''}>Order added</option>
        <option value="alpha-asc"${this._sortOrder === 'alpha-asc' ? ' selected' : ''}>A → Z</option>
        <option value="alpha-desc"${this._sortOrder === 'alpha-desc' ? ' selected' : ''}>Z → A</option>
      </select>
      <ul class="todo-list">
        ${this._getSortedTasks().map(task => this._renderTask(task)).join('')}
      </ul>
    `;

    // Wire add controls
    const input = this._container.querySelector('.todo-input');
    const addBtn = this._container.querySelector('.todo-add-btn');

    addBtn.addEventListener('click', () => {
      this.addTask(input.value);
      input.value = '';
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this.addTask(input.value);
        input.value = '';
      }
    });

    // Task 4.4: clear error on input change (without full re-render)
    input.addEventListener('input', () => {
      if (this._error) {
        this._error = '';
        const errorEl = this._container.querySelector('.todo-error');
        if (errorEl) errorEl.textContent = '';
      }
    });

    // Task 5.5: wire sort select change
    const sortSelect = this._container.querySelector('.todo-sort-select');
    sortSelect.addEventListener('change', () => {
      this._sortOrder = sortSelect.value;
      localStorage.setItem('dashboard_sort_order', this._sortOrder);
      this.render();
    });

    // Wire per-task controls
    this._tasks.forEach(task => {
      const li = this._container.querySelector(`[data-id="${task.id}"]`);
      if (!li) return;

      if (this._editingId === task.id) {
        // Inline edit mode
        const editInput = li.querySelector('.todo-edit-input');
        const saveBtn = li.querySelector('.todo-save-btn');
        const cancelBtn = li.querySelector('.todo-cancel-btn');

        editInput.focus();
        editInput.select();

        const save = () => this.editTask(task.id, editInput.value);
        const cancel = () => { this._editingId = null; this.render(); };

        saveBtn.addEventListener('click', save);
        cancelBtn.addEventListener('click', cancel);
        editInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') cancel();
        });
      } else {
        // Normal mode
        li.querySelector('.todo-toggle').addEventListener('click', () => this.toggleTask(task.id));
        li.querySelector('.todo-edit-btn').addEventListener('click', () => {
          this._editingId = task.id;
          this.render();
        });
        li.querySelector('.todo-delete-btn').addEventListener('click', () => this.deleteTask(task.id));
      }
    });
  },

  // Task 5.2: returns a sorted copy of _tasks based on _sortOrder
  _getSortedTasks() {
    const tasks = [...this._tasks];
    if (this._sortOrder === 'alpha-asc')
      return tasks.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    if (this._sortOrder === 'alpha-desc')
      return tasks.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
    return tasks; // 'added' — insertion order
  },

  _renderTask(task) {
    if (this._editingId === task.id) {
      return `
        <li class="todo-item todo-item--editing" data-id="${task.id}">
          <input class="todo-edit-input" type="text" value="${this._escHtml(task.title)}" aria-label="Edit task title" />
          <button class="todo-save-btn">Save</button>
          <button class="todo-cancel-btn">Cancel</button>
        </li>
      `;
    }
    const doneClass = task.done ? ' todo-item--done' : '';
    const titleHtml = task.done
      ? `<s class="todo-title">${this._escHtml(task.title)}</s>`
      : `<span class="todo-title">${this._escHtml(task.title)}</span>`;
    return `
      <li class="todo-item${doneClass}" data-id="${task.id}">
        <button class="todo-toggle" aria-label="${task.done ? 'Mark incomplete' : 'Mark complete'}">${task.done ? '✓' : '○'}</button>
        ${titleHtml}
        <button class="todo-edit-btn" aria-label="Edit task">✎</button>
        <button class="todo-delete-btn" aria-label="Delete task">✕</button>
      </li>
    `;
  },

  _escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
};


// ─── Quick Links Widget ──────────────────────────────────────────────────────

const linksWidget = {
  _container: null,
  _links: [], // Link[]

  init(containerEl) {
    this._container = containerEl;
    try {
      const stored = localStorage.getItem('dashboard_links');
      this._links = stored ? JSON.parse(stored) : [];
    } catch {
      this._links = [];
    }
    this.render();
  },

  _persist() {
    localStorage.setItem('dashboard_links', JSON.stringify(this._links));
  },

  // Requirements 7.2, 7.3
  addLink(label, url) {
    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();

    if (!trimmedLabel) {
      this._showError('Label cannot be empty.');
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      this._showError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }

    this._links.push({
      id: crypto.randomUUID(),
      label: trimmedLabel,
      url: trimmedUrl,
    });
    this._persist();
    this._showError('');
    this.render();
  },

  // Requirement 7.4
  deleteLink(id) {
    this._links = this._links.filter(l => l.id !== id);
    this._persist();
    this.render();
  },

  _showError(message) {
    const errorEl = this._container.querySelector('.links-error');
    if (errorEl) errorEl.textContent = message;
  },

  // Requirements 6.1, 6.2, 7.1
  render() {
    this._container.innerHTML = `
      <div class="links-add-row">
        <input class="links-label-input" type="text" placeholder="Label" aria-label="Link label" />
        <input class="links-url-input" type="url" placeholder="https://example.com" aria-label="Link URL" />
        <button class="links-add-btn">Add</button>
      </div>
      <p class="links-error" role="alert" aria-live="polite"></p>
      <ul class="links-list">
        ${this._links.map(link => this._renderLink(link)).join('')}
      </ul>
    `;

    const labelInput = this._container.querySelector('.links-label-input');
    const urlInput = this._container.querySelector('.links-url-input');
    const addBtn = this._container.querySelector('.links-add-btn');

    const submit = () => {
      this.addLink(labelInput.value, urlInput.value);
      // Only clear inputs on success (no error message means success)
      const errorEl = this._container.querySelector('.links-error');
      if (errorEl && !errorEl.textContent) {
        labelInput.value = '';
        urlInput.value = '';
      }
    };

    addBtn.addEventListener('click', submit);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

    // Wire delete buttons
    this._links.forEach(link => {
      const li = this._container.querySelector(`[data-id="${link.id}"]`);
      if (!li) return;
      li.querySelector('.links-delete-btn').addEventListener('click', () => this.deleteLink(link.id));
    });
  },

  _renderLink(link) {
    return `
      <li class="links-item" data-id="${link.id}">
        <a class="links-anchor" href="${this._escHtml(link.url)}" target="_blank" rel="noopener noreferrer">${this._escHtml(link.label)}</a>
        <button class="links-delete-btn" aria-label="Delete link">✕</button>
      </li>
    `;
  },

  _escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
};

// ─── Bootstrap ───────────────────────────────────────────────────────────────

// Apply theme synchronously before DOMContentLoaded to avoid flash (Requirement 1.6)
themeManager.init();

document.addEventListener('DOMContentLoaded', () => {
  greetingWidget.init(document.getElementById('greeting-widget'));
  timerWidget.init(document.getElementById('timer-widget'));
  todoWidget.init(document.getElementById('todo-widget'));
  linksWidget.init(document.getElementById('links-widget'));
});
