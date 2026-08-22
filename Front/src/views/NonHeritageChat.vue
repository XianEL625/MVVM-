<template>
  <!-- 右下角悬浮智能问答窗口 -->
  <div class="chat-float-wrapper">
    <button class="chat-btn" @click="openChat" style="font-size: 22px;width: 150px;">
      非遗智能问答
    </button>

    <div class="chat-window" v-show="showWindow">
      <div class="chat-header">
        <h3>非遗知识问答</h3>
        <button class="close-btn" @click="showWindow = false">×</button>
      </div>

      <div class="cat-tabs">
        <button :class="{active: domain === 'lanran'}" @click="switchDomain('lanran')">
          蓝染技艺体系
        </button>
        <button :class="{active: domain === 'djl'}" @click="switchDomain('djl')">
          黔东南苗族吊脚楼
        </button>
      </div>

      <div class="quick-questions" v-if="domain">
        <div class="q-item" v-for="q in commonQuestions" :key="q" @click="() => sendQuestion(q)">
          {{ q }}
        </div>
      </div>

      <div class="chat-body">
        <template v-for="(item, i) in messages" :key="i">
          <div class="msg user" v-if="item.role === 'user'">
            {{ item.content }}
          </div>
          <div class="msg ai" v-if="item.role === 'ai'">
            {{ item.content }}
          </div>
        </template>
      </div>

      <div class="chat-input-bar">
        <!-- 回车事件显式传空，避免传入事件对象 -->
        <input v-model="question" @keyup.enter="sendQuestion()" placeholder="请输入问题..." />
        <button @click="sendQuestion()">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const showWindow = ref(false)
const domain = ref('')
const question = ref('')
const messages = ref([])

const commonQuestions = ref([
  '包含什么？',
  '承载什么？',
  '体现什么？'
])

const openChat = () => {
  showWindow.value = true
}

const switchDomain = (val) => {
  domain.value = val
  messages.value = []
}

// 加固参数校验，确保q是字符串类型
const sendQuestion = async (text = null) => {
  // 优先使用传入的文本（快捷问题），否则使用输入框文本
  let q = text || question.value.trim()
  
  // 关键：强制转字符串，过滤事件对象/非字符串类型
  q = String(q).trim()

  // 空值/未选领域校验
  if (!q || !domain.value) {
    if (!domain.value) alert('请先选择领域（蓝染技艺体系/黔东南苗族吊脚楼）')
    if (!q) alert('请输入问题内容')
    return
  }

  // 清空输入框
  question.value = ''

  // 添加用户消息（确保内容是字符串）
  messages.value.push({ role: 'user', content: q })

  try {
    const res = await axios.post('http://localhost:8000/api/qa', {
      domain: domain.value,
      question: q
    })

    // 添加AI回复
    messages.value.push({
      role: 'ai',
      content: res.data.answer || '暂无相关答案'
    })
  } catch (err) {
    console.error('问答接口请求失败：', err)
    messages.value.push({
      role: 'ai',
      content: '请求失败，请检查后端是否启动或网络是否正常'
    })
  }
}
</script>

<style scoped>
/* 样式部分不变，省略 */
.chat-float-wrapper {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}

.chat-btn {
  width: 120px;
  height: 42px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 21px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chat-window {
  position: absolute;
  right: 0;
  bottom: 50px;
  width: 360px;
  height: 580px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 12px 15px;
  background: #1677ff;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-header h3 {
  margin: 0;
  font-size: 16px;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.cat-tabs {
  display: flex;
  padding: 8px;
  gap: 6px;
  border-bottom: 1px solid #eee;
}
.cat-tabs button {
  flex: 1;
  padding: 6px 0;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.cat-tabs button.active {
  background: #1677ff;
  color: #fff;
  border-color: #1677ff;
}

.quick-questions {
  padding: 8px 12px;
  font-size: 13px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-bottom: 1px solid #eee;
}
.q-item {
  padding: 4px 8px;
  background: #f0f7ff;
  color: #1677ff;
  border-radius: 4px;
  cursor: pointer;
}
.q-item:hover {
  background: #d7eaff;
}

.chat-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #fafafa;
}
.msg {
  max-width: 75%;
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
}
.msg.user {
  background: #1677ff;
  color: #fff;
  margin-left: auto;
}
.msg.ai {
  background: #fff;
  border: 1px solid #eee;
  margin-right: auto;
}

.chat-input-bar {
  display: flex;
  padding: 8px;
  border-top: 1px solid #eee;
}
.chat-input-bar input {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
}
.chat-input-bar button {
  width: 70px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
</style>