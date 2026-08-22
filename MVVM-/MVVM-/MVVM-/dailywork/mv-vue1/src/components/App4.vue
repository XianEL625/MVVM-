
<template>
  <div>
    {{ msg }}
    <h1 :align="postion">
      sssssssssss
    </h1>
    {{ message }}
    <button @click="increment">Count is: {{ count }}</button>
    {{ count }}
    {{ state }}
  </div>
</template>

<script setup>
import {ref,onMounted } from 'vue';
const message=ref('Vuexxxxx');
const count = ref(0); 
// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
import { reactive } from 'vue'

const state = reactive({ count: 0 })
const vite='Vite'
// const msg='Hello Vite+Vue 3.0'+vite
const msg=`hello ${vite}`
const postion='left'
console.log(message.value)
count.value++
console.log(count)
</script>
<style scoped>

</style>
