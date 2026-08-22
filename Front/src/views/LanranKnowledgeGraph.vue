<template>
  <div class="lanran-graph-container">
    <!-- 图谱控制区 -->
    <div class="graph-controls">
      <button @click="refreshGraph" class="btn primary-btn">刷新图谱</button>
      
      <!-- 预测功能模块 -->
      <div class="predict-section card">
        <h4 class="section-title">知识图谱补全预测</h4>
        
        <div class="form-group">
          <label class="form-label">头节点：</label>
          <select 
            v-model="selectedHeadId" 
            class="form-select"
            @change="clearPredictResult"
          >
            <option value="" disabled>请选择头节点</option>
            <option 
              v-for="node in metaNodes" 
              :key="node.id" 
              :value="node.id"
            >
              {{ node.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">关系类型：</label>
          <select 
            v-model="selectedRelation" 
            class="form-select"
            @change="clearPredictResult"
          >
            <option value="" disabled>请选择关系类型</option>
            <option 
              v-for="rel in metaRelations" 
              :key="rel" 
              :value="rel"
            >
              {{ rel }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <button 
            @click="predictTail" 
            class="btn predict-btn"
            :disabled="predictLoading || !selectedHeadId || !selectedRelation"
          >
            <span v-if="predictLoading">预测中...</span>
            <span v-else>预测尾节点</span>
          </button>
        </div>
        
        <!-- 预测结果展示 -->
        <div class="predict-result">
          <h5 class="result-title">预测结果：</h5>
          <div v-if="predictResult.length > 0" class="result-card">
            <div class="result-item">
              <p><strong>节点ID：</strong>{{ predictResult[0].tail_id }}</p>
              <p><strong>节点名称：</strong>{{ predictResult[0].tail_name }}</p>
                <p><strong>置信度：</strong>{{ (predictResult[0].confidence * 100).toFixed(2) }}%</p>
            </div>
            <button 
            @click="completeRelation" 
             class="btn complete-btn"
            :disabled="completeLoading"
            style="margin-top: 12px;"
            >
      <span v-if="completeLoading">补全中...</span>
      <span v-else>补全此关系</span>
    </button>
          </div>
          <p v-else class="empty-result">{{ predictMsg }}</p>
        </div>
      </div>
    </div>
    
    <!-- 图谱展示区 -->
    <div id="lanran-graph" class="graph-box"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { renderKnowledgeGraph, loadGraphData } from '@/components/D3.js/D3.js';

// 配置
const API_BASE_URL = 'http://localhost:8000/api/lanran_knowledge-graph';
const IMAGE_API_URL = 'http://localhost:8000/images';

// 响应式数据
const metaNodes = ref([]);          // 所有节点元数据
const metaRelations = ref([]);      // 所有关系类型
const selectedHeadId = ref('');     // 选中的头节点ID
const selectedRelation = ref('');   // 选中的关系类型
const predictResult = ref([]);      // 预测结果
const predictMsg = ref('请选择头结点和关系类型，点击预测按钮'); 
const predictLoading = ref(false);  // 预测加载状态
let graphSimulation = null;         // 图谱仿真实例
const completeLoading = ref(false);  
// 初始化图谱
const initGraph = async () => {
  try {
    const graphData = await loadGraphData(API_BASE_URL);
    if (graphSimulation) graphSimulation.stop();
    
    // 渲染图谱
    graphSimulation = renderKnowledgeGraph('lanran-graph', graphData, {
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
    predictMsg.value = "图谱更新中...";
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    if (response.ok) {
      alert("图谱更新成功");
      await initGraph();
      await loadGraphMeta(); 
    } else {
      alert(`图谱更新失败：${data.error || '未知错误'}`);
    }
  } catch (error) {
    console.error("刷新图谱失败：", error);
    alert("图谱更新失败，请重试");
  } finally {
    predictMsg.value = "请选择头节点和关系类型，点击预测按钮";
  }
};

// 加载图谱元数据（节点和关系类型）
const loadGraphMeta = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/meta`);
    const data = await response.json();
    
    if (data.code === 200) {
      metaNodes.value = data.nodes;
      metaRelations.value = data.relations;
      
      // 默认选中第一个有效选项
      if (metaNodes.value.length > 0 && !selectedHeadId.value) {
        selectedHeadId.value = metaNodes.value[0].id;
      }
      if (metaRelations.value.length > 0 && !selectedRelation.value) {
        selectedRelation.value = metaRelations.value[0];
      }
    } else {
      predictMsg.value = `加载元数据失败：${data.error || '未知错误'}`;
    }
  } catch (error) {
    console.error("加载元数据失败：", error);
    predictMsg.value = "加载元数据失败，请刷新页面";
  }
};

// 清空预测结果
const clearPredictResult = () => {
  predictResult.value = [];
  predictMsg.value = "请选择头节点和关系类型，点击预测按钮";
};

// 预测尾节点
const predictTail = async () => {
  // 前置校验
  if (!selectedHeadId.value) {
    predictMsg.value = "请选择头节点";
    return;
  }
  if (!selectedRelation.value) {
    predictMsg.value = "请选择关系类型";
    return;
  }

  try {
    predictLoading.value = true;
    predictMsg.value = "预测中...";
    predictResult.value = [];
    
    // 发送预测请求
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        head_id: selectedHeadId.value,
        relation: selectedRelation.value
      })
    });
    
    const data = await response.json();
    if (data.code === 200) {
      predictResult.value = data.data;
      predictMsg.value = data.data.length > 0 
        ? "预测成功" 
        : "未找到未存在的关系（预测结果已存在于图谱中）";
    } else {
      predictMsg.value = `预测失败：${data.message || '未知错误'}`;
    }
  } catch (error) {
    console.error("预测失败：", error);
    predictMsg.value = "预测失败，请检查后端服务是否正常运行";
  } finally {
    predictLoading.value = false;
  }
};
// 补全关系逻辑
const completeRelation = async () => {
  if (!predictResult.value.length) return;
  
  try {
    completeLoading.value = true;
    const tailId = predictResult.value[0].tail_id;
    
    // 发送补全请求
    const response = await fetch(`${API_BASE_URL}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        head_id: selectedHeadId.value,
        relation: selectedRelation.value,
        tail_id: tailId
      })
    });
    
    const data = await response.json();
    if (data.code === 200) {
      alert(data.message);
      // 补全成功后刷新图谱和预测结果
      await refreshGraph();
      clearPredictResult();
    } else {
      alert(data.message || '关系补全失败');
    }
  } catch (error) {
    console.error("补全关系失败：", error);
    alert("❌ 关系补全失败，请检查后端服务");
  } finally {
    completeLoading.value = false;
  }
};
// 生命周期钩子
onMounted(async () => {
  await initGraph();
  await loadGraphMeta();
});

