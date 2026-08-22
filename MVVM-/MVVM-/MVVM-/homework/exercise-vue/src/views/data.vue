<template>
<div>
    <div class="card" style="margin-bottom: 5px;">
    <el-input style="width:240px;margin-right: 10px;" v-model="data.name" :placeholder="请输入姓名搜索查询" :prefix-icon="Search"></el-input>
    <el-button type="primary" @click="search" placeholder="请输入名" >查 询</el-button>
    <el-button type="primary" @click="reset">重 置</el-button>
    <el-button type="primary" @click="handleAdd">新 增</el-button>
    </div>
    <div class="card" style="margin-bottom: 5px;">
    <el-table :data="data.members" stripe>
    <el-table-column prop="firstName" label="名"  />
    <el-table-column prop="lastName" label="性"  />
    <el-table-column prop="email" label="邮箱"  />
    <el-table-column prop="phoneNumber" label="电话号码" />
    <el-table-column prop="hireDate" label="聘用日期" />
    <el-table-column prop="jobTitle" label="聘用工作" />
    <el-table-column prop="salary" label="工资" />
    <el-table-column prop="deptId" label="部门编号" />

    <el-table-column fixed="right" label="操作" min-width="80">
      <template #default="scope">
        <el-button link type="primary" size="small" :icon="Edit" @click="handleUpdate(scope.row)">修 改</el-button>
        <el-button link type="primary" size="small"  :icon="Delete" @click="del(scope.row.empId)">删 除</el-button> 
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
    <el-dialog  title="员工信息" v-model="data.formVisible" width="500">
    <el-form :model="data.form" style="padding-right: 40px;padding-top: 20px;">
      <el-form-item label="名" label-width="80px">
        <el-input v-model="data.form.firstName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓" label-width="80px">
        <el-input v-model="data.form.lastName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px">
        <el-input v-model="data.form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话号码" label-width="80px">
        <el-input v-model="data.form.phoneNumber" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话号码" label-width="80px">
      <el-date-picker
        v-model="data.form.hireDate"
        type="date"
        placeholder="选一天"
        :disabled-date="disabledDate"
        :shortcuts="shortcuts"
        :size="size"
      /></el-form-item>
      <el-form-item label="聘用工作" label-width="80px">
        <el-input v-model="data.form.jobTitle" autocomplete="off" />
      </el-form-item>
      <el-form-item label="工资" label-width="80px">
        <el-input v-model="data.form.salary" autocomplete="off" />
      </el-form-item>
      <el-form-item label="编号" label-width="80px">
        <el-input v-model="data.form.deptId" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="data.formVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog  title="员工信息" v-model="data.formVisible2" width="500">
    <el-form :model="data.form" style="padding-right: 40px;padding-top: 20px;">
      <el-form-item label="名" label-width="80px">
        <el-input v-model="data.form.firstName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓" label-width="80px">
        <el-input v-model="data.form.lastName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px">
        <el-input v-model="data.form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话号码" label-width="80px">
        <el-input v-model="data.form.phoneNumber" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话号码" label-width="80px">
      <el-date-picker
        v-model="data.form.hireDate"
        type="date"
        placeholder="选一天"
        :disabled-date="disabledDate"
        :shortcuts="shortcuts"
        :size="size"
      /></el-form-item>
      <el-form-item label="聘用工作" label-width="80px">
        <el-input v-model="data.form.jobTitle" autocomplete="off" />
      </el-form-item>
      <el-form-item label="工资" label-width="80px">
        <el-input v-model="data.form.salary" autocomplete="off" />
      </el-form-item>
      <el-form-item label="编号" label-width="80px">
        <el-input v-model="data.form.deptId" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="data.formVisible = false">取 消</el-button>
        <el-button type="primary" @click="save2">保 存</el-button>
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
    name:null,
    members:[],
    pageNum:1,
    pageSize:10,
    total:0,
    formVisible:false,
    form:{},
    formVisible2:false
})
//const load分页\查询接口
const load=()=>{

    request({
                url: "/employees/selectPage",
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                params:{
          pageNum:data.pageNum,
          pageSize:data.pageSize,
    }
            }).then(res =>{
              console.log(res.data)
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

const save=()=>{

  request.post('/employees/updataById',JSON.stringify(data.form)).then(res =>{
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
  data.formVisible2=true,
  data.form={}
}


const handleUpdate=(row)=>{
data.form=JSON.parse(JSON.stringify(row))//深拷贝就不会影响行对象
data.formVisible=true
}

const save2 = () => {  
  request.post('/employees/add',JSON.stringify(data.form)).then(res =>{
    if(res.code="200"){
    if(data.name!==null)search()
    else load()
    ElMessage.success("新增成功")}
    else{
      ElMessage.error("新增失败")
    }
      })
      data.formVisible2 = false
};  

// // const detel=(id)=>{} 删除接口哦,因为员工号有关联关系不好删除我就没设置
// const del = (id) => {  
//   console.log(id)
//   request({
//             url: "/employees/deleteById",
//             method: "put",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             params:{
//               id:id
// }
//         }).then(res =>{
//           load()
//         })
// };  


// 条件查询
const search=()=>{

request({
            url: "/employees/selectby",
            method: "get",
            params:{
              firstName:data.name
}
        }).then(res =>{
          console.log(res.data)
          data.members=res.data
          data.total=res.total
        })
}
const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]
</script>

<style scoped>
.card{
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(194,176,231,1);
}
</style>
