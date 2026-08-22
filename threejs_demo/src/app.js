import * as THREE from 'three';  
import { MeshBasicMaterial } from 'three';  
import { BoxGeometry } from 'three';  
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  
import { TextureLoader } from 'three';  
import pkq from './public/pkq1.jpg'; 

// 创建场景、相机和渲染器变量  
let scene, camera, renderer, controls, mesh;  

// 初始化场景  
function initScene() {  
    scene = new THREE.Scene();  
}  

// 初始化相机  
function initCamera() {  
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);  
    camera.position.z = 10;  
}  

// 初始化渲染器  
function initRenderer() {  
    renderer = new THREE.WebGLRenderer({antialias: true});  
    renderer.setSize(window.innerWidth, window.innerHeight);  
    document.body.appendChild(renderer.domElement);  
}  

// 初始化坐标轴助手  
function initAxesHelper() {  
    const axesHelper = new THREE.AxesHelper(3);  
    scene.add(axesHelper);  
}  

// 初始化轨道控制  
function initOrbitControls() {  
    controls = new OrbitControls(camera, renderer.domElement);  
}  

// 创建并添加网格  
function initMesh() {  
    // 形状  
    const geometry = new BoxGeometry(1, 1, 1)
    //纹理
    const  texture=new TextureLoader().load(pkq)
    // 材质  
    const material = new MeshBasicMaterial({ 
        color: 'yellow',
        map:texture
 })
    // 创建网格  
    mesh = new THREE.Mesh(geometry, material);  
    scene.add(mesh);  
}  

// 初始化应用程序  
function init() {  
    initScene();  
    initCamera();  
    initRenderer();  
    initAxesHelper();  
    initOrbitControls();  
    initMesh(); // 添加这行来初始化方块  
}  

// 动画循环  
function render() {  
    controls.update(); // 更新轨道控制  
    renderer.render(scene, camera);  
    requestAnimationFrame(render);  
}  

// 调用初始化方法来设置场景  
init(); 
function render(){
     if(mesh.position.x>3){

     }
    else {mesh.position.x+=0.01} 
    renderer.render(scene,camera)
    requestAnimationFrame(render)
} 
render();  

window.addEventListener('resize',function(){
    camera.aspect=window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})