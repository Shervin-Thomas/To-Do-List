import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

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

  return (
    <div className="app-container">
      <div className="todo-container">
        <h1 className="title">To-Do List</h1>
        <div className="input-section">
          <input
            type="text"
            className="task-input"
            placeholder="Enter a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="add-button" onClick={addTask}>
            Insert
          </button>
        </div>
        <div className="task-list">
          {tasks.filter(task => !task.completed).map((task) => (
            <div key={task._id} className="task-item">
              <span>{task.text}</span>
              <button onClick={() => toggleTask(task)} className="check-button">✔</button>
              <button onClick={() => removeTask(task._id)} className="delete-button">✘</button>
            </div>
          ))}
        </div>
      </div>

      {tasks.some(task => task.completed) && (
        <div className="completed-container">
          <h2 className="title">Completed Tasks</h2>
          <div className="task-list">
            {tasks.filter(task => task.completed).map((task) => (
              <div key={task._id} className="task-item completed-item">
                <span className="completed">{task.text}</span>
                <button onClick={() => removeTask(task._id)} className="delete-button">✘</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
