<template>
<div>
    <div class="card" style="margin-bottom: 5px;">
        <el-input style="width:240px;margin-right: 10px;" v-model="data.name" placeholder="请搜素/选择感兴趣的取景地" :prefix-icon="Search"></el-input>
        <el-button type="info" @click="search" >查 询</el-button>
        <el-button type="info" @click="reset">重 置</el-button>
        <div  style="margin-bottom: 5px;">
<el-carousel :interval="5000" arrow="always" height="300px">
  <el-carousel-item 
    v-for="item in ScenicSpot.scenicList" 
    :key="item.spot_id"
    class="custom-carousel-item"
  >
    <div class="image-wrapper">
      <img 
        :src="item.real_image" 
        class="scaled-image"
        :style="{ 'transform': `scale(${imageScale})` }"
      >
    </div>
    
    <h3 class="image-caption">{{ item.spot_name }}</h3>
  </el-carousel-item>
</el-carousel>
        </div>
        <div style="margin-bottom: 5px;" >
            <div style="margin-top:20px;margin-bottom: 10px;color: #353523;padding: 0 10px;text-align: left;overflow: hidden;text-overflow:ellipsis ;display: -webkit-box;-webkit-line-clamp: 4; ">
                               个性化推荐：
            </div>
            <el-button type="info" @click="recommend" v-model="data.recommend">战斗场景</el-button>
            <el-button type="info" @click="recommend" v-model="data.recommend">文化古迹</el-button>
            <el-button type="info" @click="recommend" v-model="data.recommend">自然风光</el-button>
        </div>
    </div>
</div>
</template>
<script setup>
import { reactive, onMounted } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import {Search} from "@element-plus/icons-vue";
const data = reactive({
    spot_name: '',
    // 主对象容器
    ScenicSpot: {
    spot_id: null,         // 创建时不需要，编辑时携带
    spot_name: '',
    description: '',
    location: '',
    real_image: '',       // 上传后存放URL
    game_image: '',       // 上传后存放URL
    tags: [],             // 用数组形式存放标签
    status: '启用',       // 默认状态
    relatedTemplates: []  // 关联模板ID数组
        },
    recommend: '',
})
 //验证样式
 const ScenicSpot= reactive({
  scenicList: [ //
    { 
      spot_id: 1,
      spot_name: '图片1',
      real_image: 'https://cn.bing.com/images/search?view=detailV2&ccid=7%2f3sV8aP&id=50D176286A0ADFAA64663856497780B74AB1C6C1&thid=OIP.7_3sV8aPuK4ibOi1mszPugHaDt&mediaurl=https%3a%2f%2fn.sinaimg.cn%2fsinakd20111%2f672%2fw2048h1024%2f20220820%2fc931-65956222a9f136b9944b8846ce90fcc1.jpg&exph=1024&expw=2048&q=%e9%bb%91%e7%a5%9e%e8%af%9d&simid=608002039738012661&FORM=IRPRST&ck=24EACC31FBE8D4988425620CD24AC693&selectedIndex=6&itb=0', // 使用require确保路径正确
    },
    { 
      spot_id: 2,
      spot_name: '图片2',
      real_image: 'https://cn.bing.com/images/search?view=detailV2&ccid=7%2f3sV8aP&id=50D176286A0ADFAA64663856497780B74AB1C6C1&thid=OIP.7_3sV8aPuK4ibOi1mszPugHaDt&mediaurl=https%3a%2f%2fn.sinaimg.cn%2fsinakd20111%2f672%2fw2048h1024%2f20220820%2fc931-65956222a9f136b9944b8846ce90fcc1.jpg&exph=1024&expw=2048&q=%e9%bb%91%e7%a5%9e%e8%af%9d&simid=608002039738012661&FORM=IRPRST&ck=24EACC31FBE8D4988425620CD24AC693&selectedIndex=6&itb=0',
    },
    // 其他数据...
  ]
})
const search=()=>{ 
}
const reset=()=>{
}
const load=()=>{
}
const recommend=()=>{ 
}
</script>
<style>
/* 保持原有基础样式 */
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  margin: 0;
  text-align: center;
}

/* 新增等比缩放样式 */
.custom-carousel-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: visible; /* 允许图片溢出 */
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9比例 */
}

.scaled-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  transition: transform 0.3s;
  cursor: zoom-in;
}

.scaled-image:hover {
  transform: translate(-50%, -50%) scale(1.05);
  z-index: 2;
}

.image-caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgb(8, 6, 6);
  padding: 8px 20px;
  border-radius: 20px;
  z-index: 3;
  white-space: nowrap;}
</style>