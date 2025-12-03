<template>
  <div class="sprint-health-container">
    <h3 id="sprint-health-title" class="chart-title">Velocity</h3>
    
    <div id="sprint-health-description" class="sr-only">
      <p>
        Gráfico de Velocidade da Sprint interativo. Mostra a distribuição de story points por status (A Fazer, Em Progresso, Em Teste, Concluído) para cada Sprint. 
        Use a tecla Tab para navegar pelas Sprints.
      </p>
    </div>

    <div class="chart-wrapper">
      <svg
        aria-hidden="true"
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
        class="sprint-health-svg"
      >
        <title>Velocity</title>
        <desc>Gráfico Velocity mostrando o status dos story points por sprint.</desc>
        
        <g class="grid-lines">
          <line :x1="marginX" y1="0" :x2="marginX" :y2="height - marginBottom" />
          <line :x1="marginX" :y1="height - marginBottom" :x2="width - marginEnd" :y2="height - marginBottom" />
          <line v-for="i in 4" :key="`grid-y-${i}`" :x1="marginX" :y1="getY(maxPoints * i / 4)" :x2="width - marginEnd" :y2="getY(maxPoints * i / 4)" />
        </g>
        
        <g class="axis-labels y-axis">
          <text :x="marginX - 15" :y="getY(maxPoints)" text-anchor="end" alignment-baseline="middle">{{ maxPoints }}</text>
          <text :x="marginX - 15" :y="getY(0)" text-anchor="end" alignment-baseline="middle">0</text>
        </g>
        <g class="axis-labels x-axis">
           <text v-for="sprint in sprintData" :key="`label-x-${sprint.id}`" :x="getX(sprint.id) + (barGroupWidth / 2)" :y="height - marginBottom + 25" text-anchor="middle">
             {{ sprint.name }}
           </text>
        </g>
        <text 
          class="axis-title" 
          text-anchor="middle" 
          :transform="`translate(30, ${ (height - marginBottom) / 2 }) rotate(-90)`"
        >
          STORY POINTS
        </text>
        <text class="axis-title" :x="(width + marginX - marginEnd) / 2" :y="height - 10" text-anchor="middle">SPRINTS</text>
        
        <g 
          v-for="sprint in barGroups"
          :key="`bar-group-${sprint.id}`"
          class="data-point"
        >
          <rect
            :x="sprint.todoBar.x"
            :y="sprint.todoBar.y"
            :width="sprint.todoBar.width"
            :height="sprint.todoBar.height"
            class="bar bar-todo"
          />
          <text v-if="sprint.todo > 0" class="bar-label" :x="sprint.todoBar.x + sprint.todoBar.width / 2" :y="sprint.todoBar.y - 6" text-anchor="middle">
            {{ sprint.todo }}
          </text>

          <rect
            :x="sprint.progressBar.x"
            :y="sprint.progressBar.y"
            :width="sprint.progressBar.width"
            :height="sprint.progressBar.height"
            class="bar bar-progress"
          />
          <text v-if="sprint.progress > 0" class="bar-label" :x="sprint.progressBar.x + sprint.progressBar.width / 2" :y="sprint.progressBar.y - 6" text-anchor="middle">
            {{ sprint.progress }}
          </text>

          <rect
            :x="sprint.testingBar.x"
            :y="sprint.testingBar.y"
            :width="sprint.testingBar.width"
            :height="sprint.testingBar.height"
            class="bar bar-testing"
          />
          <text v-if="sprint.testing > 0" class="bar-label" :x="sprint.testingBar.x + sprint.testingBar.width / 2" :y="sprint.testingBar.y - 6" text-anchor="middle">
            {{ sprint.testing }}
          </text>

          <rect
            :x="sprint.doneBar.x"
            :y="sprint.doneBar.y"
            :width="sprint.doneBar.width"
            :height="sprint.doneBar.height"
            class="bar bar-done"
          />
          <text v-if="sprint.done > 0" class="bar-label" :x="sprint.doneBar.x + sprint.doneBar.width / 2" :y="sprint.doneBar.y - 6" text-anchor="middle">
            {{ sprint.done }}
          </text>

          <g class="tooltip">
            <rect 
              class="tooltip-bg" 
              :x="sprint.tooltipPos.x" 
              :y="sprint.tooltipPos.y - 105" 
              width="150" height="95" rx="5" 
            />
            <text class="tooltip-text" :x="sprint.tooltipPos.x + 75" :y="sprint.tooltipPos.y - 85" text-anchor="middle">
              {{ sprint.name }}
            </text>
            <text class="tooltip-text-small" :x="sprint.tooltipPos.x + 15" :y="sprint.tooltipPos.y - 60" text-anchor="start">A Fazer: {{ sprint.todo }}</text>
            <text class="tooltip-text-small" :x="sprint.tooltipPos.x + 15" :y="sprint.tooltipPos.y - 45" text-anchor="start">Progresso: {{ sprint.progress }}</text>
            <text class="tooltip-text-small" :x="sprint.tooltipPos.x + 15" :y="sprint.tooltipPos.y - 30" text-anchor="start">Teste: {{ sprint.testing }}</text>
            <text class="tooltip-text-small" :x="sprint.tooltipPos.x + 15" :y="sprint.tooltipPos.y - 15" text-anchor="start">Concluído: {{ sprint.done }}</text>
          </g>
        </g>
      </svg>

      <div class="a11y-layer">
        <button
          v-for="point in a11yPoints"
          :key="`a11y-point-${point.id}`"
          type="button"
          class="a11y-point"
          :style="{
            top: point.top + '%',
            left: point.left + '%',
            width: point.width + '%',
            height: '100%'
          }"
        >
          <span class="sr-only">
            {{ point.name }}.
            {{ point.todo }} A Fazer.
            {{ point.progress }} Em Progresso.
            {{ point.testing }} Em Teste.
            {{ point.done }} Concluído.
          </span>
        </button>
      </div>

    </div> <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-swatch bar-todo"></span>
        A Fazer
      </div>
      <div class="legend-item">
        <span class="legend-swatch bar-progress"></span>
        Em Progresso
      </div>
      <div class="legend-item">
        <span class="legend-swatch bar-testing"></span>
        Em Teste
      </div>
      <div class="legend-item">
        <span class="legend-swatch bar-done"></span>
        Concluído
      </div>
    </div>
  </div>
    <div class="navigation-footer">
      <router-link to="/" class="back-home-btn">
        <i class="pi pi-home"></i> Voltar para Página Inicial
      </router-link>
    </div>
  </template>

