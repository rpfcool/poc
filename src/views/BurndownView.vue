<template>
  <div class="burndown-chart-container">
    <h3 id="burndown-title" class="chart-title">Burndown</h3>
    
    <div id="burndown-description" class="sr-only">
      <p>
        Burndown. Use a tecla Tab para navegar pelos pontos de dados e ouvir os valores de cada dia.
      </p>
    </div>

    <div class="chart-wrapper">
      <svg
        aria-hidden="true"
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
        class="burndown-svg"
      >
        <title>Burndown</title>
        <desc>Burndown mostrando o trabalho ideal (cinza) vs. o trabalho real (azul) restante.</desc>
        
        <g class="grid-lines">
          <line :x1="marginX" y1="0" :x2="marginX" :y2="height - marginBottom" />
          <line :x1="marginX" :y1="height - marginBottom" :x2="width - marginEnd" :y2="height - marginBottom" />
          <line v-for="i in 4" :key="`grid-y-${i}`" :x1="marginX" :y1="getY(initialTasks * i / 4)" :x2="width - marginEnd" :y2="getY(initialTasks * i / 4)" />
        </g>
        <g class="axis-labels y-axis">
          <text :x="marginX - 15" :y="getY(initialTasks)" text-anchor="end" alignment-baseline="middle">{{ initialTasks }}</text>
          <text :x="marginX - 15" :y="getY(Math.round(initialTasks * 0.75))" text-anchor="end" alignment-baseline="middle">{{ Math.round(initialTasks * 0.75) }}</text>
          <text :x="marginX - 15" :y="getY(Math.round(initialTasks * 0.5))" text-anchor="end" alignment-baseline="middle">{{ Math.round(initialTasks * 0.5) }}</text>
          <text :x="marginX - 15" :y="getY(Math.round(initialTasks * 0.25))" text-anchor="end" alignment-baseline="middle">{{ Math.round(initialTasks * 0.25) }}</text>
          <text :x="marginX - 15" :y="getY(0)" text-anchor="end" alignment-baseline="middle">0</text>
        </g>
        <g class="axis-labels x-axis">
           <text v-for="i in totalDays + 1" :key="`label-x-${i}`" :x="getX(i - 1)" :y="height - marginBottom + 25" text-anchor="middle">Dia {{ i - 1 }}</text>
        </g>
        
        <text 
          class="axis-title" 
          text-anchor="middle" 
          :transform="`translate(30, ${ (height - marginBottom) / 2 }) rotate(-90)`"
        >
          Tarefas Restantes
        </text>

        <text class="axis-title" :x="(width + marginX - marginEnd) / 2" :y="height - 10" text-anchor="middle">Dias do Sprint</text>
        
        <polyline fill="none" stroke="#a0aec0" stroke-width="3" stroke-dasharray="6 3" :points="idealWorkPath" />
        <polyline fill="none" stroke="#4299e1" stroke-width="4" :points="actualWorkPath" />
        <g 
          v-for="(point, index) in actualPoints"
          :key="`actual-point-${index}`"
          class="data-point"
        >
          <circle :cx="point.x" :cy="point.y" r="6" fill="#4299e1" stroke="#fff" stroke-width="3" />
          <g class="tooltip">
            <rect class="tooltip-bg" :x="point.x - 45" :y="point.y - 55" width="90" height="35" rx="5" />
            <text class="tooltip-text" :x="point.x" :y="point.y - 35" text-anchor="middle">
              Dia {{ index }}: {{ point.value }}
            </text>
          </g>
        </g>
      </svg>

      <div class="a11y-layer">
        <button
          v-for="(point, index) in a11yPoints"
          :key="`a11y-point-${index}`"
          type="button"
          class="a11y-point"
          :style="{
            top: point.top + '%',
            left: point.left + '%'
          }"
        >
          <span class="sr-only">Dia {{ index }}: {{ point.value }} tarefas restantes.</span>
        </button>
      </div>

    </div> <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-swatch ideal"></span>
        Trabalho Ideal
      </div>
      <div class="legend-item">
        <span class="legend-swatch actual"></span>
        Trabalho Real
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const initialTasks = 21;
const totalDays = 7;
const actualData = [21, 21, 18, 15, 12, 10, 6, 2];

const width = 1000;
const height = 500;
const marginX = 80; 
const marginBottom = 60;
const marginEnd = 40;

const chartHeight = height - marginBottom;
const chartWidth = width - marginX - marginEnd;

const getX = (day) => marginX + (day / totalDays) * chartWidth;
const getY = (taskCount) => chartHeight - (taskCount / initialTasks) * chartHeight;

// Computed para o SVG (visual)
const actualPoints = computed(() => {
  return actualData.map((tasksLeft, dayIndex) => ({
    x: getX(dayIndex),
    y: getY(tasksLeft),
    value: tasksLeft
  }));
});

// Computed para a camada de acessibilidade (posicionamento em %)
const a11yPoints = computed(() => {
  return actualData.map((tasksLeft, dayIndex) => ({
    left: (getX(dayIndex) / width) * 100,
    top: (getY(tasksLeft) / height) * 100,
    value: tasksLeft
  }));
});

const idealWorkPath = computed(() => {
  const startPoint = `${getX(0)},${getY(initialTasks)}`;
  const endPoint = `${getX(totalDays)},${getY(0)}`;
  return `${startPoint} ${endPoint}`;
});

const actualWorkPath = computed(() => {
  return actualPoints.value.map(p => `${p.x},${p.y}`).join(' ');
});

</script>

<style scoped>
.burndown-chart-container {
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
  width: 30px; 
  height: 30px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: all; 
  opacity: 0;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.a11y-point:focus {
  opacity: 1;
  background: rgba(66, 153, 225, 0.5);
  border: 3px solid var(--focus-color);
  box-shadow: 0 0 10px var(--focus-color);
  outline: none;
}


.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
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
}
.legend-swatch.ideal {
  background-color: var(--ideal-color);
  border: 2px dashed #718096;
}
.legend-swatch.actual {
  background-color: #4299e1;
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