<template background-image: url="../assets/背景2.png";>
    <div  class="card" style="width: 50%;padding:40px 20px; ">
        <el-form :model="data.form" style=" padding-right: 40px;padding-top: 40px;padding-bottom: 40px;" >
        <el-form-item  >
            <div style="width: 100%;display: flex;justify-content:center;margin: 20px;">
                <el-upload
    class="avatar-uploader"
    :action="$baseUrl+'/files/upload'"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
  >
    <img v-if="data.form.avatar" :src="data.form.avatar" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload> 
            </div>
</el-form-item> 
            <!-- 修改这里，通过data.form来正确获取数据 -->
        <el-form-item label="用户名" label-width="80px">
        <el-input v-model="data.form.username" autocomplete="off" :disabled="true" />
      </el-form-item>
      <el-form-item label="密码" label-width="80px">
        <el-input v-model="data.form.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px">
        <el-input v-model="data.form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="注册时间" label-width="80px">
        <el-input v-model="data.form.datatime" autocomplete="off" />
      </el-form-item>
      <div style="text-align: center;">
        <el-button @click="updateUser" type="primary" style="background-color:rgb(0,0,0);padding: 20px,30px;">更新个人信息</el-button>
      </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  form: JSON.parse(localStorage.getItem("self-account") || '{}')
});

const handleAvatarSuccess = (res) => {
  data.form.avatar = proxy.$baseUrl + res.data;
}

const updateUser = async () => {
  try {
    const endpointMap = {
      admin: 'admins/updateById',
      patient: 'patients/updateById',
      doctor: 'doctors/updateById'
    };
    
    const res = await request.post(endpointMap[data.form.role], data.form);
    
    if(res.code === 200) {
      ElMessage.success('更新成功');
      localStorage.setItem("self-account", JSON.stringify(data.form));
      await reloadUserInfo(); // 新增数据刷新逻辑
    }
  } catch (error) {
    ElMessage.error('更新失败');
  }
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>