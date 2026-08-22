import { createRouter,createWebHistory } from "vue-router";

const router=createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
        { path: '/', name: 'Login',meta:{title:'登录系统'}, component: () => import('../views/Login.vue') },
        { path: '/Register', name: 'Register', component: () => import('../views/Register.vue') },
        { path: '/Map', name: 'Map', component: () => import('../views/3dmap.vue') },
         {path:'/Manger',name:'Manger',component:()=>import('../views/Manger.vue'), redirect: '/Manger/HomeView', children:[
             {path:'HomeView',name:'HomeView',component:()=>import('../views/HomeView.vue')},
             {path:'Self',name:'Self',component:()=>import('../views/self.vue')},
             {path:'AiGuide',name:'AiGuide',component:()=>import('../views/AiGuide.vue')},
             {path:'Community',name:'Community',component:()=>import('../views/Community.vue')},
             {path:'Home',name:'Home',component:()=>import('../views/Home.vue')},
             {path:'Advice',name:'Advice',component:()=>import('../views/Advice.vue')},
             {path:'Synthesis',name:'Synthesis',component:()=>import('../views/Synthesis.vue')},
             {path:'Dialogue',name:'Dialogue',component:()=>import('../views/Dialogue.vue')},
             {path:'Composition',name:'Composition',component:()=>import('../views/Composition.vue')},
             {path:'Work',name:'Work',component:()=>import('../views/Work.vue')},
     ]}
    ]
})

//  router.beforeEach((to, from, next) => {
//      //to到哪儿  from从哪儿离开  next跳转 为空就是放行  
//          if (to.path === '/'|| to.path==='/Register') {
//              //如果跳转为登录和注册，就放行 
//              next();    
//          } else {
//          //取出sessionStorage判断
//                let token = sessionStorage.getItem('token');     	     
//               if (token == null || token === '') { 
//                       console.log('请先登录')       
//                       next({name: 'Login'});
//                   } else {
//                          next();   
//                   }   
//      }});

export default router