<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { initSceneOne } from './SceneOne';


export default defineComponent({
  name: 'HeroComponent',
  setup() {
    onMounted(() => {
      const containerOne = document.querySelector('#sceneOne') as HTMLElement;


      if (containerOne) {
        initSceneOne(containerOne);

      }
    });
  },
});
</script>

<template>
  <main>
    <section id="sceneOne" class="scene"></section>
  </main>
</template>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
