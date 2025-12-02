<template>
  <div class="home-container">
    <div class="content-wrapper">
      <h1 class="title">Bem-vindo ao Gerenciador de Projetos Acessível</h1>
      
      <div class="features-grid">
        <div class="feature-card">
          <h2>Kanban</h2>
          <router-link to="/kanban" class="action-btn">Ir para Kanban</router-link>
        </div>
        
        <div class="feature-card">
          <h2>Burndown</h2>
          <router-link to="/burndown" class="action-btn">Ver Burndown</router-link>
        </div>
        
        <div class="feature-card">
          <h2>Velocity</h2>
          <router-link to="/velocity" class="action-btn">Ver Velocity</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.content-wrapper {
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

.title {
  font-size: 3rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #718096;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.action-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #3182ce;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
}
</style>
