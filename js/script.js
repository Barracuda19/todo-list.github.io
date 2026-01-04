const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty");

// Init
document.addEventListener("DOMContentLoaded", renderTodos);

// Add task
form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const todos = getTodos();
  todos.push({ text, completed: false });
  localStorage.setItem("todos", JSON.stringify(todos));
  input.value = "";
  renderTodos();
});

// Create li
function createTodoElement(todo) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = todo.text;
  if (todo.completed) span.classList.add("done");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";

  li.appendChild(span);
  li.appendChild(deleteBtn);
  list.appendChild(li);

  // Toggle done
span.addEventListener("click", () => {
  const todos = getTodos();
  const t = todos.find(t => t.text === todo.text);
  if (t) t.completed = !t.completed;
  localStorage.setItem("todos", JSON.stringify(todos));

  span.classList.toggle("done");

  // Animatie subtila
  span.style.transition = "all 0.3s ease";
  span.style.transform = "scale(1.05)";
  setTimeout(() => {
    span.style.transform = "scale(1)";
  }, 150);
});


  // Edit
  span.addEventListener("dblclick", () => {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = todo.text;
    li.replaceChild(inputEdit, span);
    inputEdit.focus();

    function saveEdit() {
      const newText = inputEdit.value.trim();
      if (!newText) return;
      const todos = getTodos();
      const t = todos.find(t => t.text === todo.text);
      if (t) t.text = newText;
      localStorage.setItem("todos", JSON.stringify(todos));
      li.replaceChild(span, inputEdit);
      span.textContent = newText;
      renderTodos();
    }

    inputEdit.addEventListener("blur", saveEdit);
    inputEdit.addEventListener("keydown", e => {
      if (e.key === "Enter") saveEdit();
      if (e.key === "Escape") li.replaceChild(span, inputEdit);
    });
  });

  // Delete
  deleteBtn.addEventListener("click", () => {
    const todos = getTodos().filter(t => t.text !== todo.text);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  });
}

// Helpers
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

// Render
function renderTodos() {
  list.innerHTML = "";
  const todos = getTodos();
  todos.forEach(todo => createTodoElement(todo));
  emptyState.style.display = todos.length === 0 ? "block" : "none";
}

// Filters
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll("#todo-list li").forEach(li => {
      const done = li.querySelector("span").classList.contains("done");
      if (filter === "all") li.style.display = "flex";
      if (filter === "active") li.style.display = done ? "none" : "flex";
      if (filter === "completed") li.style.display = done ? "flex" : "none";
    });
  });
});
