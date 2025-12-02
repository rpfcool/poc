<script setup>
import AppMenu from './components/AppMenu.vue';
</script>

<template>
    <!--<AppMenu />-->
    <router-view />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  /* Garante que o app ocupe a altura total, se necessário */
  height: 100%; 
}
main {
  padding-top: 1rem;
}
</style>