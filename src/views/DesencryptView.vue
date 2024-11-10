<script setup lang="ts">
import { defineOptions } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import Desencrypt from '../components/Desencrypt.vue';

defineOptions({
  name: 'DesencryptView',
  components: {
    ParticleCanvas,
    },
})
</script>

<template>
  <main>
    <ParticleCanvas />
    <Desencrypt />
  </main>
</template>