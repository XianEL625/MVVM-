<template>  
  <!-- 使用这个方式可以不用刷新 -->
   <router-view></router-view>//这是父级页面
  <div style="margin: 20px"> 
  <RouterLink to="/test">这里可以跳转</RouterLink>
  </div> 
  
  <!-- 编程式 -->
  <div>
    <router-view></router-view> 
    <el-button type="primary" @click="router.push('/test?id=2&addr=gz')">跳转页面</el-button> 
  </div>
      <!-- <div>   
        <Manger />  如果你想使用 Self1 组件   
      </div>   -->
    </template>  
    
    <script setup>
    // import { RouterLink } from 'vue-router';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    </script>