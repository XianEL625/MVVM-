<template>
    <div class="model-container">
        <div class="upload-container">
            <input type="file" ref="fileInput" @change="onFileChange" accept=".gltf, .glb" />
        </div>
        <canvas id="modelCanvas" ref="canvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 画布引用
const canvas = ref(null);
const fileInput = ref(null);

// 其他变量
let scene, camera, renderer, controls, model;

// 初始化加载模型的函数
const loadModel = (modelData) => {
    // 清除现有场景
    if (scene) {
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
    }
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas.value,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 创建简单的灯光设置
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 使用 GLTFLoader 加载模型
    const gltfLoader = new GLTFLoader();
    gltfLoader.parse(
        modelData,
        '',
        (gltf) => {
            model = gltf.scene;
            
            // 计算模型包围盒
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            // 缩放模型使其适合视图
            const maxDim = Math.max(size.x, size.y, size.z);
            model.scale.multiplyScalar(1.0 / maxDim);
            
            // 居中模型
            model.position.sub(center);
            
            // 确保模型水平放置
            model.rotation.x = 0;
            model.rotation.z = 0;
            
            scene.add(model);

            // 创建 OrbitControls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            
            // 设置相机位置以最佳视角查看模型
            const centerToCorner = new THREE.Vector3().subVectors(box.max, box.min).length() / 2;
            camera.position.set(0, 0, centerToCorner * 2);
            camera.lookAt(0, 0, 0);
            
            animate();
        },
        (error) => {
            console.error("模型加载错误:", error);
        }
    );
};

// 动画函数
const animate = () => {
    requestAnimationFrame(animate);
    
    // 更新控制器
    controls.update();
    
    renderer.render(scene, camera);
};

// 处理文件上传
const onFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            loadModel(arrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    }
};

// 在组件挂载后加载默认模型
onMounted(() => {
    // 尝试加载默认模型
    loadModel("/public/model/gltf/FJ.gltf");
});

// 清理资源
onBeforeUnmount(() => {
    if (renderer) {
        renderer.dispose();
    }
});
</script>

<style scoped>
.model-container {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

canvas {
    width: 100%;
    height: 100%;
}

.upload-container {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 15px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

input[type="file"] {
    width: 250px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    cursor: pointer;
    font-size: 14px;
    background-color: #fff;
}
</style>