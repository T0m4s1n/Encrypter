<script setup lang="ts">
import { defineOptions } from 'vue'
import Dashboard from '@/components/Dashboard.vue';

defineOptions({
  name: 'DashboardView',
  components: {
    Dashboard,
    },
})
</script>

<template>
  <main>
    <Dashboard />
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>