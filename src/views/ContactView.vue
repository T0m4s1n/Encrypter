<script setup lang="ts">
import { defineOptions } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import ContactSection from '../components/Contact.vue';

defineOptions({
  name: 'ContactView',
  components: {
    ParticleCanvas,
    ContactSection
    },
})
</script>

<template>
  <main>
    <ParticleCanvas />
    <ContactSection />
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>