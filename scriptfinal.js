document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const themeToggle = document.getElementById('theme-toggle');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Load theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Event Listeners
    todoForm.addEventListener('submit', addTodo);
    themeToggle.addEventListener('change', toggleTheme);
    filterBtns.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

    function addTodo(e) {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText !== '') {
            const todo = {
                id: Date.now(),
                text: taskText,
                completed: false,
            };
            todos.push(todo);
            saveAndRender();
            todoInput.value = '';
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }

    function toggleCompleted(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }
    
    function editTodo(id, newText) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, text: newText } : todo
        );
        saveAndRender();
    }

    function setFilter(filter) {
        currentFilter = filter;
        document.querySelector('.filter-btn.active').classList.remove('active');
        document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
        renderTodos();
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';
        let filteredTodos = todos;

        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleCompleted(todo.id));

            const span = document.createElement('span');
            span.textContent = todo.text;
            span.addEventListener('click', () => {
                const newText = prompt('Edit your task:', span.textContent);
                if (newText !== null && newText.trim() !== '') {
                    editTodo(todo.id, newText.trim());
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    // Initial render
    renderTodos();
});