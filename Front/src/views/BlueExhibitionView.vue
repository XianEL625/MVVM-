<template>
    <div class="blue-exhibition">
      <div class="tour-content">
        <div class="tour-intro" style="font-size: 22px;">
          <p>蓝染，作为一种古老的染色工艺，以其独特的魅力流传千年。它从含蓝靛色素的植物中提取染料，如蓼蓝、木蓝、菘蓝和马蓝等，再通过一系列复杂而精妙的工序，赋予织物深邃迷人的蓝色。这种源于自然的色彩，不仅色泽独特，而且具有环保、天然的特性，深受人们喜爱。</p>
        </div>
        
        <div class="tour-view">
          <div class="placeholder-view">
            <!-- <h3>虚拟漫游视图</h3>
            <p>此处将显示3D虚拟漫游界面</p> -->
            <VrMuseum/>
          </div>
          
        </div>
        
        <div class="tour-info">
          <el-tabs>
            <el-tab-pane label="蓝染特色" style="font-size: 22px;">
              <div class="info-content">
                <p>蓝染的显著特色体现在其独特的技艺原理上。制取染料时，需将含有靛苷的蓝草置于水中浸泡发酵，靛苷上的葡萄糖会水解产生糖酶和稀酸，促使苷键断开，让用于染色的吲哚酚从植物细胞中游离出来。游离的吲哚酚在热水或弱碱性溶液中迅速氧化成靛蓝，呈现为不溶于水的悬浮物状态，最终沉淀。在染色环节，传统方法是用酒糟、草木灰与靛蓝在水里混合进行还原，使靛蓝还原为可溶于水的隐色体靛白，隐色体靛白在弱碱环境里呈豆绿色，接触空气后发生氧化作用，重新还原成为靛蓝并附着在织物纤维上 ，形成牢固的染色效果。</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="文化内涵" style="font-size: 22px;">
              <div class="info-content">
                <p>蓝染不仅是一种染色技艺，更是一种文化载体，蕴含着深厚的文化内涵。它体现了人与自然和谐共生的理念，从蓝草的种植、染料的提取到织物的染色，整个过程都依赖于自然的馈赠和人们对自然规律的把握。在许多民族文化中，蓝染织物还与传统仪式、节日紧密相连，承载着人们对美好生活的向往和祝福。</p>
                <p>例如在一些少数民族地区，蓝染的服饰会在重要的祭祀、婚礼等场合穿着，其独特的图案和色彩象征着吉祥、幸福和家族传承。而且蓝染工艺的传承也凝聚着匠人们的智慧和匠心，一代又一代的传承者通过口传心授，将这门技艺延续至今，传承过程本身就是对传统文化的坚守和弘扬。</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { defineAsyncComponent } from 'vue'
    
    const VrMuseum = defineAsyncComponent({
  loader: () => import('./VrMuseum.vue'),
  loadingComponent: {
    template: '<div class="loading-box">蓝染展厅加载中，请稍候...</div>'
  },
  errorComponent: {
    template: '<div class="loading-box">蓝染展厅加载失败，请刷新重试</div>'
  },
  delay: 200,
  timeout: 30000
})


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