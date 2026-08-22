import axios from "axios";
import { ElMessage } from "element-plus";

// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 30000
});

// 请求拦截器
request.interceptors.request.use(config => {
    // 设置请求头的Content-Type为application/json;charset=utf-8
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config;
}, error => {
    // 请求拦截器中发生错误，直接返回被拒绝的Promise
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果响应数据是字符串类型，尝试解析为JSON对象
        if (typeof res === 'string') {
            try {
                // 先去除字符串两端可能存在的空白字符，再进行JSON解析
                res = JSON.parse(res.trim());
            } catch (e) {
                console.error('JSON parse error:', e);
                ElMessage.error('响应数据格式错误，请检查后端返回数据是否为正确的JSON格式');
                // 返回被拒绝的Promise，并传递错误信息
                return Promise.reject({ message: '响应数据格式错误', error: e });
            }
        }
        return res;
    },
    error => {
        if (error.response) {
            // 根据不同的响应状态码显示相应的错误提示信息
            switch (error.response.status) {
                case 404:
                    ElMessage.error('未找到接口，请检查请求地址是否正确');
                    break;
                case 500:
                    ElMessage.error('系统异常，请查看后端控制台报错');
                    break;
                default:
                    ElMessage.error(`请求失败: ${error.response.status}`);
            }
        } else {
            console.error(error.message);
            // 如果没有响应对象（如网络错误等情况），显示通用的错误提示信息
            ElMessage.error('请求发生错误，请检查网络连接或稍后重试');
        }
        // 返回被拒绝的Promise，并传递错误信息
        return Promise.reject({ message: '请求失败', error: error });
    }
);

export default request;