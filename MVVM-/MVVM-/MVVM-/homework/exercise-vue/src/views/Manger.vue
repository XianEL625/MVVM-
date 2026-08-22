<template>
    <div>
        <!-- 头部开始 -->
         <div style="height: 60px;background-color: rgb(113,73,213);"></div>
    </div>
    <!-- 头部结束 -->
    
     <!-- 下面部分开始 -->
      <div style="display: flex;flex:1;">
        <!-- 左侧导航菜单开始 -->
        <div style="width:200px;border-right: 1px solid rgb(194,176,231,1); min-height:100vh;">
            <el-menu router  style="border:0;">
                <el-menu-item index="/Manger/data" >员工信息</el-menu-item>
            </el-menu>
        </div>
        <!-- 左侧导航菜单结束 -->
    
       <!-- 右侧主体区域开始 -->
        <div style="flex:1;background-color:rgb(250,250,247);padding: 10px;">
          <RouterView/>
        </div>
    </div>
      <!-- 下面部分结束 -->
    </template>
    <script setup>
import { RouterView } from 'vue-router';

    </script>