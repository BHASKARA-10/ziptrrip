require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (Only if config is provided)
let db;
try {
  // To make it run locally without a real service account right away, we allow it to start even if it fails
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase Admin Initialized.");
  } else {
    console.warn("WARNING: Firebase service account path not provided in .env. Using mock database.");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// In-memory mock DB if Firebase is not configured
let mockTodos = [];

// CRUD Routes for Todos

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    if (db) {
      const snapshot = await db.collection('todos').get();
      const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(todos);
    } else {
      res.json(mockTodos);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db) {
      const doc = await db.collection('todos').doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json({ id: doc.id, ...doc.data() });
    } else {
      const todo = mockTodos.find(t => t.id === id);
      if (todo) res.json(todo);
      else res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const todoData = req.body;
    todoData.createdAt = new Date().toISOString();
    
    if (db) {
      const docRef = await db.collection('todos').add(todoData);
      res.status(201).json({ id: docRef.id, ...todoData });
    } else {
      const newTodo = { id: Date.now().toString(), ...todoData };
      mockTodos.push(newTodo);
      res.status(201).json(newTodo);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (db) {
      await db.collection('todos').doc(id).update(updateData);
      res.json({ id, ...updateData });
    } else {
      const index = mockTodos.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTodos[index] = { ...mockTodos[index], ...updateData };
        res.json(mockTodos[index]);
      } else {
        res.status(404).json({ error: 'Todo not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (db) {
      await db.collection('todos').doc(id).delete();
      res.json({ message: 'Todo deleted successfully' });
    } else {
      mockTodos = mockTodos.filter(t => t.id !== id);
      res.json({ message: 'Todo deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Backend server running on port \${PORT}\`);
});
