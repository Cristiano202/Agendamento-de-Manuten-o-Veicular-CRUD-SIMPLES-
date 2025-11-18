async function fetchItems() {
  const res = await fetch('/api/items');
  return res.json();
}

async function fetchItems() {
  const res = await fetch('/api/items');
  return res.json();
}

function updateStats(items) {
  const total = items.length;
  const agendados = items.filter(i => i.status === 'agendado').length;
  const concluidos = items.filter(i => i.status === 'concluído').length;
  document.getElementById('total').textContent = `Total: ${total}`;
  document.getElementById('agendados').textContent = `Agendados: ${agendados}`;
  document.getElementById('concluidos').textContent = `Concluídos: ${concluidos}`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function renderCard(item) {
  const div = document.createElement('div');
  div.className = `card ${item.status}`;
  const statusLabel = item.status === 'agendado' ? '📅' : '✅';
  div.innerHTML = `
    <div class="card-content">
      <h3>${statusLabel} ${item.veiculo}</h3>
      <p><strong>Serviço:</strong> ${item.tipo}</p>
      <p><strong>Data:</strong> ${formatDate(item.data)}</p>
      <p><strong>Quilometragem:</strong> ${item.quilometragem}</p>
      <span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
    </div>
    <div class="actions">
      <button data-id="${item.id}" class="toggle">Marcar como ${item.status === 'agendado' ? 'Concluído' : 'Agendado'}</button>
      <button data-id="${item.id}" class="edit">Editar</button>
      <button data-id="${item.id}" class="del">Excluir</button>
    </div>
  `;
  return div;
}

async function load() {
  const cards = document.getElementById('cards');
  cards.innerHTML = '<p style="text-align:center;color:white;">Carregando...</p>';
  const items = await fetchItems();
  cards.innerHTML = '';
  updateStats(items);
  if (!items.length) cards.innerHTML = '<p style="text-align:center;color:white;">Nenhum agendamento. Agende um serviço!</p>';
  items.forEach(i => cards.appendChild(renderCard(i)));
}

async function addItem(veiculo, tipo, data, quilometragem) {
  await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ veiculo, tipo, data, quilometragem, status: 'agendado' })
  });
  await load();
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'agendado' ? 'concluído' : 'agendado';
  await fetch('/api/items/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  await load();
}

async function deleteItem(id) {
  await fetch('/api/items/' + id, { method: 'DELETE' });
  await load();
}

async function editItem(id) {
  const items = await fetchItems();
  const item = items.find(i => String(i.id) === String(id));
  if (!item) return;

  const veiculo = prompt('Veículo:', item.veiculo);
  if (!veiculo) return;
  
  const tipo = prompt('Tipo de serviço:', item.tipo);
  if (!tipo) return;

  const data = prompt('Data (YYYY-MM-DD):', item.data);
  if (!data) return;

  const quilometragem = prompt('Quilometragem:', item.quilometragem);
  if (!quilometragem) return;

  await fetch('/api/items/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ veiculo, tipo, data, quilometragem })
  });
  await load();
}

// Events
document.addEventListener('DOMContentLoaded', () => {
  load();
  const btn = document.getElementById('add');
  btn.addEventListener('click', async () => {
    const veiculo = document.getElementById('veiculo').value.trim();
    const tipo = document.getElementById('tipo').value.trim();
    const data = document.getElementById('data').value.trim();
    const quilometragem = document.getElementById('quilometragem').value.trim();
    
    if (!veiculo || !tipo || !data || !quilometragem) {
      alert('Todos os campos são obrigatórios!');
      return;
    }
    
    await addItem(veiculo, tipo, data, quilometragem);
    document.getElementById('veiculo').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('data').value = '';
    document.getElementById('quilometragem').value = '';
  });

  document.getElementById('cards').addEventListener('click', (e) => {
    if (e.target.classList.contains('del')) {
      const id = e.target.dataset.id;
      if (confirm('Excluir este agendamento?')) deleteItem(id);
    }
    if (e.target.classList.contains('edit')) {
      const id = e.target.dataset.id;
      editItem(id);
    }
    if (e.target.classList.contains('toggle')) {
      const id = e.target.dataset.id;
      const status = e.target.parentElement.parentElement.className.split(' ')[1];
      toggleStatus(id, status);
    }
  });
});
