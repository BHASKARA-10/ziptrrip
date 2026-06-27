require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'todos.json');

const getLocalDateString = (d = new Date()) => {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// Default seeded data
const defaultTodos = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Group discussion for the new product launch and roadmap review.',
    time: '10:00 AM',
    date: '2024-10-14',
    progress: 48,
    status: 'IN PROGRESS',
    priority: 'Medium',
    category: 'Work',
    createdAt: '2024-10-10T10:00:00.000Z',
    deadline: '2024-10-20',
    subTasks: []
  },
  {
    id: '2',
    title: 'UI Design',
    description: 'Create a high-fidelity homepage prototype for the Olakart App.',
    time: '11:00 AM',
    date: '2024-10-14',
    progress: 20,
    status: 'TO-DO',
    priority: 'High',
    category: 'Work',
    createdAt: '2024-10-11T11:00:00.000Z',
    deadline: '2024-10-18',
    subTasks: []
  },
  {
    id: '3',
    title: 'Wireframing TaskFlow App',
    description: 'Make some ideation from sketches and wireframes for the core navigation system.',
    time: '12:00 PM',
    date: '2024-10-14',
    progress: 0,
    status: 'TO-DO',
    priority: 'High',
    category: 'Work',
    createdAt: '2024-10-12T12:00:00.000Z',
    deadline: '2024-10-21',
    subTasks: []
  },
  {
    id: '4',
    title: 'UI Design System',
    description: 'Define tokens for typography, colors, and shadows for the enterprise library.',
    time: '1:30 PM',
    date: '2024-10-14',
    progress: 60,
    status: 'IN PROGRESS',
    priority: 'Medium',
    category: 'Work',
    createdAt: '2024-10-08T09:00:00.000Z',
    deadline: '2024-10-31',
    subTasks: [
      { id: 'st1', title: 'Audit existing Figma library components', completed: true },
      { id: 'st2', title: 'Define new color palette using HCT color space', completed: true },
      { id: 'st3', title: 'Update button component interactions', completed: false },
      { id: 'st4', title: 'Publish updated documentation', completed: false }
    ]
  },
  {
    id: '5',
    title: 'Daily Scrums',
    description: 'Updates on progress and blockers with the engineering team.',
    time: '9:00 AM',
    date: '2024-10-14',
    progress: 100,
    status: 'DONE',
    priority: 'Low',
    category: 'Work',
    createdAt: '2024-10-14T09:00:00.000Z',
    deadline: '2024-10-14',
    subTasks: []
  }
];

let todos = [];
if (fs.existsSync(dataFile)) {
  try {
    todos = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    console.error('Error reading todos.json, using defaults:', err);
    todos = defaultTodos;
  }
} else {
  todos = defaultTodos;
  fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
}

const saveTodos = () => {
  fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
};

let nextId = todos.length > 0 ? Math.max(...todos.map(t => parseInt(t.id) || 0)) + 1 : 6;

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// CREATE todo
app.post('/api/todos', (req, res) => {
  const todoData = req.body;
  const newTodo = {
    id: String(nextId++),
    title: todoData.title || 'Untitled Task',
    description: todoData.description || '',
    time: todoData.time || '',
    date: todoData.date || getLocalDateString(),
    progress: 0,
    status: todoData.status || 'TO-DO',
    priority: todoData.priority || 'Medium',
    category: todoData.category || 'Personal',
    createdAt: new Date().toISOString(),
    deadline: todoData.deadline || '',
    subTasks: todoData.subTasks || []
  };
  todos.push(newTodo);
  saveTodos();
  res.status(201).json(newTodo);
});

// UPDATE todo
app.put('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos[index] = { ...todos[index], ...req.body };
  saveTodos();
  res.json(todos[index]);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  const deleted = todos.splice(index, 1);
  saveTodos();
  res.json({ message: 'Todo deleted', todo: deleted[0] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
