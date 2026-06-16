<template>
    <div
      class="kanban-board"
      role="application" 
      aria-label="Quadro Kanban de tarefas"
      aria-describedby="board-instructions"
    >
    <div id="board-instructions" class="sr-only">
      <h2>Instruções do Quadro Kanban:</h2>
      <ul>
        <li>Use Tab para navegar entre os cartões.</li>
        <li>Pressione Enter ou Espaço em um cartão para ativar o modo de movimento.</li>
        <li>Com o modo de movimento ativo, use as setas direcionais para mover o cartão entre ou dentro das colunas.</li>
        <li>Pressione Escape para desativar o modo de movimento.</li>
      </ul>
    </div>

    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
      role="status"
    >
      {{ liveMessage }}
    </div>

    <section
      v-for="(column, colIndex) in columns"
      :key="column.id"
      class="kanban-column"
      :aria-labelledby="`title-${column.id}`"
    >
      <h2 :id="`title-${column.id}`" class="column-title">
        {{ column.title }} <span class="task-count">
          ({{ column.tasks.length }})
        </span>
      </h2>

      <ul 
        class="column-content" 
        :class="{ 'drag-over': dragOverColumnId === column.id }"
        :aria-label="`Lista de tarefas na coluna ${column.title}`"
        @dragover.prevent="onDragOver(column)"
        @dragleave.prevent="onDragLeave()"
        @drop.prevent="onDrop(column)"
      >
        <li
          v-for="(task, taskIndex) in column.tasks"
          :key="task.id"
          class="kanban-card"
          :class="{ 
            'is-selected': selectedCard?.id === task.id,
            'is-dragging': draggedTaskId === task.id
          }"
          tabindex="0"
          role="button"
          :aria-pressed="selectedCard?.id === task.id ? 'true' : 'false'"
          :aria-label="`${task.title}. Prioridade: ${task.priority}`"
          :aria-describedby="`desc-${task.id}`"
          :aria-grabbed="selectedCard?.id === task.id"
          :data-card-id="task.id"
          draggable="true"
          @keyup.space.prevent="toggleSelection(task)"
          @keyup.enter.prevent="toggleSelection(task)"
          @keydown="handleCardMovement($event, task, column.id, colIndex, taskIndex)"
          @dragstart="onDragStart($event, task)"
          @dragend="onDragEnd()"
        >
          <h3 class="card-title">{{ task.title }}</h3>
          <p :id="`desc-${task.id}`" class="card-description">{{ task.description }}</p>
          <div class="card-priority" :aria-label="`Prioridade ${task.priority}`">
            <span aria-hidden="true">
              <template v-if="task.priority==='Alta'"><span title="Prioridade Alta">🔴</span></template>
              <template v-else-if="task.priority==='Média'"><span title="Prioridade Média">🟡</span></template>
              <template v-else><span title="Prioridade Baixa">🟢</span></template>
            </span>
            <span class="sr-only">Prioridade {{ task.priority }}</span>
          </div>
        </li>
      </ul>
    </section>
    </div>
    <div class="navigation-footer">
      <router-link to="/" class="back-home-btn">
        <i class="pi pi-home"></i> Voltar para Página Inicial
      </router-link>
    </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';

const columns = reactive([
  {
    id: 'todo',
    title: 'A Fazer',
    tasks: [
      { id: 't1', title: 'Analisar requisitos do Relatório de Vendas', description: 'Definir KPIs e métricas com a equipe de produto.', priority: 'Alta' },
      { id: 't2', title: 'Modelar esquema do banco de dados', description: 'Criar tabelas para armazenar os dados de vendas agregados.', priority: 'Alta' },
      { id: 't5', title: 'Configurar job de processamento noturno', description: 'Desenvolver script para consolidar os dados diariamente.', priority: 'Média' },
      { id: 't8', title: 'Criar documentação inicial da API', description: 'Esboçar os endpoints no Swagger/OpenAPI.', priority: 'Baixa' }
    ]
  },
  {
    id: 'progress',
    title: 'Em Progresso',
    tasks: [
      { id: 't3', title: 'Desenvolver API de dados do relatório', description: 'Endpoints para consulta de vendas por período e produto.', priority: 'Alta' },
      { id: 't6', title: 'Criar componente de gráfico de barras', description: 'Componente Vue reutilizável para exibir os dados.', priority: 'Média' }
    ]
  },
  {
    id: 'testing',
    title: 'Em Teste',
    tasks: [
        { id: 't4', title: 'Implementar UI da página de relatórios', description: 'Layout responsivo com filtros de data.', priority: 'Alta' },
        { id: 't9', title: 'Testar performance da consulta principal', description: 'Verificar tempo de resposta com 1 milhão de registros.', priority: 'Média' },
        { id: 't10', title: 'Revisão de acessibilidade da nova página', description: 'Garantir conformidade com WCAG 2.1 e testes com NVDA.', priority: 'Alta' }
    ]
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: [
      { id: 't7', title: 'Setup inicial do projeto', description: 'Configuração de repositório, CI/CD e dependências.', priority: 'Baixa' },
      { id: 't11', title: 'Aprovação do layout no Figma', description: 'UI/UX finalizado e aprovado pela equipe de design.', priority: 'Baixa' }
    ]
  }
]);

const selectedCard = ref(null);
const liveMessage = ref('');

