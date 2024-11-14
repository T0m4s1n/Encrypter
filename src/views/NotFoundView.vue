<script setup lang="ts">
import { defineOptions } from 'vue'
import NotFound from '../components/NotFound.vue';

defineOptions({
  name: 'NotFoundView'
})
</script>

<template>
  <main>
    <NotFound/>
  </main>
</template>
<style>
main {
  width: 100%;
  min-height: 100vh;
}
</style>