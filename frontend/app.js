const apiBase = '/api/tasks';

async function fetchTasks() {
  const res = await fetch(apiBase);
  const tasks = await res.json();
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.title} [${t.completed ? 'done' : 'pending'}]`;
    li.onclick = () => toggleTask(t);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('new-task');
  const title = input.value.trim();
  if (!title) return;
  await fetch(apiBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  input.value = '';
  fetchTasks();
}

async function toggleTask(task) {
  await fetch(`${apiBase}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: task.title, completed: !task.completed })
  });
  fetchTasks();
}

fetchTasks();