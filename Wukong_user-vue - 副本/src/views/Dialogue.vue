<template>
<div class="card">
 <div class="chat-wrapper">
<!-- 左侧聊天记录查看栏 -->
    <div class="sidebar">
      <h3>聊天记录</h3>
      <ul>
        <li
          v-for="(conversation, index) in chatStore.conversations"
          :key="index"
          :class="{ active: chatStore.activeConversation === index }"
          @click="selectConversation(index)"
        >
          聊天 {{ index + 1 }} - {{ conversation[0]?.content || '无标题' }}
        </li>
      </ul>
      <button @click="newConversation">新建聊天</button>
    </div>
<div class="chat-container">
    <!-- 消息展示区域 -->
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in chatStore.messages" :key="index" :class="['message', message.role]">
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <!-- 输入区域 -->
    <div class="chat-input">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        :disabled="isSending"
      />
      <button @click="sendMessage" :disabled="isSending">
        {{ isSending ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
  </div>
</div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useChatStore } from '@/stores/chatStore'

// Pinia 状态管理
const chatStore = useChatStore()
const inputMessage = ref('')
const isSending = ref(false)
const messageContainer = ref(null)

// 选择聊天记录
const selectConversation = (index) => {
  chatStore.activeConversation = index
  chatStore.messages = [...chatStore.conversations[index]]
}

// 新建聊天
const newConversation = () => {
  chatStore.conversations.push([])
  chatStore.activeConversation = chatStore.conversations.length - 1
  chatStore.messages = []
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  isSending.value = true

  try {
    await chatStore.sendMessage(inputMessage.value)
    inputMessage.value = ''
    chatStore.conversations[chatStore.activeConversation] = [...chatStore.messages]
    await nextTick()
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  } catch (error) {
    console.error('发送消息失败:', error)
  } finally {
    isSending.value = false
  }
}

// 初始化时滚动到底部
onMounted(() => {
  if (!chatStore.conversations.length) newConversation()
  messageContainer.value.scrollTop = messageContainer.value.scrollHeight
})
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}

.sidebar h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
  background-color: #fff;
  transition: background-color 0.3s;
}

.sidebar li:hover,
.sidebar li.active {
  background-color: #e9ecef;
}

.sidebar button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sidebar button:hover {
  background-color: #0056b3;
}

.card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chat-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
}

.chat-messages {
  height: 780px;
  width: 900px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
}

.message.user {
  text-align: right;
}

.message.assistant {
  text-align: left;
}

.message-content {
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  background-color: #f1f1f1;
  max-width: 70%;
}

.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>