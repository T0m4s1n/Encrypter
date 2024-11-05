<script setup lang="ts">
import { defineOptions } from 'vue'
import AdminComponent from '../components/AdminComponent.vue';
import ParticleCanvas from '../components/ParticleCanvas.vue';

defineOptions({
  name: 'AdminView',
  components: {
    ParticleCanvas,
    AdminComponent,
    },
})
</script>

<template>
  <main>
    <ParticleCanvas/>
    <AdminComponent/>
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>
