# Cartões CRC - Agendamento de Manutenção Veicular

Análise de Classes, Responsabilidades e Colaborações do projeto de agendamento de tarefas para veículos automáticos.

---

## 1️⃣ Cartão CRC: DatabaseManager (src/db.js)

```
┌─────────────────────────────────────────────────────────────────┐
│ CLASSE: DatabaseManager                                         │
├─────────────────────────────────────────────────────────────────┤
│ RESPONSABILIDADES:                                              │
│ • Ler dados do arquivo items.json                               │
│ • Escrever dados persistidos no arquivo                         │
│ • Criar novos agendamentos com ID único                         │
│ • Atualizar agendamentos existentes                             │
│ • Remover agendamentos do armazenamento                         │
│ • Buscar um agendamento específico por ID                       │
│ • Buscar todos os agendamentos                                  │
├─────────────────────────────────────────────────────────────────┤
│ COLABORAÇÕES:                                                   │
│ • Server (recebe requisições HTTP)                              │
│ • FileSystem (leitura/escrita de dados)                         │
│ • JSON (serialização/desserialização)                           │
└─────────────────────────────────────────────────────────────────┘

MÉTODOS:
• readDB()          → Lê JSON do arquivo
• writeDB(items)    → Persiste JSON atualizado
• getAll()          → Retorna lista completa
• getById(id)       → Busca agendamento específico
• create(item)      → Cria novo com ID gerado
• update(id, data)  → Atualiza campos
• remove(id)        → Deleta agendamento
```

---

## 2️⃣ Cartão CRC: APIServer (src/server.js)

```
┌─────────────────────────────────────────────────────────────────┐
│ CLASSE: APIServer (Express)                                     │
├─────────────────────────────────────────────────────────────────┤
│ RESPONSABILIDADES:                                              │
│ • Receber requisições HTTP de CRUD                              │
│ • Validar dados de entrada (título obrigatório)                 │
│ • Servir arquivos estáticos (HTML/CSS/JS)                       │
│ • Rotear requisições para o banco de dados                      │
│ • Retornar respostas JSON com status correto                    │
│ • Manter cors habilitado para requisições cross-origin          │
│ • Iniciar servidor na porta 3000                                │
├─────────────────────────────────────────────────────────────────┤
│ COLABORAÇÕES:                                                   │
│ • DatabaseManager (manipula dados)                              │
│ • Express (framework HTTP)                                      │
│ • CORS (controle de acesso)                                     │
│ • Cliente Web (consome API)                                     │
└─────────────────────────────────────────────────────────────────┘

ENDPOINTS:
• GET    /api/items       → Lista todos os agendamentos
• GET    /api/items/:id   → Busca agendamento por ID
• POST   /api/items       → Cria novo agendamento
• PUT    /api/items/:id   → Atualiza agendamento
• DELETE /api/items/:id   → Remove agendamento
• GET    *                → Serve index.html (SPA)
```

---

## 3️⃣ Cartão CRC: UIController (public/app.js)

```
┌─────────────────────────────────────────────────────────────────┐
│ CLASSE: UIController (Frontend)                                 │
├─────────────────────────────────────────────────────────────────┤
│ RESPONSABILIDADES:                                              │
│ • Renderizar cards de agendamentos na página                    │
│ • Atualizar estatísticas (total, agendados, concluídos)         │
│ • Formatar datas no padrão brasileiro (DD/MM/YYYY)              │
│ • Capturar eventos de clique (editar, deletar, toggle status)   │
│ • Enviar requisições AJAX para API                              │
│ • Recarregar lista após operações CRUD                          │
│ • Validar campos antes de enviar                                │
│ • Aplicar estilos visuais dinâmicos (status concluído/agendado) │
├─────────────────────────────────────────────────────────────────┤
│ COLABORAÇÕES:                                                   │
│ • APIServer (consome endpoints)                                 │
│ • DOM (manipula elementos HTML)                                 │
│ • Usuário (interage com interface)                              │
│ • localStorage (potencial para cache)                           │
└─────────────────────────────────────────────────────────────────┘

FUNÇÕES PRINCIPAIS:
• fetchItems()        → GET /api/items
• renderCard(item)    → Cria elemento card no DOM
• updateStats(items)  → Atualiza contadores
• addItem()           → POST novo agendamento
• toggleStatus()      → PUT muda status
• editItem()          → PUT edita agendamento
• deleteItem()        → DELETE remove agendamento
• load()              → Recarrega lista completa
• formatDate()        → Converte datas para PT-BR
```

---

## 📊 Relacionamento entre Classes

```
┌────────────────────┐
│   UIController     │ (Frontend)
│   (public/app.js)  │
└─────────┬──────────┘
          │ (HTTP/JSON)
          ├─ GET /api/items
          ├─ POST /api/items
          ├─ PUT /api/items/:id
          └─ DELETE /api/items/:id
          │
┌─────────▼──────────┐
│   APIServer        │ (Backend)
│ (src/server.js)    │
└─────────┬──────────┘
          │ (manipula)
          │
┌─────────▼──────────┐
│ DatabaseManager    │ (Persistência)
│   (src/db.js)      │
└─────────┬──────────┘
          │ (lê/escreve)
          │
┌─────────▼──────────┐
│  data/items.json   │ (Armazenamento)
└────────────────────┘
```

---

## 🎯 Fluxo de Operações

### Criar Agendamento
1. Usuário preenche formulário (veículo, tipo, data, quilometragem)
2. UIController valida campos
3. UIController → POST /api/items com JSON
4. APIServer valida dados
5. APIServer → DatabaseManager.create()
6. DatabaseManager grava em items.json
7. APIServer retorna novo item com ID
8. UIController recarrega lista (load())
9. Novo card aparece na tela

### Marcar como Concluído
1. Usuário clica em "Marcar como Concluído"
2. UIController → PUT /api/items/:id com `{status: "concluído"}`
3. APIServer → DatabaseManager.update()
4. DatabaseManager atualiza JSON
5. APIServer retorna item atualizado
6. UIController recarrega lista
7. Card muda visual (✅ ao invés de 📅)

### Deletar Agendamento
1. Usuário clica em "Excluir" e confirma
2. UIController → DELETE /api/items/:id
3. APIServer → DatabaseManager.remove()
4. DatabaseManager filtra e salva
5. APIServer retorna 204 (sucesso)
6. UIController recarrega lista
7. Card desaparece da tela

---

## 💾 Estrutura de Dados

```json
{
  "id": "1763463590811",
  "veiculo": "Honda Civic 2020",
  "tipo": "Troca de óleo",
  "data": "2025-11-25",
  "quilometragem": "45000",
  "status": "agendado",
  "description": "Próxima manutenção programada"
}
```

---

## 📋 Resumo

| Classe | Tipo | Camada | Função Principal |
|--------|------|--------|------------------|
| **DatabaseManager** | Modelo | Backend | Persistência de dados |
| **APIServer** | Controlador | Backend | Roteamento HTTP |
| **UIController** | Visão | Frontend | Interação do usuário |

Este projeto segue o padrão **MVC (Model-View-Controller)** em uma arquitetura simples e eficiente para agendamento de manutenção veicular.
