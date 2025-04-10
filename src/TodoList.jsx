import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://todo-list-backend-fyxe.onrender.com";
// const API_URL = "http://localhost:5000";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");

  // Fetch tasks from MongoDB on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add task to MongoDB
  const addTask = async () => {
    if (input.trim()) {
      try {
        const response = await axios.post(`${API_URL}/api/tasks`, {
          title: input,
          description: input,
          completed: false
        });
        setTasks([...tasks, response.data]);
        setInput("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Toggle task completion in MongoDB
  const toggleTask = async (task) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        completed: !task.completed
      });
      setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Remove task from MongoDB
  const removeTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setEditInput(task.title);
  };

  // Save edited task
  const saveEdit = async () => {
    if (editInput.trim() && editingTask) {
      try {
        const response = await axios.put(`${API_URL}/api/tasks/${editingTask._id}`, {
          title: editInput,
          description: editInput,
          completed: editingTask.completed
        });
        setTasks(tasks.map((t) => (t._id === editingTask._id ? response.data : t)));
        setEditingTask(null);
        setEditInput("");
      } catch (error) {
        console.error("Error updating task:", error);
      }
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
      if (editingTask) {
        saveEdit();
      } else {
        addTask();
      }
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
          {tasks
            .filter(task => !task.completed)
            .map((task) => (
              <div key={task._id} className="task-item">
                {editingTask?._id === task._id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      className="edit-input"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      autoFocus
                    />
                    <div className="button-group">
                      <button onClick={saveEdit} className="save-button">Save</button>
                      <button onClick={cancelEdit} className="cancel-button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <button 
                        onClick={() => toggleTask(task)} 
                        className={`checkbox ${task.completed ? 'checked' : ''}`}
                      >
                        {task.completed && '✓'}
                      </button>
                      <span className="task-text">{task.title}</span>
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
            {tasks
              .filter(task => task.completed)
              .map((task) => (
                <div key={task._id} className="task-item completed-item">
                  <div className="task-content">
                    <button 
                      onClick={() => toggleTask(task)} 
                      className="checkbox checked"
                    >
                      ✓
                    </button>
                    <span className="task-text completed">{task.title}</span>
                  </div>
                  <div className="button-group">
                    <button onClick={() => removeTask(task._id)} className="delete-button" title="Delete task">
                      <span>×</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
