<template>
    <div class="building-tour">
      <div class="tour-content">
        <div class="tour-intro" style="font-size: 22px;" >
          <p >吊脚楼是中国南方少数民族地区特有的建筑形式，具有悠久的历史和独特的文化价值。通过虚拟漫游，您可以身临其境地体验吊脚楼的建筑特色和文化内涵。</p>
        </div>
        
        <div class="tour-view">
          <div class="placeholder-view">
            <!-- <h3>虚拟漫游视图</h3>
            <p>此处将显示3D虚拟漫游界面</p> -->
            <div v-if="!unityLoaded" class="unity-placeholder" style="font-size: 22px;">
            <p>吊脚楼虚拟漫游资源较大，点击后开始加载。</p>
            <el-button type="large" @click="unityLoaded = true">
              进入吊脚楼漫游
                </el-button>
            </div>
<!-- 隔离加载unity，避免unity与vue发生冲突 -->
<iframe
  v-else
  src="/unity-build/index.html"
  width="100%"
  height="600px"
  frameborder="0"
  scrolling="no"
></iframe>
          </div>
          
        </div>
        
        <div class="tour-info">
          <el-tabs>
            <el-tab-pane label="建筑特色" style="font-size: 22px;">
              <div class="info-content">
                <p>吊脚楼多建于山坡地带，一般为木质结构，三层设计。底层用于饲养家禽家畜，中层是主要生活区域，顶层用于储存粮食和晾晒农作物。</p>
                <p>吊脚楼的主要特点是"吊脚"设计，即房屋的一部分悬空于地面之上，通过木柱支撑，既适应山地地形，又能防潮防兽。</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="文化内涵" style="font-size: 22px;">
              <div class="info-content">
                <p>吊脚楼不仅是一种建筑形式，更是少数民族文化的重要载体。它体现了少数民族与自然和谐共处的生活理念，以及对自然资源的合理利用。</p>
                <p>在吊脚楼中，人们举行各种传统仪式和节日活动，传承着独特的民族文化和精神信仰。</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史演变" style="font-size: 22px;">
              <div class="info-content">
                <h4>吊脚楼历史演变</h4>
                <p>吊脚楼的历史可以追溯到唐代，经过千年的发展演变，形成了多种地域特色和民族风格。</p>
                <p>随着现代化进程，传统吊脚楼正面临保护与发展的挑战，许多地区开始重视吊脚楼的文化价值，采取措施保护这一珍贵的建筑遗产。</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import VrMuseum from './VrMuseum.vue';
    import { ref } from 'vue'

const unityLoaded = ref(false)  //懒加载：初始状态不加载

  // 组件逻辑
  </script>
  
  <style scoped>
  .building-tour {
    padding: 20px;
  }
  
  h2 {
    margin-bottom: 30px;
    font-weight: 500;
    color: #333;
    text-align: center;
  }
  
  .tour-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .tour-intro {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .tour-view {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .placeholder-view {
    height: 600px;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .tour-controls {
    display: flex;
    justify-content: center;
  }
  
  .tour-info {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .info-content {
    padding: 10px;
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
    :deep(.el-tabs__item) {
  font-size: 22px !important;
}
  </style>