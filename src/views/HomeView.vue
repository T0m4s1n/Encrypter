<script setup lang="ts">
import { defineOptions } from 'vue'
import MessageAlert from '@/components/MessageAlert.vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import About from '../components/About.vue'
import ReviewsSection from '../components/Reviews.vue'
import EncryptedTitle from '../components/EncryptedTitle.vue'

defineOptions({
  name: 'HomeView',
  components: {
    MessageAlert,
    ParticleCanvas,
    About,
    ReviewsSection,
    EncryptedTitle,
    },
})
</script>

<template>
  <main>
    <MessageAlert/>
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