<template>
    <div class="card">
        <!-- 添加 flex 容器 -->
        <div style="display: flex; align-items: center;margin-bottom: 15px;">
            <img 
                :src="data.self_account.avatar||'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
                alt="" 
                style="width: 70px;height:70px;border-radius: 50%;">
            <div style="margin-left: 10px" >  
                用户名：{{ data.username }}<br>
                注册时间：{{ data.register_time }}
                <div style="margin-top: 5px;">
                <el-button type="info" @click="self" v-model="data.recommend">编辑资料</el-button>
                </div>
            </div>
        </div>
            <div style="margin-bottom: 5px;display: flex;margin-bottom: 5px; ">
                <div class="card" style="padding: 30px 120px;margin-right: 200px;">
                    已和成的图片:<br>
                    {{ data.synthesis_num }}
                </div>
                <div class="card" style="padding: 30px 120px;margin-right: 200px;">
                    分享次数:<br>
                    {{ data.like_num }}
                </div>
                <div class="card" style="padding: 30px 120px;align-items: right">
                    获得点赞<br>
                    {{ data.share_num }}
                </div>
            </div>
            <div  style="margin-bottom: 5px;">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="我的作品" name="first">
                    <div style="margin-bottom: 5px;">
        <div style="margin-bottom: 5px;">
          <div class="table" style="padding: 15px 20px;">
            <el-row :gutter="20" v-if="data.scenicList.length > 0">
              <el-col
                :span="6"
                v-for="item in data.scenicList"
                :key="item.id"
                style="margin-bottom: 20px;"
              >
                <div
                  style="
                    text-align: center;
                    background-color: #ffffff;
                    width: 280px;
                  "
                  class="card"
                >
                  <div>
                    <img
                      :src="
                        item.img_link[0] ||
                        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                      "
                      alt="分享图片"
                      style="width: 280px; height: 280px; object-fit: cover;"
                    />
                  </div>
                  <div
                    style="
                      margin-top: 15px;
                      color: #353523;
                      padding: 0 10px;
                      text-align: left;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                  >
                    {{ item.content_preview }}
                  </div>
                  <div
                    style="
                      margin-top: 15px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <img
                      :src="
                        item.user_img ||
                        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                      "
                      alt="用户头像"
                      style="width: 35px; height: 35px; border-radius: 50%;"
                    />
                    <div style="text-align: right; display: flex; align-items: center;">
                      <!-- 点赞图标动画 -->
                      <transition :name="item.is_like ? 'zoom' : ''" mode="out-in">
                        <img
                          :src="item.is_like ? '/src/assets/images/like.svg' : '/src/assets/images/unlike.svg'"
                          :style="{ color: item.is_like ? '#FF0000' : '#333333' }"
                          :key="item.is_like ? 'like' : 'unlike'"
                          style="width: 35px; height: 35px; cursor: pointer; margin-right: -5px;"
                          @click="toggleLike(item)"
                          alt="点赞图标"
                        />
                      </transition>
                      <!-- 点赞数字动画 -->
                      <div class="like-num-wrapper">
                        <transition :name="item.is_like ? 'plus' : 'minus'">
                          <div
                            class="like-num"
                            :style="{ color: item.is_like ? 'red' : '#333' }"
                            :key="item.like_num"
                          >
                            {{ item.like_num }}
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div v-else style="text-align: center; color: #999; padding: 20px;">
              暂无分享内容
            </div>
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
                </el-tab-pane>
                <el-tab-pane label="我的点赞" name="second">我的点赞</el-tab-pane>
                <el-tab-pane label="我的分享" name="third">我的分享</el-tab-pane>
                </el-tabs>
            </div>
        
    </div>
    </template>
<script setup>
import { reactive, ref ,onMounted} from 'vue';

