---
theme: smartblue
---

![screenshots.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/618c27431c1f4ad6b24158d8450c6f62~tplv-k3u1fbpfcp-watermark.image?)
# 需求分析

- 使用经纬度数据绘制 wed3d 地图
- hover 地图显示省份信息
- 使用精灵图绘制报警点

# 需求实现

## 初始化项目

使用 vite 创建基本项目

```bash
yarn create vite
```

## 创建文件目录结构

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a1d6a2baad24c36b71d62c09be1794e~tplv-k3u1fbpfcp-watermark.image?)

### 相机

```js
import { PerspectiveCamera } from "three";

// 创建相机
const createCamera = () => {
  const camera = new PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 250);

  return camera;
};

export { createCamera };
```

### 控制器

```js
import { PerspectiveCamera } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const createControl = (camera: PerspectiveCamera, canvas: HTMLElement) => {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;

  Object.assign(controls, {
    tick: controls.update,
  });

  return controls;
};

export { createControl };
```

### 场景

```js
import { Color, Scene } from "three";

// 创建场景
const createScene = () => {
  const scene = new Scene();

  scene.background = new Color("#baccd9");

  return scene;
};

export { createScene };
```

### 渲染器

```js
import { WebGLRenderer } from "three";

const createRenderer = () => {
  const renderer = new WebGLRenderer({
    antialias: true, //抗锯齿
  });
  return renderer;
};

export { createRenderer };
```

### 循环控制类

```js
import { Camera, Clock, Scene, WebGLRenderer } from "three";

const clock = new Clock();

export interface UpdateItem {
  tick?: (delta: number) => void;
}

class Loop {
  public updateList: UpdateItem[];
  constructor(
    private camera: Camera,
    private scene: Scene,
    private renderer: WebGLRenderer
  ) {
    this.updateList = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();

      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = clock.getDelta();

    for (const obj of this.updateList) {
      if (obj.tick) {
        obj.tick(delta);
      }
    }
  }
}

export { Loop };
```

### 自适应类

```js
import { PerspectiveCamera, WebGLRenderer } from "three";

const setSize = (
  container: HTMLElement,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(
    container: HTMLElement,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    setSize(container, camera, renderer);
    window.addEventListener("resize", () => {
      setSize(container, camera, renderer);
    });
  }
}

export { Resizer };
```

### 地图核心代码

**这里有个容易踩坑的地方**：遍历经纬度数据的时候，一定要判断数据的 geometry type, type 是"MultiPolygon"的多嵌套了一层。

