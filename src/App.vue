<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import ModernFooter from './components/ModernFooter.vue'; 
</script>

<template>
  <Header/>
  <RouterView />
  <ModernFooter/>
</template>

<style scoped>
</style>
