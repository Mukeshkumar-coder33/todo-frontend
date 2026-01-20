import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function Todo() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [backendStarting, setBackendStarting] = useState(true);
  const [backendAlertShown, setBackendAlertShown] = useState(false);

  const apiUrl = "https://todo-backend-gi24.onrender.com";
  const checkBackend = async () => {
    try {
      const res = await fetch(apiUrl + "/");
      const text = await res.text();

      if (text === "Backend is awake!" && !backendAlertShown) {
        setBackendStarting(false);         
        alert("✅ Backend is awake");
        setBackendAlertShown(true);         
        getItems();                        
      }
    } catch (err) {
      setBackendStarting(true);
    }
  };
  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 3000);
    return () => clearInterval(interval);
  }, [backendAlertShown]);

  const handleSubmit = () => {
    setError("");

    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Failed to add todo item");
          setTimeout(() => setError(""), 4000);
        });
    } else {
      setError("Title and Description cannot be empty");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      const oldTodo = todos.find(item => item._id === editId);
      if (
        oldTodo.title === editTitle &&
        oldTodo.description === editDescription
      ) {
        setError("No changes made");
        setTimeout(() => setError(""), 3000);
        return;
      }

      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          const updatedTodos = todos.map((item) =>
            item._id === editId
              ? { ...item, title: editTitle, description: editDescription }
              : item
          );
          setTodos(updatedTodos);
          setEditId(-1);
          setMessage("Item updated successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Failed to update item"));
    } else {
      setError("Update fields cannot be empty");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleEditCancel = () => setEditId(-1);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this item?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
        .then(() => setTodos(todos.filter(item => item._id !== id)));
    }
  };

  return (
    <>
      <div className="app-wrapper">
        <div className="content">

          <div className="row p-3 bg-success text-light">
            <h1 className="text-center">Task Overview Dashboard</h1>
          </div>
          {backendStarting && (
            <p className="text-warning text-center mt-2">
              ⏳ Backend is starting... please wait
            </p>
          )}

          <div className="row">
            <h3>Add Items</h3>
            {message && <p className="text-success">{message}</p>}

            <div className="form-group d-flex gap-2">
              <input
                className="form-control"
                placeholder="Enter Title here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="form-control"
                placeholder="Enter Description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button className="btn btn-dark" onClick={handleSubmit}>
                Submit
              </button>
            </div>

            {error && <p className="text-danger">{error}</p>}
          </div>

          <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
              <ul className="list-group">
                {todos.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item bg-info d-flex justify-content-between my-2"
                  >
                    <div>
                      {editId !== item._id ? (
                        <>
                          <strong>{item.title}</strong>
                          <div>{item.description}</div>
                        </>
                      ) : (
                        <div className="d-flex gap-2">
                          <input
                            className="form-control"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <input
                            className="form-control"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      {editId !== item._id ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning"
                          onClick={handleUpdate}
                        >
                          Update
                        </button>
                      )}

                      {editId !== item._id ? (
                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}
