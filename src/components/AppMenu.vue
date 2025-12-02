<template>
  <header class="main-header" aria-hidden="true">
    <nav class="main-navigation" aria-label="Navegação principal">
      <ul>
        <li>
          <router-link to="/">Kanban</router-link>
        </li>
        <li>
          <router-link to="/burndown">Burndown</router-link>
        </li>
        <li>
          <router-link to="/velocity">Velocity</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
// Não é necessário nenhum script para este componente puramente visual.
</script>

<style scoped>
:root {
  --nav-bg: #ffffff;
  --nav-text: #4a5568;
  --nav-text-hover: #1a202c;
  --nav-active: #4299e1;
  --nav-border: #e2e8f0;
}

/* NOVO: O <header> pai agora controla a posição.
  Usamos `position: sticky` para que ele grude no topo da janela (top: 0).
  `z-index: 1000` garante que ele fique sobre outros conteúdos ao rolar.
*/
.main-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  height: 60px;
}

.main-navigation {
  background-color: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  width: 100%;
}

.main-navigation ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 0.5rem;
}

.main-navigation li {
  margin: 0;
}

.main-navigation a {
  display: block;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: var(--nav-text);
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: border-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.main-navigation a:hover {
  color: var(--nav-text-hover);
}

.main-navigation a.router-link-active {
  color: var(--nav-active);
  border-bottom-color: var(--nav-active);
}
</style>