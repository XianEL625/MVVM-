function changeTitleAndShowTime() {   
    document.querySelector('h1').textContent = '欢迎来到我的网站';  
    const currentTime = new Date();  
    const options = {  
        year: 'numeric',  
        month: 'numeric',  
        day: 'numeric',  
        hour: 'numeric',  
        minute: 'numeric',  
        second: 'numeric'  
    };  
    const formattedTime = currentTime.toLocaleString('zh-CN', options);  

    document.getElementById('currentTime').textContent = '当前时间: ' + formattedTime;  
}  

window.onload = function() {  
    document.getElementById('changeTitle').onclick = changeTitleAndShowTime;  
};  