<template>
    <div>
      <div class="card" style="margin-bottom: 5px;">
        <el-input
          style="width: 240px; margin-right: 10px;"
          v-model="data.name"
          placeholder="请搜素/选择感兴趣的取景地"
          :prefix-icon="Search"
        ></el-input>
        <el-button type="info" @click="search">查 询</el-button>
        <el-button type="info" @click="reset">重 置</el-button>
  
        <div style="margin-bottom: 5px;">
          <div
            style="margin-top: 20px; margin-bottom: 10px; color: #353523; padding: 0 10px; text-align: left; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 4;"
          >
            筛选分享内容：
          </div>
          <el-button type="info" @click="recommend('全部')">全部</el-button>
          <el-button type="info" @click="recommend('战斗场景')">战斗场景</el-button>
          <el-button type="info" @click="recommend('文化古迹')">文化古迹</el-button>
          <el-button type="info" @click="recommend('自然风光')">自然风光</el-button>
        </div>
  
        <div style="margin-bottom: 5px;">
          <div class="card" style="margin-bottom: 5px;">
            <div class="table" style="padding: 15px 20px;">
              <el-row :gutter="20">
                <el-col
                  :span="6"
                  v-for="item in filteredShareContent"
                  style="margin-bottom: 20px;"
                >
                  <div
                    style="text-align: center; background-color: rgba(194, 176, 231, 1);"
                    class="card"
                  >
                    <div>
                      <img
                        :src="item.img_link[0] || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                        alt=""
                        style="width: 100px; height: 100px;"
                      />
                    </div>
                    <div
                      style="margin-top: 20px; color: #353523; padding: 0 10px; text-align: left; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 4;"
                    >
                      {{ item.content_preview }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
  
            <div style="margin-bottom: 15px;">
              <el-pagination
                @size-change="load"
                @current-change="load"
                v-model:current-page="data.pageNum"
                v-model:page-size="data.pageSize"
                :page-sizes="[5, 10, 15, 20, 30]"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.total"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const data = reactive({
    name: '',
    ShareContent: {
      user_id: null,
      spot_id: null,
      content_type: null,
      content_preview: null,
      submit_time: null,
      status: null,
      img_link: [],
      like_num: null,
      save_num: null,
      user_img: null
    },
    pageNum: 1,
    pageSize: 10,
    total: 0,
    currentRecommend: '全部'
  })
  

  // 根据推荐类型过滤内容
  const filteredShareContent = computed(() => {
    if (data.currentRecommend === '全部') {
      return shareContentExamples.scenicList
    } else {
      return shareContentExamples.scenicList.filter(item => item.type === data.currentRecommend)
    }
  })
  
  const recommend = (type) => {
    data.currentRecommend = type
  }
  
  const search = () => {
    // 搜索框逻辑
    console.log('搜索内容:', data.name)
  }
  
  const reset = () => {
    // 重置逻辑
    data.name = ''
    data.currentRecommend = '全部'
  }
  
  const load = () => {
    // 加载数据逻辑
    console.log('加载数据', data.pageNum, data.pageSize)
  }
  </script>
  
  <style>
  </style>