const data=reactive({
    username:'11',
    synthesis_num:11,
    like_num:11,
    share_num:11,
    self_synthesis:{},
    self_account:{},
    register_time:'2025.5.8',
    scenicList: [], // 分享内容列表
    pageNum: 1, // 当前页
    pageSize: 10, // 每页大小
    total: 0, // 总记录数
})
// 初始化测试数据
const initTestData = () => {
  console.log('初始化测试数据');
  data.scenicList = [
    {
      id: 1,
      img_link: [
        'https://pic2.zhimg.com/v2-48263fb6b6c42d4a26e7e437ae444c71_1440w.jpg',
      ],
      like_num: 1568,
      share_num: 432,
      content_preview: '自然景观：壮丽的山川与湖泊，令人心旷神怡。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '自然风光',
      is_like: false, // 添加 is_like 属性
    },
    {
      id: 2,
      img_link: [
        'https://pic3.zhimg.com/v2-a7eb0d5e48610bee7d6d6a76b8ac1a24_1440w.jpg',
      ],
      like_num: 892,
      share_num: 287,
      content_preview: '人文历史：古老的城墙诉说着千年的故事。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '文化古迹',
      is_like: false,
    },
    {
      id: 3,
      img_link: [
        'https://pic3.zhimg.com/v2-02b1655b827f5431b365064adb1b285c_1440w.jpg',
      ],
      like_num: 2345,
      share_num: 765,
      content_preview: '城市景观：灯火辉煌的夜景，现代与传统的交融。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '战斗场景',
      is_like: false,
    },
    {
      id: 4,
      img_link: [
        'https://pic3.zhimg.com/v2-02b1655b827f5431b365064adb1b285c_1440w.jpg',
      ],
      like_num: 3021,
      share_num: 1203,
      content_preview: '休闲度假：沙滩与落日，享受片刻宁静。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '自然风光',
      is_like: false,
    },
  ];
  data.total = data.scenicList.length;
  console.log('测试数据已设置:', data.scenicList);
};
const activeName = ref('first')
// 加载数据（后端接口调用）
const load = async () => {
  // 临时使用测试数据，避免后端接口问题
  initTestData();
  /*
  try {
    const params = {
      name: data.name,
      content_type: data.recommend === '全部' ? null : data.recommend,
      page: data.pageNum,
      size: data.pageSize,
    };
    const response = await axios.get('/api/share-content', { params });
    console.log('后端返回数据:', response.data);
    data.scenicList = response.data.data || [];
    data.total = response.data.total || 0;
  } catch (error) {
    console.error('加载分享内容失败:', error);
    initTestData();
  }
  */
};
const handleClick = () => {
}
// 点赞切换
const toggleLike = (item) => {
  item.is_like = !item.is_like;
  item.like_num += item.is_like ? 1 : -1;
};
onMounted(() => {
  load()
 })
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.like-num-wrapper {
  position: relative;
  margin-left: 16px;
  text-align: end;
  font-size: 13px;
  height: 17px;
  overflow-y: hidden;
}

.like-num {
  top: 0;
  left: 0;
  position: relative;
  line-height: 17px;
}

/* 爱心图标动画 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.15s cubic-bezier(0.42, 0, 0.34, 1.55);
}

.zoom-enter,
.zoom-leave-to {
  transform: scale(0);
}

.zoom-enter-to,
.zoom-leave {
  transform: scale(1);
}

/* 点赞数字+1动画 */
.plus-enter-active,
.plus-leave-active {
  transition: all 0.3s ease-in;
}

.plus-enter,
.plus-leave {
  transform: translateY(0);
}

.plus-enter-to,
.plus-leave-to {
  transform: translateY(-17px);
}

/* 点赞数字-1动画 */
.minus-enter-active,
.minus-leave-active {
  transition: all 0.3s ease-in;
}

.minus-enter {
  transform: translateY(-34px);
}

.minus-enter-to {
  transform: translateY(-17px);
}

.minus-leave {
  transform: translateY(0);
}

.minus-leave-to {
  transform: translateY(17px);
}
</style>