<script setup>
import { ref, computed } from 'vue';

// --- DADOS DE EXEMPLO (3 Sprints, 4 categorias) ---
const sprintData = ref([
  { id: 1, name: 'Sprint 1', todo: 0, progress: 0, testing: 0, done: 25 },
  { id: 2, name: 'Sprint 2', todo: 0, progress: 0, testing: 5, done: 30 },
  { id: 3, name: 'Sprint 3', todo: 10, progress: 5, testing: 5, done: 10 },
]);

// --- Configurações do Gráfico ---
const width = 1000;
const height = 500;
const marginX = 80; 
const marginBottom = 60;
const marginEnd = 40;

const chartHeight = height - marginBottom;
const chartWidth = width - marginX - marginEnd;

// --- Lógica de Cálculo ---
const totalSprints = computed(() => sprintData.value.length);
const maxPoints = computed(() => {
  const maxVal = Math.max(...sprintData.value.map(s => {
    // Encontra o valor individual mais alto
    return Math.max(s.todo, s.progress, s.testing, s.done); 
  }));
  return Math.ceil(maxVal * 1);
});

const barGroupWidth = computed(() => chartWidth / totalSprints.value);

const getX = (sprintId) => {
  const index = sprintData.value.findIndex(s => s.id === sprintId);
  return marginX + (index * barGroupWidth.value);
};

const getY = (pointCount) => {
  // Garante que 0 SPs fiquem na base do eixo
  if (pointCount <= 0) return chartHeight; 
  return chartHeight - (pointCount / maxPoints.value) * chartHeight;
};

