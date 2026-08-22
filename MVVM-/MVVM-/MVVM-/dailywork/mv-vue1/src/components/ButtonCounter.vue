<template>  
    <button @click="add">You clicked me {{ count }} times.</button>  
  </template>  
  
  <script setup>  
  import { ref } from 'vue';  
  
  const count = ref(0);  
  
  const add = () => {  
    count.value++;  
  };  
  </script>  
  
  <style scoped>  
  /* 添加组件特有的样式 */  
  </style>