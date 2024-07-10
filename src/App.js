import React, { useState, useEffect } from 'react';
import { getGitHubAuthUrl, getAccessToken } from './oauth';
import { getIssues, createIssue } from './api';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [issues, setIssues] = useState([]);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && !token) {
      fetchAccessToken(code);
    }
    // fetchTodos();
  }, []);

  useEffect(() => {
    if (token) {
      fetchIssues();
    }
  }, [token]);

  const fetchAccessToken = async (code) => {
    const accessToken = await getAccessToken(code);
    setToken(accessToken);
    window.history.pushState({}, '', '/'); // Clean up url
  };

  const fetchIssues = async () => {
    const data = await getIssues(token, 'flyingoctopus', 'vfs-react-todo-app');
    setIssues(data);
  }

  const handleLogin = () => {
    window.location.href = getGitHubAuthUrl();
  };

  const handleAddTodo = async () => {
    if (newTodo) {
      const issue = await createIssue(token, 'flyingoctopus', 'vfs-react-todo-app');
      setIssues([...issues, issue]);
      setNewTodo('');
    }
  };

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
      {!token ? (
        <button onClick={handleLogin}>Login with Github</button>
      ) : (
        <div>
        <h1>TODOs</h1>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>{issue.title}</li>
          ))}
        </ul>
        <input
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="New TODO"
        />
        <button onClick={handleAddTodo}>Add TODO</button>
        </div>
      )}
      </div>
      );
    };

export default App;