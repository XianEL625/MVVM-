import { PerspectiveCamera, Scene, WebGLRenderer, AmbientLight, DirectionalLight, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Map } from './components/Map';
import { createCamera } from './system/camera';
import { createControl } from './system/control';
import { createRenderer } from './system/renderer';
import { Resizer } from './system/Resizer';
import { createScene } from './system/scene';
import { Loop } from './system/Loop';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector2, Raycaster } from 'three';

class World {
  constructor(container) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.controls = createControl(this.camera, this.renderer.domElement);
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.renderer.domElement.style.position = 'relative';
    this.renderer.domElement.style.zIndex = '0';
    this.rotationTime = 0; // 新增时间变量
    // 新增鼠标跟踪参数
    this.lastMouseMoveTime = 0;
    this.mouseMoveThreshold = 0.3; // 静止判定时间（秒）
    this.targetRotation = 0;       // 目标旋转角度
    this.currentRotation = 0;      // 当前实际旋转角度
    this.rotationSpeed = 2.5;      // 旋转速度（弧度/秒）
    container.append(this.renderer.domElement);
    // 修改鼠标移动监听
    container.addEventListener('pointermove', (e) => {
      this.lastMouseMoveTime = performance.now() / 1000; // 记录最后移动时间
      this.targetRotation = -Math.PI/2; // 设置目标为向左90度
    });
    // Add lighting to the scene
    this.addLighting();

    // Initialize raycaster and pointer for hover detection
    this.raycaster = new Raycaster();
    this.pointer = new Vector2();
    this.monkey = null; // Store monkey reference
    this.originalColor = null; // Store original color for restoration

    // Add mouse move event listener
    container.addEventListener('pointermove', this.onPointerMove.bind(this));

    new Resizer(container, this.camera, this.renderer);
    this.map = null;

    // Load and position the black monkey model
    this.loadBlackMonkeyModel();

    // Add map-related updates to the loop
    this.loop.updateList.push({
      tick: (delta) => {
        if (this.map) {
          this.map.renderLabels();
        }
      }
    });
  }

  addLighting() {
    // Add ambient light for soft, uniform illumination
    const ambientLight = new AmbientLight(0xffffff, 0.5); // White light, moderate intensity
    this.scene.add(ambientLight);

    // Add directional light for highlights and shadows
    const directionalLight = new DirectionalLight(0xffffff, 1.0); // White light, higher intensity
    directionalLight.position.set(5, 10, 5); // Position above and to the right-front of the monkey
    directionalLight.castShadow = false; // Disable shadows for simplicity (enable if needed)
    this.scene.add(directionalLight);
  }

  async loadBlackMonkeyModel() {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync('src/assets/model/bm.glb'); // Path to your GLB file
      this.monkey = gltf.scene;

      // Adjust model scale and initial position
      this.monkey.scale.set(15.0, 15.0, 15.0); // Large scale as specified
      this.monkey.position.set(0, 10, 10); // Initial position (will be updated)

      // Position at bottom-right corner
      this.positionAtBottomRight(this.monkey);

      // Store original color of the first mesh (assuming uniform material)
      this.monkey.traverse(child => {
        if (child.isMesh && child.material) {
          this.originalColor = this.originalColor || child.material.color.clone();
        }
      });

      // Add to scene
      this.scene.add(this.monkey);

      // 替换原有动画为智能响应动画
      this.loop.updateList.push({
        tick: (delta) => {
          this.updateRotation(delta);
        }
      });

      this.scene.add(this.monkey);
    } catch (error) {
      console.error('Failed to load black monkey model:', error);
    }
  }

  positionAtBottomRight(monkey) {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    const aspect = width / height;
    const fov = this.camera.fov * (Math.PI / 180); // Convert to radians
    const distance = this.camera.position.z; // Distance from camera to near plane

    // Calculate the width and height of the view frustum at the camera's distance
    const heightAtDistance = 2 * Math.tan(fov / 2) * distance;
    const widthAtDistance = heightAtDistance * aspect;

    // Position at bottom-right (e.g., 80% of width and -80% of height from center)
    const xOffset = widthAtDistance * 0.4; // 80% of half-width to the right
    const yOffset = -heightAtDistance * 0.4; // 80% of half-height downward

    // Apply offset to model position
    monkey.position.x = xOffset;
    monkey.position.y = yOffset;
    monkey.position.z = 10; // Keep z consistent with initial position
  }

  onPointerMove(event) {
    // Update pointer position
    this.pointer.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // Check for intersection with the monkey
    if (this.monkey) {
      const intersects = this.raycaster.intersectObject(this.monkey, true);

      if (intersects.length > 0) {
        // Mouse is over the monkey, apply hover effect
        this.monkey.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.color.set(0x22a2c3); // Change to a lighter blue (example)
            child.material.emissive = new Color(0x22a2c3); // Add emissive glow
            child.material.emissiveIntensity = 0.5; // Moderate glow
          }
        });
      } else {
        // Mouse is not over the monkey, restore original color
        this.monkey.traverse(child => {
          if (child.isMesh && child.material && this.originalColor) {
            child.material.color.copy(this.originalColor);
            child.material.emissive.set(0x000000); // Reset emissive
            child.material.emissiveIntensity = 0; // Reset glow
          }
        });
      }
    }
  }

  reset() {
    if (this.map && this.map.currentGroup) {
      this.scene.remove(this.map.currentGroup);
      this.map.currentGroup = null;
      this.map.historyGroup = [];
      this.map.currentLevel = 'province';
      this.map.create();
    }
  }
  updateRotation(delta) {
    // 计算鼠标静止状态
    const currentTime = performance.now() / 1000;
    const isMouseStill = (currentTime - this.lastMouseMoveTime) > this.mouseMoveThreshold;

    // 自动切换目标角度
    if (isMouseStill) {
      this.targetRotation = 0; // 回归初始位置
    }

    // 计算旋转差值
    const angleDifference = this.targetRotation - this.currentRotation;
    
    // 动态调整旋转速度
    const acceleration = angleDifference * this.rotationSpeed;
    this.currentRotation += acceleration * delta;

    // 应用阻尼效果防止抖动
    if (Math.abs(angleDifference) < 0.01) {
      this.currentRotation = this.targetRotation;
    }

    // 应用旋转
    this.monkey.rotation.y = this.currentRotation;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  init(mapData) {
    this.map = new Map(this.scene, this.camera, this.renderer.domElement);
    this.map.create(mapData);
    this.loop.updateList.push({
      tick: () => this.map.renderLabels()
    });
  }

  start() {
    this.loop.start();
  }
}

export { World };