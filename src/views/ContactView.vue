<script setup lang="ts">
import { defineOptions } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import ContactSection from '../components/Contact.vue';
import FQATree from '@/components/FQATree.vue';

defineOptions({
  name: 'ContactView',
  components: {
    ParticleCanvas,
    FQATree,
    ContactSection
    },
})
</script>

<template>
  <main>
    <ParticleCanvas />
    <FQATree />
    <ContactSection />
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>