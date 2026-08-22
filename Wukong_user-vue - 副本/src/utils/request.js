import axios from "axios";  
import { ElMessage } from "element-plus";  

const request = axios.create({  
    baseURL: import.meta.env.VITE_BASE_URL||'http://localhost:8080/api',
    timeout: 30000  
});  

// request.interceptors.request.use(config => {  
//     config.headers['Content-Type'] = 'application/json;charset=utf-8';
//     if (config.push!== '/'||config.push!== '/Register')  {   
//         const token = sessionStorage.getItem('token');  
//         if (token) {   
//             config.headers.token = token;
//             config.headers['token'] = token;
//             config.headers.Authorization=token;
//             config.headers['Authorization'] = token;
//         } else {  
//             console.warn("Token是空的");  
//         }  
//     }  
//     return config;  
// }, error => {  
//     return Promise.reject(error);  
// });  

// request.interceptors.response.use(  
//     response => {  
//         let res = response.data;  
//         if (typeof res === 'string') {  
//             try {  
//                 res = res ? JSON.parse(res) : res;  
//             } catch (e) {  
//                 console.error('JSON parse error:', e);  
//                 ElMessage.error('响应数据格式错误');  
//                 return Promise.reject(e);  
//             }  
//         } 
//         //是否失效
//         if (res.code === '401') {
//             ElMessage.error(res.msg);
//             router.push("/")
//         } 
//         return res;  
//     },  
//     error => {  
//         if (error.response) {  
//             if (error.response.status === 404) {  
//                 ElMessage.error('未找到接口');  
//             } else if (error.response.status === 500) {  
//                 ElMessage.error('系统异常，请查看后端控制台报错');  
//             } else {  
//                 ElMessage.error(`请求失败: ${error.response.status}`);  
//             }  
//         } else {  
//             console.error(error.message);  
//         }  
//         return Promise.reject(error);  
//     }  
// );  

export default request;