onUnmounted(() => {
  // 清理图谱仿真实例
  if (graphSimulation) {
    graphSimulation.stop();
    graphSimulation = null;
  }
});
</script>

<style scoped>
/* 全局容器 */
.lanran-graph-container {
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 控制区样式 */
.graph-controls {
  margin-bottom: 16px;
}

/* 按钮通用样式 */
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

.predict-btn {
  background-color: #2196f3;
  color: white;
}

.predict-btn:hover:not(:disabled) {
  background-color: #1976d2;
}

.predict-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 卡片样式 */
.card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 预测区域样式 */
.predict-section {
  max-width: 800px;
}

.section-title {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

/* 表单样式 */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-label {
  width: 80px;
  text-align: right;
  margin-right: 12px;
  font-weight: 500;
  color: #555;
}

.form-select {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 结果展示样式 */
.predict-result {
  margin-top: 20px;
}

.result-title {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.result-card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #eee;
}

.result-item p {
  margin: 8px 0;
  color: #555;
  line-height: 1.5;
}

.empty-result {
  color: #999;
  margin: 0;
  padding: 8px 0;
}

/* 图谱容器样式 */
.graph-box {
  width: 100%;
  height: 800px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-label {
    width: 100%;
    text-align: left;
    margin-bottom: 4px;
  }
  
  .graph-box {
    height: 500px;
  }
}
.complete-btn {
  background-color: #ff9800;
  color: white;
}

.complete-btn:hover:not(:disabled) {
  background-color: #f57c00;
}

.complete-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}
.graph-box :deep(.node) {
  cursor: pointer;
}

/* 图片节点过渡效果 */
.graph-box :deep(.node-image) {
  transition: filter 0.2s ease;
}

/* 圆形节点过渡效果 */
.graph-box :deep(.node-circle) {
  transition: filter 0.2s ease, stroke-width 0.2s ease;
}

/* 文字过渡效果 */
.graph-box :deep(.node-text) {
  transition: fill 0.2s ease, font-weight 0.2s ease;
}

/* 链接过渡效果 */
.graph-box :deep(.graph-link) {
  transition: stroke 0.2s ease, stroke-opacity 0.2s ease, stroke-width 0.2s ease;
}

/* 链接标签过渡效果 */
.graph-box :deep(.graph-link-label) {
  transition: fill 0.2s ease, font-weight 0.2s ease;
}

</style>