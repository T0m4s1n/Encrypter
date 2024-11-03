<script setup lang="ts">
import { defineOptions } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import About from '../components/About.vue'
import ReviewsSection from '../components/Reviews.vue'
import EncryptedTitle from '../components/EncryptedTitle.vue'

defineOptions({
  name: 'HomeView',
  components: {
    ParticleCanvas,
    About,
    ReviewsSection,
    EncryptedTitle,
    },
})
</script>

<template>
  <main>
    <ParticleCanvas />
    <About />
    <ReviewsSection />
    <EncryptedTitle />
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>