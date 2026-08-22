<template>
  <!-- 3D容器 -->
  <div ref="container" class="canvas-container"></div>

  <!-- 加载提示 -->
  <div v-if="loading" class="loading">
    蓝染展厅加载中 {{ progress }}%
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const container = ref(null)
const loading = ref(true)
const progress = ref(0)
let scene = null
let camera = null
let renderer = null
let controls = null
let model = null
let animationId = null

// 专业灯光配置（优化版）
function initLights() {
  // 顶部点光源阵列
  const topLights = [];
  for (let i = -6; i <= 6; i += 3) {
    const topLight = new THREE.PointLight(0xffffff, 4, 25);
    topLight.position.set(i, 15, 0);
    topLight.castShadow = true;
    scene.add(topLight);
    topLights.push(topLight);
  }

  // 墙面洗墙灯（正面墙壁）
  const wallWasherFront = new THREE.DirectionalLight(0xffffff, 5); // 提高亮度到5
  wallWasherFront.position.set(0, 8, -18); // 朝向正面墙壁
  scene.add(wallWasherFront);

  // 墙面洗墙灯（背面墙壁）
  const wallWasherBack = new THREE.DirectionalLight(0xffffff, 5); // 提高亮度到5
  wallWasherBack.position.set(0, 8, 18); // 朝向背面墙壁
  scene.add(wallWasherBack);

  // 展品重点照明（改为使用点光源）
  const accentLight = new THREE.PointLight(0xffffff, 8, 20); // 范围设置为20，根据需要调整
  accentLight.position.set(0, 10, 5);
  scene.add(accentLight);

  // 辅助补光系统
  const fillLight = new THREE.DirectionalLight(0xffffff, 2);
  fillLight.position.set(-12, 12, -8);
  scene.add(fillLight);

  // 后轮廓光
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
  rimLight.position.set(0, 7, -12);
  scene.add(rimLight);
}

// 自动适配屏幕
function fitToScreen() {
  // 获取模型边界
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  //计算最佳观测举例
  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180)
  let distance = maxDim / (2 * Math.tan(fov / 2))

  camera.position.copy(center)
  camera.position.z += distance * 1.8 // 增加视角距离
  camera.lookAt(center)

  controls.target.copy(center)
  controls.update()
}

function initScene() {
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee) //浅灰色

  // 初始化渲染器（增强图形设置）
renderer = new THREE.WebGLRenderer({
  antialias: false, //关闭齿轮
  powerPreference: 'high-performance' // 使用高性能
})
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  if (!container.value) return
  const width = container.value.clientWidth || window.innerWidth
  const height = container.value.clientHeight || window.innerHeight
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)
  renderer.shadowMap.enabled = false
  // 相机配置，模拟人眼的视觉
  camera = new THREE.PerspectiveCamera(
  50,
  width / height, // 用容器宽高比
  0.1,
  1000
)

  // 控制器优化
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = false // 禁用阻尼效果，避免延迟
  controls.rotateSpeed = 0.5 // 降低旋转速度
  controls.zoomSpeed = 0.5 // 降低缩放速度
  controls.minDistance = 2 // 限制最近距离
  controls.maxDistance = 50 // 限制最远距离

  // 加载模型（添加错误处理）
new GLTFLoader().load(
  '/zhanting.gltf',
  (gltf) => {
    model = gltf.scene
    scene.add(model)

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })

    fitToScreen()
    loading.value = false
  },
  (xhr) => {
    if (xhr.total) {
      progress.value = Math.round((xhr.loaded / xhr.total) * 100)
    }
  },
  (error) => {
    console.error('模型加载失败:', error)
    loading.value = false
  }
)
  initLights()
  
  // 开启色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3
}

function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  initScene()
  animate()
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    if (model) fitToScreen()
  })
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)

  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material?.dispose()
        }
      }
    })
  }

  controls?.dispose()
  renderer?.dispose()

  if (renderer?.domElement && container.value?.contains(renderer.domElement)) {
    container.value.removeChild(renderer.domElement)
  }
})
</script>

<style>
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 1.8rem;
  font-family: 'Arial';
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  background: rgba(0,0,0,0.7);
  padding: 15px 30px;
  border-radius: 8px;
}
</style>