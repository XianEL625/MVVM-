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
      <el-form-item label="姓名" label-width="80px">
        <el-input v-model="data.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话" label-width="80px">
        <el-input v-model="data.form.tel" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px">
        <el-input v-model="data.form.email" autocomplete="off" />
      </el-form-item>
      <div style="text-align: center;">
        <el-button @click="updateUser" type="primary" style="background-color:rgb(113,73,213);padding: 20px,30px;">更新个人信息</el-button>
      </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

//文件
const handleAvatarSuccess=(res)=>{
    console.log(res.data)
    data.form.avatar=res.data
}

// 对从localStorage获取数据进行更安全的处理
const data = reactive({
    form: JSON.parse(localStorage.getItem("self-account"))
});
const emit=defineEmits(['updateUser'])
//更新个人信息

const updateUser = () => {
    if(data.form.role==="admin"){
        request.post('admins/updataById',JSON.stringify(data.form)).then(res=>{
            if(res.code==="200"){
                ElMessage.success('更新成功')
                localStorage.setItem("self-account",JSON.stringify(data.form))
                emit('updateUser')
            }else{
                ElMessage.error(res.msg);
            }
        }

        )
    }else if(data.form.role==="patient"){
        request.post('patients/updataById',JSON.stringify(data.form)).then(res=>{
            if(res.code==="200"){
                ElMessage.success('更新成功')
                localStorage.setItem("self-account",JSON.stringify(data.form))
                emit('updateUser')
            }else{
                ElMessage.error(res.msg);
            }
        })
    }else{
        request.post('doctors/updataById',JSON.stringify(data.form)).then(res=>{
            if(res.code==="200"){
                ElMessage.success('更新成功')
                localStorage.setItem("self-account",JSON.stringify(data.form))
                emit('updateUser')
            }else{
                ElMessage.error(res.msg);
            }
        })
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