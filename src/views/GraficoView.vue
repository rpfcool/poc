<template>
  <div class="burndown-chart-container">
    <h3 id="burndown-title" class="chart-title">Gráfico de Burndown de Tarefas</h3>
    
    <div id="burndown-description" class="sr-only">
      <p>
        Este gráfico mostra o progresso das tarefas restantes ao longo de um período de {{ totalDays }} dias. 
        A linha cinza pontilhada representa a trajetória ideal de conclusão. 
        A linha azul sólida representa o trabalho real restante a cada dia. Os dados detalhados estão disponíveis em uma lista após o gráfico.
      </p>
    </div>

    <svg
      role="img"
      aria-labelledby="burndown-title"
      aria-describedby="burndown-description"
      :viewBox="`0 0 ${width} ${height}`"
      xmlns="http://www.w3.org/2000/svg"
      class="burndown-svg"
    >
      <title>Gráfico de Burndown do Sprint</title>
      <desc>Gráfico de linhas mostrando o trabalho ideal (cinza) vs. o trabalho real (azul) restante.</desc>

      <g class="grid-lines" aria-hidden="true">
        <line :x1="marginX" y1="0" :x2="marginX" :y2="height - marginBottom" />
        <line :x1="marginX" :y1="height - marginBottom" :x2="width - marginEnd" :y2="height - marginBottom" />
        <line v-for="i in 4" :key="`grid-y-${i}`" :x1="marginX" :y1="getY(initialTasks * i / 4)" :x2="width - marginEnd" :y2="getY(initialTasks * i / 4)" />
      </g>
      
      <g class="axis-labels y-axis" aria-hidden="true">
        <text :x="marginX - 15" :y="getY(initialTasks)" text-anchor="end" alignment-baseline="middle">{{ initialTasks }}</text>
        <text :x="marginX - 15" :y="getY(Math.round(initialTasks * 0.75))" text-anchor="end" alignment-baseline="middle">{{ Math.round(initialTasks * 0.75) }}</text>
        <text :x="marginX - 15" :y="getY(Math.round(initialTasks * 0.5))" text-anchor="end" alignment-baseline="middle">{{ Math.round(initialTasks * 0.5) }}</text>
        <text :x="marginX - 15" :y="getY(Math.round(initialTasks * 0.25))" text-anchor="end" alignment-baseline="middle">{{ Math.round(initialTasks * 0.25) }}</text>
        <text :x="marginX - 15" :y="getY(0)" text-anchor="end" alignment-baseline="middle">0</text>
      </g>
      <g class="axis-labels x-axis" aria-hidden="true">
         <text v-for="i in totalDays + 1" :key="`label-x-${i}`" :x="getX(i - 1)" :y="height - marginBottom + 25" text-anchor="middle">Dia {{ i - 1 }}</text>
      </g>
      
      <text class="axis-title" :x="20" :y="(height - marginBottom) / 2" text-anchor="middle" transform="rotate(-90, 20, 190)">Tarefas Restantes</text>
      <text class="axis-title" :x="(width + marginX - marginEnd) / 2" :y="height - 10" text-anchor="middle">Dias do Sprint</text>

      <polyline
        fill="none"
        stroke="#a0aec0"
        stroke-width="3"
        stroke-dasharray="6 3"
        :points="idealWorkPath"
      />

      <polyline
        fill="none"
        stroke="#4299e1"
        stroke-width="4"
        :points="actualWorkPath"
      />

      <g 
        v-for="(point, index) in actualPoints"
        :key="`actual-point-${index}`"
        class="data-point"
        role="listitem"
        :aria-label="`Dia ${index}: ${point.value} tarefas restantes.`"
        tabindex="0"
      >
        <circle
          :cx="point.x"
          :cy="point.y"
          r="6"
          fill="#4299e1"
          stroke="#fff"
          stroke-width="3"
        />
        <g class="tooltip">
          <rect class="tooltip-bg" :x="point.x - 45" :y="point.y - 55" width="90" height="35" rx="5" />
          <text class="tooltip-text" :x="point.x" :y="point.y - 35" text-anchor="middle">
            Dia {{ index }}: {{ point.value }}
          </text>
        </g>
      </g>
    </svg>

    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-swatch ideal"></span>
        Trabalho Ideal
      </div>
      <div class="legend-item">
        <span class="legend-swatch actual"></span>
        Trabalho Real
      </div>
    </div>

    <div class="sr-only" role="region" aria-labelledby="burndown-data-title">
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const initialTasks = 21;
const totalDays = 7;
const actualData = [21, 21, 18, 15, 12, 10, 6, 2];

const width = 1000; // Aumentado para maior resolução interna
const height = 500;
const marginX = 80; 
const marginBottom = 60;
const marginEnd = 40;

const chartHeight = height - marginBottom;
const chartWidth = width - marginX - marginEnd;

const getX = (day) => marginX + (day / totalDays) * chartWidth;
const getY = (taskCount) => chartHeight - (taskCount / initialTasks) * chartHeight;

const idealWorkPath = computed(() => {
  const startPoint = `${getX(0)},${getY(initialTasks)}`;
  const endPoint = `${getX(totalDays)},${getY(0)}`;
  return `${startPoint} ${endPoint}`;
});

const actualPoints = computed(() => {
  return actualData.map((tasksLeft, dayIndex) => ({
    x: getX(dayIndex),
    y: getY(tasksLeft),
    value: tasksLeft
  }));
});

const actualWorkPath = computed(() => {
  return actualPoints.value.map(p => `${p.x},${p.y}`).join(' ');
});

// REMOVIDO: O 'areaPath' foi removido do script.
</script>

<style scoped>
:root {
  --text-color: #2d3748;
  --focus-color: #4299e1;
  --ideal-color: #a0aec0;
  --actual-color: #4299e1;
  --light-grid: #e2e8f0;
}

.burndown-chart-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  margin: 2rem auto;
  /* ALTERAÇÃO: Usa a largura da janela (viewport) como referência, com um máximo */
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
  font-size: 1.75rem; /* AUMENTADO */
}

.burndown-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.grid-lines line {
  stroke: var(--light-grid);
  stroke-width: 1px;
}

.axis-labels {
  font-size: 16px; /* AUMENTADO */
  fill: #718096;
}

.axis-title {
  font-size: 18px; /* AUMENTADO */
  fill: #4a5568;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* REMOVIDO: O estilo .area-fill foi removido */

.tooltip {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}
.data-point:hover .tooltip,
.data-point:focus .tooltip {
  opacity: 1;
}
.tooltip-bg {
  fill: #2d3748;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.tooltip-text {
  fill: #ffffff;
  font-size: 16px; /* AUMENTADO */
  font-weight: 600;
}
.data-point {
  cursor: pointer;
}
.data-point:focus {
  outline: none;
}
.data-point:focus circle {
  r: 8; /* AUMENTADO */
  fill: #2b6cb0;
  outline: 3px solid var(--focus-color);
  outline-offset: 2px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 1rem; /* AUMENTADO */
}
.legend-item {
  display: flex;
  align-items: center;
  color: #4a5568;
}
.legend-swatch {
  display: inline-block;
  width: 18px; /* AUMENTADO */
  height: 18px; /* AUMENTADO */
  margin-right: 10px;
  border-radius: 4px;
}
.legend-swatch.ideal {
  background-color: var(--ideal-color);
  border: 2px dashed #718096;
}
.legend-swatch.actual {
  background-color: var(--actual-color);
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
</style>