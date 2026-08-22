<template>
    <div>
        <div class="card" style="margin-bottom: 5px;">
            <el-table :data="data.members" stripe>
              <el-table-column prop="patientName" label="患者姓名" />
                <el-table-column prop="doctorName" label="医生姓名" />
                <el-table-column prop="time" label="就诊时间" />
                <el-table-column prop="detail" label="医嘱病历" >
                <template #default="scope">
                    <el-button type="primary" @click="view(scope.row.detail)">查看内容</el-button>
                </template>
                </el-table-column>
                <el-table-column prop="time" label="就诊时间" >
                    <!-- <template #default="scope">
                    <div v-html="scope.row.detail"></div>
                    </template> -->
                </el-table-column> 
                <el-table-column prop="hospitalization" label="是否住院" />
                <el-table-column fixed="right" label="操作" min-width="80">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit" @click="handleUpdate(scope.row)" v-if="data.account.role !== 'patient'">填写病历</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-bottom: 15px;">
                <el-pagination @size-change="load" @current-change="load"
                    v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                    :page-sizes="[5, 10, 15, 20, 30]" background layout="total,sizes,prev, pager, next,jumper"
                    :total="data.total" />
            </div>
        </div>
        <el-dialog  title="就诊信息表" v-model="data.formVisible" width="800">
    <el-form :model="data.form" style="padding-right: 40px;padding-top: 20px;">

      <el-form-item label="内容" label-width="80px">
        <div style="border: 1px solid #ccc; width: 100%">
  <Toolbar
    style="border-bottom: 1px solid #ccc"
    :editor="editorRef"
    :mode="mode"
  />
  <Editor
    style="height: 500px; overflow-y: hidden;"
    v-model="data.form.detail"
    :mode="mode"
    :defaultConfig="editorConfig"
    @onCreated="handleCreated"
  />
</div>
      </el-form-item>
      <el-form-item label="是否住院" label-width="80px">
        <el-radio-group v-model="data.form.hospitalization">
        <el-radio value="是" label="是"></el-radio>
        <el-radio value="否" label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog title="内容" v-model="data.viewVisible" width="50%" :close-on-click-modal="false">
  <div class="editor-content-view" style="padding: 20px" v-html="data.content"></div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="data.viewVisible = false">关闭</el-button>
    </span>
  </template> 
</el-dialog>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import {Edit } from "@element-plus/icons-vue";
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import _ from 'lodash';
import '@wangeditor/editor/dist/css/style.css'; 
import { onBeforeUnmount, ref,shallowRef } from 'vue';  
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';  

const data = reactive({
    departmentObjs: [],
    state: null,
    members: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    content:null,
    viewVisible:false,
    account: JSON.parse(localStorage.getItem("account")),
});

//* wangEditor5 初始化开始 */
const baseUrl = process.env.VUE_APP_BASE_URL
const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const mode = 'default'
const editorConfig = { MENU_CONF: {} }

// 图片上传配置
editorConfig.MENU_CONF['uploadImage'] = {
  server: baseUrl + '/files/wang/upload', // 服务端图片上传接口
  fieldName: 'file' // 服务端图片上传接口参数
}

// 组件销毁时，也要销毁编辑器，否则可能会造成内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  } else {
    console.warn('尝试销毁编辑器时，编辑器实例不存在，可能存在初始化问题');
  }
});

// 记录editor实例，重要！
const handleCreated = (editor) => {
  editorRef.value = editor
}
/* wangEditor5 初始化结束 */

onMounted(() => {
    load();
});

//查看内容
const view=(content)=>{
    data.content=content
    data.viewVisible=true
}
//const load分页\查询接口
const load = () => {
  if(data.account.role==="admin"){
    request({
        url: "/diagnosis/selectPage",
        method: "get",
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
        }
    }).then(res => {
        data.members = res.data;
        data.total = res.total;
    }).catch(err => {
        ElMessage.error('查询数据失败，请稍后重试');
        console.error('查询接口请求出错：', err);
    });}
    else{
      request({
        url: "/diagnosis/selectPage2",
        method: "get",
        params: {
            pageNum: data.pageNum,
            pageSize: data.pageSize,
            role:data.account.role,
            username:data.account.username
        }
    }).then(res => {
        data.members = res.data;
        data.total = res.total;
    }).catch(err => {
        ElMessage.error('查询数据失败，请稍后重试');
        console.error('查询接口请求出错：', err);
    });
    }
};

// 编辑保存
const save = () => {
    // 发起异步请求
    request.post('/diagnosis/updataById', JSON.stringify(data.form))
      .then(res => {
            if (res.code === "200") {
                ElMessage.success("编辑成功");
            } else {
                ElMessage.error("编辑失败");
            }
            // 确保在请求成功或失败的回调中更新 formVisible 状态和调用 load 函数
            data.formVisible = false;
            load();
        })
      .catch(error => {
            // 处理请求错误情况，例如可以在这里打印错误信息或给用户提示
            console.error("保存时发生错误:", error);
            ElMessage.error("保存过程出错，请稍后重试");
        });
};
//关闭编写病历表
const cancelEdit = () => {
    // 先隐藏对话框
    data.formVisible = false;
    // 可以添加一个短暂的延迟（使用 setTimeout）后再重置 data.form 等相关数据，模拟组件更新完成后再重置数据
    setTimeout(() => {
        data.form = {}; // 这里根据实际需求重置 data.form 的数据结构，示例重置为空对象
    }, 200);
};

const isUpdating = ref(false); // 添加更新状态标识

const handleUpdate = (row) => {
    if (!isUpdating.value) {
        isUpdating.value = true;
        data.form = JSON.parse(JSON.stringify(row)); // 深拷贝就不会影响行对象
        data.formVisible = true;
        // 可以添加一个短暂的延迟（比如使用 setTimeout）后将标识重置，模拟更新完成
        setTimeout(() => {
            isUpdating.value = false;
        }, 300); 
    }
};

</script>