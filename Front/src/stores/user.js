import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userRole: null, // 'user' 或 'researcher'
    username: '',
    isInitialized: false // 添加初始化状态标记
  }),
  
  actions: {
    // 初始化时从本地存储恢复状态
    initialize() {
      if (this.isInitialized) return
      
      const authData = localStorage.getItem('auth')
      if (authData) {
        try {
          const { username, role } = JSON.parse(authData)
          this.isLoggedIn = true
          this.userRole = role
          this.username = username
        } catch (e) {
          console.error('解析本地存储的认证数据失败:', e)
          this.clearAuthData()
        }
      }
      this.isInitialized = true
    },
    
    // 登录方法
    login(username, password, role) {
      // 固定用户名和密码验证
      const validUsers = {
        user: { username: 'user', password: '11' },
        researcher: { username: 'researcher', password: '11' }
      }
      
      const validUser = validUsers[role]
      
      if (validUser && username === validUser.username && password === validUser.password) {
        this.isLoggedIn = true
        this.userRole = role
        this.username = username
        
        // 保存到本地存储（不存密码）
        this.saveAuthData()
        
        return true
      }
      return false
    },
    
    // 保存认证数据到本地存储
    saveAuthData() {
      localStorage.setItem('auth', JSON.stringify({
        username: this.username,
        role: this.userRole
      }))
    },
    
    // 登出方法
    logout() {
      this.isLoggedIn = false
      this.userRole = null
      this.username = ''
      this.clearAuthData()
    },
    
    // 清除本地存储的认证数据
    clearAuthData() {
      localStorage.removeItem('auth')
    }
  },
  
  // 添加getters便于访问
  getters: {
    isUser: (state) => state.userRole === 'user',
    isResearcher: (state) => state.userRole === 'researcher'
  }
})