```js
// 加载器
const loader = new TextureLoader();
// 加载报警点图片
const animateTexture = loader.load(cautionSprite);

type NumberArray = [number, number];

// 转换函数
export const projection = geoMercator()
  .center([104.065735, 30.659462]) // 设置中心点
  .translate([0, 0]);

// 创建mesh，line
const createShape = (points: NumberArray[]) => {
  const path: Vector2[] = [];

  points.forEach((item) => {
    const [x, y] = projection(item) as NumberArray;
    path.push(new Vector2(x, -y));
  });

  const shape = new Shape(path);

  const geometry = new ExtrudeGeometry(shape, {
    bevelEnabled: false, // -bevelEnabled — bool，对挤出的形状应用是否斜角，默认值为true。
    depth: 5,
  });
  const material = new MeshBasicMaterial({
    color: "#2e317c",
    opacity: 0.8,
    transparent: true,
  });
  const mesh = new Mesh(geometry, material);
  const linegeometry = new BufferGeometry().setFromPoints(path);
  const linematerial = new LineBasicMaterial({
    color: "#ffffff",
    linewidth: 3,
  });
  const line = new Line(linegeometry, linematerial);
  line.position.z = 6;

  return { mesh, line };
};

class Map {
  pointer: Vector2;
  private raycaster: Raycaster;
  currentMesh: Mesh[];
  constructor(
    protected readonly scene: Scene,
    protected readonly camera: Camera
  ) {
    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    this.currentMesh = [];

    window.addEventListener("pointermove", this.onPointerMove.bind(this));
  }

  private onPointerMove(event: PointerEvent) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.currentMesh.length) {
      for (let index = 0; index < this.currentMesh.length; index++) {
        (this.currentMesh[index].material as MeshBasicMaterial).color.set(
          "#2e317c"
        );
      }
    }

    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (!intersects.length) { //判断是都有选中物体
      emitter.emit("hoverMap", false);
    }
    this.currentMesh = [];
    for (let index = 0; index < intersects.length; index++) {
      if (
        intersects[index].object.type === "Mesh" &&
        !intersects[index].object.userData.isAnimateMarker
      ) {
        const mesh = intersects[index].object as Mesh;
        emitter.emit("hoverMap", {
          x: event.clientX,
          y: event.clientY,
          data: mesh.userData,
        });
        this.currentMesh.push(mesh);
        (mesh.material as MeshBasicMaterial).color.set("#22a2c3");
      }
    }
  }

  create() {
    const objectGroup = new Object3D();
    MapData.features.forEach((item) => {
      const { coordinates, type } = item.geometry;
      const { properties } = item;
      if (["MultiPolygon"].includes(type)) {
        coordinates.forEach((v) => {
          v.forEach((j) => {
            const { mesh, line } = createShape(j as NumberArray[]);
            mesh.userData = properties;
            objectGroup.add(mesh, line);
          });
        });
      } else {
        coordinates.forEach((v) => {
          const { mesh, line } = createShape(v as NumberArray[]);
          mesh.userData = properties;
          objectGroup.add(mesh, line);
        });
      }
    });

    this.scene.add(objectGroup);
  }

  createAnimateMarker() {
    const animateMarker = new AnimateMarker(
      {
        texture: animateTexture,
        tilesHoriz: 23,
        tilesVert: 1,
        numTiles: 23,
        tileDispDuration: 75,
      },
      10,
      this.camera
    );

    return animateMarker;
  }
}

export { Map };
```

### World 中组装

```js
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Map } from "./components/Map";
import { createCamera } from "./system/camera";
import { createControl } from "./system/control";
import { Loop, UpdateItem } from "./system/Loop";
import { createRenderer } from "./system/renderer";
import { Resizer } from "./system/Resizer";
import { createScene } from "./system/scene";

class World {
  protected readonly camera: PerspectiveCamera;
  protected readonly scene: Scene;
  protected readonly renderer: WebGLRenderer;
  protected readonly loop: Loop;
  protected readonly controls: OrbitControls;

  constructor(container: HTMLElement) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.controls = createControl(this.camera, this.renderer.domElement);
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    this.loop.updateList.push(this.controls as UpdateItem);

    container.append(this.renderer.domElement);

    new Resizer(container, this.camera, this.renderer);
  }

  render() {
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }

  init() {
    // 场景添加物体
    const map = new Map(this.scene, this.camera);
    map.create();

    const animateMarker = map.createAnimateMarker();
    this.loop.updateList.push(animateMarker.annie);
    this.scene.add(animateMarker.mesh);

    animateMarker.setPosition([116.405285, 39.904989], 10);
  }

  start() {
    this.loop.start();
  }
}

export { World };
```

### App.vue 使用

```ts
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { emitter } from './utils/mitt';
import { World } from './World';
import { projection } from "./World/components/Map"

const currentInfo = ref();
const infobox = ref<HTMLElement>()


const container = ref<HTMLElement>()
const main = () => {
  if (!container.value) return;
  const world = new World(container.value)
  world.init();
  world.start();
}

onMounted(() => {
  main();
  //监听地图hover事件
  emitter.on("hoverMap", (emitData) => {
    if (!emitData) {
      currentInfo.value = null;
      return;
    }
    const { x, y, data: res } = emitData as { x: number, y: number, data: { center: [number, number], name: string } }
    if (infobox.value) {
      infobox.value.style.left = `${x}px`
      infobox.value.style.top = `${y}px`
      currentInfo.value = res;
    }
  });
})
</script>

<template>
  <div ref="container" class="app"></div>
  <div ref="infobox" v-show="currentInfo && currentInfo?.name" class="g-info">{{ currentInfo?.name || "--" }}</div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.g-info {
  position: fixed;
  top: 0;
  left: 0;
  height: 32px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 2px;
  padding: 0 20px;
  color: #fff;
  line-height: 30px;
  text-align: center;
}
</style>
```
