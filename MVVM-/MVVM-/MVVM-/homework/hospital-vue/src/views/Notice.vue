<template>
    <div>
        <div class="card" style="margin-bottom: 5px;">
        <el-input style="width:240px;margin-right: 10px;" v-model="data.name" placeholder="请输入公告标题" :prefix-icon="Search"></el-input>
        <el-button type="primary" @click="search" >查 询</el-button>
        <el-button type="primary" @click="reset">重 置</el-button>
        <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div>
        <div class="card" style="margin-bottom: 5px;">
        <el-table :data="data.members" stripe>
        <el-table-column prop="name" label="公告标题"  />
        <el-table-column type="textarea" prop="context" label="公告内容"  >
         <template #default="scope">
                    <el-button type="primary" @click="view(scope.row.context)">查看内容</el-button>
         </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" />
        <el-table-column fixed="right" label="操作" min-width="80">
          <template #default="scope">
            <el-button link type="primary" size="small" :icon="Edit" @click="handleUpdate(scope.row)">修 改</el-button>
            <el-button link type="primary" size="small"  :icon="Delete" @click="del(scope.row.id)">删 除</el-button>
          </template>
        </el-table-column>    
            </el-table>
            <div style="margin-bottom: 15px;">
           <el-pagination
           @size-change="load"
           @current-change="load"
           v-model:current-page="data.pageNum"
           v-model:page-size="data.pageSize"
           :page-sizes="[5,10,15,20,30]"
           background
           layout="total,sizes,prev, pager, next,jumper"
           :total="data.total"
           />
            </div>
        </div>
        <el-dialog  title="请填写信息" v-model="data.formVisible" width="800">
        <el-form :model="data.form" style="padding-right: 40px;padding-top: 20px;">
          <el-form-item label="公告标题" label-width="80px">
            <el-input v-model="data.form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="公告内容" label-width="80px">
            <div style="border: 1px solid #ccc; width: 100%">
  <Toolbar
    style="border-bottom: 1px solid #ccc"
    :editor="editorRef"
    :mode="mode"
  />
  <Editor
    style="height: 500px; overflow-y: hidden;"
    v-model="data.form.context"
    :mode="mode"
    :defaultConfig="editorConfig"
    @onCreated="handleCreated"
  />
</div>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.formVisible = false">取 消</el-button>
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
    import { reactive } from 'vue';
    import {Search,Edit,Delete} from "@element-plus/icons-vue";
    import request from '../utils/request';
    import { ElMessage } from 'element-plus';
    import '@wangeditor/editor/dist/css/style.css'; 
    import { onBeforeUnmount, ref,shallowRef } from 'vue';  
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue';  
    
    console.log(sessionStorage.getItem('token'))
    const data=reactive({
        name:null ,
        members:[],
        pageNum:1,
        pageSize:10,
        total:0,
        formVisible:false,
        form:{},
        content:null,
        viewVisible:false
    })

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
//查看内容
const view=(content)=>{
    data.content=content
    data.viewVisible=true
}

    //const load分页\查询接口
    const load=()=>{
    
        request({
                    url:"/notices/selectPage",
                    method: "get",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params:{
              pageNum:data.pageNum,
              pageSize:data.pageSize,
        }
                }).then(res =>{
                  data.members=res.data
                  data.total = res.total
                })
    }
    load()
    // 重置接口：
    const reset=()=>{
       data.name=null
       load()
     }
    // const save=()=>{}做两个操作：一个新增保存，一个编辑
    const save=()=>{
     data.form.id?update():add()
    
      }
      const add = () => {  
        request.post('/notices/add',JSON.stringify(data.form)).then(res =>{
          if(data.name!==null)search()
          else load()
            })
            data.formVisible = false
    };  
    
    const update=()=>{
      request.post('/notices/updataById',JSON.stringify(data.form)).then(res =>{
              if(data.name!==null)search()
              else load()
            })
            data.formVisible = false
    }
    
    const handleAdd=()=>{
      data.formVisible=true,
      data.form={}
    }
    
    
    const handleUpdate=(row)=>{
    data.form=JSON.parse(JSON.stringify(row))//深拷贝就不会影响行对象
    data.formVisible=true
    }
    
    // const detel=(id)=>{} 删除接口哦
    const del = (id) => {  
      request({
                url: "/notices/deleteById",
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                params:{
                  id:id
    }
            }).then(res =>{
              load()
            })
    };  
    
    
    // 条件查询
    const search=()=>{
    
    request({
                url: "/notices/selectByName",
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                params:{
                    name:data.name
    }
            }).then(res =>{
              data.members=res.data
              data.total = res.total
            })
    }
    
    </script>
    
    <style scoped>
    
    </style>
    