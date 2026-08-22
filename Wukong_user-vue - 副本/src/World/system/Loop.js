import { Camera, Clock, Scene, WebGLRenderer } from "three";

const clock = new Clock();

// 声明时不导出
class Loop {
  updateList = [];
  constructor(
    camera,
    scene,
    renderer
  ) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updateList = [];
  }
  camera;
  scene;
  renderer;

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      this.renderer.render(this.scene, this.camera);
      if (this.map?.labelRenderer) {
        this.map.labelRenderer.render(this.scene, this.camera); // 同步渲染标签
      }
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

// 统一在文件末尾导出（唯一导出点）
export { Loop };