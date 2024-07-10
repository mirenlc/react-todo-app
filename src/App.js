import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (title) => {
    try {
      const response = await axios.post('/api/todos', { title });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await axios.put(`/api/todos/${id}`, { completed: !todo.completed });
      setTodos(todos.map(t => (t.id === id ? response.data : t)));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div>
        {todos.map(todo => (
          <div key={todo.id} className="todo">
            <p className={todo.completed ? 'completed' : ''}><strong>ID:</strong> {todo.id}</p>
            <p className={todo.completed ? 'completed' : ''}><strong>Title:</strong> {todo.title}</p>
            <p className={todo.completed ? 'completed' : ''}><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
            <button onClick={() => toggleComplete(todo.id)}>
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
      <h2>Add To-Do</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
        />
        <button type="submit">Add To-Do</button>
      </form>
    </div>
  );
}

export default App;