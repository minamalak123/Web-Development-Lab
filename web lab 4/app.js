
"use strict";

class TodoApp {
  constructor() {
    this.todos = [
      { id: 1, text: 'See Lecture', completed: false },
      { id: 2, text: 'Solve assignment', completed: false }
    ];

    this.nextId = 3;
    this.filter = 'all';

    this.form = document.querySelector('#todo-form');
    this.input = document.querySelector('#todo-input');
    this.list = document.querySelector('#todo-list');
    this.count = document.querySelector('#items-left');

    this.form.addEventListener('submit', event => {
      event.preventDefault();

      const text = this.input.value.trim();
      if (!text) return;

      this.todos.push({
        id: this.nextId++,
        text,
        completed: false
      });

      this.input.value = '';
      this.render();
      this.input.focus();
    });

    document.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        this.filter = button.dataset.filter;
        this.render();
      });
    });

    document.querySelector('#clear-completed')
      .addEventListener('click', () => {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.render();
      });

    document.querySelector('#clear-all')
      .addEventListener('click', () => {
        this.todos = [];
        this.render();
      });

    this.render();
  }

  editTodo(todo, label) {
    const editor = document.createElement('input');
    editor.className = 'edit-input';
    editor.value = todo.text;

    label.replaceWith(editor);
    editor.focus();
    editor.select();

    let finished = false;

    const finish = save => {
      if (finished) return;
      finished = true;

      if (save && editor.value.trim()) {
        todo.text = editor.value.trim();
      }

      this.render();
    };

    editor.addEventListener('keydown', event => {
      if (event.key === 'Enter') finish(true);
      if (event.key === 'Escape') finish(false);
    });

    editor.addEventListener('blur', () => finish(true));
  }

  render() {
    this.list.replaceChildren();

    const visible = this.todos.filter(todo =>
      this.filter === 'all' ||
      (this.filter === 'completed'
        ? todo.completed
        : !todo.completed)
    );

    if (visible.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'No tasks to show';
      this.list.append(empty);
    }

    visible.forEach(todo => {
      const item = document.createElement('li');

      item.className =
        `todo-item${todo.completed ? ' completed' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-check';
      checkbox.checked = todo.completed;

      checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        this.render();
      });

      const label = document.createElement('span');
      label.className = 'todo-text';
      label.textContent = todo.text;
      label.title = 'Double-click to edit';

      label.addEventListener('dblclick', () => {
        this.editTodo(todo, label);
      });

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-btn';
      remove.textContent = '×';
      remove.title = 'Delete task';

      remove.addEventListener('click', () => {
        this.todos = this.todos.filter(
          item => item.id !== todo.id
        );
        this.render();
      });

      item.append(checkbox, label, remove);
      this.list.append(item);
    });

    const left = this.todos.filter(
      todo => !todo.completed
    ).length;

    this.count.textContent =
      `${left} item${left === 1 ? '' : 's'} left`;

    document.querySelectorAll('[data-filter]').forEach(button => {
      const selected = button.dataset.filter === this.filter;

      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
}

new TodoApp();
