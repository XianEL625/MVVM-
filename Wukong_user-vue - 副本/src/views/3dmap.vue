```vue
<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div style="width: 300px; font-family: 宋体; display: flex; align-items: center;">
        <img style="width: 40px; padding-left: 15px;" src="../assets/images/hshlogo.png" alt="">
        <span style="font-size:20px; color:white">黑神话智能巡礼交互系统</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu
        :default-active="activeIndex"
        font-family="宋体"
        font-size="20px"
        mode="horizontal"
        background-color="rgb(0,0,0)"
        text-color="#eeeef0"
        style="flex:1; justify-content: flex-end; border-bottom: none;"
        @select="handleMenuSelect"
      >
        <el-menu-item index="1">地图</el-menu-item>
        <el-menu-item index="2">我的合成</el-menu-item>
        <el-menu-item index="3">分享社区</el-menu-item>
      </el-menu>
      <div style="width: fit-content; display:flex; align-items: center; padding-right:10px;">
        <el-dropdown>
          <img :src="data.self_account.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="" style="width: 40px; height:40px; border-radius: 50%;">
          <template #dropdown>
            <el-dropdown-menu style="border-right: 1px solid rgb(194,176,231,1);">
              <el-dropdown-item>
                <div @click="selfshow">个人信息</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="logout">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span style="color:white; margin-left:5px;">{{ data.self_account.username }}</span>
      </div>
    </div>
    <!-- 原有内容 -->
    <div ref="container" class="app"></div>
    <div ref="infobox" v-show="currentInfo?.name" class="g-info">
      {{ currentInfo?.name || "--" }}
    </div>
    <div class="search-container">
      <div class="card" >
      <div style="margin-bottom: 5px;">
        <el-input
          v-model="input1"
          style="width: 380px"
          size="large"
          placeholder="城市、作品"
          :suffix-icon="Search"
          @input="handleSearch"
        />
      </div>
      <div style="margin-bottom: 5px;">
        <div style="margin-bottom: 5px;"><span>取景地筛选：</span></div>
        <el-button type="info" @click="recommend" v-model="data.recommend">战斗场景</el-button>
        <el-button type="info" @click="recommend" v-model="data.recommend">文化古迹</el-button>
        <el-button type="info" @click="recommend" v-model="data.recommend">自然风光</el-button>
      </div>
      <div style="margin-bottom: 5px;">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="最近更新" name="first">
        <div>
        <el-scrollbar height="500px" style="width:380px">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>  
      </el-scrollbar>
        </div>
        </el-tab-pane>
        <el-tab-pane label="热门取景地" name="second">
        <div>
        <el-scrollbar height="500px" style="width:380px">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>  
        </el-scrollbar>
        </div>
        </el-tab-pane>
        <el-tab-pane label="个性推荐" name="third">
        <div>
        <el-scrollbar height="500px" style="width:380px">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>  
        </el-scrollbar>
        </div>
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch,reactive } from 'vue';
import { World } from '../World/index.js';
import levelMap from '@/assets/json/level-geo.json';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// Reactive state
const activeIndex = ref('1');
const data = ref({
  self_account: {
    username: 'User',
    avatar: ''
  }
});
const currentInfo = ref(null);
const infobox = ref(null);
const container = ref(null);
const input1 = ref('');
const worldInstance = ref(null); // Store World instance

// Initialize Three.js World
const initWorld = () => {
  if (!container.value) {
    console.error('Container ref is null');
    return;
  }
  
  try {
    const world = new World(container.value);
    world.init(levelMap);
    world.start();
    worldInstance.value = world; // Store instance for interaction
    console.log('World initialized, canvas:', container.value.querySelector('canvas'));
  } catch (error) {
    console.error('Failed to initialize World:', error);
    ElMessage.error('Failed to initialize map');
  }
};

// Handle menu selection
const handleMenuSelect = (index) => {
  activeIndex.value = index;
  if (worldInstance.value) {
    switch (index) {
      case '1':
        worldInstance.value.updateView('map'); // Example: Switch to map view
        break;
      case '2':
        worldInstance.value.updateView('synthesis'); // Example: Show synthesis view
        break;
      case '3':
        worldInstance.value.updateView('community'); // Example: Show community view
        break;
    }
  }
};

// Handle search input
const handleSearch = (value) => {
  if (worldInstance.value && value) {
    // Example: Search for a location in the Three.js scene
    worldInstance.value.searchLocation(value);
  }
};

// Dropdown actions
const selfshow = () => {
  ElMessage.info('Displaying user profile');
  // Example: Update Three.js scene to show user-specific data
  if (worldInstance.value) {
    worldInstance.value.highlightUserData(data.value.self_account.username);
  }
};

const logout = () => {
  ElMessage.success('Logged out');
  data.value.self_account = { username: 'Guest', avatar: '' };
  if (worldInstance.value) {
    worldInstance.value.resetScene(); // Example: Reset scene on logout
  }
};

// Watch search input for debounced updates
watch(input1, (newValue) => {
  if (!newValue) {
    currentInfo.value = null; // Clear info box when search is cleared
    if (worldInstance.value) {
      worldInstance.value.clearSearch(); // Clear search highlights
    }
  }
});
const handleClick = () => {
}
// Lifecycle hooks
onMounted(() => {
  initWorld();
});

onUnmounted(() => {
  if (worldInstance.value) {
    worldInstance.value.dispose(); // Clean up Three.js resources
  }
});
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgb(0,0,0);
  display: flex;
  align-items: center;
  z-index: 1000; /* Ensure header is topmost */
}

.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
  z-index: 0; /* Below header and UI elements */
}

.g-info {
  position: fixed;
  top: 70px; /* Below header */
  left: 10px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  padding: 0 20px;
  color: #fff;
  line-height: 30px;
  text-align: center;
  z-index: 10;
}

.search-container {
  position: fixed;
  top: 130px; /* Below header and info box */
  left: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 16px;
}

:deep(.province-label) {
  transform: translate(-50%, -50%);
  white-space: nowrap;
  transition: all 0.3s ease;
  pointer-events: none;
  color: white;
  font-size: 10px;
  text-shadow: 0 0 5px black;
}

:deep(.province-label:hover) {
  color: #3EC5FB;
  transform: translate(-50%, -50%) scale(1.1);
}

:deep(.city-label) {
  color: white;
  font-size: 8px;
  text-shadow: 0 0 5px black;
}

.gsap-animate {
  transition: all 1s ease-in-out;
}
</style>
```