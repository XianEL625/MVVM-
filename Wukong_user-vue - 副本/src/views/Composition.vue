<template>
  <div class="card">
      <el-form :model="data.form" style="padding-right: 40px; padding-top: 20px;">
        <el-form-item label="取景地" label-width="80px">
          <el-select
            multiple
            v-model="data.form.department"
            placeholder="内容涉及的取景地"
          >
            <el-option
              v-for="item in data.departmentObjs"
              :key="item.id"
              :label="item.spot_name"
              :value="item.spot_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容类型" label-width="80px">
          <el-select
            v-model="data.form.content_type"
            placeholder="选择"
          >
            <el-option
              v-for="item in data.departmentObjs"
              :key="item.id"
              :label="item.name"
              :value="item.name"
              :multiple="true"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" label-width="80px">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl + '/files/upload'"
            list-type="picture"
            :on-success="handleAvatarSuccess"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容预览信息" label-width="80px">
          <el-input
            v-model="data.form.content_preview"
            autocomplete="off"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// 定义 baseUrl
const baseUrl = 'https://your-api-base-url';

const data = reactive({
  formVisible: true, // 控制对话框显示
  departmentObjs: [
    { id: 1, spot_name: '地点1', name: '类型1' },
    { id: 2, spot_name: '地点2', name: '类型2' }
  ],
  name: null,
  members: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
  form: {
    department: [], // 取景地（多选）
    content_type: '', // 内容类型（单选）
    content_preview: '',
    avatar: ''
  }
});

// 处理图片上传成功
const handleAvatarSuccess = (res) => {
  console.log('上传成功:', res);
  data.form.avatar = res.data;
};

// 保存表单
const save = () => {
  console.log('保存表单数据:', data.form);
  data.formVisible = false; // 保存后关闭对话框
};
</script>

<style scoped>
/* 可添加自定义样式 */
</style>