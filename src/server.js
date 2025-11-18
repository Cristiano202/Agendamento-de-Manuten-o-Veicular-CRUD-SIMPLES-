const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.get('/api/items', async (req, res) => {
  const items = await db.getAll();
  res.json(items);
});

app.get('/api/items/:id', async (req, res) => {
  const item = await db.getById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

app.post('/api/items', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const newItem = await db.create({ title, description });
  res.status(201).json(newItem);
});

app.put('/api/items/:id', async (req, res) => {
  const updated = await db.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

app.delete('/api/items/:id', async (req, res) => {
  const ok = await db.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
});

// Serve index.html for all other routes (SPA friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
