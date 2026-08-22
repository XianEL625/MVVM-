<template>
    <div class="card" style="font-family: 宋体">
        <div style="margin-bottom: 10px;"><span style="font-size:20px; color:black;font-weight:bold;">评分与意见反馈</span></div>
        <div style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
             <span style="margin-bottom: 5px;font-size:20px;">请为您的体验评分</span>
             <div class="star-rating" style="display: flex; flex-direction: column; align-items: flex-start;">
             <div style="display: flex; align-items: center; gap: 8px;">
                <el-icon 
                v-for="index in 5" 
                :key="index"
                class="star-icon"
                :class="{ 'filled': index <= hoverScore || index <= data.rating_score }"
                @mouseenter="hoverScore = index"
                @mouseleave="hoverScore = data.rating_score"
                @click="data.rating_score = index"
            >
                <StarFilled />
                </el-icon>
            </div>
            </div>
            <span style="color: grey; ">(点击星星为你的体验评分(1-5分))</span>
        
        </div>
        </div>
        <div style="margin-bottom: 10px;">
            <div style="margin-bottom: 5px;">
            <span style="font-size:20px;">反馈类型</span></div>
            <div style="display: flex; align-items: center;">
                <el-button type="primary">功能建议</el-button>
                <el-button type="success">内容纠错</el-button>
                <el-button type="info">体验反馈</el-button>
                <el-button type="warning">其它</el-button>
            </div>
        </div>
        <div style="margin-bottom: 10px;">
            <div style="margin-bottom: 5px;"><span style="font-size:20px;">您的反馈</span></div>
            <div>           
            <el-input
            v-model="textarea2"
            style="width: 1500px"
            :autosize="{ minRows: 5, maxRows: 10 }"
            type="textarea"
            placeholder="Please input"
            />
            </div>
        </div>
        <diV style="margin-bottom: 10px;">
            <div style="margin-bottom: 5px;"><span style="font-size:20px;">您的联系方式</span></div>
            <div>
                <el-input
                 v-model="input"
                 style="width: 240px"
                 placeholder="请输入您的联系方式"
                 clearable
                />
            </div>
        </diV>
        
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { StarFilled } from '@element-plus/icons-vue'

const data = reactive({
    rating_score: 0,
    RatingRecord:{},
    rating_type:'',
    feedback:'',
    rating_num:''
})
const hoverScore = ref(0) // Temporary score during hover
const textarea2 = ref('')
const input = ref('')
</script>

<style scoped>
.star-rating {
    display: inline-flex;
    gap: 8px;
}

.star-icon {
    font-size: 24px;
    cursor: pointer;
    color: #d9d9d9; /* Default gray color for unselected stars */
    transition: color 0.2s;
}

.star-icon.filled {
    color: #fadb14; /* Yellow color for selected/hovered stars */
}
</style>