// Computed para as barras visuais do SVG
const barGroups = computed(() => {
  const groupPadding = 0.1; 
  const numBars = 4;
  const barMargin = 0.05; // 5% de margem entre as barras
  
  const innerGroupWidth = barGroupWidth.value * (1 - groupPadding);
  // Largura de cada barra individual (considerando a margem)
  const barWidth = (innerGroupWidth / numBars) * (1 - barMargin);
  const marginWidth = (innerGroupWidth / numBars) * barMargin;

  return sprintData.value.map((sprint) => {
    const groupXStart = getX(sprint.id);
    const paddingOffset = barGroupWidth.value * (groupPadding / 2);
    
    // Posições X para as 4 barras
    const x1 = groupXStart + paddingOffset;
    const x2 = x1 + barWidth + marginWidth;
    const x3 = x2 + barWidth + marginWidth;
    const x4 = x3 + barWidth + marginWidth;

    // Posições Y e Alturas
    const todoY = getY(sprint.todo);
    const progressY = getY(sprint.progress);
    const testingY = getY(sprint.testing);
    const doneY = getY(sprint.done);
    
    const todoH = chartHeight - todoY;
    const progressH = chartHeight - progressY;
    const testingH = chartHeight - testingY;
    const doneH = chartHeight - doneY;
    
    return {
      id: sprint.id,
      name: sprint.name,
      ...sprint,
      
      todoBar: { x: x1, y: todoY, width: barWidth, height: todoH },
      progressBar: { x: x2, y: progressY, width: barWidth, height: progressH },
      testingBar: { x: x3, y: testingY, width: barWidth, height: testingH },
      doneBar: { x: x4, y: doneY, width: barWidth, height: doneH },
      
      tooltipPos: {
        x: groupXStart + (barGroupWidth.value / 2) - 75,
        y: Math.min(todoY, progressY, testingY, doneY)
      }
    }
  });
});

// Computed para a camada de acessibilidade
const a11yPoints = computed(() => {
  return sprintData.value.map((sprint) => {
    const groupCenterX = getX(sprint.id) + (barGroupWidth.value / 2);
    return {
      id: sprint.id,
      name: sprint.name,
      ...sprint,
      left: (groupCenterX / width) * 100,
      top: 0, 
      width: (barGroupWidth.value / width) * 100
    }
  });
});

</script>

<style scoped>

.sprint-health-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  margin: 2rem auto;
  width: 80vw;
  max-width: 1100px;
  min-width: 600px;
}

.chart-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.75rem;
}

.chart-wrapper {
  position: relative;
}

.sprint-health-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.grid-lines line {
  stroke: var(--light-grid);
  stroke-width: 1px;
}

.axis-labels {
  font-size: 16px;
  fill: #718096;
}

.axis-title {
  font-size: 18px;
  fill: #4a5568;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Estilos das Barras */
.bar {
  transition: opacity 0.2s ease-in-out;
  rx: 2px; /* Cantos levemente arredondados */
}
.bar-todo { fill: var(--color-todo); }
.bar-progress { fill: var(--color-progress); }
.bar-testing { fill: var(--color-testing); }
.bar-done { fill: var(--color-done); }

.data-point:hover .bar {
  opacity: 0.7;
}

/* Rótulos de valor acima das barras */
.bar-label {
  font-size: 14px;
  font-weight: 600;
  fill: var(--text-color);
}


.tooltip {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}
.data-point:hover .tooltip {
  opacity: 1;
}
.tooltip-bg {
  fill: #2d3748;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.tooltip-text {
  fill: #ffffff;
  font-size: 16px;
  font-weight: 600;
}
.tooltip-text-small {
  fill: #e2e8f0;
  font-size: 14px;
  font-weight: 400;
}
.data-point {
  cursor: pointer;
}

/* --- Estilos para a Camada de Acessibilidade --- */
.a11y-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.a11y-point {
  position: absolute;
  transform: translate(-50%, 0); 
  pointer-events: all; 
  opacity: 0;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.a11y-point:focus {
  opacity: 1;
  background: rgba(66, 153, 225, 0.4);
  border: 3px solid var(--focus-color);
  box-shadow: 0 0 10px var(--focus-color);
  outline: none;
}

/* Legenda (Atualizada para 4 itens) */
.chart-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  font-size: 1rem;
}
.legend-item {
  display: flex;
  align-items: center;
  color: #4a5568;
}
.legend-swatch {
  display: inline-block;
  width: 18px; 
  height: 18px; 
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.legend-swatch.bar-todo { background-color: var(--color-todo); }
.legend-swatch.bar-progress { background-color: var(--color-progress); }
.legend-swatch.bar-testing { background-color: var(--color-testing); }
.legend-swatch.bar-done { background-color: var(--color-done); }

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