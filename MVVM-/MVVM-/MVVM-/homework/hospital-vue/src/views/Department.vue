<template>
    <div>
        <div class="card" style="margin-bottom: 5px;">
        <el-input style="width:240px;margin-right: 10px;" v-model="data.name" placeholder="请输入科室搜索查询" :prefix-icon="Search"></el-input>
        <el-button type="primary" @click="search" >查 询</el-button>
        <el-button type="primary" @click="reset">重 置</el-button>
        <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div>
        <div class="card" style="margin-bottom: 5px;">
        <el-table :data="data.members" stripe size="large">
        <el-table-column prop="name" label="姓名"  />
        <el-table-column prop="description" label="介绍" min-width="200" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="80">
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
          <el-form-item label="科室名称" label-width="80px">
            <el-input v-model="data.form.name" autocomplete="off"   />
          </el-form-item>
          <el-form-item label="介绍" label-width="80px">
            <el-input v-model="data.form.description" autocomplete="off" type="textarea" :rows="3"/>
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
    //const load分页\查询接口
    const load=()=>{
    
        request({
                    url: "/departments/selectPage",
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
        request.post('/departments/add',JSON.stringify(data.form)).then(res =>{
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
      request.post('/departments/updataById',JSON.stringify(data.form)).then(res =>{
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
                url: "/departments/deleteById",
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
                url: "/departments/selectByName",
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
    