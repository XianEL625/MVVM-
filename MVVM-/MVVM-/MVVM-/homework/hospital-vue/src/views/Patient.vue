<template>
    <div>
        <div class="card" style="margin-bottom: 5px;">
        <el-input style="width:240px;margin-right: 10px;" v-model="data.name" placeholder="请输入姓名搜索查询" :prefix-icon="Search"></el-input>
        <el-button type="primary" @click="search" >查 询</el-button>
        <el-button type="primary" @click="reset">重 置</el-button>
        <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div>
        <div class="card" style="margin-bottom: 5px;">
        <el-table :data="data.members" stripe size="large">
        <el-table-column prop="username" label="账号"  />
        <el-table-column  label="头像"  >
          <template #default="scope" >
    <img v-if="scope.row.avatar" :src="scope.row.avatar" alt="" style="width: 40px;display:block;height: 40px;border-radius: 50%;">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"  />
        <el-table-column prop="tel" label="电话" show-overflow-tooltip/>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="primary" size="large" :icon="Edit" @click="handleUpdate(scope.row)">修 改</el-button>
            <el-button link type="primary" size="large"  :icon="Delete" @click="del(scope.row.id)">删 除</el-button>
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
        <el-dialog  title="请填写信息" v-model="data.formVisible" width="500">
        <el-form :model="data.form" style="padding-right: 40px;padding-top: 20px;">
          <el-form-item label="账号" label-width="80px">
            <el-input v-model="data.form.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="头像" label-width="80px">
            <el-upload
        class="avatar-uploader"
        :action="$baseUrl+'/files/upload'"
        list-type="picture"
        :on-success="handleAvatarSuccess"
      >
      <el-button type="primary">上传头像</el-button>
      </el-upload> 
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
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.formVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">保 存</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    </template>
    
    <script setup>
    import { reactive } from 'vue';
    import {Search,Edit,Delete} from "@element-plus/icons-vue";
    import request from '../utils/request';
    import { ElMessage } from 'element-plus';
    
    console.log(sessionStorage.getItem('token'))
    const data=reactive({
      departmentObjs:[],
        name:null ,
        members:[],
        pageNum:1,
        pageSize:10,
        total:0,
        formVisible:false,
        form:{}
    })
    //上传文件
    //文件
    const handleAvatarSuccess=(res)=>{
        console.log(res.data)
        data.form.avatar=res.data
    }
    //const load分页\查询接口
    const load=()=>{
    
        request({
                    url: "/patients/selectPage",
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
        request.post('/patients/add',JSON.stringify(data.form)).then(res =>{
          if(res.code="200"){
          if(data.name!==null)search()
          else load()
          ElMessage.success("新增成功")}
          else{
            ElMessage.error("新增失败")
          }
            })
            data.formVisible = false
    };  
    
    const update=()=>{
      request.post('/patients/updataById',JSON.stringify(data.form)).then(res =>{
              if(res.code="200"){
              if(data.name!==null)search()
              else load()
              ElMessage.success("修改成功")}
            else{
              ElMessage.error("修改失败")
            }
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
                url: "/patients/deleteById",
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                params:{
                  id:id
    }
            }).then(res =>{
              if(res.code="200"){
              load()
              ElMessage.success("删除成功")}
              else{
                ElMessage.error("删除失败")
              }
            })
    };  
    
    
    // 条件查询
    const search=()=>{
    
    request({
                url: "/patients/selectByName",
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                params:{
                    name:data.name
    }
            }).then(res =>{
              if(res.code="200"){
              ElMessage.success("查询成功")
              data.members=res.data
              data.total = res.total}
              else{
                ElMessage.error("查询失败")
              }
            })
    }
    
    </script>
    
    <style scoped>
    
    </style>
    