<template>  
    <div style="font-size:20px;">  
      111111111111  
    </div>  
    <div>
        {{ a }}
        {{ b }}
    </div>
    <div>
        {{ data.a}}
        {{ data.b }}
    </div>

    <diV>
        <input v-model="data.a"/>
    </diV>

    <div>
        <span style="color: red;" v-if="data.name==='佩奇'">小猪佩奇</span>
        <span style="color: blue;" v-if="data.name==='乔治'">小猪乔治</span>
    </div>

    <div style="display: flex;margin-bottom: 20px;">
<div @click="show(item)"v-for="item in data.arr"style="width: 300px;height: 300px;background-color: green;margin: 10px;text-align: center;line-height: 300px;">{{ item }}</div>
    </div>

    <div>
        <select style="width: 200px;">
            <option v-for="item in data.fruits">{{ item }}</option>
        </select>
    </div>

    <div>
        <button @:click="click">点我加好运</button>//v-on点击事件
    </div>
    <div style="margin-bottom: 30px;">
        <div :style="data.box"></div>//v-bind
        <!-- <div >
            <img :src="data.img" alt="">
        </div> -->
    </div>  <!-- onMounted 加载页面需要时间-->

    <div style="margin: 30px;">
        <el-button @click="clickDate" :style="{color:'red'}">Default</el-button> //文本颜色
        <el-button type="primary" plain>Primary</el-button>
        <el-button type="success" plain>Success</el-button>
        <el-button type="info">Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger"color="#626aef">Danger</el-button>
    </div>
    
    <div>
    <el-icon :size="20">
    <Edit />
    </el-icon>
    <span style="margin-left:30px ; color: #666;">
        <el-icon :size="20" color="#666" style="top:4px"><View /></el-icon> 100
    </span>
     </div>
    <div>
        <el-button type="danger" :icon="Delete" circle />
        <el-input
      v-model="data.a"
      style="width: 240px"
      placeholder="Type something"
      :prefix-icon="Search"
    />
    </div>
  
</template>  

<script setup>
import {reactive,ref,onMounted} from "vue";  
// 当你在按钮或者输入框组件里使用图标需要单独导入
import{Delete,Search}from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';
const router = useRouter();

  const a=ref(1)  
  const b=ref("1111111111111")
//  通过router.currentRoute.value.query获取query对象
  const data=reactive({
    id:router.currentRoute.value.query.id,
    addr:router.currentRoute.value.query.addr,
    a:123,
    b:"wwwwwni",
    name:'佩奇',
    arr:[1,2,3],
    fruits:['苹果','香蕉','水果'],
    box:{
        width:'100px',
        height:'100px',
        backgroundColor:'red'
    },
    img:'https://baomidou.com/assets/asset.cIbiVTt_.svg'
  }) 

  console.log('获取到的传递过来的id='+data.id)
  console.log('获取到的传递过来的addr='+data.addr)

  const clickDate=()=>{
    alert("当前使用的是E-P")
  }
  const click=()=>{
    alert("好运+1")
  }
  const show=(value)=>{
    alert("好运+1")
  }
onMounted(()=>{
    alert('页面加载完成')
})

</script>  