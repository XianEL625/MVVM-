import { createApp } from 'vue';
import App from './App.vue'; // 确保路径正确
// import Self1 from './components/self1.vue'; // 确保路径正确
import Manger from './view/Manger.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// import './assets/global.css'; // 全局的css

// 引入Vue Router
import { createRouter, createWebHistory } from 'vue-router';

const app = createApp(App);

// 引用ElementPlus
app.use(ElementPlus, {
    locale: zhCn,
});

// 引用组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 全局注册组件
// app.component('Self1', Self1);
app.component('Manger', Manger);
// 创建路由实例并配置路由规则
//redirect重定向默认路由
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'self', component: () => import('./App.vue') },
        { path: '/test', name: 'test', component: () => import('./components/test.vue') },
    ]
});

// 使用路由
app.use(router);

// 挂载 Vue 应用
app.mount('#app');