// --- Estado para Drag and Drop ---
const draggedTaskId = ref(null);
const dragOverColumnId = ref(null);

// No script: A função que alimenta a região "viva"
function announce(message) {
  liveMessage.value = ''; // Limpa a mensagem anterior
  // nextTick garante que a mudança seja detectada pelo leitor de tela
  nextTick(() => { 
    liveMessage.value = message; 
  });
}

function toggleSelection(task) {
  if (selectedCard.value?.id === task.id) {
    selectedCard.value = null;
    announce(`Modo de movimento desativado para '${task.title}'.`);
  } else {
    selectedCard.value = task;
    announce(`'${task.title}' selecionado. Use as setas para mover ou Escape para cancelar.`);
  }
}

// --- Funções de Lógica de Negócio ---
function moveTask(taskId, fromColumnId, toColumnId) {
  if (fromColumnId === toColumnId) return;
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);
  if (!fromColumn || !toColumn) return;
  const taskIndex = fromColumn.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;
  const [task] = fromColumn.tasks.splice(taskIndex, 1);
  toColumn.tasks.push(task);
  announce(`Tarefa '${task.title}' movida para ${toColumn.title}.`);
}

function moveTaskWithinColumn(taskId, columnId, currentIndex, direction) {
  const column = columns.find(c => c.id === columnId);
  if (!column) return;
  const newIndex = currentIndex + direction;
  const [task] = column.tasks.splice(currentIndex, 1);
  column.tasks.splice(newIndex, 0, task);
  announce(`'${task.title}' movido para a posição ${newIndex + 1}.`);
}

// Função que gerencia a movimentação (teclado)
async function handleCardMovement(event, task, columnId, colIndex, taskIndex) {
  // Garante que o cartão está no "modo de movimento"
  if (!selectedCard.value || selectedCard.value.id !== task.id) {
    return;
  }
  
  // Função interna para gerenciar o foco após a renderização
  const moveAndFocus = async () => {
    await nextTick();
    const el = document.querySelector(`[data-card-id="${task.id}"]`);
    if (el) el.focus();
  };
  
  switch(event.code) {
    case 'ArrowRight':
      event.preventDefault();
      if (colIndex < columns.length - 1) {
        // moveTask (lógica de negócio)
        moveTask(task.id, columnId, columns[colIndex + 1].id);
        moveAndFocus();
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (colIndex > 0) {
        moveTask(task.id, columnId, columns[colIndex - 1].id);
        moveAndFocus();
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (taskIndex > 0) {
        moveTaskWithinColumn(task.id, columnId, taskIndex, -1);
        moveAndFocus();
      }
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (taskIndex < columns.length - 1) {
        moveTaskWithinColumn(task.id, columnId, taskIndex, 1);
        moveAndFocus();
      }
      break;
    case 'Escape':
      event.preventDefault();
      const taskTitle = selectedCard.value.title;
      selectedCard.value = null;
      announce(`Seleção de '${taskTitle}' cancelada.`);
      break;
  }
}

// --- Handlers de Eventos de Drag and Drop ---
function onDragStart(event, task) {
  event.dataTransfer.setData('text/plain', task.id);
  event.dataTransfer.dropEffect = 'move';
  draggedTaskId.value = task.id;
}

function onDragOver(column) {
  dragOverColumnId.value = column.id;
}

function onDragLeave() {
  dragOverColumnId.value = null;
}

function onDrop(targetColumn) {
  const taskId = event.dataTransfer.getData('text/plain');
  let sourceColumn = null;
  for (const col of columns) {
    if (col.tasks.some(t => t.id === taskId)) {
      sourceColumn = col;
      break;
    }
  }
  if (sourceColumn && targetColumn) {
    moveTask(taskId, sourceColumn.id, targetColumn.id);
  }
  cleanupDragState();
}

function onDragEnd() {
  cleanupDragState();
}

function cleanupDragState() {
  draggedTaskId.value = null;
  dragOverColumnId.value = null;
}
</script>

<style>
body {
  background-color: var(--board-bg);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.kanban-board {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
  min-height: 90vh;
  align-items: flex-start;
}
.kanban-column {
  flex: 1 0 300px;
  max-width: 320px;
  background: var(--column-bg);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
.column-title {
  font-size: 1.1rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  margin: 0 0 1rem 0;
  color: var(--text-color);
}
.task-count {
  font-weight: normal;
  color: #4a5568;
}
.column-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
}
.kanban-card {
  background-color: var(--card-bg);
  border-radius: 6px;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s, opacity 0.2s ease-in-out;
  cursor: grab;
}
.kanban-card:hover {
  border-color: #c1c7d0;
}
.kanban-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--focus-color);
}
.kanban-card.is-selected {
  background-color: #e6fcff;
  border-color: var(--focus-color);
  box-shadow: 0 0 0 3px var(--focus-color);
}
.card-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}
.card-description {
  color: #4a5568;
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
}
.card-priority {
  margin-top: 0.75rem;
  font-size: 1.2rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Estilos para feedback visual do Drag and Drop */
.kanban-card.is-dragging {
  opacity: 0.4;
  transform: rotate(3deg);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.column-content.drag-over {
  background-color: #d4e6f1;
  border: 2px dashed var(--focus-color);
}
.navigation-footer {
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
}

.back-home-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--surface-card);
  color: var(--text-color);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.back-home-btn:hover {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}
</style>