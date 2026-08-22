<template> 
  <div class="home-container"> 
    <el-container> 
      <el-header height="auto"> 
        <div class="header-content"> 
          <h1>知识图谱展示平台</h1> 
          <div class="user-info"> 
            <span>欢迎，{{ userStore.username }}</span> 
            <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button> 
          </div> 
        </div> 
      </el-header> 
      <el-container> 
        <el-aside width="200px"> 
          <el-menu 
            :default-active="activeMenu" 
            router 
            class="side-menu" 
          > 
            <el-menu-item index="/knowledge-graph/lanran-knowledge-graph"style="font-size: 22px;"> 
              <span>蓝染技艺体系</span> 
            </el-menu-item> 
            <el-menu-item index="/knowledge-graph/djl-knowledge-graph"style="font-size: 22px;"> 
              <span>黔东南苗族吊脚楼</span> 
            </el-menu-item> 
            <!-- <el-menu-item index="/home/model-container"> 
              <span>test</span> 
            </el-menu-item>  -->
          </el-menu> 
        </el-aside> 
        <el-main> 
          <router-view /> 
        </el-main> 
      </el-container> 
    </el-container> 
  </div> 
</template> 
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useUserStore } from '../stores/user'
  
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  
  const activeMenu = computed(() => route.path)
  
  const handleLogout = () => {
    userStore.logout()
    router.push('/')
  }
  </script>
  

<style scoped> 
.home-container { 
  height: 100vh; 
} 

.el-header { 
  background-color: #409eff; 
  color: white; 
  padding: 10px 20px; /* 修改padding使内容完全显示 */
} 

.header-content { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap; /* 允许在小屏幕上换行 */
} 

.header-content h1 {
  margin: 0; /* 移除标题默认边距 */
  padding: 10px 0; /* 添加一些垂直内边距 */
}

.user-info { 
  display: flex; 
  align-items: center; 
  gap: 15px; /* 增加间距 */
} 

/* 退出登录按钮样式 */
.user-info .el-button--danger {
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 4px;
}

.el-aside { 
  background-color: #f5f7fa; 
  border-right: 1px solid #e6e6e6; 
} 

.side-menu { 
  height: 100%; 
  border-right: none; 
} 

.el-main { 
  padding: 20px; 
  background-color: #f5f7fa; 
} 
</style> 