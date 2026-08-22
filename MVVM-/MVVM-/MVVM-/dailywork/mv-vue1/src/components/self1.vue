<template>
<div>
<div>
    <el-input clearable v-model="data.input"  :prefix-icon="Search" style="width: 240px" placeholder="Please input" />
</div>
<!-- type="textarea"变成多行文本
 disable和readonly可以只显示文本无法输入
 前置图标prefix-icon和后缀图标suffix-icon，注意要单独导入文本
 clearable是清空 -->
<el-input
clearable
    v-model="data.descri"
    style="width: 240px"
    :rows="2"
    type="textarea"
    placeholder="请输入一段描述"
  />
  </div>
    <!-- multiple多选 -->
    <el-select
    multiple
    clearable
      v-model="data.value"
      placeholder="请选择水果"
      size="large"
      style="width: 240px"
    >
    <!-- key是唯一的 -->
      <el-option
        v-for="item in data.options"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      />
    </el-select>{{ data.value }}

    <div style="margin:20px">
        <el-radio-group v-model="data.sex">
    <el-radio value="男">男</el-radio>
    <el-radio label="女">女</el-radio>
  </el-radio-group>{{ data.sex }}
<!--单选按钮组 
  注意要保证v-model里面的值跟value的值一样 -->
  <el-radio-group style="margin-left:100px ;"  v-model="data.tag">
    <el-radio-button label="我点赞的内容" value="1" />
    <el-radio-button label="我发布的内容" value="2" />
    <el-radio-button label="我收藏的内容" value="3" />
  </el-radio-group>
    </div>

    <!-- 多选框绑定的是数组 -->
    <div style="margin: 20px;">
        <el-checkbox-group v-model="data.checkList">
    <el-checkbox v-for="item in data.options" :key="item.id" :value="item.name" :label="item.name"/>
  </el-checkbox-group>
  <span style="margin-left: 20px;">
  {{ data.checkList }}</span>
    </div>

    <!-- 使用网络图片地址可以渲染
     若是本地图片需要先导入 import -->
    <div style="margin: 20px;">
<!-- <img src="https://baomidou.com/assets/asset.cIbiVTt_.svg" alt="" style="width: 100px"> -->
    <el-image :src="img" :style="{ width: '100px' }"/>
    </div>

    <!-- format="YYYY-MM-DD"显示框
        value-format="YYYY-MM-DD"数据 -->
    <div style="margin:20px">
      <el-date-picker
        v-model="data.date"
        type="请选择日期"
        placeholder="Select date and time"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
    </div>{{ data.date }}

    <div style="margin:20px">
  <el-table :data="data.tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
    </div>

</template>

<script setup>
import {reactive} from 'vue';
import {Search} from"@element-plus/icons-vue"
import img from '@/assets/cIbiVTt.svg'
const data =reactive({
    input:'输入内容',
    descri:"xxxxx",
    value:' ',
    options:[{id:1,name:'苹果'},{id:2,name:'香蕉'}],
    sex:'',
    tag:'1',
    checkList:[],
    date:'',
    tableData : [
    { date: '2002-06-25', name: 'lxy', address: 'xsdsds' }
]
})

</script>
