/*
 * @Date: 2023-02-27 21:40:37
 * @LastEditors: z-god 1476482763@qq.com
 * @LastEditTime: 2023-03-16 16:49:06
 * @FilePath: \wed3d-worldh:\project\three-map\src\World\index.ts
 */

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
