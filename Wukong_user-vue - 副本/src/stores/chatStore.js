import { defineStore } from 'pinia'
import request from '@/utils/request'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [], // 当前显示的聊天记录
    conversations: [[]], // 所有聊天会话的数组
    activeConversation: 0, // 当前激活的聊天索引
  }),
  actions: {
    async sendMessage(message) {
      try {
        // 添加用户消息
        this.messages.push({ role: 'user', content: message })

        // 发送请求到后端
        const response = await request.post('/chat/', {
          message,
          context: this.messages, // 发送完整上下文
        })

        // 添加AI回复
        this.messages.push({ role: 'assistant', content: response.data.message })
        this.conversations[this.activeConversation] = [...this.messages]
      } catch (error) {
        throw new Error('发送消息失败: ' + error.message)
      }
    },
    // 清空消息
    clearMessages() {
      this.messages = []
      this.conversations[this.activeConversation] = []
    },
  },
})