<template>
  <div class="card">
    <!-- 图片轮播 -->
    <div style="margin-bottom: 20px;">
      <el-carousel :interval="5000" arrow="always" height="400px">
        <el-carousel-item v-for="(img, index) in work.img_link" :key="index">
          <img
            :src="img || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            alt="作品图片"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div  style="
        margin-bottom: 20px;
        color: #353523;
        padding: 0 20px;
        text-align: left;
        font-size: 16px;
        line-height: 1.6;
      ">
        #{{ work.spot_name }}#
    </div>
    <!-- 内容预览 -->
    <div
      style="
        margin-bottom: 20px;
        color: #353523;
        padding: 0 20px;
        text-align: left;
        font-size: 16px;
        line-height: 1.6;
      "
    >
      {{ work.content_preview }}
    </div>
    <!-- 用户信息和交互 -->
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
      "
    >
      <img
        :src="
          work.user_img ||
          'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        "
        alt="用户头像"
        style="width: 50px; height: 50px; border-radius: 50%;"
      />
      <div style="text-align: right; display: flex; align-items: center;">
        <!-- 点赞图标动画 -->
        <transition :name="work.is_like ? 'zoom' : ''" mode="out-in">
          <img
            :src="work.is_like ? '/src/assets/images/like.svg' : '/src/assets/images/unlike.svg'"
            :style="{ color: work.is_like ? '#FF0000' : '#333333' }"
            :key="work.is_like ? 'like' : 'unlike'"
            style="width: 35px; height: 35px; cursor: pointer; margin-right: -5px;"
            @click="toggleLike"
            alt="点赞图标"
          />
        </transition>
        <!-- 点赞数字动画 -->
        <div class="like-num-wrapper">
          <transition :name="work.is_like ? 'plus' : 'minus'">
            <div
              class="like-num"
              :style="{ color: work.is_like ? 'red' : '#333' }"
              :key="work.like_num"
            >
              {{ work.like_num }}
            </div>
          </transition>
        </div>
        <!-- 分享图标动画 -->
        <transition :name="work.is_share ? 'zoom' : ''" mode="out-in">
          <el-icon
            class="share-icon"
            :style="{ color: work.is_share ? '#1890ff' : '#333333' }"
            :key="work.is_share ? 'share' : 'unshare'"
            @click="toggleShare"
          >
            <Share />
          </el-icon>
        </transition>
        <!-- 分享数字动画 -->
        <div class="share-num-breaker"></div>
        <div class="share-num-wrapper">
          <transition :name="work.is_share ? 'plus' : 'minus'">
            <div
              class="share-num"
              :style="{ color: work.is_share ? '#1890ff' : '#333' }"
              :key="work.share_num"
            >
              {{ work.share_num }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Share } from '@element-plus/icons-vue';

// 单项数据
const work = reactive({
  id: 1,
  img_link: [
    'https://pic2.zhimg.com/v2-48263fb6b6c42d4a26e7e437ae444c71_1440w.jpg',
    'https://pic3.zhimg.com/v2-02b1655b827f5431b365064adb1b285c_1440w.jpg',
    'https://pic3.zhimg.com/v2-a7eb0d5e48610bee7d6d6a76b8ac1a24_1440w.jpg'
  ],
  like_num: 1568,
  share_num: 432,
  content_preview: '自然景观：壮丽的山川与湖泊，令人心旷神怡。',
  user_img:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  content_type: '自然风光',
  is_like: false,
  is_share: false,
  spot_name:"五指山"
});

// 点赞切换
const toggleLike = () => {
  work.is_like = !work.is_like;
  work.like_num += work.is_like ? 1 : -1;
};

// 分享切换
const toggleShare = () => {
  work.is_share = !work.is_share;
  work.share_num += work.is_share ? 1 : -1;
};
</script>

<style scoped>
.card {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #fff;
}

/* 轮播图样式 */
:deep(.el-carousel__item) {
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* 点赞和分享数字样式 */
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