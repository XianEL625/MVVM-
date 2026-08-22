<template>
  <div  class="card"  style="margin-bottom: 10px; font-size: 18px;">
    你好，用户！欢迎使用本系统
  </div>
  <div class="demo-collapse class" style="margin-bottom: 5px;">
    <div style="margin-bottom: 15px; font-weight: bold; font-size: 22px;">系统公告</div>
    <el-collapse v-model="data.activeName" accordion v-if="data.form.length > 0">
      <el-collapse-item
        v-for="item in data.form"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      >
        <div style="padding: 20px" v-html="item.context"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '../utils/request'; // 假设 request 是你的 axios 封装

// 初始化数据对象
const data = reactive({
  form: [], // 存储公告列表
  activeName: '', // 默认展开的公告 ID（初始为空字符串）
  account: JSON.parse(localStorage.getItem('account') || '{}') // 用户信息
});

// 获取系统公告
const findNotice = async () => {
  try {
    const res = await request.get('/notices/selectAll');
    if (res.code === '200' && Array.isArray(res.data)) {
      data.form = res.data;
      console.log('Fetched notices:', data.form);
      // 如果有数据，设置默认展开第一个公告
      if (data.form.length > 0) {
        data.activeName = String(data.form[0].id);
      }
    } else {
      handleError(res);
    }
  } catch (error) {
    console.error('Failed to fetch notices:', error);
    ElMessage.error('网络出现问题，请检查网络连接后重试');
  }
};

// 错误处理
const handleError = (error) => {
  if (error.code === '404') {
    ElMessage.error('请求的系统公告资源不存在，请联系管理员');
  } else if (error.code === '500') {
    ElMessage.error('服务器内部出现错误，请稍后再试');
  } else {
    ElMessage.error(error.message || '获取公告失败');
  }
};

// 组件挂载时获取公告
onMounted(() => {
  findNotice();
});
</script>

<style scoped>

.demo-collapse {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* 优化折叠面板样式 */
:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
}

:deep(.el-collapse-item__content) {
  font-size: 14px;
  line-height: 1.6;
}
</style>