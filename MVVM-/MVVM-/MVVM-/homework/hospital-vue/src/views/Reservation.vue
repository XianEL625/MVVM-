<template>
    <div>
        <div class="card" style="margin-bottom: 5px;">
            <el-select v-model="data.state" placeholder="请选择挂号状态" style="width: 200px;padding:12px 12px;">
                <el-option label="待呼叫" value="待呼叫"></el-option>
                <el-option label="已呼叫" value="已呼叫"></el-option>
            </el-select>
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button type="primary" @click="reset">重 置</el-button>
        </div>
        <div class="card" style="margin-bottom: 5px;">
            <el-table :data="data.members" stripe >
                <el-table-column prop="patientName" label="患者姓名" />
                <el-table-column prop="doctorName" label="医生姓名" />
                <el-table-column prop="time" label="预约时间" />
                <el-table-column prop="state" label="挂号状态" />
                <el-table-column fixed="right" label="操作" min-width="80">
                    <template #default="scope">
                        <el-button link type="primary" size="large" :icon="PhoneFilled"
                            @click="handleUpdate(scope.row)" v-if="data.account.role !== 'patient'">呼 叫</el-button>
                        <el-button link type="primary" size="large" :icon="Delete"
                            @click="del(scope.row.id)">删 除</el-button>
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
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { PhoneFilled, Delete } from "@element-plus/icons-vue";
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import _ from 'lodash';

const data = reactive({
    departmentObjs: [],
    state: null,
    members: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    account: JSON.parse(localStorage.getItem("account")),
});
onMounted(() => {
    load();
});

//const load分页\查询接口
const load = () => {
    if(data.account.role==="admin"){
    request({
        url: "/reservations/selectPage",method: "get",
        params: {
            pageNum: data.pageNum,pageSize: data.pageSize,
        }
    }).then(res => {
        data.members = res.data;data.total = res.total;
    }).catch(err => {
        ElMessage.error('查询数据失败，请稍后重试');console.error('查询接口请求出错：', err);
    });}
    else{
        request({
        url: "/reservations/selectPage4",method: "get",
        params: {
            pageNum: data.pageNum,pageSize: data.pageSize,role:data.account.role,
            username:data.account.username
        }
    }).then(res => {
        data.members = res.data;data.total = res.total;
    }).catch(err => {
        ElMessage.error('查询数据失败，请稍后重试');console.error('查询接口请求出错：', err);
    });
    }
};

// 重置接口：
const reset = () => {
    data.name = null;
    load();
};



const handleUpdate = (row) => {
    if(row.state==="已呼叫")
    ElMessage.error('已叫号');
    else{
    row.state="已呼叫"
    request.post('/reservations/updataById', JSON.stringify(row))
      .then(res => {
        if (res.code === "200") {   ElMessage.success("叫号成功"); 
        if(data.state!==null) search(); else load();  
}else {  
         ElMessage.error(res.msg || "叫号失败");  } })
      .catch(err => {
            ElMessage.error('系统内部出错');console.error('更新接口请求出错：', err);
        });
} }
// const detel=(id)=>{} 删除接口哦
const del = (id) => {
    console.log(id)
    request({
        url: "/reservations/deleteById",
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        params: {
            id: id
        }
    }).then(res => {
        load();
    }).catch(err => {
        ElMessage.error('删除数据失败，请稍后重试');
        console.error('删除接口请求出错：', err);
    });
};

// 条件查询
const search = () => {
    if(data.account.role==="admin"){
    request({
        url: "/reservations/selectPage3",
        method: "get",
        params: {
            state: data.state,
            pageNum:data.pageNum,
            pageSize:data.pageSize,
        }
    }).then(res => {
        data.members = res.data;
        data.total = res.total;
    }).catch(err => {
        ElMessage.error('条件查询数据失败，请稍后重试');
        console.error('条件查询接口请求出错：', err);
    });}
    else{
        request({
        url: "/reservations/selectPage5",
        method: "get",
        params: {
            state: data.state,
            pageNum:data.pageNum,
            pageSize:data.pageSize,
            role:data.account.role,
            username:data.account.username
        }
    }).then(res => {
        data.members = res.data;
        data.total = res.total;
    }).catch(err => {
        ElMessage.error('条件查询数据失败，请稍后重试');
        console.error('条件查询接口请求出错：', err);
    });
    }
};

</script>