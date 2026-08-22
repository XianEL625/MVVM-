<template>
    <div class="login-container">
      <div class="login-card">
        <h1>数字平台</h1>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-radio-group v-model="loginForm.role">
              <el-radio label="user">普通用户</el-radio>
              <el-radio label="researcher">研究者</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">登录</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="login-tips">
          <p>普通用户: user / password123</p>
          <p>研究者: researcher / research123</p>
        </div> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../stores/user'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const userStore = useUserStore()
  const loginFormRef = ref(null)
  const loading = ref(false)
  
  const loginForm = reactive({
    username: '',
    password: '',
    role: 'user'
  })
  
  onMounted(() => {
    userStore.initialize()
  })
  
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }]
  }
  
  const handleLogin = () => {
  loginFormRef.value.validate(async valid => {
    if (!valid) return

    loading.value = true

    const { username, password, role } = loginForm

    if (userStore.login(username, password, role)) {
      ElMessage.success('登录成功')

      if (role === 'user') {
        await router.push({ name: 'blueExhibition' })
      } else {
        await router.push({ name: 'knowledgeGraph' })
      }
    } else {
      ElMessage.error('用户名或密码错误')
    }

    loading.value = false
  })
}
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .login-card {
    width: 400px;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-weight: 500;
  }
  
  .login-button {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
  }
  
  .login-tips {
    margin-top: 20px;
    color: #999;
    font-size: 14px;
  }
  </style>