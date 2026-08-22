import axios from "axios";  
import { ElMessage } from "element-plus";  

const request = axios.create({  
    baseURL: import.meta.env.VITE_BASE_URL||'http://localhost:8080',
    timeout: 30000  
});  

request.interceptors.request.use(config => {  
    // 只有在非文件上传请求时才设置 Content-Type
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }
    
    // 登录和注册接口不加 token
    if (config.url !== '/user/login' && config.url !== '/user/register') {
        const token = sessionStorage.getItem('token');  
        if (token) {   
            config.headers['token'] = token;
        }  
    }  
    return config;  
}, error => {  
    return Promise.reject(error);  
});

request.interceptors.response.use(  
    response => {  
        let res = response.data;  
        if (typeof res === 'string') {  
            try {  
                res = res ? JSON.parse(res) : res;  
            } catch (e) {  
                console.error('JSON parse error:', e);  
                ElMessage.error('响应数据格式错误');  
                return Promise.reject(e);  
            }  
        } 
        return res;  
    },  
    error => {  
        if (error.response) {  
            if (error.response.status === 404) {  
                ElMessage.error('未找到接口');  
            } else if (error.response.status === 401) {  
                ElMessage.error('未授权，请重新登录');  
            } else if (error.response.status === 500) {  
                ElMessage.error('系统异常，请查看后端控制台报错');  
            } else {  
                ElMessage.error(`请求失败: ${error.response.status}`);  
            }  
        } else {  
            console.error(error.message);  
        }  
        return Promise.reject(error);  
    }  
);

export default request;