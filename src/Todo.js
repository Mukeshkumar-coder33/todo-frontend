const apiUrl = "https://todo-backend-gi24.onrender.com"; // deployed backend

// Edit check
if (oldTodo.title === editTitle && oldTodo.description === editDescription) {
  setError("No changes made");
  setTimeout(() => setError(""), 3000);
  return;
}

// Update local state after edit
const updatedTodos = todos.map((item) => {
  if (item._id === editId) {
    return { ...item, title: editTitle, description: editDescription };
  }
  return item;
});
setTodos(updatedTodos);
