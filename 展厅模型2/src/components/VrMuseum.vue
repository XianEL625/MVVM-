<template>
  <div ref="museumContainer" class="museum-container"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { RoomEnvironment } from './js/RoomEnvironment.js';
// import { MeshoptDecoder } from './js/meshopt_decoder.module.js'

export default {
  name: 'VrMuseum',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null, // 添加controls到data
    };
  },
  mounted() {
    this.initThreeScene();
    this.loadModel();
    window.addEventListener('resize', this.onWindowResize);
  },
  methods: {
    initThreeScene() {
      const width = this.$refs.museumContainer.clientWidth;
      const height = this.$refs.museumContainer.clientHeight;

      // 创建场景、相机和渲染器
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.$refs.museumContainer.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0x000099);

      // 地表格
      const grid = new THREE.GridHelper(500, 100, 0xffffff, 0xffffff);
      grid.material.opacity = 0.5;
      grid.material.depthWrite = false;
      grid.material.transparent = true;
      this.scene.add(grid);
// 材质
//       const environment = new RoomEnvironment();
      // const pmremGenerator = new THREE.PMREMGenerator(renderer);
      // this.scene.environment = pmremGenerator.fromScene(environment).texture;
      // 初始化OrbitControls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;


      // 添加光照
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);
      const light1 = new THREE.DirectionalLight(0xffffff, 1)
      light1.position.set(0, 0, 10)
      this.scene.add(light1)
      const light2 = new THREE.DirectionalLight(0xffffff, 1)
      light1.position.set(0, 0, -10)
      this.scene.add(light2)
      const light3 = new THREE.DirectionalLight(0xffffff, 1)
      light1.position.set(10, 0, 0)
      this.scene.add(light3)
      const light4 = new THREE.DirectionalLight(0xffffff, 1)
      light1.position.set(-10, 0, 0)
      this.scene.add(light4)

      // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight.position.set(0, 1, 0);
      // this.scene.add(directionalLight);

      // 添加轴助线
      const axesHelper = new THREE.AxesHelper(20);
      this.scene.add(axesHelper);

      // 动画循环
      this.animate();
    },
    loadModel() {
      const loader = new GLTFLoader();
      loader.load(
          '/zhanting.gltf', // 确保这是正确的模型路径，替换为您的GLTF模型路径
          (gltf) => {gltf.scene.traverse(function(child) {
                if (child.isMesh) {
                  child.material.emissive = child.material.color;
                  child.material.emissiveMap = child.material.map;
                }
              });

            // 设置模型的初始位置和缩放
            gltf.scene.scale.set(10, 10, 10); // 根据需要调整缩放
            gltf.scene.position.set(0,0,1); // 根据需要调整位置

            // 添加模型到场景
            this.scene.add(gltf.scene);

            // 调整相机位置以匹配模型的大小
            this.updateCamera(gltf.scene);
          },
          (progress) => {
            // 加载进度的回调
          },
          (error) => {
            console.error('An error happened', error);
          }
      );
    },
    updateCamera(model) {
      // 计算模型的边界框并更新相机位置
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);

      // 更新相机位置以查看整个模型
      this.camera.position.set(center.x, center.y + maxDimension, -maxDimension * 2);
      this.camera.lookAt(this.scene.position);

      // 更新相机的远裁剪面
      this.camera.far = maxDimension * 3;
      this.camera.updateProjectionMatrix();
    },
    animate() {
      requestAnimationFrame(this.animate);
      if (this.controls) { // 确保controls已经被初始化
        this.controls.update(); // 更新控制器
      }
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      // 窗口大小变化时更新相机和渲染器
      const width = this.$refs.museumContainer.clientWidth;
      const height = this.$refs.museumContainer.clientHeight;
      this.camera.aspect = width / height;
      this.renderer.setSize(width, height);
      this.camera.updateProjectionMatrix();
    },
  },
};
</script>

<style>
.museum-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
