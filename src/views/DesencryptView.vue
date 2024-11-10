<script setup lang="ts">
import { defineOptions } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import MessageAlert from '@/components/MessageAlert.vue'
import Desencrypt from '../components/Desencrypt.vue';

defineOptions({
  name: 'DesencryptView',
  components: {
    MessageAlert,
    ParticleCanvas,
    },
})
</script>

<template>
  <main>
    <MessageAlert/>
    <ParticleCanvas />
    <Desencrypt />
  </main>
</template>