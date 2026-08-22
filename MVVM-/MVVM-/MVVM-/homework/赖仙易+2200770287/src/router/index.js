import { createRouter,createWebHistory } from "vue-router";

const router=createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {path:'/Manger',name:'Manger',component:()=>import('../views/Manger.vue'),children:[
            {path:'data',name:'data',component:()=>import('../views/data.vue')}
    ]}
    ]
})

export default router