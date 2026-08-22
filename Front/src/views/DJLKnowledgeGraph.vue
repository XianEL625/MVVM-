<template>
  <div class="lanran-graph-container">
    <!-- 图谱控制区 -->
    <div class="graph-controls">
      <button @click="refreshGraph" class="btn primary-btn">刷新图谱</button>
    </div>
    
    <!-- 图谱展示区 -->
    <div id="djl-graph" class="graph-box"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { renderKnowledgeGraph, loadGraphData } from '@/components/D3.js/D3.js';

// 配置
const API_BASE_URL = 'http://localhost:8000/api/djl_knowledge-graph';

// 响应式数据
let graphSimulation = null;

// 初始化图谱
const initGraph = async () => {
  try {
    const graphData = await loadGraphData(API_BASE_URL);
    if (graphSimulation) graphSimulation.stop();
    
    // 渲染图谱
    graphSimulation = renderKnowledgeGraph('djl-graph', graphData, {
      width: 1400,
      height: 900,
      linkDistance: 180,
      chargeStrength: -600,
      collideRadius: 60
    });
  } catch (error) {
    console.error("图谱初始化失败：", error);
    alert("图谱加载失败，请检查后端服务是否正常运行");
  }
};

// 刷新图谱
const refreshGraph = async () => {
  try {
    const graphData = await loadGraphData(API_BASE_URL);
    if (graphSimulation) graphSimulation.stop();
    
    graphSimulation = renderKnowledgeGraph('djl-graph', graphData, {
      width: 1400,
      height: 900,
      linkDistance: 180,
      chargeStrength: -600,
      collideRadius: 60
    });
    
    alert("✅ 图谱刷新成功");
  } catch (error) {
    console.error("刷新图谱失败：", error);
    alert("❌ 图谱刷新失败，请重试");
  }
};

// 生命周期钩子
onMounted(async () => {
  await initGraph();
});

onUnmounted(() => {
  if (graphSimulation) {
    graphSimulation.stop();
    graphSimulation = null;
  }
});
</script>

<style scoped>
.lanran-graph-container {
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.graph-controls {
  margin-bottom: 16px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.primary-btn {
  background-color: #42b983;
  color: white;
}

.primary-btn:hover {
  background-color: #359469;
}

.graph-box {
  width: 100%;
  height: 800px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  cursor: grab;
  overflow: hidden;
}

.graph-box:active {
  cursor: grabbing;
}

/* 让D3.js模块生成的元素能正确继承容器样式 */
.graph-box :deep(.node) {
  cursor: pointer;
}

.graph-box :deep(.node-circle) {
  transition: filter 0.2s ease, stroke-width 0.2s ease, r 0.2s ease;
}

.graph-box :deep(.node-text) {
  transition: fill 0.2s ease, font-weight 0.2s ease, font-size 0.2s ease, opacity 0.2s ease;
  user-select: none;
}

.graph-box :deep(.graph-link) {
  transition: stroke 0.2s ease, stroke-opacity 0.2s ease, stroke-width 0.2s ease;
}

.graph-box :deep(.graph-link-label) {
  transition: fill 0.2s ease, font-weight 0.2s ease, font-size 0.2s ease;
  user-select: none;
  pointer-events: none;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .graph-box {
    height: 500px;
  }
}
</style>