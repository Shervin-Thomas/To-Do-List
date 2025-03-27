import React, { useState } from "react";
import "./App.css";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTask = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const removeCompletedTask = (index) => {
    setTasks(tasks.filter((task, i) => !(task.completed && i === index)));
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
          {tasks.filter(task => !task.completed).map((task, index) => (
            <div key={index} className="task-item">
              <span>{task.text}</span>
              <button onClick={() => toggleTask(index)} className="check-button">
                ✔
              </button>
              <button onClick={() => removeTask(index)} className="delete-button">
                ✘
              </button>
            </div>
          ))}
        </div>
      </div>
      {tasks.some(task => task.completed) && (
        <div className="completed-container">
          <h2 className="title">Completed Tasks</h2>
          <div className="task-list">
            {tasks.filter(task => task.completed).map((task, index) => (
              <div key={index} className="task-item completed-item">
                <span className="completed">{task.text}</span>
                <button onClick={() => removeCompletedTask(index)} className="delete-button">
                    ✘
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
