// token.js

// 定义一个对象来存储token相关的操作和数据
let tokenModule = {
    token: null,

    // 设置token的方法
    setToken: function (newToken) {
        this.token = newToken;
    },

    // 获取token的方法
    getToken: function () {
        return this.token;
    }
};

export default tokenModule;