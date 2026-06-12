// Select DOM elements needed for app behavior
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const errorMessage = document.getElementById('error-message');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const emptyState = document.getElementById('empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');

// Track current tasks and filter mode
let tasks = [];
let currentFilter = 'all';
let editTaskId = null;

// Read saved tasks from localStorage when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = localStorage.getItem('todoTasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTasks();
});

// Handle new task form submission
taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const trimmedText = taskInput.value.trim();

  if (!trimmedText) {
    displayError('Please enter a task before adding.');
    return;
  }

  if (editTaskId) {
    updateTask(editTaskId, trimmedText);
  } else {
    addTask(trimmedText);
  }

  taskInput.value = '';
  taskInput.focus();
  editTaskId = null;
  taskForm.querySelector('button').textContent = 'Add Task';
  displayError('');
});

// Event delegation for task list actions and task completion
taskList.addEventListener('click', event => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (checkbox) {
    const taskId = checkbox.closest('.task-item')?.dataset.id;
    if (!taskId) return;
    toggleTaskCompletion(taskId, checkbox.checked);
    return;
  }

  const button = event.target.closest('button');
  if (!button) return;

  const taskId = button.closest('.task-item')?.dataset.id;
  if (!taskId) return;

  if (button.matches('.delete')) {
    removeTask(taskId);
  }

  if (button.matches('.edit')) {
    beginEditTask(taskId);
  }
});

// Filter button handling
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

// Add a new task object and refresh the UI
function addTask(text) {
  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
  };
  tasks.unshift(newTask);
  persistTasks();
  renderTasks();
}

// Update an existing task text
function updateTask(id, text) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, text } : task
  );
  persistTasks();
  renderTasks();
}

// Delete a task by id
function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  persistTasks();
  renderTasks();
}

// Start editing a task by setting the input value and state
function beginEditTask(id) {
  const taskToEdit = tasks.find(task => task.id === id);
  if (!taskToEdit) return;

  taskInput.value = taskToEdit.text;
  taskInput.focus();
  editTaskId = id;
  taskForm.querySelector('button').textContent = 'Save';
}

// Toggle the completed state of a task
function toggleTaskCompletion(id, isCompleted) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: isCompleted } : task
  );
  persistTasks();
  renderTasks();
}

// Save the task array to localStorage
function persistTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Return tasks filtered by the current filter mode
function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

// Render the tasks list and update the task count
function renderTasks() {
  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = '';

  if (visibleTasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  visibleTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item${task.completed ? ' completed' : ''}`;
    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
      <label class="task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
      </label>
      <p class="task-text">${escapeHtml(task.text)}</p>
      <div class="task-actions">
        <button type="button" class="action-btn edit" aria-label="Edit task">Edit</button>
        <button type="button" class="action-btn delete" aria-label="Delete task">Delete</button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });

  updateTaskCount();
}

// Update the displayed count of active tasks
function updateTaskCount() {
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = activeCount;
}

// Show an inline error message to the user
function displayError(message) {
  errorMessage.textContent = message;
}

// Escape HTML to prevent injection when rendering text content
function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}