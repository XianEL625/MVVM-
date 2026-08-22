<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'

const route = useRoute()
const userStore = useUserStore()

userStore.initialize()

const NonHeritageChat = defineAsyncComponent(() => import('./views/NonHeritageChat.vue'))

const showChat = computed(() => {
  return userStore.isLoggedIn && route.name !== 'login'
})
</script>

<template>
  <div class="app-container">
    <NonHeritageChat v-if="showChat" />
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>