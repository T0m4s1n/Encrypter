<script setup lang="ts">
import { defineOptions } from 'vue'
import Dashboard from '../components/Dashboard.vue';
import MessageAlert from '@/components/MessageAlert.vue'

defineOptions({
  name: 'DashboardView',
  components: {
    MessageAlert,
    Dashboard,
    },
})
</script>

<template>
  <main>
    <MessageAlert/>
    <Dashboard />
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>
