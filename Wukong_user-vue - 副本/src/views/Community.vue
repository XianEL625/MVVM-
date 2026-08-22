<template>
  <div>
    <div class="card" style="margin-bottom: 5px;">
      <el-input
        style="width: 240px; margin-right: 10px;"
        v-model="data.name"
        placeholder="请搜索/选择感兴趣的取景地"
        :prefix-icon="Search"
      ></el-input>
      <el-button type="info" @click="search">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <div style="margin-bottom: 5px;">
        <div
          style="
            margin-top: 20px;
            margin-bottom: 10px;
            color: #353523;
            padding: 0 10px;
            text-align: left;
          "
        >
          筛选分享内容：
        </div>
        <el-button type="info" @click="recommend('战斗场景')">战斗场景</el-button>
        <el-button type="info" @click="recommend('文化古迹')">文化古迹</el-button>
        <el-button type="info" @click="recommend('自然风光')">自然风光</el-button>
      </div>
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
                      <!-- 分享图标动画 -->
                      <transition :name="item.is_share ? 'zoom' : ''" mode="out-in">
                        <el-icon
                          class="share-icon"
                          :style="{ color: item.is_share ? '#1890ff' : '#333333' }"
                          :key="item.is_share ? 'share' : 'unshare'"
                          @click="toggleShare(item)"
                        >
                          <Share />
                        </el-icon>
                      </transition>
                      <!-- 分享数字动画 -->
                      <div class="share-num-breaker"></div>
                      <div class="share-num-wrapper">
                        <transition :name="item.is_share ? 'plus' : 'minus'">
                          <div
                            class="share-num"
                            :style="{ color: item.is_share ? '#1890ff' : '#333' }"
                            :key="item.share_num"
                          >
                            {{ item.share_num }}
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
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Search, Share } from '@element-plus/icons-vue';
import axios from 'axios';

// 响应式数据
const data = reactive({
  name: '', // 搜索关键字
  recommend: '全部', // 筛选类型
  scenicList: [], // 分享内容列表
  pageNum: 1, // 当前页
  pageSize: 10, // 每页大小
  total: 0 // 总记录数
});

// 初始化测试数据
const initTestData = () => {
  console.log('初始化测试数据');
  data.scenicList = [
    {
      id: 1,
      img_link: [
        'https://pic2.zhimg.com/v2-48263fb6b6c42d4a26e7e437ae444c71_1440w.jpg'
      ],
      like_num: 1568,
      share_num: 432,
      content_preview: '自然景观：壮丽的山川与湖泊，令人心旷神怡。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '自然风光',
      is_like: false,
      is_share: false,
    },
    {
      id: 2,
      img_link: [
        'https://pic3.zhimg.com/v2-a7eb0d5e48610bee7d6d6a76b8ac1a24_1440w.jpg'
      ],
      like_num: 892,
      share_num: 287,
      content_preview: '人文历史：古老的城墙诉说着千年的故事。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '文化古迹',
      is_like: false,
      is_share: false
    },
    {
      id: 3,
      img_link: [
        'https://pic3.zhimg.com/v2-02b1655b827f5431b365064adb1b285c_1440w.jpg'
      ],
      like_num: 2345,
      share_num: 765,
      content_preview: '城市景观：灯火辉煌的夜景，现代与传统的交融。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '战斗场景',
      is_like: false,
      is_share: false
    },
    {
      id: 4,
      img_link: [
        'https://pic3.zhimg.com/v2-02b1655b827f5431b365064adb1b285c_1440w.jpg'
      ],
      like_num: 3021,
      share_num: 1203,
      content_preview: '休闲度假：沙滩与落日，享受片刻宁静。',
      user_img:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content_type: '自然风光',
      is_like: false,
      is_share: false
    }
  ];
  data.total = data.scenicList.length;
  console.log('测试数据已设置:', data.scenicList);
};

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
      size: data.pageSize
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

// 筛选分享内容
const recommend = (type) => {
  data.recommend = type;
  data.pageNum = 1; // 重置到第一页
  load();
};

// 搜索
const search = () => {
  data.pageNum = 1; // 重置到第一页
  load();
};

// 重置
const reset = () => {
  data.name = '';
  data.recommend = '全部';
  data.pageNum = 1;
  load();
};

// 点赞切换
const toggleLike = (item) => {
  item.is_like = !item.is_like;
  item.like_num += item.is_like ? 1 : -1;
};

// 分享切换
const toggleShare = (item) => {
  item.is_share = !item.is_share;
  item.share_num += item.is_share ? 1 : -1;
};

// 初始化加载数据
load();
</script>

<style scoped>
/* 保持原有样式不变 */
.like-num-wrapper,
.share-num-wrapper {
  position: relative;
  margin-left: 16px;
  text-align: end;
  font-size: 13px;
  height: 17px;
  overflow-y: hidden;
}

.share-num-breaker {
  width: 10px;
}

.like-num,
.share-num {
  top: 0;
  left: 0;
  position: relative;
  line-height: 17px;
}

/* 分享图标样式，确保与点赞图标尺寸一致 */
.share-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px; /* 确保图标内部内容缩放到正确尺寸 */
}

/* 爱心和分享图标动画 */
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

/* 点赞和分享数字+1动画 */
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

/* 点赞和分享数字-1动画 */
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