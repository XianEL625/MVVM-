<!--
 * @Date: 2023-02-27 21:34:36
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-03-10 19:49:43
 * @FilePath: \wed3d-worldh:\project\three-map\src\App.vue
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { emitter } from './utils/mitt';
import { World } from './World';
import { projection } from "./World/components/Map"

const currentInfo = ref();
const infobox = ref<HTMLElement>()


const container = ref<HTMLElement>()
const main = () => {
  if (!container.value) return;
  const world = new World(container.value)
  // world.render();
  world.init();
  world.start();
}

onMounted(() => {
  main();
  emitter.on("hoverMap", (emitData) => {
    if (!emitData) {
      currentInfo.value = null;
      return;
    }
    const { x, y, data: res } = emitData as { x: number, y: number, data: { center: [number, number], name: string } }
    if (infobox.value) {
      infobox.value.style.left = `${x}px`
      infobox.value.style.top = `${y}px`
      currentInfo.value = res;
    }
  });
})
</script>

<template>
  <div ref="container" class="app"></div>
  <div ref="infobox" v-show="currentInfo && currentInfo?.name" class="g-info">{{ currentInfo?.name || "--" }}</div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.g-info {
  position: fixed;
  top: 0;
  left: 0;
  height: 32px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 2px;
  padding: 0 20px;
  color: #fff;
  line-height: 30px;
  text-align: center;
}
</style>
