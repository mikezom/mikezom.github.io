fetch('lib/todo.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('todo-list');
    data.forEach(item => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.checked;
      checkbox.disabled = true;  // prevent editing
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + item.label));
      li.appendChild(label);
      list.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Failed to load todo list:", err);
  });
