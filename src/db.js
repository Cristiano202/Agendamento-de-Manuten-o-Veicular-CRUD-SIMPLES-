const fs = require('fs').promises;
const path = require('path');
const dbPath = path.join(__dirname, '..', 'data', 'items.json');

async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeDB(items) {
  await fs.writeFile(dbPath, JSON.stringify(items, null, 2), 'utf8');
}

async function getAll() {
  return await readDB();
}

async function getById(id) {
  const items = await readDB();
  return items.find(i => i.id === id);
}

async function create(item) {
  const items = await readDB();
  const id = Date.now().toString();
  const newItem = { id, ...item };
  items.push(newItem);
  await writeDB(items);
  return newItem;
}

async function update(id, data) {
  const items = await readDB();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data };
  await writeDB(items);
  return items[index];
}

async function remove(id) {
  const items = await readDB();
  const filtered = items.filter(i => i.id !== id);
  if (filtered.length === items.length) return false;
  await writeDB(filtered);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
