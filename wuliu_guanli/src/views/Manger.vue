<template >
    <div class="all">
        <!-- 头部开始 -->
         <div style="height: 60px;background-color: rgb(113,73,213);display: flex;align-items: center;">
          <div style="width: 300px;font-family: 宋体;display: flex; align-items: center;">
            <img style="width: 40px;padding-left: 15px;" src="../assets/logo.png" alt="" >
          <span style="font-size:20px; color:white">物流订单跟踪系统</span>
          </div>
           <!-- 新增菜单部分 -->
          <el-menu
    font-family="宋体"
    font-size="20px"
    mode="horizontal"
    background-color="rgb(0,0,0,0)"
    text-color="white"
    style="flex:1; justify-content: flex-end; border-bottom: none;"
    @select="handleMenuSelect"
>
    <!-- <el-menu-item index="/Manger/homeView">公告</el-menu-item> -->
    <el-menu-item index="/Manger/Order" v-if="data.account.role === '用户'">我的订单</el-menu-item>
    <el-menu-item index="/Manger/Order_Manger"v-if="data.account.role !== '用户'">订单管理</el-menu-item>
          </el-menu>
          <div style="width: fit-content;display:flex;align-items: center;padding-right:10px ;">
            <el-dropdown>
            <img :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="" style="width: 40px;height:40px ;border-radius: 50%;">
            <template #dropdown>
              <el-dropdown-menu  style="border-right: 1px solid rgb(194,176,231,1);">
                <el-dropdown-item >
                  <div @click="selfshow">
                  个人信息</div>
                </el-dropdown-item>
                <el-dropdown-item >
                  <div @click="logout">
                  退出登录
                </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span style="color:white; margin-left:5px ;" >{{ data.self_account.username }}</span>
          </div> 
        </div>
    </div>
    <!-- 头部结束 -->
    
     <!-- 下面部分开始 -->
      <div style="display: flex;flex:1;">
      <!-- 左侧导航菜单开始  <div style="width:200px;border-right: 1px solid rgb(194,176,231,1); min-height:100vh;">
          <el-scrollbar>  
          <el-menu router  style="border:0;" :default-openeds="['1', '3']" >
              <el-menu-item index="/Manger/homeview" style="display: block;text-align: center;padding: 0 70px 0 0px;">首页</el-menu-item>
              <el-sub-menu index="1" v-if="data.account.role === 'admin'">
                <template #title>
                  <el-icon><message /></el-icon>信息管理 
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/Manger/notice" >公告信息</el-menu-item>
                  <el-menu-item index="/Manger/department">科室信息</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><FirstAidKit /></el-icon>预约就诊
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/Manger/reserve">预约挂号</el-menu-item>
                  <el-menu-item index="/Manger/reservation">患者挂号</el-menu-item>
                  <el-menu-item index="/Manger/diagnosis">我的就诊</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="3" v-if="data.account.role === 'admin'">
                <template #title>
                  <el-icon><setting /></el-icon>用户管理
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/Manger/Doctordata" >医生信息</el-menu-item>
                   <el-menu-item index="/Manger/patient">患者信息</el-menu-item>
                     <el-menu-item index="/Manger/admin">管理员信息</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>                
                
            </el-menu>
          </el-scrollbar> 
        </div>-->
        <!-- 左侧导航菜单结束 -->
    
       <!-- 右侧主体区域开始 -->
        <div style="flex:1;background-color:rgb(250,250,247);padding: 10px;">
          <RouterView @updateUser="updateUser"/>
        </div>
    </div>
      <!-- 下面部分结束 -->
    </template>
    <script setup>
     import { reactive } from 'vue';
     import { RouterView } from 'vue-router';
     import request from '../utils/request';
     import { useRouter } from 'vue-router';
     const data=reactive({
      account: JSON.parse(localStorage.getItem("account")),
      self_account: JSON.parse(localStorage.getItem("self-account"))
     });
     console.log(data.account.role)
     console.log("用户信息"+data.account.username)
     // 修改这里，按照后端期望的方式传递参数，使用@RequestBody对应的方式，将参数放在请求体中以JSON格式发送
     const load = () => {
      request({
        url: "/user/findByUsername",
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        params:{
          role:data.account.role,
          username:data.account.username
    }
    }).then(res => {
        localStorage.setItem("self-account",JSON.stringify(res.data))
    }).catch(err => {
        console.error("请求出现错误：", err);
        // 可以在这里根据错误情况进行一些更具体的处理，比如显示错误提示给用户等
    });
};
load();
const handleMenuSelect = (index) => {
    router.push(index);
};
const router = useRouter();

      const logout = () => {
    localStorage.removeItem("account");
    localStorage.removeItem("self-account");
    sessionStorage.removeItem("token");
    router.push("/");
};
      const selfshow=()=>{
        router.push("/Manger/self");
      }
    </script>
    
    <style>
.el-menu .is-active{
  background:rgb(233, 227, 241) !important;
}
  </style>