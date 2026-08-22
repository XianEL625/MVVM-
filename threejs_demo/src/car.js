import * as THREE from 'three';  
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';   
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Lamborghini from './public/Lamborghini.glb'
// import { color, metalness, roughness } from 'three/tsl';
// 创建场景、相机和渲染器变量  
let scene, camera, renderer, controls,grid;  

// 初始化场景  
function initScene() {  
    scene = new THREE.Scene();  
}  

// 初始化相机  
function initCamera() {  
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);  
    camera.position.set(4.25,1.4,-4.5) 
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
//控制地面网格  
function initGridHelper(){
    const grid=new THREE.GridHelper(20,40,'red',0xffffff)
    grid.material.opacity=0.2
    grid.material.transparent=true
    scene.add(grid)
}
function loadCarModel(){
    const loader=new GLTFLoader().load(Lamborghini,function(gltf){
        const carModel=gltf.scene
        carModel.rotation.y=Math.PI
        scene.add(carModel)
    })
    
}

//加光照
function initAmbientLight(){
    const ambientLight=new THREE.AmbientLight('#fff',2)
    scene.add(ambientLight)
}
// 加地板
function initFloor() {
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshPhysicalMaterial({
        // 双面绘制
        side: THREE.DoubleSide,
        color: 0x808080,
        // 金属度
        metalness: 0,
        // 粗糙度，越小越光滑
        roughness: 0.1
    });
    const mesh = new THREE.Mesh(floorGeometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
}
function initSpotLight(){
    const spotLight=new THREE.SpotLight('#fff',2)
    spotLight.angle=Math.PI/8;
    spotLight.penumbra=0.2;
    spotLight.decay=2;
    spotLight.distance=30;
    spotLight.shadow.radius=10;
    //阴影映射
    spotLight.shadow.mapSize.set(4096,4096)
    spotLight.position.set(-5,10,1);
    //光照射的方向
    spotLight.target.position.set(0,0,0);
    spotLight.castShadow=true;
    scene.add(spotLight);


}

// 初始化应用程序  
function init() {  
    initScene();  
    initCamera();  
    initRenderer();  
    initAxesHelper();  
    initOrbitControls(); 
    initGridHelper();
    loadCarModel();
    
    initAmbientLight();
    initFloor();
    initSpotLight();
}  

// 动画循环  
function render() {  
    controls.update(); // 更新轨道控制  
    renderer.render(scene, camera);  
    requestAnimationFrame(render);  
}  

// 调用初始化方法来设置场景  
init(); 
render();  

window.addEventListener('resize',function(){
    camera.aspect=window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
})