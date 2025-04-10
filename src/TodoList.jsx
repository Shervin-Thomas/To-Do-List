import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");

  // Fetch tasks from MongoDB on component mount
  useEffect(() => {
    axios.get("https://todo-list-backend-fyxe.onrender.com/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add task to MongoDB
  const addTask = () => {
    if (input.trim()) {
      const newTask = { text: input, completed: false };
      axios.post("https://todo-list-backend-fyxe.onrender.com/api/tasks", newTask)
        .then((res) => setTasks([...tasks, res.data]))
        .catch((err) => console.error("Error adding task:", err));

      setInput("");
    }
  };

  // Toggle task completion in MongoDB
  const toggleTask = (task) => {
    axios.put(`https://todo-list-backend-fyxe.onrender.com/api/tasks/${task._id}`, {
      completed: !task.completed
    })
    .then(() => {
      setTasks(tasks.map((t) => t._id === task._id ? { ...t, completed: !t.completed } : t));
    })
    .catch((err) => console.error("Error updating task:", err));
  };

  // Remove task from MongoDB
  const removeTask = (taskId) => {
    axios.delete(`https://todo-list-backend-fyxe.onrender.com/api/tasks/${taskId}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== taskId)))
      .catch((err) => console.error("Error deleting task:", err));
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setEditInput(task.text);
  };

  // Save edited task
  const saveEdit = () => {
    if (editInput.trim() && editingTask) {
      axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        text: editInput,
        completed: editingTask.completed
      })
      .then(() => {
        setTasks(tasks.map((t) => 
          t._id === editingTask._id ? { ...t, text: editInput } : t
        ));
        setEditingTask(null);
        setEditInput("");
      })
      .catch((err) => console.error("Error updating task:", err));
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditInput("");
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Tasks</h1>
        <p className="subtitle">What's on your mind today?</p>
      </div>

      <div className="todo-container">
        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              className="task-input"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="add-button" onClick={addTask}>
              <span>+</span>
            </button>
          </div>
        </div>

        <div className="task-list">
          {tasks.filter(task => !task.completed).map((task) => (
            <div key={task._id} className="task-item">
              {editingTask?._id === task._id ? (
                <>
                  <input
                    type="text"
                    className="edit-input"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  />
                  <div className="button-group">
                    <button onClick={saveEdit} className="save-button">Save</button>
                    <button onClick={cancelEdit} className="cancel-button">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-content">
                    <button 
                      onClick={() => toggleTask(task)} 
                      className={`checkbox ${task.completed ? 'checked' : ''}`}
                    >
                      {task.completed && '✓'}
                    </button>
                    <span className="task-text">{task.text}</span>
                  </div>
                  <div className="button-group">
                    <button onClick={() => startEditing(task)} className="edit-button" title="Edit task">
                      <span>✎</span>
                    </button>
                    <button onClick={() => removeTask(task._id)} className="delete-button" title="Delete task">
                      <span>×</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {tasks.some(task => task.completed) && (
        <div className="completed-container">
          <h2 className="section-title">Completed</h2>
          <div className="task-list">
            {tasks.filter(task => task.completed).map((task) => (
              <div key={task._id} className="task-item completed-item">
                {editingTask?._id === task._id ? (
                  <>
                    <input
                      type="text"
                      className="edit-input"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <div className="button-group">
                      <button onClick={saveEdit} className="save-button">Save</button>
                      <button onClick={cancelEdit} className="cancel-button">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="task-content">
                      <button 
                        onClick={() => toggleTask(task)} 
                        className="checkbox checked"
                      >
                        ✓
                      </button>
                      <span className="task-text completed">{task.text}</span>
                    </div>
                    <div className="button-group">
                      <button onClick={() => startEditing(task)} className="edit-button" title="Edit task">
                        <span>✎</span>
                      </button>
                      <button onClick={() => removeTask(task._id)} className="delete-button" title="Delete task">
                        <span>×</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
